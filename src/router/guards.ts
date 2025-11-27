// router/guards.ts
import { useUserStore } from '@/stores'
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { checkFirstInstall } from '@/api/install'
import { ElMessage } from 'element-plus'
import { translate } from '@/plugins/i18n'
import { isTokenExpired } from '@/utils/jwt'

let hasChecked = false // 避免每次跳转都重复请求
let initialized = false

export const authGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  const userStore = useUserStore()
  const token = userStore.getToken()

  if (to.path === '/404') {
    return next()
  }

  // install 页面不需要检测
  if (to.path === '/install') {
    const res = await checkFirstInstall()
    initialized = res.data
    if (!initialized) {
      // 返回上一页
      return next(from.path)
    }
    return next()
  }

  // 如果还没检查过，调用 API
  if (!hasChecked) {
    const res = await checkFirstInstall()
    initialized = res.data
    hasChecked = true
  }

  if (initialized) {
    ElMessage({
      message: '第一次使用，先进行初始化吧！',
      type: 'warning',
      duration: 3000,
    })
    next('/install')
  } else {
    if (to.meta.requiresAuth) {
      if (!token) {
        // 没有 token → 未登录
        ElMessage(translate('router.beforeLogin'))
        next('/login')
      } else if (isTokenExpired(token)) {
        // token 过期 → 清理并跳转登录
        userStore.removeToken()
        ElMessage.error(translate('router.loginExpired'))
        next('/login')
      } else {
        // 有效 token → 放行
        next()
      }
    } else if (to.path === '/login' && token && !isTokenExpired(token)) {
      // 已登录但访问登录页 → 跳首页
      ElMessage(translate('router.login'))
      next('/')
    } else {
      // 其他情况直接放行
      next()
    }
  }
}
