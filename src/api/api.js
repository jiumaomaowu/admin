import axios from 'axios'
import request from '../utils/request'

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++数据管理模块接口+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++



// =========================登录模块==============================
export function loginByUsername(data) {
  return request({
    url: '/admin/login',
    method:'post',
    data
  })
}
export function loginBywx(data) {
  return request({
    url: '/wx/login',
    method:'post',
    data
  })
}
// =========================医院管理模块==============================



// export const getHospitalList = params => {return request({url: '/hospital/list',method: 'get',params: { params }})}  // 获取医院列表接口
  export function getHospitalList(params) {
    return request({
      url: '/admin/hospital/list',
      method: 'get',
      params
    })
  }

// export const addHospital = params => {
//   return axios.post('/admin/hospital/add', params).then(res => res.data)
// }; //添加医院接口

export function addHospital(data) {
  console.log(data)
  return request({
    url: '/admin/hospital/add',
    method: 'post',
    data
  })
}

export const editHospital = params => { return axios.post('/admin/hospital/edit', params).then(res => res.data) };  //编辑修改医院接口

export const removeHospital = params => { return axios.post('/admin/hospital/remove', params).then(res => res.data) };  //删除医院接口

export const batchRemoveHospital = params => { return axios.post('/admin/hospital/batchremove', params).then(res => res.data) };//批量产出接口

// =========================申办方管理模块==============================
export const addApplicant = params => { return axios.post('/admin/applicant/add', params).then(res => res.data) };//添加申办方接口

export const getApplicantList = params => { return axios.get('/admin/applicant/list',{ params: params }); }//获取申办方列表接口

export const editApplicant = params => { return axios.post('/admin/applicant/edit', params).then(res => res.data) };//编辑修改申办方接口

export const removeApplicant = params => { return axios.post('/admin/applicant/remove', params).then(res => res.data) };//删除申办方接口

export const batchRemoveApplicant = params => { return axios.post('/admin/applicant/batchremove', params).then(res => res.data) };//批量删除申办方接口


// =========================协议模板管理模块==============================
export const getProtocollist = params => { return axios.get('/admin/protocol/list',{ params: params }); }//获取协议模板接口

export const getHospitalProtocol = params => { return axios.post('/admin/protocol/getHospital', params).then(res => res.data) };

export const getApplicant = params => { return axios.get('/admin/protocol/applicant',{ params: params }); }

export const addProtocol = params => { return axios.post('/admin/protocol/add', params).then(res => res.data) };

export const editProtocol = params => { return axios.post('/admin/protocol/edit', params).then(res => res.data) };

export const removeProtocol = params => { return axios.post('/admin/protocol/remove', params).then(res => res.data) };

export const batchRemoveProtocol = params => { return axios.post('/admin/protocol/batchremove', params).then(res => res.data) };

// =========================上会日历模块==============================
export const getMeetinglist = params => { return axios.get('/admin/meeting_calendar/list',{ params: params }); }   //请求上会日历列表


// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++系统管理模块接口+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// =========================管理员列表模块==============================

export const getAdminlist = params => { return axios.get('/admin/admin/list',{ params: params })}; //获取管理员列表数据

export const addAdmin = params => { return axios.post('/admin/admin/add', params).then(res => res.data) };  //添加管理员数据

export const changeSatus = params => { return axios.post('/admin/admin/changestatus', params).then(res => res.data) };//更改管理员启用状态

export const editAdmin = params => { return axios.post('/admin/admin/edit', params).then(res => res.data) }; //编辑管理员信息

export const removeAdmin = params => { return axios.post('/admin/admin/remove', params).then(res => res.data) };//删除管理员信息

export const batchRemoveAdmin = params => { return axios.post('/admin/admin/batchremove', params).then(res => res.data) };//批量删除管理员信息

// ==========================角色管理模块==================================================
//获取角色列表数据
export function getRoleList(params) {
  return request({
    url: '/admin/role/list',
    method: 'get',
    params
  })
}

