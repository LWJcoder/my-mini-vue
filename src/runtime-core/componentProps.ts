export function initProps(instance: any) {
  if (instance.vnode.props) {
    instance.props = instance.vnode.props || {};  // 防止app初始化 空值
    
  }
}