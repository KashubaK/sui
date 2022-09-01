import {ElementDescription, ElementRecord} from "../elements/element";
import {action} from "mobx";

export function renderElement(record: ElementRecord): HTMLElement {
  record.element ||= document.createElement(record.tagName);

  if (record.children) {
    record.element.replaceChildren(...record.children.map(renderElement));
  }

  applyElementDescription(record.element, record.description);

  return record.element;
}

export function applyElementDescription(element: HTMLElement, description: ElementDescription) {
  if (description.text) {
    if (element.firstChild && element.firstChild.nodeType === Node.TEXT_NODE) {
      element.firstChild.textContent = description.text;
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
    for (const key in description.events) {
      const beep = key as keyof typeof description.events;
      const listener = action(description.events[beep]);
      if (!listener) continue;

      // TODO: Remove event listener, listener types
      element.addEventListener(beep, listener as any);
    }
  }
}