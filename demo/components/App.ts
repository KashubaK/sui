import {component} from "../../src/component";
import { Counter } from "./Counter";

export const App = component({ count: 0 }, ({ state, $ }) => {
  const rerender = $.button({
    text: `Re-render App`,
    events: {
      click: () => {
        state.count++
      }
    }
  });

  const container = $.div({ class: `ProperDemo` });

  const counter = Counter({
    input: { defaultCount: 0 },
    events: {
      count(count) {
        state.count = count;
      }
    },
  });

  const count = $.span({ text: `Count: ${state.count}` })

  return (
    container(
      count(),
      counter,
      rerender(),
    )
  )
}, 'App');