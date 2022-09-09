import {component} from "../../../src/component";

export default component(function Children({ $ }) {
  const container = $.div();
  const parent = Parent();

  return container(
    parent(Child())
  );
});

const Parent = component(function Parent({ $, children }) {
  const container = $.div({ text: 'imma parent' });

  return container(...children);
});

const Child = component(function Child({ $ }) {
  return $.span({ text: 'I am a child!' });
});
