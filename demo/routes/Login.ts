import {component} from "../../src";
import {IRouteInput} from "../../src/components/Router";

export default component<{ count: number }, IRouteInput>({ count: 0 }, function Login({ state, $ }) {
  const container = $.div();
  const heading = $.h1({ text: 'Login' });
  const button = $.button({
    text: `count ${state.count}`,
    events: {
      click: () => state.count++
    }
  })

  return container(heading(), button());
})