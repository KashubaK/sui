import {component} from "../../src/component";
import {navigate} from "./Router";

type Input = {
  to: string;
}

export default component<Input>(function Link({ input, children, $ }) {
  const anchor = $.a({
    attributes: { href: input.to },
    events: {
      click(e) {
        e.preventDefault();
        navigate(input.to);
      }
    }
  });

  return anchor(...children);
});