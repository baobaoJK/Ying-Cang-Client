import request from '../request'

// 文件上传接口
export const uploadFile = (file: File) => {
  // 使用 FormData 来传输文件
  const formData = new FormData()
  formData.append('file', file) // 'file' 需要和后端接口的参数名对应

  // 发送请求，由于请求拦截器已经配置，会自动携带JWT
  return request.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data', // 设置请求头，告诉后端这是一个文件上传请求
    },
  })
}
