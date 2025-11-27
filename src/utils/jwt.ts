import { jwtDecode } from 'jwt-decode'

interface JwtPayload {
  exp: number
  iat: number
  sub: string
}

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<JwtPayload>(token)
    if (!decoded.exp) return true
    const now = Math.floor(Date.now() / 1000) // 当前时间秒
    return decoded.exp < now
  } catch (e) {
    console.log(e as Error)
    return true // 解析失败视为过期
  }
}
