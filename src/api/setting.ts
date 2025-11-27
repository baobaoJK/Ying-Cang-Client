import type { AxiosResponse } from 'axios'
import request from './request'

// 获取网站设置信息
export const getWebSetting = () => {
  return request.get('/getWebSetting').then((res: AxiosResponse) => {
    return res
  })
}

// 更新网站设置信息
export const updateWebSetting = (webSettingForm: object) => {
  return request
    .put('/updateWebSetting', webSettingForm, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((res: AxiosResponse) => {
      return res
    })
}

// 获取用户设置信息
export const getUserSetting = () => {
  return request.get('/getUserSetting').then((res: AxiosResponse) => {
    return res
  })
}

// 更新用户设置信息
export const updateUserSetting = (userSettingForm: object) => {
  return request
    .post('/updateUserSetting', userSettingForm, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((res: AxiosResponse) => {
      return res
    })
}

// 打包文件
export const exportFile = () => {
  return request.get('/export_progress')
}

// 获取打包进度
export const getExportProgressStatus = () => {
  return request.get('/export_progress_status')
}

// 下载文件
export const downloadFile = () => {
  return request.get('/downloadImages', { responseType: 'blob' })
}

// 下载 SQL 文件
export const downloadSqlFile = () => {
  return request.get('/downloadSql', { responseType: 'blob' })
}
