import Cookies from 'js-cookie'
// token
const TokenKey = 'vue_admin_template_token'

export function getToken () {
  return Cookies.get(TokenKey)
}

export function setToken (token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken () {
  return Cookies.remove(TokenKey)
}
// 时间戳
const TimeKey = 'vue_time'
export function getTime () {
  return Cookies.get(TimeKey)
}

export function setTime (token) {
  return Cookies.set(TimeKey, token)
}
