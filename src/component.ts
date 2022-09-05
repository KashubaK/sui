import {action, observable} from "mobx";
import {createElementGenerator, ElementRecord, ElementRenderer} from "./elements/element";
import {elements} from "./elements/elements";

type ComponentEvents = Record<string, (...args: any[]) => unknown>

type ComponentUtils<State, Input, Events extends ComponentEvents> = {
  state: State;
  input: Input;
  emit: (eventName: keyof Events, value: ReturnType<Events[typeof eventName]>) => void;
  $: {
    [key in keyof HTMLElementTagNameMap]: ReturnType<typeof createElementGenerator<key>>
  };
};

type ComponentDefaultState<State, Input> = State | ((input: Input) => State);
type ComponentDefinition<State, Input, Events extends ComponentEvents> = ((utils: ComponentUtils<State, Input, Events>) => ElementRenderer);

type ComponentInstanceGeneratorArgs<Input, Events extends ComponentEvents> = {
  input: Input;
  events?: Events,
  when?: boolean;
}

type ComponentInstanceGenerator<State, Input, Events extends ComponentEvents> = (args: ComponentInstanceGeneratorArgs<Input, Events>) => ComponentRenderer<State, Input>;
export type ComponentRenderer<State = any, Input = any> = ((state?: State, input?: Input) => ElementRecord) & {
  type: 'component';
  input: Input;
  parent?: ElementRecord;
  when?: boolean;
  displayName: string;
  __lastRenderTime?: number;
};

export function component<
  State extends Record<string, unknown>,
  Input extends Record<string, unknown>,
  Events extends ComponentEvents
>(defaultState: ComponentDefaultState<State, Input>, define: ComponentDefinition<State, Input, Events>, name = 'Unknown'): ComponentInstanceGenerator<State, Input, Events> {
  const generateInstance: ComponentInstanceGenerator<State, Input, Events> = ({ input, events, when }) => {
    const initialState = observable(typeof defaultState === 'function' ? defaultState(input) : defaultState);

    const renderer: ComponentRenderer<State, Input> = (state = initialState) => {
      const componentElements = elements();
      
      const record = define({
        state: state,
        input: input,
        emit: action((key, value) => {
          events?.[key](value);
        }),
        $: componentElements,
      })();

      record.description.when = when;
      record.state = state;
      record.input = input;
      record.type = 'component';

      return record;
    }

    renderer.type = 'component';
    renderer.input = input;
    renderer.when = when;
    renderer.displayName = name;

    return renderer;
  }

  return generateInstance;
}
