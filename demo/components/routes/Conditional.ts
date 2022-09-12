import {component} from "../../../src";

export default component<undefined, { count: number }>(function Conditional({ $, state }) {
  const container = $.div();
  const span = $.span();

  const increment = $.button({ events: { click: () => state.count++ } });
  const decrement = $.button({ events: { click: () => state.count-- } });

  return container(
    increment("Increment"),
    state.count >= 1 && span('a'),
    state.count >= 2 && span('b'),
    state.count >= 3 && span('c'),
    state.count && span(`Count: ${state.count}`),
    decrement("Decrement")
  );
}, { count: 0 });