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

type ComponentInstance<State, Input, Output> = {
  state: State;
  input: Input;
  output: Output;
  record: ElementRecord;
};

type ComponentRendererArgs<Input> = {
  input: Input;
  when?: boolean;
}

type ComponentRenderer<Input> = ((args: ComponentRendererArgs<Input>) => ElementRecord)
export function component<
  State extends Record<string, unknown>,
  Input extends Record<string, unknown>,
  Output extends Record<string, unknown>
>(defaultState: ComponentDefaultState<State, Input>, define: ComponentDefinition<State, Input, Output>): ComponentRenderer<Input> {
  const isCounter = define.toString().includes('class: "Counter"');

  const renderer: ComponentRenderer<Input> = ({ input, when }) => {
    const initialInput = observable(input);
    const initialState = observable(
      typeof defaultState === 'function' ? defaultState(input) : defaultState
    );
    const initialOutput = observable({} as any); // TODO: Default output?

    const componentElements = elements();

    const instance: ComponentInstance<State, Input, Output> = {
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

    instance.record.type = 'component';
    instance.record.description.when = when;

    const applyElementChanges = (fromMounted = false) => {
      const start = performance.now();

      // TODO: Figure out how to get autorun to work without having to do this
      for (const key in initialState) {
        initialState[key];
      }
      for (const key in initialInput) {
        initialInput[key];
      }

      const currentRecord = instance.record;

      if (!currentRecord.element)  {
        return;
      }

      const newRecord = fromMounted ? currentRecord : define({
        state: instance.state,
        input: instance.input,
        output: instance.output,
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

      instance.record = currentRecord;
      const end = performance.now();

      console.log('Component update took', end - start, 'ms')
    }

    instance.record.onElementMount = () => {
      applyElementChanges(true);
    }

    autorun(() => applyElementChanges());

    return instance.record;
  }

  return renderer;
}