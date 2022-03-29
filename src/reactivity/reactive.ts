import { readonlyHandler, mutableHanler, shallowReadonlyHandler } from "./baseHandler";

export enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadonly'
}

export function reactive(raw) {
  return new Proxy(raw, mutableHanler);
}

export function readonly(raw) {
  // not set
  return new Proxy(raw, readonlyHandler);
}

export function shallowReadonly(raw) {
  return new Proxy(raw, shallowReadonlyHandler);  
}

export function isReactive(value) {
  return !!value[ReactiveFlags.IS_REACTIVE];
}


export function isReadonly(value) {
  return !!value[ReactiveFlags.IS_READONLY];
}

// 是否被代理
export function isProxy(value) {
  return isReadonly(value) || isReactive(value);
}