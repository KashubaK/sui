# Abandoned!

This project will not be worked on for the foreseeable future.

# SUI

Simple client-side UI framework for JavaScript.

# Early development in progress - not production ready!

This is just an idea that may never come to fruition. There is much work to do before it can be considered usable.

## TODO

- Battle test, build example applications to catch edge cases and performance issues
- Implement unit tests to ensure production readiness

## But, _why?_ Another framework?

Yes! The more frameworks there are, the more refined our ideas become. This project is highly opinionated,
[I](https://github.com/KashubaK) am building this to solve my own problems that others may share.

## What makes SUI different?

- No special syntax, just pure JavaScript.
- Intuitive, mutable state management built-in. (Currently powered by [MobX](https://mobx.js.org/README.html))

That's it! 

## Pure JavaScript

No transpilation. You can even import this straight into the browser.

```js
import { component, mount } from '@kashuab/sui';

// You need to use named functions!
// This may change in the future to reduce repetition.
export const Heading = component(function Heading({ $ }) {
  const heading = $.h1();
  
  return heading('Hello world!');
});

mount(Heading(), document.body);
```

Modern frameworks out that don't seem to care that developers aren't writing straight up JS. This often creates 
disconnection between source code and what's actually happening, resulting in confusion and frustration. 

## Mutable state

Model your component's state and interact with it directly:

```js
import { component } from '@kashuab/sui';

const defaultState = { count: 0 };

export const Counter = component(function Counter({ state, $ }) {
  const increment = $.button({
    events: {
      click: () => state.count++,
    }
  });
  
  const count = $.span();
  const container = $.div();
  
  return container(
    increment('Increment'),
    count(`Count: ${state.count}`)
  );
}, defaultState);
```

## Nesting components

Call the component function:

```js
import { component } from '@kashuab/sui';

export const Parent = component(function Parent({ $ }) {
  const container = $.div();
  const heading = $.h1();
  const child = Child();
  
  return container(
    heading('We have an important, never-before-seen message for you.'),
    child
  );
})

const Child = component(function Child({ $ })  {
  const text = $.span();

  return text('Hello world!');
});
```

## Conditional rendering

Apply a similar strategy as React by using `&&`:

```js
import { component } from '@kashuab/sui';

const defaultState = { count: 0 };

export const Counter = component(function Counter({ state, $ }) {
  const container = $.div();
  
  const increment = $.button({
    events: {
      click: () => state.count++,
    }
  });
  
  const text = $.span();
  
  return container(
    increment('Increment'),
    text(`Count: ${state.count}`),
    state.count === 10 && text('You counted to ten!')
  );
}, defaultState);
```

### Conditional rendering child components

```js
import { component } from '@kashuab/sui';

const defaultState = { count: 0 };

export const Counter = component(function Counter({ state, $ }) {
  const container = $.div();
  
  const increment = $.button({
    events: {
      click: () => state.count++,
    }
  });

  const text = $.span();
  const countedToTen = CountedToTen();

  return container(
    increment('Increment'),
    text(`Count: ${state.count}`),
    state.count === 10 && countedToTen
  );
}, defaultState);

const CountedToTen = component(function CountedToTen({ $ }) {
  const text = $.span();

  return text('You counted to ten!');
});
```

## Provide children to nested components

```js
import { component } from '@kashuab/sui';

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

const Child = component(function Child({ $, children }) {
  const text = $.span();
  
  return text('I am a child!', ...children);
});
```

## Provide child component `input`

```js
import {component} from '@kashuab/sui';

const defaultState = { count: 0 };

export const App = component(function App({ state, $ }) {
  const container = $.div();

  const counter = $.button({
    events: {
      click: () => state.count++
    }
  });
  
  const display = CountDisplay({ input: { count: state.count } });
  
  return (
    container(
      counter('Increment'),
      display,
    )
  );
}, defaultState);

export const CountDisplay = component(function CountDisplay({ input, $ }) {
  const text = $.span();
  
  return display(`Current count: ${input.count}`);
})
```

## Handle data propagated by child components

You're probably used to passing functions as "props" to children. Sui segregates the idea of "props" into two things:
`input` and `events`. This separation provides more clarity to each concern as opposed to grouping them together.

Pass an `events` object to the child component, and if you've got TypeScript, enjoy those type annotations.

```js
import {component} from '@kashuab/sui';

const appDefaultState = { count: 0 };

export const App = component(function App({ state, $ }) {
  const container = $.div();
  
  const counter = Counter({
    input: { defaultCount: 10 },
    events: {
      count: newCount => state.count = newCount,
    }
  })
  
  const text = $.span();
  
  return (
    container(
      counter,
      text(`Current count: ${state.count}`),
    )
  );
}, appDefaultState);

const counterDefaultState = (input) => ({ count: input.defaultCount });

export const Counter = component(function Counter({ input, emit, $ }) {
  const counter = $.button({
    events: {
      click: () => {
        state.count++;
        
        // Use 'emit' to propagate information to a propspective parent!
        emit('count', state.count);
      }
    }
  });
  
  return counter(`Increment (default count is ${input.defaultCount})`);
}, counterDefaultState)
```

## Iterative rendering

```js
import { component } from '@kashuab/sui';
import { times } from 'lodash';

export const App = component(function App({ state, $ }) {
  const container = $.div();

  const counter = $.button({
    events: {
      click: () => state.count++
    }
  });
  
  // You don't have to use lodash!
  const listItems = times(state.count, (i) => {
    const li = $.li();
    
    return li(`List item ${i}`);
  });
  
  const list = $.ul();

  return (
    container(
      counter('Increment'),
      list(...listItems),
    )
  );
});
```

**This works with components too! :)**

## TODO: TypeScript documentation

For now, see [the demo source](demo).











