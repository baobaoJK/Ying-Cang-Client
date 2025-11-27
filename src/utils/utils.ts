export const formatFileSize = (size: number) => {
  if (size < 1024) return size + ' B'
  const units = ['KB', 'MB', 'GB', 'TB']
  let i = -1
  do {
    size /= 1024
    i++
  } while (size >= 1024 && i < units.length - 1)
  return size.toFixed(2) + ' ' + units[i]
}

/**
 * 将字节转换为可读格式
 * @param bytes 字节数
 * @param decimals 小数位数
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

/**
 * 专门用于显示存储信息的格式化函数
 */
export function formatStorageSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let value = bytes
  let unitIndex = 0

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024
    unitIndex++
  }

  // 对于 MB 和 GB 保留2位小数，其他保留0位
  const decimals = unitIndex >= 2 ? 2 : 0
  return `${value.toFixed(decimals)} ${units[unitIndex]}`
}

/**
 * 获取网页域名
 */
export function getDomain(): string {
  const url = window.location.origin
  return url
}
