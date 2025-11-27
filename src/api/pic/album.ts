import type { AxiosResponse } from 'axios'
import request from '../request'

// 获取相册列表接口
export const getAlbumList = async () => {
  return request.get('/album')
}

// 添加相册接口
export const addAlbum = async (albumName: string) => {
  return request.post('/album', { albumName }).then((res: AxiosResponse) => {
    return res
  })
}

// 编辑相册名称
export const editAlbum = async (rename: string, aid: number) => {
  return request.put('/album', { rename, aid }).then((res: AxiosResponse) => {
    return res
  })
}

// 删除相册
export const deleteAlbum = async (aid: number) => {
  return request.delete('/album', { data: { aid } }).then((res: AxiosResponse) => {
    return res
  })
}
