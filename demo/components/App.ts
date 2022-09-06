import {component} from "../../src/component";
import Router from "../../src/components/Router";
import Home from "../routes/Home";
import Login from "../routes/Login";
import User from "../routes/User";
import FetchData from "../routes/FetchData";

const Fallback = component({}, function Fallback({ $ }) {
  const heading = $.h1({ text: 'No route matched.' });

  return heading();
})

export default component({}, function App({ $ }) {
  const router = Router({
    input: {
      routes: {
        '/': Home,
        '/login': Login,
        '/data': FetchData,
        '/user/:id': User,
      },
      fallback: Fallback
    }
  })

  const container = $.div();

  return container(router);
});