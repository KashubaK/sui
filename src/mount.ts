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
        console.log('nah dawg');
        return;
      }
    }

    const record = render(currentRecord?.state);

    if (currentRecord) {
      if (currentRecord.name !== record.name) {
        // Don't remove the conflicted record, will be cleaned up later if necessary.
        render.parent?.childRecords?.splice(childIndex, 0, record);
        currentRecord = record;
      } else {
        currentRecord.description = record.description;
      }
    } else {
      currentRecord = record;
    }

    currentRecord.state ||= record.state;
    rootRecord ||= currentRecord;

    currentRecord.lastState = { ...currentRecord.state };
    currentRecord.lastInput = 'input' in render ? { ...render.input } : {};

    const element = reconcileElement(currentRecord);

    if (currentRecord.description.when !== false) {
      if (!currentRecord.mounted) {
        if (render.parent) render.parent.childRecords[childIndex] = currentRecord;

        if (parentElement.children[childIndex]) {
          parentElement.children[childIndex].insertAdjacentElement('beforebegin', element);
        } else {
          parentElement.appendChild(element);
        }

        currentRecord.mounted = true;
      }
    } else if (currentRecord.mounted) {
      parentElement.removeChild(element);
      currentRecord.mounted = false;
    }

    currentRecord.children = record.children;

    currentRecord.children?.forEach((child, index) => {
      child.parent = currentRecord!;

      mount(child, element, index)
    });

    if (currentRecord.childRecords.length !== currentRecord.children.length) {
      currentRecord.childRecords = currentRecord.childRecords.filter((child, index) => {
        // Something about this is super funky. It works, but it's WEIRD...
        if (!currentRecord?.children[index]) {
          child.element?.parentElement?.removeChild(child.element);
          return false;
        }

        return true;
      });
    }

    const end = performance.now();

    if (isComponentRenderer(render)) {
      render.__lastRenderTime = end - start;
    }

    lastReaction?.dispose();

    let firstRun = true;

    // UGLY, probably an anti-pattern, but works.
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
  };

  perform();
}

function componentRequiresUpdate(record: ElementRecord, render: ComponentRenderer) {
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
