import {component} from "../../src/component";

type State = {}
type Input = {}

export const Wow = component<State, Input, {}>({}, ({ $ }) => {
  const wowMessage = $.h1({
    class: 'Wow',
    text: `Wow, you counted to 10!`
  })

  return wowMessage();
}, 'Wow')