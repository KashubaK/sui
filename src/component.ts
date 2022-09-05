import {observable} from "mobx";
import {createElementGenerator, ElementRecord, ElementRenderer} from "./elements/element";
import {elements} from "./elements/elements";

type ComponentUtils<State, Input, Output> = {
  state: State;
  input: Input;
  output: Output;
  $: {
    [key in keyof HTMLElementTagNameMap]: ReturnType<typeof createElementGenerator<key>>
  };
};

type ComponentDefaultState<State, Input> = State | ((input: Input) => State);
type ComponentDefinition<State, Input, Output> = ((utils: ComponentUtils<State, Input, Output>) => ElementRenderer);

type ComponentInstanceGeneratorArgs<Input> = {
  input: Input;
  when?: boolean;
}

type ComponentInstanceGenerator<State, Input> = (args: ComponentInstanceGeneratorArgs<Input>) => ComponentRenderer<State, Input>;
export type ComponentRenderer<State = any, Input = any, Output = any> = ((state?: State, input?: Input, output?: Output) => ElementRecord) & {
  type: 'component';
  input?: Input;
  parent?: ElementRecord;
};

export function component<
  State extends Record<string, unknown>,
  Input extends Record<string, unknown>,
  Output extends Record<string, unknown>
>(defaultState: ComponentDefaultState<State, Input>, define: ComponentDefinition<State, Input, Output>, name?: string): ComponentInstanceGenerator<State, Input> {
  const generateInstance: ComponentInstanceGenerator<State, Input> = ({ input, when }) => {
    const initialState = observable(typeof defaultState === 'function' ? defaultState(input) : defaultState);
    const initialOutput = observable({} as any); // TODO: Default output?

    const renderer = (state = initialState, output = initialOutput) => {
      const componentElements = elements();
      
      const record = define({
        state: state,
        input: input,
        output: output,
        $: componentElements,
      })();

      record.description.when = when;
      record.state = state;
      record.input = input;
      record.output = output;
      record.type = 'component';
      
      return record;
    }

    renderer.type = 'component';
    renderer.input = input;

    return renderer as ComponentRenderer<State, Input>;
  }

  return generateInstance;
}
