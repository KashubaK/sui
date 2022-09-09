import {ComponentRecordGenerator} from "../component";
import {action} from "mobx";

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

export type ElementDescription<TagName extends keyof HTMLElementTagNameMap> = {
  class?: string;
  events?: Partial<{
    [key in keyof GlobalEventHandlersEventMap]: (e: GlobalEventHandlersEventMap[key]) => unknown;
  }>;
  style?: Partial<Pick<CSSStyleDeclaration, WritableKeys<CSSStyleDeclaration> & NonFunctionKeys<CSSStyleDeclaration>>>;
  // TODO: NonFunctionKeys here is making this Record<never, unknown>
  attributes?: Partial<Pick<HTMLElementTagNameMap[TagName], WritableKeys<HTMLElementTagNameMap[TagName]>>>;
  text?: string;
  html?: string;
  when?: boolean;
  mount?: (element: HTMLElementTagNameMap[TagName]) => unknown;
  unmount?: (element: HTMLElementTagNameMap[TagName]) => unknown;
};

export type ElementRecord<Input = {}, State = {}, TagName extends keyof HTMLElementTagNameMap = keyof HTMLElementTagNameMap> = {
  type: 'component' | 'element';
  name: string;
  tagName: TagName;
  description: ElementDescription<TagName>;
  children: (ElementRenderer | ComponentRecordGenerator)[];
  childRecords: ElementRecord[];
  mounted: boolean;
  parent?: ElementRecord;
  element?: HTMLElement;
  listeners?: Record<string, (e: any) => unknown>;
  state?: State;
  lastState?: State;
  input?: Input;
  lastInput?: Input;
  index?: number;
}

export type Child = ComponentRecordGenerator<any, any> | ElementInstanceGenerator | ElementRenderer;

export type ElementInstanceGenerator = (...children: Child[]) => ElementRenderer;

export type ElementRenderer<TagName extends keyof HTMLElementTagNameMap = keyof HTMLElementTagNameMap> = (() => ElementRecord<any, any, TagName>) & {
  parent?: ElementRecord;
  componentName: string;
  type: 'element' | 'component';
};

export function createElementGenerator<TagName extends keyof HTMLElementTagNameMap>(tagName: TagName) {
  return (description: ElementDescription<TagName> = {}): ElementInstanceGenerator => {
    if (description.mount) description.mount = action(description.mount);
    if (description.unmount) description.unmount = action(description.unmount);

    const instanceGenerator = (...children: (ComponentRecordGenerator<any, any> | ElementInstanceGenerator | ElementRenderer)[]): ElementRenderer<TagName> => {
      const generateElementRecord = () => {
        const record: ElementRecord<any, any, TagName> = {
          tagName,
          name: tagName,
          // ugh. TS doesn't like how I'm using generics to map element tag names
          description: description as any,
          childRecords: [],
          children: children.map(child => {
            // Weird hack. We don't want to call Component/ElementRenderers, but if it's an InstanceGenerator we do
            if ('type' in child) {
              return child;
            }

            return child();
          }),
          mounted: false,
          type: 'element',
        };

        return record;
      }

      generateElementRecord.type = 'element' as const;
      generateElementRecord.componentName = tagName;

      return generateElementRecord;
    }

    return instanceGenerator as ElementInstanceGenerator;
  }
}
