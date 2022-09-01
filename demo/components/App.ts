import {component} from "../../src/component";
import {Counter} from "./Counter";

export const App = component({}, ({ $ }) => {
  const container = $.div({ class: 'ProperDemo' });
  const counter = Counter({ defaultCount: 0 });

  return (
    container(
      counter
    )
  )
});