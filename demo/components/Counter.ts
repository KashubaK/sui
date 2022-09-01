import {component} from "../../src/component";

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

  const decrementor = $.button({
    class: 'Counter__Decrementor',
    text: 'Decrement',
    events: {
      click: () => {
        state.count--;
        output.count = state.count;
      }
    }
  });

  const countDisplay = $.span({
    class: 'Counter__Count',
    text: `Count: ${state.count}`
  });

  const wow = $.span({
    text: `Wow!`
  });

  return container(
    incrementor,
    countDisplay(
      wow
    ),
    decrementor,
  );
});
