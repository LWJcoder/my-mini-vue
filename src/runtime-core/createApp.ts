import { render } from "./renderer";
import { createVnode } from "./vnode";

export function createApp (rootElement) {
  return {
    mount(rootContainer) {
      const  vnode = createVnode(rootElement);
      return render( vnode, rootContainer);
    }
  }
}
