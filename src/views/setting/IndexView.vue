<script lang="ts" setup>
import { Motion } from 'motion-v'
import WebSetting from './tabs/WebSetting.vue'
import UserSetting from './tabs/UserSetting.vue'
import ApiSetting from './tabs/ApiSetting.vue'
import FileSetting from './tabs/FileSetting.vue'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'

// i18n
const { t } = useI18n()

// active
const active = ref('web')
</script>
<template>
  <Motion
    as="div"
    id="setting"
    :initial="{ y: 20, opacity: 0 }"
    :animate="{ y: 0, opacity: 1 }"
    :transition="{ delay: 0.1, duration: 0.3 }"
  >
    <el-tabs tab-position="left" v-model="active">
      <el-tab-pane :label="t('setting.webSetting.name')" name="web">
        <WebSetting />
      </el-tab-pane>
      <el-tab-pane :label="t('setting.userSetting.name')" name="user">
        <UserSetting />
      </el-tab-pane>
      <el-tab-pane :label="t('setting.apiSetting.name')" name="api">
        <ApiSetting />
      </el-tab-pane>
      <el-tab-pane :label="t('setting.fileManager.name')" name="file">
        <FileSetting />
      </el-tab-pane>
    </el-tabs>
  </Motion>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variable.scss' as *;

#setting {
  width: calc(100vw - pxTorem(128 + 332px));
  min-height: calc(100% - pxTorem(20px));
  background-color: white;
  border-radius: pxTorem(8px);
  box-shadow: 0px 0px pxTorem(10px) rgba(0, 0, 0, 0.1);
  padding: pxTorem(32px) pxTorem(64px);
  box-sizing: border-box;
}
</style>
