import { extend } from "../share";

let activeEffect;
let shouldTrack;

export class ReactiveEffect {
  _fn: any;
  _scheduler: any;
  deps = [];
  active = true;

  constructor(fn, scheduler?) {
    this._fn = fn;
    if (scheduler) {
      this._scheduler = scheduler;
    }
  }

  run() {   
    if (!this.active) {
      return this._fn();      
    }
    shouldTrack = true;
    activeEffect = this;
    let result = this._fn();

    shouldTrack = false;
    return result;

  }

  stop() {
    if (this.active) {
      cleanEffect(this);
      this.active = false;
    }
  }
}

function cleanEffect(effect: any) {
  effect.deps.forEach((dep: any) => {
    dep.delete(effect);
  });
  effect.deps.length = 0;
}

const targetsMap = new Map();
export function track(target, key) {
  if (!isTracking()) {
    return;
  }
  // map: {
  //   target: (map) {
  //     key: (set) {
  //       dep()
  //     }
  //   }
  // }
  let depsMap = targetsMap.get(target);

  if (!depsMap) {
    depsMap = new Map();
    targetsMap.set(target, depsMap);
  }

  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Set();
    depsMap.set(key, dep);
  }
  trackEffects(dep);
}

export function trackEffects(dep) {

  if (dep.has(activeEffect)) {
    return;
  }
  dep.add(activeEffect);
  activeEffect.deps.push(dep);
}

export const isTracking = () => {
  return shouldTrack && activeEffect;
}

export function trigger(target, key) {
  const depsMap = targetsMap.get(target);
  const deps = depsMap.get(key);

  triggerEffects(deps);
}

export function triggerEffects(deps) {
  for (const effect of deps) {
    if (effect._scheduler) {
      effect._scheduler();
    } else {
      effect.run();
    }
  }
}

export function effect(fn, options: any = {}) {
  let _effect = new ReactiveEffect(fn, options.scheduler);
  _effect.run();
  const runner: any = _effect.run.bind(_effect);
  extend(_effect, options);
  runner.effect = _effect;
  return runner;
}

export function stop(runner: any) {
  runner.effect.stop();
}
