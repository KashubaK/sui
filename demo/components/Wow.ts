import {component} from "../../src/component";

export const Wow = component({}, ({ $ }) => {
  const wowMessage = $.h1({
    class: 'Wow',
    text: 'Wow, you counted to 10!'
  })

  return wowMessage();
})