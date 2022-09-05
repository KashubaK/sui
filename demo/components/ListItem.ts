import {component} from "../../src/component";

type ListItemInput = {
  text: string;
}

export const ListItem = component<{ count: number }, ListItemInput, {}>({ count: 0 }, ({ state, input, $ }) => {
  const button = $.button({
    text: 'Add',
    events: {
      click: () => state.count++
    }
  });

  return $.li({ text: `${input.text} ${state.count}` })(button());
})