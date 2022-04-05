import { h } from '../../lib/mini-vue-esm.js';
window.self = null;

export const App = {
  render() {
      window.self = this;

      return h('div', {class: 'main'} , 
      'hi, ' + this.minVue
      // [h('p', {class: 'blue'},' blue text' ),
      // h('p', {class: 'red'},' red text' ),]
      )
  },
  setup() {
    return {
      minVue: 'min-vue-haha'
    }
  }
}

