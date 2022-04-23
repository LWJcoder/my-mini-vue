export function emit(instance, event) {
    console.log('emit', event);

    const capilize = (str: string) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    const toHandleKey = (str: string) => {
        return str ? 'on' +  capilize(str) : ''
    }
    const ho_capilize = (str: string) => {
        return str.replace(/-(\w)/g, (_, c: string) => {
            return c ? c.toUpperCase() : ''
        })
    }

    const { props } = instance;
    // console.log(toHandleKey(capilize(event)), props);
    
    const handler = props[toHandleKey(ho_capilize(event))]
    handler && handler();
    
    
}