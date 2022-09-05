import {ElementRecord, ElementRenderer} from "./elements/element";
import {ComponentRenderer} from "./component";
import {reconcileElement} from "./render/render";
import {autorun} from "mobx";
import {isEqual} from "lodash-es";

let rootRecord: ElementRecord | null = null;

function isComponentRenderer(render: ComponentRenderer | ElementRenderer): render is ComponentRenderer {
  return render.type === 'component';
}

export function mount(render: ComponentRenderer | ElementRenderer, parentElement: HTMLElement, childIndex = 0) {
  autorun(() => {
    let currentRecord = render.parent ? render.parent.childRecords[childIndex] : rootRecord;

    if (currentRecord && isComponentRenderer(render)) {
      if (
        isEqual(currentRecord.state, currentRecord.lastState) &&
        isEqual(render.input, currentRecord.lastInput)
      ) {
        return;
      }
    }

    const record = render(currentRecord?.state);

    if (currentRecord) {
      currentRecord.description = record.description;
      currentRecord.children = record.children;
    } else {
      currentRecord = record;
    }

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

    currentRecord.children?.forEach((child, index) => {
      child.parent = currentRecord!;

      mount(child, element, index)
    });
  })
}
