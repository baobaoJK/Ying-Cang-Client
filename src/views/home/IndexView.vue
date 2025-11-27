<script lang="ts" setup>
import { Motion } from 'motion-v'
import { useI18n } from 'vue-i18n'
import HeaderView from '@/components/layout/header/IndexView.vue'
import { computed, onMounted, ref } from 'vue'
import { getWebSetting } from '@/api/setting'
import { getDomain } from '@/utils/utils'

// i18n
const { t } = useI18n()

// 动画配置
const animateConfig = {
  initial: { y: 10, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transitionList: [
    { duration: 0.2, stagger: 0.1 },
    { duration: 0.2, delay: 0.2, stagger: 0.1 },
    { duration: 0.2, delay: 0.4, stagger: 0.1 },
    { duration: 0.2, delay: 0.6, stagger: 0.1 },
  ],
}

// 是否显示页脚
const showFooter = computed(() => {
  return pageConfig.value.footerText.length > 0 || pageConfig.value.registrationNumber.length > 0
})

// 页面信息
const pageConfig = ref({
  title: t('home.title'),
  subTitle01: t('home.subTitle01'),
  subTitle02: t('home.subTitle02'),
  footerText: t('home.footerText'),
  registrationNumber: '',
})

// 背景图片
const backgroundImage = ref('')

// 获取页面信息
onMounted(async () => {
  const res = await getWebSetting()
  pageConfig.value.title = res.data.site.mainTitle
  pageConfig.value.subTitle01 = res.data.site.subTitle01
  pageConfig.value.subTitle02 = res.data.site.subTitle02
  pageConfig.value.footerText = res.data.site.footerText
  backgroundImage.value = getDomain() + res.data.webBackgroundUrl
})
</script>

<template>
  <el-container id="home" :style="{ backgroundImage: 'url(' + backgroundImage + ')' }">
    <HeaderView />

    <el-main class="main" ref="scope">
      <div class="title-box">
        <Motion
          as="div"
          :initial="animateConfig.initial"
          :animate="animateConfig.animate"
          :transition="animateConfig.transitionList[0]"
          v-if="pageConfig.title"
        >
          <h1>{{ pageConfig.title }}</h1>
        </Motion>
        <Motion
          as="div"
          :initial="animateConfig.initial"
          :animate="animateConfig.animate"
          :transition="animateConfig.transitionList[1]"
          v-if="pageConfig.subTitle01"
        >
          <h2>{{ pageConfig.subTitle01 }}</h2>
        </Motion>

        <Motion
          as="div"
          :initial="animateConfig.initial"
          :animate="animateConfig.animate"
          :transition="animateConfig.transitionList[2]"
          v-if="pageConfig.subTitle02"
        >
          <h2>{{ pageConfig.subTitle02 }}</h2>
        </Motion>
      </div>
      <Motion
        as="div"
        :initial="animateConfig.initial"
        :animate="animateConfig.animate"
        :transition="animateConfig.transitionList[3]"
      >
        <router-link to="/upload" class="upload-btn"
          ><el-icon><UploadFilled /></el-icon>{{ t('home.upload') }}</router-link
        >
      </Motion>
    </el-main>
    <el-footer v-if="showFooter" class="footer"
      >{{ pageConfig.footerText }}
      <a href="https://beian.miit.gov.cn/" target="_blank">{{ pageConfig.registrationNumber }}</a>
    </el-footer>
  </el-container>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/home/index.scss';
</style>
