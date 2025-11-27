import type { AxiosResponse } from 'axios'
import request from './request'

// 获取仪表盘数据
export const getDashBoardData = () => {
  return request.get('/dashboard').then((res: AxiosResponse) => {
    return res
  })
}
