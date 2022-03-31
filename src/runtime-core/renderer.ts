import { createComponentInstance, setupComponent } from "./component";


export function render(vnode, rootContainer) {
  return patch(vnode , rootContainer);
}

function patch(vnode: any, rootContainer: any) {
  // 判断是element类型
  // 'div', {class: 'red'}, children
  if (typeof vnode.type === 'string') {
    // 节点
    processElement(vnode, rootContainer)    

  } else {
    // component
    processComponent(vnode, rootContainer)    
    
  }
}

function processElement(vnode: any, container: any) {
  mountElement(vnode, container)
}

function mountElement(vnode: any, container: any) {
  // 挂载
  const el = document.createElement(vnode.type);

  for (const key in vnode.props) {
    el.setAttribute(key, vnode.props[key])    
  }

  if (vnode.children) {
    vnode.children.forEach(v => {
      patch(v, el);
    })
  }

  container.append(el);
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


