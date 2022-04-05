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
  const el = (vnode.el = document.createElement(vnode.type));

  for (const key in vnode.props) {
    el.setAttribute(key, vnode.props[key])    
  }

  const { children } = vnode;
  if (children) {
    if (typeof children === 'string') {
      el.textContent = children;
    } else if( Array.isArray(children)){
      mountChildren(children, el);
    }    
  }

  container.append(el);
}

function mountChildren(children, container) {
  children.forEach(v => {
    patch(v, container);
  })
}

function processComponent(vnode: any, container: any) {
  mountComponent(vnode, container)
}


function mountComponent(vnode: any, container) {
  // 
  const instance = createComponentInstance(vnode);

  setupComponent(instance);
  setupRenderEffect(instance, vnode, container);
}


function setupRenderEffect(instance: any,vnode: any, container) {
  const { proxy } = instance;
  const subTree = instance.render.call(proxy);
  patch(subTree, container);

  // 绑定
  vnode.el = subTree.el;
}


