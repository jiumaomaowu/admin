import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken() {

  // console.log('getToken', Cookies.get(TokenKey))
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  // console.log('setToken',  token)
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
export function setSession(user) {
  return sessionStorage.setItem('user', JSON.stringify(user));
}
export function setlocalStorage(user,userInfo) {
  return localStorage.setItem(user, JSON.stringify(userInfo));
}
