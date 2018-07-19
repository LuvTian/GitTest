import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // 验权

const whiteList = ['/login', '/pcpay'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      next();
      NProgress.done()
    }
  } else {
    if (to.path !== '/login') {
      next({ path: '/login' });
      NProgress.done()
    }
    else {
      next();
      NProgress.done()
    }
  }
  //     store.dispatch('GenerateRoutes', ).then(() => { // 生成可访问的路由表
  //       router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
  //       next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
  //     })
  //   }
  // } else {
  //   if (whiteList.indexOf(to.path) !== -1) {
  //     next()
  //   } else {
  //     next('/login')
  //     NProgress.done()
  //   }
  // }
  // next()
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
