import {component} from "../../src/component";
import Router from "./Router";
import Home from "./routes/Home";
import Login from "./routes/Login";
import User from "./routes/User";
import FetchData from "./routes/FetchData";
import Stress from "./routes/Stress";
import Children from "./routes/Children";
import Conditional from "./routes/Conditional";

const Fallback = component(function Fallback({ $ }) {
  return $.h1({})('No route matched.');
})

export default component(function App({ $ }) {
  const router = Router({
    input: {
      routes: {
        '/': Home,
        '/login': Login,
        '/data': FetchData,
        '/stress': Stress,
        '/children': Children,
        '/conditional': Conditional,
        '/user/:id': User,
      },
      fallback: Fallback
    }
  })

  const container = $.div({ class: 'App' });
  const text = $.span()

  return container(text('hmm'), router, text('uhhh'));
});