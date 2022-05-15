import { shallowReadonly } from "../reactivity/reactive";
import { emit } from "./componentEmit";
import { initProps } from "./componentProps";
import { PublicInstanceHandlers } from "./componentPublicInstance";
import { initSlots } from "./componentSlots";

export function createComponentInstance(vnode: any) {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
    proxy: null,
    props: {},
    slots: {},
    emit: () => {}
  };
  component.emit = emit as any;
  return component;
}

export function setupComponent(instance) {
  initProps(instance);
  initSlots(instance, instance.vnode.children);

  setupStatefulComponent(instance);
}

function setupStatefulComponent(instance: any) {
  // 实现this.xxx
  
  const Component = instance.type;
  const { setup } = Component;
  if (setup) {
    const setupResult = setup(shallowReadonly(instance.props), {
      emit: instance.emit.bind(null, instance)
    });
    handleSetupResult(instance, setupResult);
  }
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

