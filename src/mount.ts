// This is getting a bit out of hand...

import {ElementRecord, ElementRenderer} from "./elements/element";
import {ComponentRecordGenerator, ComponentRenderer} from "./component";
import {reconcileElement} from "./render/render";
import {autorun, IReactionPublic} from "mobx";

let rootRecord: ElementRecord | null = null;

function isComponentRenderer(render: ComponentRecordGenerator | ElementRenderer): render is ComponentRecordGenerator {
  return render.type === 'component';
}

export function mount(fn: ComponentRenderer | ElementRenderer, parentElement: HTMLElement | DocumentFragment, childIndex = 0) {
  // ComponentRenderer does not contain any properties
  let render: ComponentRecordGenerator | ElementRenderer;

  if (!('type' in fn)) {
    render = fn() as ComponentRecordGenerator;
  } else {
    render = fn;
  }

  const perform = (lastReaction?: IReactionPublic) => {
    const start = performance.now();
    let currentRecord = render.parent ? render.parent.childRecords[childIndex] : rootRecord;

    if (currentRecord && isComponentRenderer(render)) {
      if (!componentRequiresUpdate(currentRecord, render)) {
        return;
      }
    }

    let record = render();

    if (currentRecord && render.parent) {
      if (recordIsCompatible(currentRecord, render)) {
        updateRecord(currentRecord, record);
      } else {
        const removedRecord = render.parent.childRecords.splice(childIndex, 1, record);
        if (removedRecord?.[0]) {
          unmountElement(removedRecord[0]);
        }

        currentRecord = record;
      }
    } else {
      currentRecord = record;
    }

    if (render.parent) {
      currentRecord.parent = render.parent;
      currentRecord.index = childIndex;
      render.parent.childRecords[childIndex] = currentRecord;
    }

    rootRecord ||= currentRecord;

    currentRecord.lastState = deepRemoveObservables({ ...currentRecord.state });
    currentRecord.lastInput = 'input' in render ? deepRemoveObservables({ ...(render.input || {}) }) : {};

    reconcileElement(currentRecord);

    const parentForChildren = currentRecord.element;

    if (parentForChildren instanceof HTMLElement || parentForChildren instanceof DocumentFragment) {
      currentRecord.children = record.children;

      for (let i = 0; i < currentRecord.children.length; i++) {
        const child = currentRecord.children[i];
        child.parent = currentRecord!;

        mount(child, parentForChildren, i);
      };
    }

    if (!currentRecord.mounted || currentRecord.type === 'fragment') {
      mountElement(currentRecord, parentElement, childIndex);
    }

    if (currentRecord.childRecords.length !== currentRecord.children.length) {
      cleanChildren(currentRecord);
    }

    const end = performance.now();

    lastReaction?.dispose();

    // UGLY, probably an anti-pattern, but works.
    let firstRun = true;

    autorun((r) => {
      deepRead(currentRecord?.state || {});
      deepRead(currentRecord?.input || {});

      if (firstRun) {
        firstRun = false;
        return;
      } else {
        perform(r);
      }
    });

    if (isComponentRenderer(render)) {
      render.__lastRenderTime = end - start;
    }

    return currentRecord;
  };

  return perform();
}

function updateRecord(record: ElementRecord, newRecord: ElementRecord) {
  record.description = newRecord.description;
}

function recordIsCompatible(record: ElementRecord, render: ElementRenderer | ComponentRecordGenerator) {
  return record.name === render.componentName
}

function cleanChildren(record: ElementRecord) {
  record.childRecords = record.childRecords.filter((child, index) => {
    // Something about this is super funky. It works, but it's WEIRD...
    if (!record?.children[index]) {
      child.element?.parentElement?.removeChild(child.element);
      return false;
    }

    return true;
  });
}

function mountElement(record: ElementRecord, parentElement: HTMLElement | DocumentFragment, index: number) {
  if (!parentElement) {
    console.error(record);
    throw new Error('Cannot mount element without a parent element');
  }

  const element = record.element;
  if (!element) {
    console.error(record);
    throw new Error('Cannot mount element when record does not contain an element');
  }

  if (parentElement.children[index]) {
    parentElement.insertBefore(element, parentElement.children[index]);
  } else {
    parentElement.appendChild(element);
  }

  if (record.description.mount && element instanceof HTMLElement) {
    // TODO: State updates inside description.mount function do not cause reactivity
    // unless called within a setTimeout. WARN DEVELOPERS: Too many mount hooks can cause performance issues.
    setTimeout(() => record.description.mount?.(element));
  }

  record.mounted = true;
}

function unmountElement(record: ElementRecord) {
  record.element?.parentElement?.removeChild(record.element);

  if (record.element) {
    const element = record.element;

    if (record.description.unmount && element instanceof HTMLElement) {
      // TODO: State updates inside description unmount function do not cause reactivity
      // unless called within a setTimeout. WARN DEVELOPERS: Too many unmount hooks can cause performance issues.
      setTimeout(() => record.description.unmount?.(element));
    }
  }

  record.mounted = false;
}

function componentRequiresUpdate(record: ElementRecord, render: ComponentRecordGenerator) {
  if (record.name !== render.componentName) return true;
  if (!shallowEqual(record.state, record.lastState)) return true;
  if (!shallowEqual(record.input, record.lastInput)) return true;
  if (deepStateChanged(record.state || {}, record.lastState || {})) return true;
  if (deepStateChanged(record.input || {}, record.lastInput || {})) return true;

  return false;
}

function deepStateChanged(current: object, last: object): boolean {
  for (const key in current) {
    if (!current.hasOwnProperty(key)) {
      continue;
    }

    const currentValue = current[key as keyof typeof current];
    const lastValue = last[key as keyof typeof current];

    if (currentValue !== lastValue) return true;

    if (typeof currentValue === 'object') {
      const objectsChanged = deepStateChanged(currentValue, lastValue);

      if (objectsChanged) return true;
    }
  }

  return false
}

function deepRead(object: any = {}) {
  for (const key in object) {
    if (!object.hasOwnProperty(key)) {
      continue
    }

    object[key];

    if (typeof object[key] === 'object') {
      deepRead(object[key]);
    }
  }
}

function deepRemoveObservables(object: any = {}) {
  for (const key in object) {
    if (!object.hasOwnProperty(key)) continue;
    if (typeof object[key] === 'object') {
      object[key] = deepRemoveObservables({ ...object[key] });
    }
  }

  return { ...object };
}

function shallowEqual(a: Record<string, unknown> = {}, b: Record<string, unknown> = {}) {
  for (const key in a) {
    if (!a.hasOwnProperty(key)) continue;
    if (a[key] !== b[key]) {
      return false;
    }
  }

  return true;
}
