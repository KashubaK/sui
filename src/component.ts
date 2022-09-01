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

    instanceStore[id].record.type = 'component';

    const applyElementChanges = (fromMounted = false) => {
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

      const newRecord = fromMounted ? currentRecord : define({
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
        if (!parent.element) {
          return;
        }

        let currentChild = parent.children?.[index];

        if (!currentChild) {
          currentChild = newChild;
        }

        if (!isEqual(newChild.description, currentChild.description)) {
          Object.assign(currentChild.description, newChild.description);
        } else if (currentChild.mounted) {
          // Element already mounted, no need to update
          return;
        }

        if (newChild.description.when === false) {
          currentChild.mounted = false;
          currentChild.element?.parentElement?.removeChild(currentChild.element);
          return;
        }

        const element = renderElement(currentChild);

        if (!element.parentElement) {
          if (parent.element.children[index]) {
            parent.element.children[index].insertAdjacentElement('beforebegin', element);
          } else {
            parent.element.appendChild(element);
          }
        }

        currentChild.mounted = true;

        if (newChild.children) {
          newChild.children.forEach((c, i) => {
            if (currentChild.children[i]) {
              Object.assign(currentChild.children[i], c);
            } else {
              currentChild.children.push(c);
            }

            handleChild(c, i, currentChild);
          });
        }
      }

      newRecord.children?.forEach((c, i) => {
        handleChild(c, i, currentRecord)
      });

      instanceStore[id].record = currentRecord;
      const end = performance.now();

      console.log('Component update took', end - start, 'ms')
    }

    instanceStore[id].record.onElementMount = () => {
      applyElementChanges(true);
    }

    autorun(() => applyElementChanges());

    return instanceStore[id].record;
  }

  return renderer;
}