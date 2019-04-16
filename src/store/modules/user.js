import { loginByUsername, logout } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    user: '',
    status: '',
    code: '',
    token: getToken(),
    name: '',
    avatar: '',
    introduction: '',
    roles: [],
    setting: {
      articlePlatform: []
    },
    items: [],
    isLoadRoutes: false,
    count: 0,
    userF:[],
    addPermission:[],
    addUserinfo:'',
    addSelection:[],
    row:''
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
      window.localStorage.setItem('avatar', JSON.stringify(state.avatar))
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    EXPAND_MENU :(state, menuItem) =>{
      console.log(state,menuItem)
      if (menuItem.index > -1) {
        if (state.items[menuItem.index] && state.items[menuItem.index].meta) {
          state.items[menuItem.index].meta.expanded = menuItem.expanded
        }
      } else if (menuItem.item && 'expanded' in menuItem.item.meta) {
        menuItem.item.meta.expanded = menuItem.expanded
      }
    },
    ADD_MENU :(state, menuItems) =>{
      // console.log("ADD_MENU",menuItems)
      if (menuItems.length === 0) {
        state.items = []
      } else {
        state.items = menuItems;
      }
    },
    LOAD_ROUTES :(state)=> {
      state.isLoadRoutes = !state.isLoadRoutes
    },
    increment (state) {

      state.count++
      // console.log(state);
    },
    userForm(state, userForm){
      state.userF = userForm
    },
    SET_PERMISSION: (state, permission) => {
      state.addPermission = permission
    },
    ADD_USERINFO:(state, addUserinfo) =>{
      state.addUserinfo = addUserinfo
      state.avatar = addUserinfo.avatar
     
      window.localStorage.setItem('userInfo', JSON.stringify(state.addUserinfo))
    },
    ADD_SELECTION:(state, addSelection) =>{

      state.addSelection = addSelection
    },
    SET_ROW:(state, row) =>{
      state.row = row
    
      window.localStorage.setItem('row', JSON.stringify(state.row))
    }
  },

  actions: {
    addMenu({ commit }, menuItems)  {
      // console.log('menuItems',menuItems);

      if (menuItems.length > 0) {
        commit('ADD_MENU', menuItems)

      }

    },
    addUserinfo({commit},data){
      commit('ADD_USERINFO',data)
    },

    addSelection({commit},data){

      commit('ADD_SELECTION',data)
    },
    loadRoutes({ commit }) {
      commit('LOAD_ROUTES')
    },
    addCount({ commit }){
      commit('increment')

    },
    addUser({commit},user){
      // console.log(user)
      commit('userForm',user)
    },
    setName({commit},username){
      commit('SET_NAME', username)
    },
    setRow({commit},row){
     
      commit('SET_ROW', row)
    },
    setAvatar({commit},avatar){
      commit('SET_AVATAR', avatar)
    },
    // 用户名登录
    LoginByUsername({ commit }, userInfo) {
      const username = userInfo.username
      // console.log('用户名登录')
      return new Promise((resolve, reject) => {
        loginByUsername(username, userInfo.password).then(response => {

          const data = response.data
           console.log(response.user)
          commit('SET_TOKEN', data.token)

          setToken(response.data.token)

          // commit('ADD_MENU', response.user)
          // setToken(response.data.token)


          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },


    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    },

 
 
    addPermission({ commit }, data) {
      return new Promise(resolve => {
        commit('SET_PERMISSION', data)
        resolve()
      })
    }
  }
}

export default user
