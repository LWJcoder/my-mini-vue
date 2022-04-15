import { PublicInstanceHandlers } from "./componentPublicInstance";

export function createComponentInstance(vnode: any) {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
    proxy: null,
    props: {},
  };

  return component;
}

export function setupComponent(instance) {
  // TODO
  // initProps
  // initSlots

  setupStatefulComponent(instance);
}

function setupStatefulComponent(instance: any) {
  // 实现this.xxx
  
  const Component = instance.type;
  const { setup } = Component;
  instance.props = instance.vnode.props;
  // debugger
  if (setup) {
    const setupResult = setup(instance.props);
    handleSetupResult(instance, setupResult);
  }
  // debugger;
  // const {setupState} = instance 

  instance.proxy = new Proxy({_: instance}, PublicInstanceHandlers)
}
function handleSetupResult(instance: any, setupResult: any) {

  if (typeof setupResult === 'object') {
    instance.setupState = setupResult;
  }

  finishComponentSetup(instance);
}

function finishComponentSetup(instance: any) {
  const Component = instance.type;

  instance.render = Component.render;
}

