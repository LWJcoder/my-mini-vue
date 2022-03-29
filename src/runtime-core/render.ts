import { createComponentInstance, setupComponent } from "./component";


export function render(vnode, rootContainer) {
  return patch(vnode , rootContainer);
}

function patch(vnode: any, rootContainer: any) {
  // 判断是element类型
  if (typeof vnode.type === 'string') {
    processComponent(vnode, rootContainer)    
  } else {
    // object
    
  }
}
function processComponent(vnode: any, container: any) {

  mountComponent(vnode, container)
}

function mountComponent(vnode: any, container) {
  // 
  const instance = createComponentInstance(vnode);

  setupComponent(instance);
  setupRenderEffect(instance, container);
}


function setupRenderEffect(instance: any, container) {
  const subTree = instance.render();
  patch(subTree, container);
}

