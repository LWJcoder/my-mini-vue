const extend = Object.assign;
const isObject = (val) => {
    return val !== null && typeof val === 'object';
};
const hasChanged = (val, newVal) => {
    return !Object.is(val, newVal);
};
const hasOwn = (target, key) => {
    return target.hasOwnProperty(key);
};

let activeEffect;
let shouldTrack;
class ReactiveEffect {
    constructor(fn, scheduler) {
        this.deps = [];
        this.active = true;
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
function cleanEffect(effect) {
    effect.deps.forEach((dep) => {
        dep.delete(effect);
    });
    effect.deps.length = 0;
}
const targetsMap = new Map();
function track(target, key) {
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
function trackEffects(dep) {
    if (dep.has(activeEffect)) {
        return;
    }
    dep.add(activeEffect);
    activeEffect.deps.push(dep);
}
const isTracking = () => {
    return shouldTrack && activeEffect;
};
function trigger(target, key) {
    const depsMap = targetsMap.get(target);
    const deps = depsMap.get(key);
    triggerEffects(deps);
}
function triggerEffects(deps) {
    for (const effect of deps) {
        if (effect._scheduler) {
            effect._scheduler();
        }
        else {
            effect.run();
        }
    }
}
function effect(fn, options = {}) {
    let _effect = new ReactiveEffect(fn, options.scheduler);
    _effect.run();
    const runner = _effect.run.bind(_effect);
    extend(_effect, options);
    runner.effect = _effect;
    return runner;
}
function stop(runner) {
    runner.effect.stop();
}

const shallowReadonlyGetter = CreateGetter(true, true);
function CreateGetter(isReadonly = false, isShallow = false) {
    return (target, key) => {
        const res = Reflect.get(target, key);
        if (key === ReactiveFlags.IS_REACTIVE) {
            return !isReadonly;
        }
        else if (key === ReactiveFlags.IS_READONLY) {
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
            return isReadonly ? readonly(res) : reactive(res);
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
const readonlyHandler = {
    get: CreateGetter(true),
    set(target, key) {
        console.warn('readonly can not be set');
        return true;
    },
};
const mutableHanler = {
    get: CreateGetter(),
    set: createSetter(),
};
const shallowReadonlyHandler = extend({}, readonlyHandler, {
    get: shallowReadonlyGetter
});

var ReactiveFlags;
(function (ReactiveFlags) {
    ReactiveFlags["IS_REACTIVE"] = "__v_isReactive";
    ReactiveFlags["IS_READONLY"] = "__v_isReadonly";
})(ReactiveFlags || (ReactiveFlags = {}));
function reactive(raw) {
    return createReactiveObject(raw, mutableHanler);
}
function readonly(raw) {
    // not set
    return createReactiveObject(raw, readonlyHandler);
}
function shallowReadonly(raw) {
    return createReactiveObject(raw, shallowReadonlyHandler);
}
function isReactive(value) {
    return !!value[ReactiveFlags.IS_REACTIVE];
}
function isReadonly(value) {
    return !!value[ReactiveFlags.IS_READONLY];
}
// 是否被代理
function isProxy(value) {
    return isReadonly(value) || isReactive(value);
}
function createReactiveObject(obj, baseHandlers) {
    if (!isObject(obj)) {
        console.warn(`${obj} must be object`);
        return obj;
    }
    return new Proxy(obj, baseHandlers);
}

function emit(instance, event) {
    console.log('emit', event);
    const capilize = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };
    const toHandleKey = (str) => {
        return str ? 'on' + capilize(str) : '';
    };
    const ho_capilize = (str) => {
        return str.replace(/-(\w)/g, (_, c) => {
            return c ? c.toUpperCase() : '';
        });
    };
    const { props } = instance;
    // console.log(toHandleKey(capilize(event)), props);
    const handler = props[toHandleKey(ho_capilize(event))];
    handler && handler();
}

function initProps(instance) {
    if (instance.vnode.props) {
        instance.props = instance.vnode.props || {}; // 防止app初始化 空值
    }
}

const publicProxiesMap = {
    $el: (i) => i.vnode.el,
    $slots: (i) => i.slots,
};
const PublicInstanceHandlers = {
    get({ _: instance }, key) {
        const { setupState, props } = instance;
        if (hasOwn(setupState, key)) {
            return setupState[key];
        }
        else if (hasOwn(props, key)) {
            return props[key];
        }
        const res = publicProxiesMap[key];
        if (res) {
            return res(instance);
        }
    }
};

function initSlots(instance, children) {
    console.log('children', children);
    instance.slots = Array.isArray(children) ? children : [children];
}

function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type,
        setupState: {},
        proxy: null,
        props: {},
        slots: {},
        emit: () => { }
    };
    component.emit = emit;
    return component;
}
function setupComponent(instance) {
    initProps(instance);
    initSlots(instance, instance.vnode.children);
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
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
    instance.proxy = new Proxy({ _: instance }, PublicInstanceHandlers);
}
function handleSetupResult(instance, setupResult) {
    if (typeof setupResult === 'object') {
        instance.setupState = setupResult;
    }
    finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
    const Component = instance.type;
    instance.render = Component.render;
}

function render(vnode, rootContainer) {
    return patch(vnode, rootContainer);
}
function patch(vnode, rootContainer) {
    // 判断是element类型
    // 'div', {class: 'red'}, children
    if (typeof vnode.type === 'string') {
        // 节点
        processElement(vnode, rootContainer);
    }
    else {
        // component
        processComponent(vnode, rootContainer);
    }
}
function processElement(vnode, container) {
    mountElement(vnode, container);
}
function mountElement(vnode, container) {
    // 挂载
    const el = (vnode.el = document.createElement(vnode.type));
    const { props, children } = vnode;
    for (const key in props) {
        // 在初始化的时候，通过document.addEventListener 添加事件 onClick: handleClick
        if (/^on[A-Z]/.test(key)) {
            // onClick...
            el.addEventListener(key.slice(2).toLowerCase(), props[key]);
        }
        else {
            el.setAttribute(key, props[key]);
        }
    }
    // const { children } = vnode;
    if (children) {
        if (typeof children === 'string') {
            el.textContent = children;
        }
        else if (Array.isArray(children)) {
            mountChildren(children, el);
        }
    }
    container.append(el);
}
function mountChildren(children, container) {
    children.forEach(v => {
        patch(v, container);
    });
}
function processComponent(vnode, container) {
    mountComponent(vnode, container);
}
function mountComponent(initialVnode, container) {
    // 
    const instance = createComponentInstance(initialVnode);
    setupComponent(instance);
    setupRenderEffect(instance, initialVnode, container);
}
function setupRenderEffect(instance, initialVnode, container) {
    const { proxy } = instance;
    const subTree = instance.render.call(proxy);
    patch(subTree, container);
    // 绑定
    initialVnode.el = subTree.el;
}

function createVnode(type, props, children) {
    const vnode = {
        type,
        props,
        children
    };
    return vnode;
}

function createApp(rootElement) {
    return {
        mount(rootContainer) {
            const vnode = createVnode(rootElement);
            return render(vnode, rootContainer);
        }
    };
}

function h(type, props, children) {
    return createVnode(type, props, children);
}

function renderSlots(slots) {
    return createVnode('div', {}, slots);
}

class RefImpl {
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
function ref(value) {
    return new RefImpl(value);
}
function trackRefValue(ref) {
    if (isTracking()) {
        trackEffects(ref.dep);
    }
}
function isRef(value) {
    return !!value.__v_isRef;
}
function unRef(value) {
    return isRef(value) ? value.value : value;
}
//假如是ref， 就返回 值.value, 否则就返回 值；
function proxyRefs(objectWithRef) {
    return new Proxy(objectWithRef, {
        get(target, key) {
            return unRef(Reflect.get(target, key));
        },
        set(target, key, value) {
            if (isRef(target[key]) && !isRef(value)) {
                return target[key].value = value;
            }
            else {
                return Reflect.set(target, key, value);
            }
        }
    });
}

export { createApp, effect, h, isProxy, isReactive, isReadonly, isRef, proxyRefs, reactive, readonly, ref, renderSlots, shallowReadonly, stop, unRef };
