// vue3
import { App } from "./App";
import { createApp } from "../../src/runtime-core/createApp";

const container = document.querySelector("#app");
createApp(App).mount(container);
