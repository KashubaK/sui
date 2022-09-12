import {component} from "../../../src/component";

export default component(function Children({ $ }) {
  const container = $.div();
  const parent = Parent();

  return container(
    parent(Child())
  );
});

const Parent = component(function Parent({ $, children }) {
  const container = $.div();

  return container('imma parent', ...children);
});

const Child = component(function Child({ $ }) {
  const span = $.span();

  return span('I am a child!');
});
