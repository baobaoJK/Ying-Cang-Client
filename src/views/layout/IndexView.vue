<script lang="ts" setup>
import { Motion } from 'motion-v'
import { computed, onMounted, ref } from 'vue'
import Language from '@/components/i18n/IndexView.vue'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores'
import { ElMessage } from 'element-plus'
import { useRoute } from 'vue-router'
import { getUserSetting, getWebSetting } from '@/api/setting'
import router from '@/router'
import { getDomain } from '@/utils/utils'

// i18n
const { t } = useI18n()
// route
const route = useRoute()

// 用户名称
const username = ref('')

// 用户头像
const avatar = ref('')

// 页面名称
const pageName = computed(() => {
  const name = route.name?.toString()
  return t('router.pageName.' + name)
})

// logo
const logo = ref('')

// 动画配置
const animateConfig = {
  initial: { x: -20, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transitionList: [
    { delay: 0.1 },
    { delay: 0.2 },
    { delay: 0.3 },
    { delay: 0.4 },
    { delay: 0.5 },
    { delay: 0.6 },
  ],
}

// 退出登录
const logout = () => {
  const userStore = useUserStore()
  userStore.logout()

  ElMessage({
    message: t('layout.logoutSuccess'),
    type: 'success',
  })
}

// 跳转首页
const goToHome = () => {
  router.push('/')
}

onMounted(async () => {
  const res = await getUserSetting()
  username.value = res.data.username
  avatar.value = res.data.userAvatarUrl

  const webSetting = await getWebSetting()
  logo.value = getDomain() + webSetting.data.webSVGLogoUrl
})
</script>

<template>
  <div id="layout">
    <el-container style="width: 100%; height: 100%">
      <el-aside class="side">
        <Motion
          as="div"
          :initial="animateConfig.initial"
          :animate="animateConfig.animate"
          :transition="animateConfig.transitionList[0]"
        >
          <div
            class="title"
            @click="goToHome"
            :style="{ backgroundImage: 'url(' + logo + ')' }"
          ></div>
        </Motion>

        <el-menu :default-active="$route.path" class="menu" router>
          <Motion
            as="div"
            :initial="animateConfig.initial"
            :animate="animateConfig.animate"
            :transition="animateConfig.transitionList[1]"
          >
            <el-menu-item index="/dashboard">
              <el-icon><SwitchFilled /></el-icon>
              <span>{{ t('layout.dashboard') }}</span>
            </el-menu-item>
          </Motion>

          <Motion
            as="div"
            :initial="animateConfig.initial"
            :animate="animateConfig.animate"
            :transition="animateConfig.transitionList[2]"
          >
            <el-menu-item index="/upload">
              <el-icon><UploadFilled /></el-icon>
              <span>{{ t('layout.upload') }}</span>
            </el-menu-item>
          </Motion>

          <Motion
            as="div"
            :initial="animateConfig.initial"
            :animate="animateConfig.animate"
            :transition="animateConfig.transitionList[3]"
          >
            <el-menu-item index="/pic">
              <el-icon><PictureFilled /></el-icon>
              <span>{{ t('layout.pic') }}</span>
            </el-menu-item>
          </Motion>

          <Motion
            as="div"
            :initial="animateConfig.initial"
            :animate="animateConfig.animate"
            :transition="animateConfig.transitionList[4]"
          >
            <el-menu-item index="/setting">
              <el-icon><Setting /></el-icon>
              <span>{{ t('layout.setting') }}</span>
            </el-menu-item>
          </Motion>
        </el-menu>
      </el-aside>
      <el-container class="container">
        <el-main class="main">
          <Motion
            as="div"
            :initial="{ y: -20, opacity: 0 }"
            :animate="{ y: 0, opacity: 1 }"
            :transition="{ delay: 0.3, duration: 0.3 }"
            class="header"
          >
            <div class="page-title">
              <h3>{{ pageName }}</h3>
            </div>

            <div class="options">
              <el-dropdown placement="bottom">
                <div class="user">
                  <img :src="avatar" class="avatar" />
                  <div class="username">{{ username }}</div>
                </div>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="logout">{{ t('layout.logout') }}</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>

              <Language></Language>
            </div>
          </Motion>

          <Motion
            as="div"
            :initial="{ y: 20, opacity: 0 }"
            :animate="{ y: 0, opacity: 1 }"
            :transition="{ delay: 0.3, duration: 0.3 }"
          >
            <RouterView />
          </Motion>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/layout.scss' as *;
</style>
