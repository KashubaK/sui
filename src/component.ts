import {action, observable} from "mobx";
import {createElementGenerator, ElementInstanceGenerator, ElementRecord, ElementRenderer} from "./elements/element";
import {elements} from "./elements/elements";

export type ComponentEvents = Record<string, (...args: any[]) => unknown>

export type ComponentUtils<Input, State, Events extends ComponentEvents | undefined> = {
  input: Input;
  state: State;
  $: {
    [key in keyof HTMLElementTagNameMap]: ReturnType<typeof createElementGenerator<key>>
  };
} & (
  Events extends undefined ? {} : {
    // TypeScript doesn't seem to know that we've ruled out `undefined` in `Events extends undefined`
    // @ts-ignore
    emit: Events extends undefined ? never : EmitFn<Events>
  }
)

export type EmitFn<Events extends ComponentEvents> = (
  eventName: keyof Events,
  value: ReturnType<Events[typeof eventName]>
) => void;

export type ComponentDefaultState<Input, State> = State | ((input: Input) => State);
export type ComponentDefinition<Input, State, Events extends ComponentEvents | undefined > =
  (utils: ComponentUtils<Input, State, Events>) => ElementRenderer | ElementInstanceGenerator;

export type ComponentInstanceGeneratorArgs<Input, Events extends ComponentEvents | undefined> =
  { when?: boolean } & (
    Input extends undefined
      ? Events extends undefined
        ? {}
        : { events?: Events }
      : Events extends ComponentEvents
        ? { input: Input, events?: Events }
        : { input: Input }
  )

export type ComponentInstanceGenerator<Input = undefined, State = undefined, Events extends ComponentEvents | undefined = undefined> =
  Input extends undefined
    ? (args?: ComponentInstanceGeneratorArgs<Input, Events>) => ComponentRenderer<Input, State>
    : Events extends undefined
      ? (args: ComponentInstanceGeneratorArgs<Input, Events>) => ComponentRenderer<Input, State>
      : (args: ComponentInstanceGeneratorArgs<Input, Events>) => ComponentRenderer<Input, State>

export type ComponentRenderer<Input = undefined, State = undefined> = ((state?: State) => ElementRecord) & {
  type: 'component';
  input: Input;
  parent?: ElementRecord;
  when?: boolean;
  componentName: string;
  __lastRenderTime?: number;
};

type ComponentAdditionalFnArgs<
  Input extends Record<string, unknown> | undefined = undefined,
  State extends Record<string, unknown> | undefined = undefined,
  Events extends ComponentEvents | undefined = undefined
> =
  Parameters<
    State extends undefined
      ? () => ComponentInstanceGenerator<Input, State, Events>
      : (defaultState: ComponentDefaultState<Input, State>) => ComponentInstanceGenerator<Input, State, Events>
  >;

export function component<
  Input extends Record<string, unknown> | undefined = undefined,
  State extends Record<string, unknown> | undefined = undefined,
  Events extends ComponentEvents | undefined = undefined,
>(define: ComponentDefinition<Input, State, Events>, ...args: ComponentAdditionalFnArgs<Input, State, Events>): ComponentInstanceGenerator<Input, State, Events> {
  // TODO: Is there a way to accomplish this without all the type casting?
  let [defaultState] = args;

  const componentName = define.name;
  if (!componentName) {
    throw new Error('[Sui] You must use a named function when creating a component.');
  }

  const generateInstance = (args: ComponentInstanceGeneratorArgs<Input, Events>) => {
    const { when = true } = args;

    const input = 'input' in args ? args.input : undefined;
    const events = 'events' in args ? args.events : undefined;

    defaultState = defaultState instanceof Function ? defaultState(input as Input) : defaultState;

    const initialState = observable(defaultState || {}) as State;

    const renderer: ComponentRenderer<Input, State> = (state = initialState) => {
      let record = define({
        state: state as State,
        input: input as Input,
        emit: action((key: string, value: any) => {
          events?.[key](value);
        }),
        $: elements,
      } as any)();

      // Components can return an ElementInstanceGenerator
      if (typeof record === 'function') record = record();

      record.name = componentName;
      record.description.when = when;
      record.state = state;
      record.input = input;
      record.type = 'component';

      return record;
    }

    renderer.type = 'component';
    renderer.input = input as Input;
    renderer.when = when;
    renderer.componentName = componentName;

    return renderer;
  }

  return generateInstance as ComponentInstanceGenerator<Input, State, Events>;
}
