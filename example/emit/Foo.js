// import { h } from '.'
import { h } from '../../lib/mini-vue-esm.js';

export const Foo = {
  setup(props, {emit}) {
    console.log(props);
    const emitAdd = () => {
        console.log('emitAdd from Foo');
        emit('add', 1)
        emit('add-foo', 1)
    }
    return {
      emitAdd
    }
  },
  render() {
    
    return  h('button', {onClick: this.emitAdd
    } , 'test emit')
  }
}