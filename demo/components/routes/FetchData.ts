import {component} from "../../../src";
import {IRouteInput} from "../../../src/components/Router";
import {action, observable} from "mobx";

type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
}

type Fetcher<Data> = {
  loading: boolean;
  data: Data | null;
}

type State = {
  postsFetcher: Fetcher<Post[]> | null;
}

const defaultState = {
  postsFetcher: null,
}

const createFetcher = <Data>(url: string): Fetcher<Data> => {
  const state = observable({
    loading: true,
    data: null,
  });

  (async() => {
    state.loading = true;

    const response = await fetch(url);
    const json = await response.json();

    action(() => {
      state.data = json;
      state.loading = false;
    })();
  })();

  return state;
}

export default component<IRouteInput, State>(function FetchData({ state, $ }) {
  state.postsFetcher ??= createFetcher<Post[]>('https://jsonplaceholder.typicode.com/posts');

  const container = $.div({ text: "Whats up", class: 'Data' });
  const loadingText = $.span({ text: 'Loading...', when: state.postsFetcher?.loading });

  const posts = (state.postsFetcher?.data || []).map(post => {
    const div = $.div();
    const title = $.h1({ text: post.title });
    const body = $.p({ text: post.body });

    return div(
      title,
      body
    );
  }) || [];

  const postList = $.div();

  return container(
    loadingText,
    postList(...posts)
  );
}, defaultState)