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
  const counter = Counter({ input: { defaultCount: 0 } });

  return (
    container(
      counter,
      rerender()
    )
  )
}, 'App');