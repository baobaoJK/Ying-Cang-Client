import { ref } from 'vue'
import { defineStore } from 'pinia'
import router from '@/router'
export const useUserStore = defineStore(
  'user',
  () => {
    // 语言
    const language = ref('zh')

    // 设置语言
    const setLanguage = (newLanguage: string) => {
      language.value = newLanguage
    }

    // 获取语言
    const getLanguage = () => {
      return language.value
    }

    // token
    const token = ref('')

    // 设置 token
    const setToken = (newToken: string) => {
      token.value = newToken
    }

    // 删除 token
    const removeToken = () => {
      token.value = ''
    }

    // 获取 token
    const getToken = () => {
      return token.value
    }

    // 退出登录
    const logout = () => {
      removeToken()
      router.push('/')
    }

    return {
      token,
      setToken,
      removeToken,
      getToken,
      logout,
      language,
      setLanguage,
      getLanguage,
    }
  },
  {
    persist: true,
  },
)
