import {component, ComponentDefinition} from "../../../src";
import {IRouteInput} from "../Router";

const Login: ComponentDefinition<IRouteInput, { count: number }> = ({ state, $ }) => {
  const container = $.div();
  const heading = $.h1();
  const button = $.button({
    events: {
      click: () => state.count++
    }
  })

  const fragment = $.fragment();

  console.log({ fragment })

  return container(
    fragment(heading('Login'), button(`count ${state.count}`))
  );
}

export default component(Login, { count: 0 })