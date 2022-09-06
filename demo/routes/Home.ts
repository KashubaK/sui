import {component} from "../../src";
import Link from "../../src/components/Link";
import {IRouteInput} from "../../src/components/Router";

export default component<{}, IRouteInput>({}, function Home({ $ }) {
  const container = $.div();

  const heading = $.h1({ text: 'Home' });

  const loginLink = Link({ input: { to: '/login', text: 'Login' } })
  const lineBreak = $.br();
  const userLink = Link({ input: { to: '/user/12345', text: 'User 12345' } })

  return container(
    heading(),
    loginLink,
    lineBreak(),
    userLink,
  );
})