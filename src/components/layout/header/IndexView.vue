<script lang="ts" setup>
import { useUserStore } from '@/stores'
import { ElMessage } from 'element-plus'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Language from '@/components/i18n/IndexView.vue'
import { getWebSetting } from '@/api/setting'
import { getDomain } from '@/utils/utils'
// i18n
const { t } = useI18n()

// 用户仓库
const userStore = useUserStore()

// 检测是否登录
const isLogin = computed(() => {
  return userStore.getToken() !== ''
})

// 组件信息
const headerConfig = ref({
  title: t('name'),
  svgLogo: '',
})

// 登出
const logout = () => {
  userStore.removeToken()
  window.location.href = '/'
  ElMessage({
    message: t('logoutSuccess'),
    type: 'success',
  })
}

onMounted(async () => {
  const webRes = await getWebSetting()

  headerConfig.value.title = webRes.data.site.name
  headerConfig.value.svgLogo = getDomain() + webRes.data.webSVGLogoUrl
})
</script>
<template>
  <el-header class="header">
    <div class="title">{{ headerConfig.title }}</div>
    <div class="logo" :style="{ backgroundImage: 'url(' + headerConfig.svgLogo + ')' }"></div>
    <div class="option">
      <router-link to="/login" v-if="!isLogin" class="login"
        ><el-icon><UserFilled /></el-icon>{{ t('loginButton') }}</router-link
      >
      <a v-else href="#" class="logout" @click="logout">
        <el-icon><SwitchButton /></el-icon>{{ t('logout') }}</a
      >
      <Language></Language>
    </div>
  </el-header>
</template>
<style lang="scss" scoped>
@use '@/assets/styles/variable.scss' as *;

.header {
  position: fixed;
  display: flex;
  width: 100%;
  height: pxTorem(60px);
  justify-content: space-between;
  align-items: center;
  background-color: white;
  padding: 0 pxTorem(100px);
  box-sizing: border-box;

  .title {
    width: pxTorem(260px);
    text-align: right;
  }

  .logo {
    width: pxTorem(192px);
    height: pxTorem(50px);
    background-image: url('/public/images/logo.svg');
    background-size: cover;
  }

  .option {
    width: pxTorem(260px);
    height: 100%;
    display: flex;
    align-items: center;

    .login,
    .logout {
      display: flex;
      align-items: center;
      color: black;
      margin-right: pxTorem(20px);
      transition: all 0.3s;
      i {
        font-size: pxTorem(20px);
        margin-right: pxTorem(6px);
      }

      &:hover {
        opacity: 0.5;
      }
    }
  }
}
</style>
