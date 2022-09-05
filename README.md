# SUI

Simple client-side UI framework for JavaScript.

# Early development in progress

This is just an idea that may never come to fruition. There is much work to do before it can be considered usable.

## TODO

- First-class routing
- First-class data fetching
- First-class test utilities

## But, _why?_ Another framework?

Yes! The more frameworks there are, the more refined our ideas become. This project is highly opinionated,
[I](https://github.com/KashubaK) am building this to solve my own problems that others may share.

## What makes SUI different?

- No special syntax, just pure JavaScript.
- Intuitive, mutable state management built-in. (Powered by [MobX](https://mobx.js.org/README.html))
- **TODO:** First-class routing
- **TODO:** First-class test utilities
- **TODO:** First-class data fetching

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

Model your component's state and interact with it directly:

```js
import { component } from 'sui';

const defaultState = {
  count: 0,
}

export const Counter = component(defaultState, ({ state, $ }) => {
  const increment = $.button({
    text: 'Increment',
    events: {
      click: () => state.count++,
    }
  });
  
  const count = $.span({ text: `Count: ${state.count}` });
  
  const container = $.div();
  
  return container(
    increment,
    count
  );
});
```

## Nesting components

Call the component function:

```js
import { component } from 'sui';

export const Parent = component({}, ({ $ }) => {
  const container = $.div();
  const heading = $.h1({ text: 'We have an important, never-before-seen message for you.' });
  
  return container(
    heading(),
    Child({})
  );
})

const Child = component({}, ({ $ }) => {
  return $.span({ text: 'Hello world!' });
});
```

## Conditional rendering

Add `when: boolean` to the element record:

```js
import { component } from 'sui';

const defaultState = {
  count: 0,
}

export const Counter = component(defaultState, ({ state, $ }) => {
  const container = $.div();
  
  const increment = $.button({
    text: 'Increment',
    events: {
      click: () => state.count++,
    }
  });
  
  const count = $.span({ text: `Count: ${state.count}` });
  const countedToTen = $.span({
    text: 'You counted to ten!',
    when: state.count === 10,
  });
  
  return container(
    increment(),
    count(),
    countedToTen()
  );
});
```

### Conditional rendering child components

Pass `when: boolean` to the component when you call it:

```js
import { component } from 'sui';

const defaultState = {
  count: 0,
}

export const Counter = component(defaultState, ({ state, $ }) => {
  const container = $.div();
  
  const increment = $.button({
    text: 'Increment',
    events: {
      click: () => state.count++,
    }
  });

  const count = $.span({ text: `Count: ${state.count}` });
  
  const countedToTen = CountedToTen({
    when: state.count === 10,
  })

  return container(
    increment(),
    count(),
    countedToTen()
  );
});

const CountedToTen = component({}, ({ $ }) => {
  return $.span({ text: 'You counted to ten!' })();
});
```

## Provide child component `input`

```js
import {component} from 'sui';

export const App = component({ count: 0 }, ({ state, $ }) => {
  const container = $.div();

  const counter = $.button({
    text: 'Increment',
    events: {
      click: () => state.count++
    }
  });
  
  const display = CountDisplay({ input: { count: state.count } });
  
  return (
    container(
      counter(),
      display,
    )
  );
});

export const CountDisplay = component({}, ({ input, $ }) => {
  const display = $.span({ text: `Current count: ${input.count}` });
  
  return display();
})
```

## Handle data propagated by child components

You're probably used to passing functions as "props" to children. Sui segregates the idea of "props" into two things:
`input` and `events`. This separation provides more clarity to each concern as opposed to grouping them together.

Pass an `events` object to the child component, and if you've got TypeScript, enjoy those type annotations.

```js
import {component} from 'sui';

export const App = component({ count: 0 }, ({ state, $ }) => {
  const container = $.div();
  
  const counter = Counter({
    events: {
      count: newCount => state.count = newCount,
    }
  })
  
  const display = $.span({ text: `Current count: ${state.count}` });
  
  return (
    container(
      counter(),
      display,
    )
  );
});

export const Counter = component({ count: 0 }, ({ input, emit, $ }) => {
  const counter = $.button({
    text: 'Increment',
    events: {
      click: () => {
        state.count++;
        emit('count', state.count);
      }
    }
  });
  
  return counter();
})
```

## Iterative rendering

```js
import { component } from 'sui';
import { times } from 'lodash';

export const App = component({ count: 0 }, ({ state, $ }) => {
  const container = $.div();

  const counter = $.button({
    text: 'Increment',
    events: {
      click: () => state.count++
    }
  });
  
  const listItems = times(state.count, (i) => $.li({ text: `List item ${i}` }));
  const list = $.ul();

  return (
    container(
      counter(),
      list(...listItems),
    )
  );
});
```

**This works with components too! :)**

## TODO: Provide children to nested components











