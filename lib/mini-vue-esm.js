const extend = Object.assign;
const isObject = (val) => {
    return val !== null && typeof val === 'object';
};
const hasOwn = (target, key) => {
    return target.hasOwnProperty(key);
};

const targetsMap = new Map();
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
    instance.slots = children || [];
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

export { createApp, h, renderSlots };
