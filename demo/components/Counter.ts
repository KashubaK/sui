import {component} from "../../src/component";
import {Wow} from "./Wow";
import {ListItem} from "./ListItem";

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
  });

  const incrementor = $.button({
    class: 'Counter__Incrementor',
    text: 'Increment',
    events: {
      click: () => {
        state.count += 1000;
        emit('count', state.count);
      }
    }
  });

  const decrementor = $.button({
    class: 'Counter__Decrementor',
    text: 'Decrement',
    events: {
      click: () => {
        state.count -= 10;
        emit('count', state.count);
      }
    }
  });

  const countDisplay = $.span({
    class: 'Counter__Count',
    text: `Count: ${state.count}`
  });

  const wow = Wow({
    input: { count: state.count },
  });

  const listItems = [...Array(state.count)].map((_, i) => {
    return ListItem({ input: { text: `List item ${i + 1}` } });
  })

  const list = $.ul({});

  return container(
    incrementor(),
    countDisplay(
      wow,
    ),
    decrementor(),
    list(
      $.li({ text: 'First item' })(),
      ...listItems.slice(0, 5),
      $.li({ text: 'AFTER 5', when: listItems.length >= 5 })(),
      ...listItems.slice(5),
      $.li({ text: 'Last' })(),
    )
  );
}, 'Counter');
