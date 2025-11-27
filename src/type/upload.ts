import { type UploadFile } from 'element-plus'

// 直接使用 Element Plus 的类型，并扩展自定义属性
export interface CustomUploadFile extends UploadFile {
  html?: string
  bbcode?: string
  markdown?: string
  thumbnail?: string
}

// jpg,jpeg,png,gif,bmp,webp,ico,jfif,tif,tga,svg
export const uploadAcceptList = '.jpg,.jpeg,.png,.gif,.bmp,.webp,.ico,.jfif,.tif,.tga,.svg'

// jpg,jpeg,png,gif,bmp,webp,ico,jfif,tif,tga,svg
export const allowedTypes =
  'image/jpg,image/jpeg,image/png,image/gif,image/bmp,image/webp,image/x-icon,image/svg+xml'

// export const uploadAcceptList = [
//   'jpg',
//   'jpeg',
//   'png',
//   'gif',
//   'bmp',
//   'webp',
//   'ico',
//   'jfif',
//   'tif',
//   'tga',
//   'svg',
// ]

// // jpg,jpeg,png,gif,bmp,webp,ico,jfif,tif,tga,svg
// export const allowedTypes = [
//   'image/jpg',
//   'image/jpeg',
//   'image/png',
//   'image/gif',
//   'image/bmp',
//   'image/webp',
//   'image/ico',
//   'image/jfif',
//   'image/tif',
//   'image/tga',
//   'image/svg',
// ]
