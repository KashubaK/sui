import {ElementRecord} from "../elements/element";
import {action} from "mobx";

export function reconcileElement(record: ElementRecord): Node {
  if (!record.element) {
    record.element = record.type === 'text' ?
      document.createTextNode(record.textContent || '') :
      document.createElement(record.tagName);
  }

  applyElementDescription(record);

  return record.element;
}

export function applyElementDescription(record: ElementRecord) {
  const { description, element } = record;
  if (!element) {
    throw new Error('Cannot apply description from record without an element');
  }

  if (!(element instanceof HTMLElement)) return;

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
      const typedKey = key as keyof typeof description.events;
      const listener = action(description.events[typedKey]);
      if (!listener) continue;

      if (record.listeners[typedKey]) {
        element.removeEventListener(typedKey, record.listeners[typedKey]);
      }

      record.listeners[typedKey] = listener;

      // TODO: listener types
      element.addEventListener(typedKey, listener as any);
    }
  }

  const { attributes } = description;

  if (attributes) {
    for (const key in attributes) {
      if (!(key in element)) continue;
      const typedKey = key as keyof typeof attributes;

      if (typeof element[typedKey] === 'function' || typeof attributes[typedKey] === 'function') {
        console.warn('[Sui] You cannot set functions within element attributes, they will be ignored.');
        continue;
      }

      // TODO: Figure out element attribute key types
      // @ts-ignore
      element[typedKey] = attributes[typedKey];
    };
  }
}