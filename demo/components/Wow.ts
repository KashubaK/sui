import {component} from "../../src/component";

type State = {}
type Input = { count: number }

export const Wow = component<State, Input, {}>({}, ({ input, $ }) => {
  const wowMessage = $.h1({
    class: 'Wow',
    text: `Wow, you counted to ${input.count}!`
  })

  return wowMessage();
}, 'Wow')