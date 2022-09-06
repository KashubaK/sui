import {component} from "../../src";
import Link from "../../src/components/Link";
import {IRouteInput} from "../../src/components/Router";

export default component<{}, IRouteInput>({}, function Home({ $ }) {
  const container = $.div({ class: 'Home' });

  const heading = $.h1({ text: 'Home' });

  const loginLink = Link({ input: { to: '/login', text: 'Login' } })
  const userLink = Link({ input: { to: '/user/12345', text: 'User 12345' } })
  const dataLink = Link({ input: { to: '/data', text: 'Data' } })
  const lineBreak = $.br();

  return container(
    heading(),
    loginLink,
    lineBreak(),
    userLink,
    lineBreak(),
    dataLink
  );
})