import {component, ComponentDefinition} from "../../src";
import {IRouteInput} from "../../src/components/Router";

const Login: ComponentDefinition<IRouteInput, { count: number }> = ({ state, $ }) => {
  const container = $.div();
  const heading = $.h1({ text: 'Login' });
  const button = $.button({
    text: `count ${state.count}`,
    events: {
      click: () => state.count++
    }
  })

  return container(heading, button);
}

export default component(Login, { count: 0 })