import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores'
import router from '@/router'
import { translate } from '@/plugins/i18n'

// 请求地址
export const baseURL = '/api'

// 创建请求实例
const request = axios.create({
  baseURL: baseURL,
  timeout: 5000,
})

axios.defaults.withCredentials = true

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 获取 Token
    const userStore = useUserStore()
    const token = userStore.getToken()

    // 如果 Token 存在则携带 Token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    // 失败执行promise
    return Promise.reject(error)
  },
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    // 如果是 application/zip /sql
    if (response.data.type == 'application/zip' || response.data.type == 'application/sql') {
      return response
    }

    // 判断返回的数据
    const { status } = response.data
    if (status) {
      return response.data
    } else {
      ElMessage.error('业务异常')
      return Promise.reject(response)
    }
  },
  async (error) => {
    // error.message
    console.log(error)

    // 400 状态
    if (error.status == 400) {
      ElMessage.error({
        message: translate(error.response.data.data.message),
        type: 'error',
        grouping: true,
      })
      return Promise.reject(error)
    }

    // 401 状态
    if (error.status == 401) {
      const userStore = useUserStore()
      userStore.removeToken()
      router.push('/login')
      return Promise.reject(error)
    }

    const res = error.response?.data
    if (res?.message) {
      ElMessage({
        message: translate(`${res.message}`),
        type: 'error',
        grouping: true,
      })
    }

    return Promise.reject(error)
  },
)

export default request
