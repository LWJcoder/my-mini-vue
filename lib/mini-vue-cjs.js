'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const publicProxiesMap = {
    $el: (i) => i.vnode.el,
};
const PublicInstanceHandlers = {
    get({ _: instance }, key) {
        const { setupState } = instance;
        if (key in setupState) {
            return setupState[key];
        }
        const res = publicProxiesMap[key];
        if (res) {
            return res(instance);
        }
    }
};

function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type,
        setupState: {},
        proxy: null,
    };
    return component;
}
function setupComponent(instance) {
    // TODO
    // initProps
    // initSlots
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    // 实现this.xxx
    const Component = instance.type;
    const { setup } = Component;
    if (setup) {
        const setupResult = setup();
        handleSetupResult(instance, setupResult);
    }
    // debugger;
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
    for (const key in vnode.props) {
        el.setAttribute(key, vnode.props[key]);
    }
    const { children } = vnode;
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
function mountComponent(vnode, container) {
    // 
    const instance = createComponentInstance(vnode);
    setupComponent(instance);
    setupRenderEffect(instance, vnode, container);
}
function setupRenderEffect(instance, vnode, container) {
    const { proxy } = instance;
    const subTree = instance.render.call(proxy);
    patch(subTree, container);
    // 绑定
    vnode.el = subTree.el;
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

exports.createApp = createApp;
exports.h = h;
