import {component} from "../../../src/component";

export default component(function Children({ $ }) {
  const container = $.div();
  const parent = Parent();
  const child = Child();

  return container(
    parent(child("Child of child!"))
  );
});

const Parent = component(function Parent({ $, children }) {
  const container = $.div();

  return container('imma parent', ...children);
});

const Child = component(function Child({ children, $ }) {
  const span = $.span();

  return span('I am a child!', ...children);
});
