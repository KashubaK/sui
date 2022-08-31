import { v4 } from 'uuid';
import {observable} from "mobx";
import {createElementGenerator} from "./elements/element";

type ComponentUtils<State, Input, Output> = {
  state: State;
  input: Input;
  output: Output;
  $: {
    [key in keyof HTMLElementTagNameMap]: ReturnType<typeof createElementGenerator<key>>
  };
};

type ComponentDefaultState<State, Input> = State | ((input: Input) => State);
type ComponentDefinition<State, Input, Output> = (utils: ComponentUtils<State, Input, Output>) => HTMLElement;

type InstanceStore<State, Input, Output> = Record<string, {
  state: State;
  input: Input;
  output: Output;
}>;

export function component<
  State extends Record<string, unknown>,
  Input extends Record<string, unknown>,
  Output extends Record<string, unknown>
>(defaultState: ComponentDefaultState<State, Input>, definition: ComponentDefinition<State, Input, Output>) {
  const instanceStore: InstanceStore<State, Input, Output> = {};

  return (input: Input) => {
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
    const currentOutput = instanceStore[id].output;

    return definition({
      state: currentState,
      input: currentInput,
      output: currentOutput,
      $: {
        // TODO: Add more elements
        div: createElementGenerator('div', currentState),
        span: createElementGenerator('span', currentState),
        button: createElementGenerator('button', currentState),
        input: createElementGenerator('input', currentState),
      } as any,
    });
  }
}