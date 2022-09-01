// PSEUDO CODE
import {mount} from "../src/mount";
import {Counter} from "./components/Counter";
import {renderElement} from "../src/render/render";

mount(document.body, renderElement(Counter({ defaultCount: 0 })));