import {component} from "../../src/component";

type ListItemInput = {
  text: string;
}

export const ListItem = component<{}, ListItemInput, {}>({}, ({ input, $ }) => {
  return $.li({ text: input.text })();
})