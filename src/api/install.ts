import type { AxiosResponse } from 'axios'
import request from './request'
import type { ConfigForm } from '@/type/server-config'

// 检测是否第一次进入
export const checkFirstInstall = async () => {
  return request.get('/install/check').then((res: AxiosResponse) => {
    return res
  })
}

// 填写配置信息
export const configInstall = async (data: ConfigForm) => {
  return request.post('/install/config', data)
}
