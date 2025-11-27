import type { AxiosResponse } from 'axios'
import request from '../request'

// 获取图片数量
export const getPicCount = () => {
  return request.get('/getPicCount').then((res: AxiosResponse) => {
    return res
  })
}

// 获取图片列表
export const getPicList = (params: {
  page: number
  perPage: number
  albumId: number
  order?: string
  keyword?: string
}) => {
  return request.get('/getPicList', { params }).then((res: AxiosResponse) => {
    return res
  })
}

// 移动图片
export const movePic = (movePicList: number[], albumId: number) => {
  return request.post('/pic', { movePicList, albumId }).then((res: AxiosResponse) => {
    return res
  })
}

// 删除图片
export const deletePic = (deletePicList: number[]) => {
  return request.delete('/pic', { data: { deletePicList } }).then((res: AxiosResponse) => {
    return res
  })
}

// 修改图片描述
export const updatePic = (pid: number, value: object) => {
  return request.put('/pic', { pid, value }).then((res: AxiosResponse) => {
    return res
  })
}
