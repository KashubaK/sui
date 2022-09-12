import {component} from "../../../src";
import Link from "../Link";
import {IRouteInput} from "../Router";
import {action} from "mobx";

type HomeState = {
  lineBreakElementWidth: null | number;
}

export default component<IRouteInput, HomeState>(function Home({ $, state }) {
  const container = $.div({ class: 'Home' });
  const heading = $.h1();

  const loginLink = Link({ input: { to: '/login' } })
  const userLink = Link({ input: { to: '/user/12345' } })
  const dataLink = Link({ input: { to: '/data' } })
  const stressLink = Link({ input: { to: '/stress' } })
  const childrenLink = Link({ input: { to: '/children' } })
  const conditionalLink = Link({ input: { to: '/conditional' } })

  const lineBreak = $.br();

  return container(
    heading('Home'),
    loginLink('Login'),
    lineBreak,
    userLink('User 12345'),
    lineBreak,
    dataLink('Data fetching'),
    lineBreak,
    stressLink('Stress test'),
    lineBreak,
    childrenLink('Children example'),
    lineBreak,
    conditionalLink('Conditionals')
  );
}, { lineBreakElementWidth: null });
