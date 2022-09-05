import {ComponentRenderer} from "../component";
import {v4} from "uuid";

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
  when?: boolean;
};

export type ElementRecord<State = {}, Input = {}> = {
  type: 'component' | 'element';
  tagName: keyof HTMLElementTagNameMap;
  description: ElementDescription;
  children: (ElementRenderer | ComponentRenderer<State, Input>)[];
  childRecords: ElementRecord[];
  mounted: boolean;
  key: string;
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

type ElementInstanceGenerator = (...children: ElementRenderer[]) => ElementRenderer;

export type ElementRenderer = (() => ElementRecord) & {
  parent?: ElementRecord;
  key: string;
  type: 'element' | 'component';
};

export function createElementGenerator<TagName extends keyof HTMLElementTagNameMap>(tagName: TagName) {
  return (description: ElementDescription): ElementInstanceGenerator => {
    const instanceGenerator = (...children: ElementRenderer[]): ElementRenderer => {
      const key = v4();
      const renderer = () => {
        const record: ElementRecord = {
          tagName,
          description,
          childRecords: [],
          children,
          mounted: false,
          key,
          type: 'element',
        };

        return record;
      }

      renderer.type = 'element';
      renderer.key = key;

      return renderer as ElementRenderer;
    }

    return instanceGenerator;
  }
}
