import { v4 } from 'uuid';
import {autorun, observable} from "mobx";

type IfEquals<X, Y, A=X, B=never> =
  (<T>() => T extends X ? 1 : 2) extends
    (<T>() => T extends Y ? 1 : 2) ? A : B;

type WritableKeys<T> = {
  [P in keyof T]-?: IfEquals<{
    [Q in P]: T[P];
  }, {
    -readonly [Q in P]: T[P];
  }, P>
}[keyof T];

type NonFunctionKeys<T> = {
  [P in keyof T]-?: IfEquals<T[P], () => unknown>
}[keyof T];


type ElementDescription = {
  class?: string;
  events?: Partial<{
    [key in keyof GlobalEventHandlersEventMap]: (e: GlobalEventHandlersEventMap[key]) => unknown;
  }>;
  style?: Partial<Pick<CSSStyleDeclaration, WritableKeys<CSSStyleDeclaration> & NonFunctionKeys<CSSStyleDeclaration>>>;
  text?: string;
  html?: string;
};

type ElementDescriptor = ElementDescription | (() => ElementDescription)

type ElementRenderer = ((...children: (ElementRenderer | HTMLElement | string)[]) => HTMLElement) & {
  element: HTMLElement;
};

export function createElementGenerator<TagName extends keyof HTMLElementTagNameMap>(tagName: TagName, state: any) {
  return (desc: ElementDescriptor, deps: unknown[] = []): ElementRenderer => {
    const element = document.createElement(tagName);

    applyElementDescription(element, desc);

    autorun(() => {
      applyElementDescription(element, desc);
    })

    const renderElement: ElementRenderer = (...children) => {
      element.replaceChildren(
        element.innerText,
        ...children.map(child => typeof child === 'function' ? child.element : child)
      );

      return element;
    };

    renderElement.element = element;

    return renderElement;
  }
}

export function applyElementDescription(element: HTMLElement, descriptor: ElementDescriptor) {
  let desc = typeof descriptor === 'function' ? descriptor() : descriptor;

  if (desc.text) {
    if (element.firstChild && element.firstChild.nodeType === Node.TEXT_NODE) {
      element.firstChild.textContent = desc.text;
    } else {
      element.prepend(document.createTextNode(desc.text));
    }
  }

  if (desc.html) {
    element.innerHTML = desc.html;
  }

  if (desc.class) {
    element.className = desc.class;
  }

  if (desc.style) {
    for (const key in desc.style) {
      if (!(desc.style.hasOwnProperty(key))) continue;
      const beep = key as keyof typeof desc.style;

      element.style[beep] ||= desc.style[beep] || '';
    }
  }

  if (desc.events) {
    for (const key in desc.events) {
      const beep = key as keyof typeof desc.events;
      const listener = desc.events[beep];
      if (!listener) continue;

      // TODO: Remove event listener, listener types
      element.addEventListener(beep, listener as any);
    }
  }
}