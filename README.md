# SUI

Simple client-side UI framework for JavaScript.

# Early development in progress

This is just an idea that may never come to fruition. There is much work to do before it can be considered usable.

## TODO

- Rendering optimization (currently using a very naive approach)
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
    heading,
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
    increment,
    count,
    countedToTen
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
    increment,
    count,
    countedToTen
  );
});

const CountedToTen = component({}, ({ $ }) => {
  return $.span({ text: 'You counted to ten!' });
});
```

## TODO: Provide children to nested components

## TODO: Provide child component `input`

## TODO: Handle child component `output`











