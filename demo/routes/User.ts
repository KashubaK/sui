import {component} from "../../src";
import {IRouteInput} from "../../src/components/Router";
import Link from "../../src/components/Link";

export default component<IRouteInput>(function User({ input, $ }) {
  const container = $.div();
  const heading = $.h1({ text: `User: ${input.params.id}` });
  const link = Link({ input: { to: '/', text: 'Back to home' } });

  return container(
    heading,
    link,
  );
});