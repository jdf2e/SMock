//import 'babel-polyfill' //如需兼容低端浏览器，请打开此注释
import Vue from 'vue';
import App from './view/index.vue';
import './asset/css/common.scss';
//import router from './router.js';

Vue.config.errorHandler=function() {
  console.log(arguments)
}
const app = new Vue({
  render: h => h(App),
}).$mount('#app');
