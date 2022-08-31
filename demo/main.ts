// PSEUDO CODE
import {mount} from "../src/mount";
import {Counter} from "./components/Counter";

mount(document.body, Counter({ defaultCount: 0 }));