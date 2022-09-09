import {component} from "../../../src";

export default component<undefined, { count: number }>(function Conditional({ $, state }) {
  const container = $.div();
  const count = $.span({ text: `Count: ${state.count}` });
  const a = $.span({ text: 'a' });
  const b = $.span({ text: 'b' });
  const c = $.span({ text: 'c' });

  const increment = $.button({ text: 'Increment', events: { click: () => state.count++ } });
  const decrement = $.button({ text: 'Decrement', events: { click: () => state.count-- } });

  return container(
    increment,
    state.count >= 1 && a,
    state.count >= 2 && b,
    state.count >= 3 && c,
    count,
    decrement
  );
}, { count: 0 });