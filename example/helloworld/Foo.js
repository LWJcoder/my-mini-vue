// import { h } from '.'
import { h } from '../../lib/mini-vue-esm.js';

export const Foo = {
  setup(props) {
    console.log(props);
   
    return {
      
    }
  },
  render() {
    
    // 在初始化的时候，通过document.addEventListener 添加事件 onClick: handleClick
    return  h('div', {} , this.fooState)
  }
}