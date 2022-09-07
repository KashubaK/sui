// This is getting a bit out of hand...

import {ElementRecord, ElementRenderer} from "./elements/element";
import {ComponentRenderer} from "./component";
import {reconcileElement} from "./render/render";
import {autorun, IReactionPublic} from "mobx";

let rootRecord: ElementRecord | null = null;

function isComponentRenderer(render: ComponentRenderer | ElementRenderer): render is ComponentRenderer {
  return render.type === 'component';
}

export function mount(render: ComponentRenderer | ElementRenderer, parentElement: HTMLElement, childIndex = 0) {
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
      if (!recordIsCompatible(currentRecord, render)) {
        const removedRecord = render.parent.childRecords.splice(childIndex, 1, record);
        if (removedRecord?.[0]) {
          unmountElement(removedRecord[0]);
        }

        currentRecord = record;
      } else {
        updateRecord(currentRecord, record);
      }
    } else {
      currentRecord = record;
    }

    if (render.parent) render.parent.childRecords[childIndex] = currentRecord;

    rootRecord ||= currentRecord;

    currentRecord.lastState = { ...currentRecord.state };
    currentRecord.lastInput = 'input' in render ? { ...render.input } : {};

    const element = reconcileElement(currentRecord);

    if (currentRecord.description.when !== false) {
      if (!currentRecord.mounted) {
        mountElement(currentRecord, parentElement, childIndex);
      }
    } else if (currentRecord.mounted) {
      unmountElement(currentRecord);
    }

    currentRecord.children = record.children;
    currentRecord.children.forEach((child, index) => {
      child.parent = currentRecord!;

      mount(child, element, index)
    });

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
  };

  perform();
}

function updateRecord(record: ElementRecord, newRecord: ElementRecord) {
  record.description = newRecord.description;
}

function recordIsCompatible(record: ElementRecord, render: ElementRenderer | ComponentRenderer) {
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

function mountElement(record: ElementRecord, parentElement: HTMLElement, index: number) {
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
    parentElement.children[index].insertAdjacentElement('beforebegin', element);
  } else {
    parentElement.appendChild(element);
  }

  record.mounted = true;
}

function unmountElement(record: ElementRecord) {
  record.element?.parentElement?.removeChild(record.element);
  record.mounted = false;
}

function componentRequiresUpdate(record: ElementRecord, render: ComponentRenderer) {
  if (record.name !== render.componentName) return true;
  if (!shallowEqual(record.state, record.lastState)) return true;
  if (!shallowEqual(record.input, record.lastInput)) return true;
  if ((render.when ?? true) !== record.mounted) return true;
  if (deepStateChanged(record.state || {}, record.lastState || {})) return true;
  if (deepStateChanged(record.input || {}, record.lastInput || {})) return true;

  return false;
}

function deepStateChanged(current: object, last: object): boolean {
  for (const key in current) {
    const currentValue = current[key as keyof typeof current];
    const lastValue = last[key as keyof typeof current];

    if (!currentValue !== lastValue) return true;

    if (typeof currentValue === 'object') {
      const objectsChanged = deepStateChanged(currentValue, lastValue);

      if (objectsChanged) return true;
    }
  }

  return false
}

function deepRead(object: any = {}) {
  for (const key in object) {
    object[key];

    if (typeof object[key] === 'object') {
      deepRead(object[key]);
    }
  }
}

function shallowEqual(a: Record<string, unknown> = {}, b: Record<string, unknown> = {}) {
  for (const key in a) {
    if (a[key] !== b[key]) {
      return false;
    }
  }

  return true;
}
