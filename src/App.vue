<script setup lang="ts">
import { onMounted } from 'vue'
import { getWebSetting } from './api/setting'

onMounted(async () => {
  const res = await getWebSetting()
  // 更换 icon
  const iconUrl: string = res.data.webLogoUrl
  let link = document.querySelector("link[rel*='icon']") as HTMLLinkElement

  if (!link) {
    // 如果不存在就创建
    link = document.createElement('link')
    link.rel = 'icon'
    link.type = 'image/x-icon'
    document.head.appendChild(link)
  }

  link.href = iconUrl

  // 更换标题
  const title: string = res.data.site.webTitle
  document.title = title
})
</script>

<template>
  <RouterView />
</template>

<style lang="scss">
@use '@/assets/styles/base.scss';
@use '@/assets/styles/element-plus.scss';
</style>
