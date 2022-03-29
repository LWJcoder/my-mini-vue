import { ReactiveEffect } from "./effect";


class ComputedRefImpl {
  private _getter: any;
  private _value: any;
  private _dirty: boolean = true;
  private _effect: ReactiveEffect;
  

  constructor(getter) {
    this._getter = getter;
    this._effect = new ReactiveEffect(getter,() => {
      if (!this._dirty) {
        this._dirty = true;
      }
    })
  }

  get value() {
    if (this._dirty) {
      this._value = this._effect.run();
      this._dirty = false;
    }
    return this._value;
  }

  // set value(value){
  //   this._value = value;

  // }
}

export function computed(getter) {
  return new ComputedRefImpl(getter);
}
