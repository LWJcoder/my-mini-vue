import { h } from '../../lib/mini-vue-esm.js';
import { Foo } from './Foo.js';
window.self = null;

export const App = {
  render() {
      window.self = this;

      return h('div', {
        class: 'main',
        onClick:()=> {
          console.log('onclick');
        }
        } , 
      [h(Foo, { fooState: this.minVue}) ]
      // [h('p', {class: 'blue'},' blue text' ),
      // h('p', {class: 'red'},' red text' ),]
      )
  },
  setup() {
     // 注册事件
     const handleClick = () => {
      console.log(' handle onClick');
    }
    return {
      handleClick,
      minVue: 'min-vue-haha'
    }
  }
}

