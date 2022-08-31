import {component} from "../../src/component";
import {Wow} from "./Wow";

type Input = {
  defaultCount: number;
}

type State = {
  count: number;
}

type Output = {
  count: number;
}

const defaultCounterState = (input: Input): State => ({ count: input.defaultCount });

export const Counter = component<State, Input, Output>(defaultCounterState, ({ state, output, $ }) => {
  const container = $.div({
    class: 'Counter',
    style: {
      display: 'flex',
      alignItems: 'center'
    }
  });

  const incrementor = $.button({
    class: 'Counter__Incrementor',
    text: 'Increment',
    events: {
      click: () => {
        state.count++;
        output.count = state.count;
      }
    }
  });

  const countDisplay = $.span(() => ({
    class: 'Counter__Count',
    text: `Count: ${state.count}`
  }));

  return container(() => [
    incrementor,
    countDisplay,
    state.count >= 10 && Wow({})
  ]);
});
