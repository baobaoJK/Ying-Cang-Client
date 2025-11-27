<script setup lang="ts">
import { Motion } from 'motion-v'
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, type FormRules, type FormInstance, type MessageOptions } from 'element-plus'
import { useI18n } from 'vue-i18n'
import type { LoginForm } from '@/type/login'
import { loginServices } from '@/api/login'
import { useUserStore } from '@/stores'
import router from '@/router'
import { getWebSetting } from '@/api/setting'

// i18n
const { t } = useI18n()

// 动画配置
const animateConfig = {
  initial: { y: 10, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transitionList: [
    { duration: 0.3 },
    { duration: 0.3, delay: 0.1 },
    { duration: 0.3, delay: 0.2 },
    { duration: 0.3, delay: 0.3 },
    { duration: 0.3, delay: 0.4 },
    { duration: 0.3, delay: 0.5 },
    { duration: 0.3, delay: 0.6 },
  ],
}

// 表单约束
const loginFormRef = ref<FormInstance>()
const loginForm = reactive<LoginForm>({
  username: '',
  password: '',
})

// 表单规则
const rules = reactive<FormRules<LoginForm>>({
  username: [{ required: true, message: t('login.pla.username'), trigger: 'blur' }],
  password: [{ required: true, message: t('login.pla.password'), trigger: 'blur' }],
})

// 按钮节流
const loginButtonStatus = ref(false)

// 表单提交
const loginSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    loginButtonStatus.value = true
    let messageStr = ''
    let messageType = ''

    if (valid) {
      // 发送登录请求
      const res = await loginServices(loginForm)
      if (res.data.token != undefined) {
        const userStore = useUserStore()
        userStore.setToken(res.data.token)
        router.push('/')
      } else {
        loginButtonStatus.value = false
      }

      messageStr = t(`${res.data.message}`)
      messageType = res.data.messageType
    } else {
      messageStr = t('login.message.pleaseFillIn')
      messageType = 'warning'
      loginButtonStatus.value = false
    }

    if (messageStr != '') {
      ElMessage({
        message: messageStr,
        type: messageType,
        grouping: true,
      } as MessageOptions)
    }
  })
}

// 登录封面和登陆背景
const loginBgImgSrc = ref<string>('')
const backgroundImgSrc = ref<string>('')

// 钩子
onMounted(async () => {
  const res = await getWebSetting()
  loginBgImgSrc.value = res.data.webLoginBgUrl
  backgroundImgSrc.value = res.data.webBackgroundUrl
})
</script>

<template>
  <div id="login" ref="scope" :style="{ backgroundImage: 'url(' + backgroundImgSrc + ')' }">
    <Motion
      as="div"
      :initial="animateConfig.initial"
      :animate="animateConfig.animate"
      :transition="animateConfig.transitionList[0]"
    >
      <div class="login-box">
        <Motion
          class="login-bg"
          as="div"
          :initial="animateConfig.initial"
          :animate="animateConfig.animate"
          :transition="animateConfig.transitionList[0]"
          :style="{ backgroundImage: 'url(' + loginBgImgSrc + ')' }"
        ></Motion>
        <div class="login-block">
          <Motion
            as="div"
            :initial="animateConfig.initial"
            :animate="animateConfig.animate"
            :transition="animateConfig.transitionList[1]"
          >
            <h1 class="login-title">LOGIN</h1>
          </Motion>
          <el-form ref="loginFormRef" :model="loginForm" :rules="rules" class="login-form">
            <Motion
              as="div"
              :initial="animateConfig.initial"
              :animate="animateConfig.animate"
              :transition="animateConfig.transitionList[2]"
            >
              <el-form-item prop="username">
                <el-input
                  v-model="loginForm.username"
                  class="username"
                  :placeholder="t('login.username')"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
            </Motion>
            <Motion
              as="div"
              :initial="animateConfig.initial"
              :animate="animateConfig.animate"
              :transition="animateConfig.transitionList[3]"
            >
              <el-form-item prop="password">
                <el-input
                  v-model="loginForm.password"
                  type="password"
                  class="password"
                  :placeholder="t('login.password')"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
            </Motion>
            <Motion
              as="div"
              :initial="animateConfig.initial"
              :animate="animateConfig.animate"
              :transition="animateConfig.transitionList[4]"
            >
              <el-form-item>
                <el-button
                  :disabled="loginButtonStatus"
                  id="login-button"
                  class="login-button"
                  @click="loginSubmit(loginFormRef)"
                  >{{ t('loginButton') }}</el-button
                >
              </el-form-item>
            </Motion>
          </el-form>
          <Motion
            as="div"
            :initial="animateConfig.initial"
            :animate="animateConfig.animate"
            :transition="animateConfig.transitionList[5]"
          >
            <div class="link">
              <a href="#" class="forget">{{ t('forget') }}</a>
            </div>
          </Motion>
          <Motion
            as="div"
            :initial="animateConfig.initial"
            :animate="animateConfig.animate"
            :transition="animateConfig.transitionList[6]"
          >
            <div class="link">
              <router-link to="/" class="index">{{ t('index') }}</router-link>
            </div>
          </Motion>
        </div>
      </div>
    </Motion>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/login/index.scss';
</style>
