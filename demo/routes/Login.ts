import {component} from "../../src";
import {IRouteInput} from "../../src/components/Router";

export default component<{}, IRouteInput>({}, function Login({ $ }) {
  const heading = $.h1({ text: 'Login' });

  return heading();
})