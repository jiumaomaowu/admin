import router from './router/index'
import VueRouter from 'vue-router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import { getToken } from './utils/auth' // getToken from cookie
import MenuUtils from './utils/MenuUtils'
// console.log('luyou222')
NProgress.configure({ showSpinner: false })// NProgress Configuration
let  routers = []
// // permissiom judge function
function hasPermission(roles, permissionRoles) {
  if (roles.indexOf('admin') >= 0) return true // admin permission passed directly
  if (!permissionRoles) return true
  return roles.some(role => permissionRoles.indexOf(role) >= 0)
}
// const router = new VueRouter({
//   routes
// })
const whiteList = ['/login', '/authredirect']// no redirect whitelist
let permission = JSON.parse(window.sessionStorage.getItem('user'))
if (permission) {

  store.commit('ADD_MENU', permission)

  MenuUtils(routers,store.state.user.items)
  router.options.routes = routers
  router.addRoutes(routers)

  // console.log(router)

}



router.beforeEach((to, from, next) => {
  // console.log('qwer')
  NProgress.start() // start progress bar

  if (getToken()) { // determine if there has token

//   //NProgress.start();
  if (to.path == '/login') {
    sessionStorage.removeItem('user');
  }
  let user = JSON.parse(sessionStorage.getItem('user'));
  if (!user && to.path != '/login') {
    next({ path: '/login' })
  } else {
    next()
  }

  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next('/login') // 否则全部重定向到登录页
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
