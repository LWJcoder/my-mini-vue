import { h } from '../../lib/mini-vue-esm.js';
import { Foo } from './Foo.js';

export const App = {
  name: 'app',
  setup() {

   return {
     minVue: 'min-vue-haha'
   }
 },
  render() {
      const app =  h('div', {}, 'app');
      const foo = h(Foo, {},[ h('p', {}, 'p123'),  h('p', {}, 'p234')])
      
      return h('div', {}, [app, foo])
  },
 
} 

