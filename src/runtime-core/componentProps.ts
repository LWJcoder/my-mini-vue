export function initProps(instance: any) {
  if (instance.vnode.props) {
    instance.props = instance.vnode.props;  
    
  }
}