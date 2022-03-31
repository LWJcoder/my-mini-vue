// vue3
import { App } from "./App";
import { createApp } from "../../lib/mini-vue-esm";

const container = document.querySelector("#app");
createApp(App).mount(container);
