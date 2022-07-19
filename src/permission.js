import router from '@/router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import store from '@/store'
const whileList = ['/login', '/404'] // 白名单相当于vip

router.beforeEach((to, from, next) => {
  NProgress.start()
  const token = store.state.user.token
  if (token) {
    // 有token的情况下 去登录页不让去 去其他的正常放行
    if (to.path === '/login') {
      next('/')
      NProgress.done()
    } else {
      if (!store.state.user.userInfo.id) {
        store.dispatch('user/getInfo')
      }
      next()
    }
  } else {
    // 没有token的情况下  判断在不在白名单  在的话直接放行  不在的话就让去登录
    if (whileList.includes(to.path)) {
      next()
    } else {
      next('/login')
    }
  }
})
router.afterEach(() => {
  NProgress.done()
})
