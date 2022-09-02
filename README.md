# SUI

Simple client-side UI framework for JavaScript.

## But, _why?_ Another framework?

Yes! The more frameworks there are, the more refined our ideas become. SUI aims to address problems that have bothered 
developers with the popular frameworks out there.

## What makes SUI different?

- No special syntax, just pure JavaScript.
- Intuitive, mutable state management built-in. 

That's it! 

## Pure JavaScript

No magic, no transpilation.

```js
import { component } from 'sui';

export const Heading = component(({ $ }) => {
  return $.h1('Hello world!');
});
```

Modern frameworks out that don't seem to care that developers aren't writing straight up JS. This often creates 
disconnection between source code and what's actually happening, resulting in confusion and frustration. 

## Mutable state

Model your component's state and interact with it directly.

```js
import { component } from 'sui';

const defaultState = {
  count: 0,
}

export const Counter = component(defaultState, ({ state, $ }) => {
  const increment = $.button('Increment', {
    events: {
      click: () => state.count++,
    }
  });
  
  const count = $.span(`Count: ${state.count}`);
  
  const container = $.div();
  
  return container(
    increment,
    count
  );
});
```











