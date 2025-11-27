import { createApp } from 'vue'
import pinia, { useUserStore } from '@/stores/index'
import i18n from './plugins/i18n'

import App from './App.vue'
import router from './router'

// Element-Plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// ElementPlus 国际化
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'

// VueDragSelect
import VueDragSelect from '@coleqiu/vue-drag-select'

// 简易菜单
import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css'
import ContextMenu from '@imengyu/vue3-context-menu'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 图片查看插件
import 'viewerjs/dist/viewer.css'
import VueViewer from 'v-viewer'

VueViewer.setDefaults({
  url: 'data-url',
})

app.use(pinia)
app.use(i18n)

const userStore = useUserStore()
i18n.global.locale.value = userStore.getLanguage() === 'zh' ? 'zh' : 'en'
app.use(ElementPlus, {
  locale: i18n.global.locale.value === 'zh' ? zhCn : en,
})

app.use(router)
app.use(VueViewer)
app.use(VueDragSelect)
app.use(ContextMenu)

app.mount('#app')
