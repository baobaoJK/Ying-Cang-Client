import { createI18n } from 'vue-i18n'
import zh from '../locales/zh'
import en from '../locales/en'

const i18n = createI18n({
  legacy: false, // Composition API 模式
  locale: 'zh', // 默认语言
  fallbackLocale: 'en',
  messages: {
    zh,
    en,
  },
})

export const translate = (key: string): string => {
  return i18n.global.t(key)
}

export default i18n
