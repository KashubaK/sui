import {component} from "../../../src";
import {IRouteInput} from "../Router";
import {times} from "lodash-es";

const ListItem = component<undefined, { count: number }>(function ListItem({ state, children, $ }) {
  const li = $.li();
  const increment = $.button({
    events: {
      click: () => state.count++,
    }
  })

  return li(...children, increment(`Count: ${state.count}`));
}, { count: 0 });

export default component<IRouteInput, { count: number }>(function Stress({ state, $ }) {
  const container = $.div();
  const heading = $.h1();
  const increaseButton = $.button({
    events: {
      click: () => state.count += 1000
    }
  });

  const decreaseButton = $.button({
    events: {
      click: () => {
        if (state.count === 0) return;

        state.count -= 1000
      }
    }
  });

  const listItems = times(state.count, (i) => {
    return ListItem()(`List item ${i}`);
  });

  const list = $.ul();

  return container(
    heading('Stress test'),
    increaseButton(`Increase element count by 1000 (current: ${state.count})`),
    decreaseButton(`Decrease element count by 1000 (current: ${state.count})`),
    list(...listItems)
  );
}, { count: 0 })