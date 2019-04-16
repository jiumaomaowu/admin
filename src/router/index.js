import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import menuModule from '../store/modules/user'
// import index from '@/components/index'
import index from '@/views/dashboard/dashboard'

import layout from '@/views/layout/layout'
import Login from '@/views/login/login'
import VueRouter from 'vue-router'
Vue.use(Router)
Vue.use(VueRouter)

 let routes = [
  {
    path: '/login',

    name: '',
    id:-2,
    component: Login,
    hidden: true
},
  {
    path:"/",
    redirect:'dashboard',
    id:-1,
    component: layout,
    hidden: false,
    top_menu : "顶级菜单",
    children: [
      { path: '/dashboard',name:'', component: index, hidden: false ,meta: { title:'首页' } }
    ],
    
    icon : ""
  },
  // {
  //   path: '/',
  //   name: '数据管理',
  //   id:0,
  //   icon:'el-icon-message',
  //   component: home,
  //   meta: { roles: ['admin1'] },
  //   children: [
  //       { path: '/hospital', component: hospital, name: '医院管理', hidden: false ,meta: { roles: ['admin1'] }, },
  //       { path: '/applicant', component: applicant, name: '申办方管理', hidden: false },
  //       { path: '/protocol_template', component: protocol_template, name: '模板管理', hidden: false },
  //       { path: '/ethic_meeting_calendar', component: ethic_meeting_calendar, name: '上会日历', hidden: false }
  //   ]
  // },
  // {
  //   path: '/',
  //   name: '系统管理',
  //   id:1,
  //   icon:'el-icon-menu',
  //   component: home,
  //   meta: { roles: ['admin'] },
  //   children: [
  //       { path: '/admin', component: admin, name: '管理员列表', hidden: false ,meta: { roles: ['admin22'] }},
  //       { path: '/role', component: role, name: '角色管理', hidden: false }

  //   ]
  // },
  // {
  //   path: '/',
  //   name: '设置',
  //   id:4,
  //   icon:'el-icon-setting',
  //   meta: { roles: ['admin1'] },
  //   component: home,
  //   children: [
  //       { path: '/menu', component: menu, name:'修改菜单', hidden: false },
  //       { path: '/main7', component: index, name: '主页2', hidden: true }

  //   ]
  // },
  // { path: '/', redirect: '/404', component: home,hidden: false },
  // ...generateRoutesFromMenu(menuModule.state.items)
]

const router = new VueRouter({
  routes
})
export default router


