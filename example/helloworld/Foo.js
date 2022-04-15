// import { h } from '.'
import { h } from '../../lib/mini-vue-esm.js';

export const Foo = {
  setup(props) {
    console.log(props);
    return {
    }
  },
  render() {
    //todo: 注册事件
    // onClick: () => {
    //   console.log('onClick');
    // }
    // 在初始化的时候，通过document.addEventListener 添加事件
    return  h('div', {} , this.fooState)
  }
}