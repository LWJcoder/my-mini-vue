const publicProxiesMap = {
  $el: (i) => i.vnode.el,
  
}

export const PublicInstanceHandlers = {
  get({_ :instance}, key) {
    const { setupState } = instance;
    if (key in setupState) {
      return setupState[key];
    }

    const res = publicProxiesMap[key];
    
    if (res) {
      return res(instance);
    }
  }
}