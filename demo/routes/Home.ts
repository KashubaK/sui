import {component} from "../../src";
import Link from "../../src/components/Link";
import {IRouteInput} from "../../src/components/Router";
import {action} from "mobx";

type HomeState = {
  lineBreakElementWidth: null | number;
}

export default component<IRouteInput, HomeState>(function Home({ $, state }) {
  const container = $.div({ class: 'Home' });
  const heading = $.h1({ text: 'Home' });

  const loginLink = Link({ input: { to: '/login', text: 'Login' } })
  const userLink = Link({ input: { to: '/user/12345', text: 'User 12345' } })
  const dataLink = Link({ input: { to: '/data', text: 'Data' } })
  const stressLink = Link({ input: { to: '/stress', text: 'Stress test' } })

  const lineBreak = $.br({
    mount: action((element) => {
      state.lineBreakElementWidth = element.getBoundingClientRect().width;
    })
  });

  return container(
    heading,
    loginLink,
    lineBreak,
    userLink,
    lineBreak,
    dataLink,
    lineBreak,
    stressLink
  );
}, { lineBreakElementWidth: null });
