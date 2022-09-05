import {ElementRecord} from "../elements/element";
import {action} from "mobx";

export function reconcileElement(record: ElementRecord): HTMLElement {
  if (!record.element) {
    record.element = document.createElement(record.tagName);
    record.onElementMount?.();
  }

  applyElementDescription(record);

  return record.element;
}

export function applyElementDescription(record: ElementRecord) {
  const { description, element } = record;
  if (!element) {
    throw new Error('Cannot apply description from record without an element');
  }

  if (description.text) {
    if (element.firstChild && element.firstChild.nodeType === Node.TEXT_NODE) {
      if (element.firstChild.textContent != description.text) {
        element.firstChild.textContent = description.text;
      }
    } else {
      element.prepend(document.createTextNode(description.text));
    }
  }

  if (description.html) {
    element.innerHTML = description.html;
  }

  if (description.class) {
    element.className = description.class;
  }

  if (description.style) {
    for (const key in description.style) {
      if (!(description.style.hasOwnProperty(key))) continue;
      const beep = key as keyof typeof description.style;

      element.style[beep] = description.style[beep] || '';
    }
  }

  if (description.events) {
    record.listeners ||= {};

    for (const key in description.events) {
      const beep = key as keyof typeof description.events;
      const listener = action(description.events[beep]);
      if (!listener) continue;

      if (record.listeners[beep]) {
        element.removeEventListener(beep, record.listeners[beep]);
      }

      record.listeners[beep] = listener;

      // TODO: listener types
      element.addEventListener(beep, listener as any);
    }
  }
}