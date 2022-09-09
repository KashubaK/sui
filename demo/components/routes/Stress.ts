import {component} from "../../../src";
import {IRouteInput} from "../../../src/components/Router";
import {times} from "lodash-es";

const ListItem = component<{ text: string }, { count: number }>(function ListItem({ state, input, $ }) {
  const li = $.li({ text: input.text });
  const increment = $.button({
    text: `Count: ${state.count}`,
    events: {
      click: () => state.count++,
    }
  })

  return li(increment);
}, { count: 0 });

export default component<IRouteInput, { count: number }>(function Stress({ state, $ }) {
  const container = $.div();
  const heading = $.h1({ text: 'Stress test' });
  const increaseButton = $.button({
    text: `Increase element count by 1000 (current: ${state.count})`,
    events: {
      click: () => state.count += 1000
    }
  });

  const decreaseButton = $.button({
    text: `Decrease element count by 1000 (current: ${state.count})`,
    events: {
      click: () => {
        if (state.count === 0) return;

        state.count -= 1000
      }
    }
  });

  const listItems = times(state.count, (i) => {
    return ListItem({ input: { text: `List item ${i}` } });
  });

  const list = $.ul();

  return container(heading, increaseButton, decreaseButton, list(...listItems));
}, { count: 0 })