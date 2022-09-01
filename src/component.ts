import { v4 } from 'uuid';
import {autorun, observable} from "mobx";
import {createElementGenerator, ElementRecord} from "./elements/element";
import {elements} from "./elements/elements";
import {renderElement} from "./render/render";
import { isEqual } from 'lodash-es';

type ComponentUtils<State, Input, Output> = {
  state: State;
  input: Input;
  output: Output;
  $: {
    [key in keyof HTMLElementTagNameMap]: ReturnType<typeof createElementGenerator<key>>
  };
};

type ComponentDefaultState<State, Input> = State | ((input: Input) => State);
type ComponentDefinition<State, Input, Output> = (utils: ComponentUtils<State, Input, Output>) => ElementRecord;

type InstanceStore<State, Input, Output> = Record<string, {
  state: State;
  input: Input;
  output: Output;
  record: ElementRecord;
}>;

type ComponentRenderer<Input> = ((input: Input) => ElementRecord)

export function component<
  State extends Record<string, unknown>,
  Input extends Record<string, unknown>,
  Output extends Record<string, unknown>
>(defaultState: ComponentDefaultState<State, Input>, define: ComponentDefinition<State, Input, Output>): ComponentRenderer<Input> {
  const instanceStore: InstanceStore<State, Input, Output> = {};

  const renderer = (input: Input) => {
    const id = v4();

    const initialInput = observable(input);
    const initialState = observable(
      typeof defaultState === 'function' ? defaultState(input) : defaultState
    );
    const initialOutput = observable({} as any); // TODO: Default output?

    const componentElements = elements();

    instanceStore[id] = {
      input: initialInput,
      state: initialState,
      output: initialOutput,
      record: define({
        state: initialState,
        input: initialInput,
        output: initialOutput,
        $: componentElements,
      }),
    }

    const applyElementChanges = () => {
      const start = performance.now();

      // TODO: Figure out how to get autorun to work without having to do this
      for (const key in initialState) {
        initialState[key];
      }
      for (const key in initialInput) {
        initialInput[key];
      }

      const currentRecord = instanceStore[id].record;
      if (!currentRecord.element)  {
        return;
      }

      const newRecord = define({
        state: instanceStore[id].state,
        input: instanceStore[id].input,
        output: instanceStore[id].output,
        $: componentElements,
      });

      if (!isEqual(currentRecord.description, newRecord.description)) {
        Object.assign(currentRecord.description, newRecord.description);

        renderElement(currentRecord);
      }

      const handleChild = (newChild: ElementRecord, index: number, parent: ElementRecord) => {
        let currentChild = parent.children?.[index];

        if (!currentChild) {
          currentChild = newChild;
        }

        if (!isEqual(newChild.description, currentChild.description)) {
          Object.assign(currentChild.description, newChild.description);
        } else if (currentChild.element) {
          return;
        }

        const element = renderElement(currentChild);

        if (!element.parentElement) {
          parent.element?.appendChild(element);
        }

        if (currentChild.children) {
          currentChild.children.forEach((c, i) => handleChild(c, i, currentChild));
        }
      }

      newRecord.children?.forEach((c, i) => handleChild(c, i, currentRecord));

      instanceStore[id].record = currentRecord;
      const end = performance.now();

      console.log('Component update took', end - start, 'ms')
    }

    instanceStore[id].record.onElementMount = () => {
      applyElementChanges();
    }

    autorun(applyElementChanges);

    return instanceStore[id].record;
  }

  return renderer;
}