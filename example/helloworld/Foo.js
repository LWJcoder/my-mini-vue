// import { h } from '.'
import { h } from '../../lib/mini-vue-esm.js';

export const Foo = {
  setup(props) {
    console.log(props);
    props.fooState++;
    // todo
    return {
      
    }
  },
  render() {
    
    return  h('div', {} , this.fooState)
  }
}