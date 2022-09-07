import {ComponentRenderer} from "../component";

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
};

export type ElementRecord<State = {}, Input = {}, TagName extends keyof HTMLElementTagNameMap = keyof HTMLElementTagNameMap> = {
  type: 'component' | 'element';
  name: string;
  tagName: TagName;
  description: ElementDescription<TagName>;
  children: (ElementRenderer | ComponentRenderer<State, Input>)[];
  childRecords: ElementRecord[];
  mounted: boolean;
  onElementMount?: () => void;
  parent?: ElementRecord;
  element?: HTMLElement;
  listeners?: Record<string, (e: any) => unknown>;
  state?: State;
  lastState?: State;
  input?: Input;
  lastInput?: Input;
  index?: number;
}

export type ElementInstanceGenerator = (...children: (ComponentRenderer<any, any> | ElementInstanceGenerator | ElementRenderer)[]) => ElementRenderer;

export type ElementRenderer = (() => ElementRecord) & {
  parent?: ElementRecord;
  componentName: string;
  type: 'element' | 'component';
};

export function createElementGenerator<TagName extends keyof HTMLElementTagNameMap>(tagName: TagName) {
  return (description: ElementDescription<TagName> = {}): ElementInstanceGenerator => {
    const instanceGenerator = (...children: (ComponentRenderer<any, any> | ElementInstanceGenerator | ElementRenderer)[]): ElementRenderer => {
      const generateElementRecord = () => {
        const record: ElementRecord = {
          tagName,
          name: tagName,
          description,
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

    return instanceGenerator;
  }
}
