import {component} from "../../src/component";
import {Wow} from "./Wow";

type Input = {
  defaultCount: number;
}

type State = {
  count: number;
}

type Events = {
  count: (count: number) => unknown;
}

const defaultCounterState = (input: Input): State => ({ count: input.defaultCount });

export const Counter = component<State, Input, Events>(defaultCounterState, ({ state, emit, $ }) => {
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
        emit('count', state.count);
      }
    }
  });

  const decrementor = $.button({
    class: 'Counter__Decrementor',
    text: 'Decrement',
    events: {
      click: () => {
        state.count--;
        emit('count', state.count);
      }
    }
  });

  const countDisplay = $.span({
    class: 'Counter__Count',
    text: `Count: ${state.count}`
  });

  const wow = Wow({
    input: {},
    // input: { count: state.count },
    when: state.count === 10
  });

  return container(
    incrementor(),
    countDisplay(
      wow,
    ),
    decrementor(),
  );
}, 'Counter');
