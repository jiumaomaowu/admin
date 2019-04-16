// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been ddddsetddd in webpack.base.conf with an alias.
import Vue from 'vue';
import Vuex from 'vuex'
import router from './router/index'
import store from './store/index'
import App from './App.vue'
import Element from 'element-ui'
import VueRouter from 'vue-router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import '../static/css/cssreset.css'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import './styles/index.scss' // global css
import i18n from './lang' // Internationalization
import 'vue-event-calendar/dist/style.css' //1.1.10之后的版本，css被放在了单独的文件中，方便替换
import vueEventCalendar from 'vue-event-calendar'
import './permission'
import './icons/index' // icon

import * as filters from './filters' // global filters

Vue.use(vueEventCalendar, {locale: 'en'}) //可以设置语言，支持中文和英文
Vue.use(Vuex)
Vue.use(ElementUI)
Vue.use(VueRouter)

Vue.config.productionTip = false

Vue.use(Element, {
  size: 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})
// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
router.afterEach(() => {
  NProgress.done() // finish progress bar
})
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)

}).$mount('#app')

