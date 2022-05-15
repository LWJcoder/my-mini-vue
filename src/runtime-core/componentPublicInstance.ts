import { hasOwn } from "../../share/index";

const publicProxiesMap = {
  $el: (i) => i.vnode.el,
  $slots: (i) => i.slots,
  
}

export const PublicInstanceHandlers = {
  get({_ :instance}, key) {
    const { setupState, props } = instance;
    
    if (hasOwn(setupState, key)) {
      return setupState[key];
    } else if (hasOwn(props, key)) {
      return props[key];
    }

    const res = publicProxiesMap[key];
    
    if (res) {
      return res(instance);
    }
  }
}