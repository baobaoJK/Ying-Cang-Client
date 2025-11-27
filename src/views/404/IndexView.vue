<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { Motion } from 'motion-v'

// i18n
const { t } = useI18n()
</script>
<template>
  <div id="not-found">
    <Motion
      as="div"
      :initial="{ y: 20, opacity: 0 }"
      :animate="{ y: 0, opacity: 1 }"
      :transition="{ delay: 0.2, duration: 0.5 }"
    >
      <div class="not-found-img"></div>
    </Motion>
    <Motion
      as="div"
      :initial="{ y: 20, opacity: 0 }"
      :animate="{ y: 0, opacity: 1 }"
      :transition="{ delay: 0.3, duration: 0.5 }"
    >
      <h1 class="title">{{ t('notFound') }}</h1>
    </Motion>
    <Motion
      as="div"
      :initial="{ y: 20, opacity: 0 }"
      :animate="{ y: 0, opacity: 1 }"
      :transition="{ delay: 0.4, duration: 0.5 }"
    >
      <router-link to="/" class="back">{{ t('back') }}</router-link>
    </Motion>
  </div>
</template>
<style lang="scss" scoped>
@use '@/assets/styles/variable.scss' as *;
#not-found {
  @extend %fullview;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .not-found-img {
    width: pxTorem(440px);
    height: pxTorem(270px);
    background-image: url('/images/404.png');
    background-size: cover;
  }

  .title {
    font-weight: 300;
    margin: pxTorem(30px) 0;
  }

  .back {
    padding: pxTorem(12px) pxTorem(180px);
    text-align: center;
    background-color: $mainColor;
    color: white;
    border-radius: pxTorem(8px);
    transition: all 0.3s;

    &:hover {
      opacity: 0.5;
    }
  }
}
</style>
