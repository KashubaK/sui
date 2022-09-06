import {component} from "../component";
import {navigate} from "./Router";

type Input = {
  to: string;
  text: string;
}

export default component<{}, Input>({}, function Link({ input, $ }) {
  const anchor = $.a({
    text: input.text,
    attributes: { href: input.to },
    events: {
      click(e) {
        e.preventDefault();
        navigate(input.to);
      }
    }
  });

  return anchor();
})