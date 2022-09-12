import {component} from "../../../src";
import {getTheme} from "../theme";

const theme = getTheme();

type HeadingInput = {
  tag?: 'span' | 'h6' | 'h5' | 'h4' | 'h3' | 'h2' | 'h1';
  removeMargin?: boolean;
}

export const Heading = component<HeadingInput | undefined>(function Heading({ $, children, input }) {
  const { tag = 'span', removeMargin = false } = input || {};

  const heading = $[tag]({
    style: {
      margin: removeMargin ? 0 : 'inherit'
    }
  });

  return heading(...children);
})