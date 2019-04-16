import request from '@/utils/request'

export function loginByUsername(username, password) {
  const data = {
    username,
    password
  }
  // console.log(data)
  return request({
    url: '/login/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}

export function getUserInfo(token) {
  // console.log('getUserInfo请求')
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function backHome(token) {
  return request({
    url: '/',
    method: 'get',
    params: { token }
  })
}
