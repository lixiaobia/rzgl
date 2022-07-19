import axios from 'axios'
import { Message } from 'element-ui'
import { getTime } from '@/utils/auth'
import store from '@/store'
import router from '@/router'
// create an axios instance
const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})
// 添加请求拦截器
request.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  const token = store.state.user.token
  if (token) {
    const time = Date.now() - getTime()
    if (time > 7200000) {
      store.dispatch('user/logout')
      router.push('/login')
    }
    // 存在就在config上配置请求参数
    config.headers['Authorization'] = 'Bearer ' + token
    // config.headers = {
    //   Authorization: 'Bearer ' + token
    // }
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
request.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  const { data, success, message } = response.data
  if (success) {
    // console.log(res)
    return data
  } else {
    Message.error(message)
    return Promise.reject(new Error(message))
  }
}, function (error) {
  if (error.response && error.response.data && error.response.data.code === 10002) {
    store.dispatch('user/logout')
    router.push('/login')
  }
  // 对响应错误做点什么
  return Promise.reject(error)
})
export default request
