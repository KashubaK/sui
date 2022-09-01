type IfEquals<X, Y, A = X, B = never> =
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

export type ElementDescription = {
  class?: string;
  events?: Partial<{
    [key in keyof GlobalEventHandlersEventMap]: (e: GlobalEventHandlersEventMap[key]) => unknown;
  }>;
  style?: Partial<Pick<CSSStyleDeclaration, WritableKeys<CSSStyleDeclaration> & NonFunctionKeys<CSSStyleDeclaration>>>;
  text?: string;
  html?: string;
};

export type ElementRecord = {
  tagName: keyof HTMLElementTagNameMap;
  description: ElementDescription;
  children: ElementRecord[];
  element?: HTMLElement;
  listeners?: Record<string, (e: any) => unknown>;
  onElementMount?: () => void;
}

export type ElementRenderer = (...children: (ElementRecord | ElementRenderer)[]) => ElementRecord;

export function createElementGenerator<TagName extends keyof HTMLElementTagNameMap>(tagName: TagName) {
  return (description: ElementDescription) => {
    const renderer: ElementRenderer = (...children) => {
      const record = {
        tagName,
        description,
        children: children.map(child => typeof child === 'function' ? child() : child),
      };

      return record;
    }

    return renderer;
  }
}
