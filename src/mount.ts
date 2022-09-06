import {ElementRecord, ElementRenderer} from "./elements/element";
import {ComponentRenderer} from "./component";
import {reconcileElement} from "./render/render";
import {IReactionDisposer, reaction} from "mobx";

let rootRecord: ElementRecord | null = null;

function isComponentRenderer(render: ComponentRenderer | ElementRenderer): render is ComponentRenderer {
  return render.type === 'component';
}

export function mount(render: ComponentRenderer | ElementRenderer, parentElement: HTMLElement, childIndex = 0) {
  const perform = (disposeLastStateReaction?: IReactionDisposer) => {
    const start = performance.now();
    let currentRecord = render.parent ? render.parent.childRecords[childIndex] : rootRecord;

    if (currentRecord && isComponentRenderer(render)) {
      if (
        shallowEqual(currentRecord.state, currentRecord.lastState) &&
        shallowEqual(render.input, currentRecord.lastInput) &&
        (render.when ?? true) === currentRecord.mounted
      ) {
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

    disposeLastStateReaction?.();

    // UGLY, probably an anti-pattern, but works.
    const nextDispose: IReactionDisposer = reaction(() => {
      return {
        ...currentRecord?.state,
        ...currentRecord?.input,
      }
    }, () => {
      perform(nextDispose)
    });
  };

  perform();
}

function shallowEqual(a: Record<string, unknown> = {}, b: Record<string, unknown> = {}) {
  for (const key in a) {
    if (a[key] !== b[key]) {
      return false;
    }
  }

  return true;
}
