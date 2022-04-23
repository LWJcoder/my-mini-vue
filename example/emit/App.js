import { h } from '../../lib/mini-vue-esm.js';
import { Foo } from './Foo.js';
window.self = null;

export const App = {
  setup() {
    // 注册事件
    const handleClick = () => {
     console.log(' handle onClick');
   }
   const onAdd = () => {
     console.log('on add call');
   }
   const onAddFoo = () => {
    console.log('onAddFoo call');
  }
   return {
     handleClick,
     onAdd,
     onAddFoo,
     minVue: 'min-vue-haha'
   }
 },
  render() {
      window.self = this;

      return h('div', {
        class: 'main',
      
        } , 
      [h(Foo, { onAdd: this.onAdd,onAddFoo: this.onAddFoo }) ]
      // [h('p', {class: 'blue'},' blue text' ),
      // h('p', {class: 'red'},' red text' ),]
      )
  },
 
}

