import { h, renderSlots } from '../../lib/mini-vue-esm.js';

export const Foo = {
  setup(props){ 
   
    return {
      
    }
  },
  render() {
    console.log(this.$slots);
    const foo = h('div', {}, 'foo')
    return  h('div', {}, [foo, renderSlots(this.$slots)])
  }
}