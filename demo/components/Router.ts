import {component, ComponentInstanceGenerator, ComponentRenderer} from "../../src/component";
import {action} from "mobx";

// TODO: Move Router/Link to `sui-router` package

export type IRouteInput = {
  params: Record<string, string>;
  query: URLSearchParams;
}

type Input = {
  routes: Record<string, ComponentInstanceGenerator<IRouteInput, any, any>>;
  fallback: ComponentInstanceGenerator;
};

type State = {
  currentRoute: string;
  removeNavigateListener: (() => void) | null
}

const defaultState = { currentRoute: location.pathname, removeNavigateListener: null };

export default component<Input, State>(function Router({ state, input }) {
  const locationPathSegments = state.currentRoute.split('/');
  locationPathSegments.shift();

  // How does this not cause a double-render on mount?
  state.removeNavigateListener ||= onNavigate((url) => {
    state.currentRoute = url;
  });

  return getMatchedRoute();

  function getMatchedRoute() {
    let matchedRoute: ComponentRenderer<IRouteInput> | null = null;

    Object.keys(input.routes).reverse().forEach(path => {
      if (matchedRoute) return;

      const params: Record<string, string> = {};
      const pathSegments = path.split('/');

      pathSegments.shift();

      let matched = locationPathSegments.length === pathSegments.length;
      if (!matched) return;

      pathSegments.forEach((segment, index) => {
        if (!matched) return;

        const currentSegment = locationPathSegments[index];
        if (typeof currentSegment !== 'string') {
          matched = false;
          return;
        }

        const isParam = segment.startsWith(':');
        const segmentName = segment.replace(':', '');

        if (!isParam) {
          if (segmentName != currentSegment) {
            matched = false;
            return;
          };
        } else {
          params[segmentName] = currentSegment;
        }
      });

      if (!matched) return;

      matchedRoute = input.routes[path]({ input: { params, query: new URLSearchParams(location.search) } })
    });

    return matchedRoute || input.fallback();
  }
}, defaultState);

export function navigate(url: string) {
  history.pushState({}, '', url);

  const event = new CustomEvent('__sui:navigate', { detail: { url } });

  window.dispatchEvent(event);
}

export function onNavigate(callback: (newPath: string) => unknown) {
  const handleNavigate = action((e: Event | PopStateEvent) => {
    if (e instanceof CustomEvent) {
      const { url } = e.detail;

      callback(url);
    } else if (e instanceof PopStateEvent) {
      callback(window.location.pathname);
    }
  });

  window.addEventListener('__sui:navigate', handleNavigate)
  window.addEventListener('popstate', handleNavigate);

  return () => window.removeEventListener('__sui:navigate', handleNavigate);
}