//添加角色数据
export function addRole(data) {
  return request({
    url: '/admin/role/add',
    method: 'post',
    data
  })
}

//编辑角色数据
export function editRole(data) {
  return request({
    url: '/admin/role/edit',
    method: 'post',
    data
  })
}

//批量删除角色数据
export function removeRole(data) {
  return request({
    url: '/admin/role/remove',
    method: 'post',
    data
  })
}

//批量删除角色数据
export function batchRemoveRole(data) {
  return request({
    url: '/admin/role/batchremove',
    method: 'post',
    data
  })
}


// 返回权限数据
export function rolePermission(data) {
  return request({
    url: '/admin/role/permission',
    method: 'post',
    data
  })
}

// 提交权限接口
export function sumitPermission(data) {
  return request({
    url: '/admin/role/permission/submit',
    method: 'post',
    data
  })
}

// 获取权限接口
export function getPermission(data) {
  return request({
    url: '/admin/role/permission/get',
    method: 'post',
    data
  })
}
// 添加用户
export function sumitUser(data) {
  return request({
    url: '/admin/role/user/submit',
    method: 'post',
    data
  })
}

// 获取对应权限的 用户
export function getUser(data) {
  return request({
    url: '/admin/role/user/get',
    method: 'post',
    data
  })
}

// ==========================菜单管理模块==================================================
export function getmenuList(params) {
  return request({
    url: '/admin/menu/list',
    method: 'get',
    params
  })
}
// 添加菜单
export function addMenu(data) {
  return request({
    url: '/admin/menu/add',
    method: 'post',
    data
  })
}
//获取上级菜单
export function topMenu(params) {
  return request({
    url: '/admin/menu/topmenu',
    method: 'get',
    params
  })
}
//获取权限按钮
export function permissionBtn(params) {
  return request({
    url: '/admin/menu/permission',
    method: 'get',
    params
  })
}


//编辑菜单
export function editMenu(data) {
  return request({
    url: '/admin/menu/edit',
    method: 'post',
    data
  })
}
//删除caidan数据
export function removeMenu(data) {
  return request({
    url: '/admin/menu/remove',
    method: 'post',
    data
  })
}

//批量删除caidan数据
export function batchRemoveMenu(data) {
  return request({
    url: '/admin/menu/batchremove',
    method: 'post',
    data
  })
}

// 获取 个人信息 personal
export function personal(data) {
  // console.log(data)
  return request({
    url: '/admin/get/personal',
    method: 'post',
    data
  })
}

export function editPersonal(data) {
  return request({
    url: '/admin/edit/personal',
    method: 'post',
    data
  })
}

//获取首页登陆接口访问次数
export function getLogindata(params) {
  return request({
    url: '/admin/dashboard/chart',
    method: 'get',
    params
  })
}

//获取首页登陆接口的时间和ip
export function getlastLogin(params) {
  return request({
    url: '/admin/dashboard/lastLogin',
    method: 'get',
    params
  })
}
// -----------------------------------------------------------------------------------------
// 获取博客列表
export function getBlog(params) {
  return request({
    url: '/admin/blog/list',
    method: 'get',
    params
  })
}

// 添加博客
export function addBlog(data) {
  return request({
    url: '/admin/blog/add',
    method: 'post',
    data
  })
}
// 返回mark数据
export function markDown(data) {
  return request({
    url: '/admin/mark/down',
    method: 'post',
    data
  })
}



// 编辑博客
export function editBlog(data) {
  return request({
    url: '/admin/blog/edit',
    method: 'post',
    data
  })
}
//批量删除角色数据
export function removeBlog(data) {
  return request({
    url: '/admin/blog/remove',
    method: 'post',
    data
  })
}

//批量删除角色数据
export function batchRemoveBlog(data) {
  return request({
    url: '/admin/blog/batchremove',
    method: 'post',
    data
  })
}