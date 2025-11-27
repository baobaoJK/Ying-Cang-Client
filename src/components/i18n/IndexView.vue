<script lang="ts" setup>
import { useUserStore } from '@/stores'
import { useI18n } from 'vue-i18n'
// i18n
const { t, locale } = useI18n()

// 切换语言
const changeLanguage = (lang: string) => {
  const userStore = useUserStore()
  userStore.setLanguage(lang)
  locale.value = lang
  // location.reload()
}
</script>
<template>
  <div id="language"></div>
  <el-dropdown class="language">
    <span class="el-dropdown-link">
      {{ t('language') }}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="changeLanguage('en')">English</el-dropdown-item>
        <el-dropdown-item @click="changeLanguage('zh')">中文</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style lang="scss">
@use '@/assets/styles/variable.scss' as *;

.language {
  display: flex;
  font-size: pxTorem(16px) !important;
  height: pxTorem(18px) !important;
  color: black !important;
}

#language {
  width: pxTorem(20px);
  height: pxTorem(20px);
  margin-right: pxTorem(6px);
  background-size: cover;
  background-image: url('/public/images/icon/翻译_translate.svg');
  i {
    font-size: pxTorem(20px);
    margin-right: pxTorem(6px);
  }
}
</style>
