import { extend, isObject } from "../../share/index";
import { track, trigger } from "./effect";
import { reactive, ReactiveFlags, readonly } from "./reactive";
const shallowReadonlyGetter = CreateGetter(true, true);

function CreateGetter(isReadonly = false, isShallow = false) {
  return (target, key) => {
    const res = Reflect.get(target, key);

    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly;
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly;
    }

    if (isShallow) {
      return res;
    }

    if (!isReadonly) {
      // 依赖收集
      track(target, key);
    }
    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res)
    }
    return res;
  };
}

function createSetter() {
  return (target, key, value) => {
    const res = Reflect.set(target, key, value);
    // 触发依赖
    trigger(target, key);

    return res;
  };
}

export const readonlyHandler = {
  get: CreateGetter(true),
  set(target, key) {
    console.warn('readonly can not be set')
    return true;
  },
}

export const mutableHanler = {
  get: CreateGetter(),

  set: createSetter(),
}

export const shallowReadonlyHandler = extend({}, readonlyHandler, {
  get: shallowReadonlyGetter
});