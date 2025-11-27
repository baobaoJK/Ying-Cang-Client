<script lang="ts" setup>
import { getUserSetting, updateUserSetting } from '@/api/setting'
import { ElMessage, type UploadRawFile, type FormInstance, type UploadFile } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'

// i18n
const { t } = useI18n()

// 用户设置表单
const userSettingFormRef = ref<FormInstance>()
const userSettingForm = ref({
  username: '',
  account: '',
  password: '',
})
const userAvatarUrl = ref('')

// 用户设置表单验证规则
const userSettingFormRules = reactive({
  username: {
    required: true,
    message: t('setting.userSetting.message.pleaseInputUsername'),
    trigger: 'blur',
  },
})

// 头像预览图
const avatarPreviewUrl = ref('')
const avatarFile = ref<UploadRawFile>()

// 验证图片类型
const allowedType = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']

// 图片检测
const handleAvatarChange = (file: UploadFile) => {
  if (!file.raw) {
    ElMessage.error(t('setting.userSetting.message.fileReadFailed'))
    return
  }

  // 类型守卫
  if (!(file.raw instanceof File)) {
    ElMessage.error(t('setting.userSetting.message.invalidFileType'))
    return
  }

  if (!allowedType.includes(file.raw.type)) {
    ElMessage.error(t('setting.userSetting.message.unsupportedImageType'))
    return
  }

  avatarFile.value = file.raw

  // 创建预览 URL
  const reader = new FileReader()
  reader.onload = (e) => {
    if (e.target) {
      avatarPreviewUrl.value = e.target.result as string
    }
  }
  reader.onerror = () => {
    ElMessage.error(t('setting.userSetting.message.imagePreviewFailed'))
  }
  reader.readAsDataURL(file.raw)
}

// 上传检测
const beforeUpload = (file: File) => {
  if (!allowedType.includes(file.type)) {
    ElMessage({
      message: t('setting.userSetting.message.unsupportedImageType'),
      type: 'error',
      grouping: true,
    })
    return false // 阻止上传
  }
  return true // 允许上传
}

// 表单提交
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return

  await formEl.validate(async (valid) => {
    if (valid) {
      const formData = new FormData()
      formData.append('form', JSON.stringify(userSettingForm.value))
      formData.append('avatar', avatarFile.value as File)

      const res = await updateUserSetting(formData)
      if (res.data.messageType == 'success') {
        ElMessage.success(t('setting.userSetting.message.userSettingIsUpdated'))
        const reloadWeb = setTimeout(() => {
          window.location.reload()
          clearTimeout(reloadWeb)
        }, 1000)
      }
    }
  })
}

onMounted(async () => {
  const res = await getUserSetting()
  userSettingForm.value.username = res.data.username
  userSettingForm.value.account = res.data.account
  userAvatarUrl.value = res.data.userAvatarUrl
})
</script>
<template>
  <el-form
    ref="userSettingFormRef"
    :model="userSettingForm"
    :rules="userSettingFormRules"
    class="user-setting-form"
    label-width="auto"
  >
    <el-form-item :label="t('setting.userSetting.userAvatar')">
      <img v-if="userAvatarUrl" :src="userAvatarUrl" class="avatar" />
      <img v-if="avatarPreviewUrl" :src="avatarPreviewUrl" class="avatar" />
      <el-upload
        class="avatar-uploader"
        :show-file-list="false"
        :auto-upload="false"
        :on-change="handleAvatarChange"
        :before-upload="beforeUpload"
        action="#"
      >
        <el-icon class="avatar-uploader-icon"><Plus /></el-icon
      ></el-upload>
    </el-form-item>
    <el-form-item :label="t('setting.userSetting.username')" prop="username">
      <el-input
        v-model="userSettingForm.username"
        :placeholder="t('setting.userSetting.pleaseInputUsername')"
        class="username"
        autocomplete="off"
      ></el-input>
    </el-form-item>
    <el-form-item :label="t('setting.userSetting.account')" prop="account">
      <el-input
        v-model="userSettingForm.account"
        :placeholder="t('setting.userSetting.account')"
        class="account"
        autocomplete="off"
        disabled
      ></el-input>
    </el-form-item>
    <el-form-item :label="t('setting.userSetting.password')">
      <el-input
        v-model="userSettingForm.password"
        :placeholder="t('setting.userSetting.noChangePleaseSaveEmpty')"
        class="password"
        autocomplete="off"
        type="password"
      ></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm(userSettingFormRef)">{{
        t('setting.userSetting.saveChange')
      }}</el-button>
    </el-form-item>
  </el-form>
</template>

<style lang="scss">
@use '@/assets/styles/variable.scss' as *;

.user-setting-form {
  .avatar {
    display: block;
    width: pxTorem(100px);
    height: pxTorem(100px);
    margin-right: pxTorem(16px);
    border-radius: pxTorem(8px);
  }

  .avatar-uploader .el-upload {
    border: pxTorem(1px) dashed #8c939d;
    border-radius: pxTorem(8px);
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: all 0.3s;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #32aaff;

    .el-icon.avatar-uploader-icon {
      color: #32aaff;
    }
  }

  .el-icon.avatar-uploader-icon {
    font-size: pxTorem(28px);
    color: #8c939d;
    width: pxTorem(100px);
    height: pxTorem(100px);
    transition: all 0.3s;
    text-align: center;
  }
}
</style>
