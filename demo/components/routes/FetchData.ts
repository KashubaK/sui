import {component} from "../../../src";
import {IRouteInput} from "../Router";
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

  const container = $.div({ class: 'Data' });
  const loadingText = $.span();

  const posts = (state.postsFetcher?.data || []).map(post => {
    const div = $.div();
    const title = $.h1();
    const body = $.p();

    return div(
      title(post.title),
      body(post.body)
    );
  }) || [];

  const postList = $.div();

  return container(
    "Whats up",
    state.postsFetcher.loading && loadingText('Loading...'),
    postList(...posts)
  );
}, defaultState)