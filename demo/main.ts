// PSEUDO CODE
import {mount} from "../src/mount";
import {renderElement} from "../src/render/render";
import {App} from "./components/App";

mount(document.body, renderElement(App({})));