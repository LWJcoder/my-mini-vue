export function initSlots(instance:any,  children: any) {
    console.log('children', children);
    
    instance.slots = children || [];
}