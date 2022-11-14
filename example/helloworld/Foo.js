import { h, ref } from '../../lib/mini-vue-esm.js';

export const Foo = {
  setup(props) {
    console.log(props);
    props.fooState++;
    const count = ref(0);

    // todo
    return {
      count
    }
  },
  render() {
    
    return  h('div', {} , [h('div', {}, this.count.value + '' + this.fooState)])
  }
}