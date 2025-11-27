import type { LoginForm } from '@/type/login'
import request from './request'

// 登录接口
export const loginServices = async (data: LoginForm) => {
  return request.post('/login', data, {
    // withCredentials: true,
  })
}
