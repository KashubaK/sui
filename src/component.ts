import { v4 } from 'uuid';
import {autorun, observable} from "mobx";
import {createElementGenerator, ElementRecord} from "./elements/element";
import {elements} from "./elements/elements";
import {renderElement} from "./render/render";

type ComponentUtils<State, Input, Output> = {
  state: State;
  input: Input;
  output: Output;
  $: {
    [key in keyof HTMLElementTagNameMap]: ReturnType<typeof createElementGenerator<key>>
  };
};

type ComponentDefaultState<State, Input> = State | ((input: Input) => State);
type ComponentDefinition<State, Input, Output> = (utils: ComponentUtils<State, Input, Output>) => ElementRecord;

type InstanceStore<State, Input, Output> = Record<string, {
  state: State;
  input: Input;
  output: Output;
}>;

type ComponentRenderer<Input> = ((input: Input) => ElementRecord)

export function component<
  State extends Record<string, unknown>,
  Input extends Record<string, unknown>,
  Output extends Record<string, unknown>
>(defaultState: ComponentDefaultState<State, Input>, define: ComponentDefinition<State, Input, Output>): ComponentRenderer<Input> {
  const instanceStore: InstanceStore<State, Input, Output> = {};

  const renderer = (input: Input) => {
    const id = v4();

    instanceStore[id] ||= {
      input: observable(input),
      state: observable(
        typeof defaultState === 'function' ? defaultState(input) : defaultState
      ),
      output: observable({} as any), // TODO: Default output?
    }

    const currentInput = instanceStore[id].input;
    const currentState = instanceStore[id].state;
    const currentOutput  = instanceStore[id].output;

    const initialRecord = define({
      state: currentState,
      input: currentInput,
      output: currentOutput,
      $: elements(),
    });

    autorun(() => {
      const newRecord = define({
        state: currentState,
        input: currentInput,
        output: currentOutput,
        $: elements(),
      });

      Object.assign(initialRecord, newRecord);

      renderElement(initialRecord);

      console.log('Component updated', newRecord, currentState, currentInput, currentOutput)
    });

    return initialRecord;
  }

  return renderer;
}