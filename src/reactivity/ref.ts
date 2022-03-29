import { hasChanged, isObject } from "../../share/index";
import { isTracking, trackEffects, triggerEffects } from "./effect";
import { reactive } from "./reactive";

class RefImpl {
  private _rawValue: any;
  private _value: any;
  private dep: any;
  public __v_isRef: boolean;

  constructor(value) {
    this._rawValue = value;
    this._value = setRefValue(value);
    this.dep = new Set();
    this.__v_isRef = true;
  }

  get value() {
    trackRefValue(this);
    return this._value;
  }

  set value(newVal) {
    if (hasChanged(newVal, this._rawValue)) {
      this._rawValue = newVal;
      this._value = setRefValue(newVal);
      triggerEffects(this.dep);
    }
  }
}

function setRefValue(value) {
  return isObject(value) ? reactive(value) : value;
}

export function ref(value) {
  return new RefImpl(value);
}

export function trackRefValue(ref) {
  if (isTracking()) {
    trackEffects(ref.dep);
  }
}

export function isRef(value) {
  return !!value.__v_isRef;
}

export function unRef(value) {
  return isRef(value) ? value.value : value;
}

//假如是ref， 就返回 值.value, 否则就返回 值；
export function proxyRefs(objectWithRef) {
  return new Proxy(objectWithRef, {
    get(target, key) {
      return unRef(Reflect.get(target,key));
    },
    set(target, key, value){
      if (isRef(target[key]) && !isRef(value) ) {        
        return target[key].value = value;
      } else {
        return Reflect.set(target, key, value);
      }
    }
  })
}