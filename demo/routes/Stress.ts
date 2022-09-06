import {component} from "../../src";
import {IRouteInput} from "../../src/components/Router";
import {times} from "lodash-es";

export default component<{ count: number }, IRouteInput>({ count: 0 }, function Stress({ state, $ }) {
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
    const listItem = $.li({ text: `List item ${i}` });

    return listItem()
  });

  const list = $.ul();

  return container(heading(), increaseButton(), decreaseButton(), list(...listItems));
})