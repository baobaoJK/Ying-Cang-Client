<script lang="ts" setup>
import { getWebSetting, updateWebSetting } from '@/api/setting'
import { ElMessage, type FormInstance, type UploadFile, type UploadRawFile } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'

// i18n
const { t } = useI18n()

// LogoType
enum LogoType {
  Logo,
  SvgLogo,
  LoginCover,
  Background,
}
// 网站设置表单
const webSettingFormRef = ref<FormInstance>()
const webSettingForm = ref({
  site: {
    name: 'Ying-Cang',
    webTitle: '影仓-您的私人安全影像仓库',
    mainTitle: '私人安全影像仓库',
    subTitle01: '上传您的图片，可存储不同格式的图片以及视频',
    subTitle02: '可以使用 APP 将影像分享至 QQ 或 微信',
    footerText: 'Copyright © 2025 - present Ying-Cang. All rights reserved.',
    icpNo: '',
    useAPI: 0,
  },
  webLogoUrl: '',
  webSVGLogoUrl: '',
  loginCoverUrl: '',
  backgroundUrl: '',
})

// 网站设置表单验证规则
const webSettingFormRules = reactive({
  site: {
    name: {
      required: true,
      message: t('setting.webSetting.message.pleaseInputWebSiteName'),
      trigger: 'blur',
    },
  },
})

// logo 预览图
const logoPreviewUrl = ref('')
const logoFile = ref<UploadRawFile>()
// svg logo 预览图
const svgLogoPreviewUrl = ref('')
const svgLogoFile = ref<UploadRawFile>()
// 登录封面预览图
const loginCoverPreviewUrl = ref('')
const loginCoverFile = ref<UploadRawFile>()
// 背景图预览图
const backgroundPreviewUrl = ref('')
const backgroundFile = ref<UploadRawFile>()

// 图片检测
const handleLogoChange = (file: UploadFile, logoType: LogoType) => {
  if (!file.raw) {
    ElMessage.error('文件读取失败')
    return
  }

  // 类型守卫
  if (!(file.raw instanceof File)) {
    ElMessage.error('无效的文件类型')
    return
  }

  // 验证图片类型
  const allowedTypes = ref(['image/png'])
  if (logoType === LogoType.Logo) {
    allowedTypes.value = ['image/png']
  } else {
    allowedTypes.value = ['image/svg+xml', 'image/jpg', 'image/jpeg', 'image/png']
  }

  if (!allowedTypes.value.includes(file.raw.type)) {
    ElMessage.error('只支持 PNG 格式的图片!')
    return
  }

  if (logoType === LogoType.Logo) {
    // 保存文件对象，用于后续上传
    logoFile.value = file.raw
  } else if (logoType === LogoType.SvgLogo) {
    svgLogoFile.value = file.raw
  } else if (logoType === LogoType.LoginCover) {
    loginCoverFile.value = file.raw
  } else if (logoType === LogoType.Background) {
    backgroundFile.value = file.raw
  }

  // 创建预览 URL
  const reader = new FileReader()
  reader.onload = (e) => {
    if (e.target) {
      if (logoType === LogoType.Logo) {
        logoPreviewUrl.value = e.target.result as string
      } else if (logoType === LogoType.SvgLogo) {
        svgLogoPreviewUrl.value = e.target.result as string
      } else if (logoType === LogoType.LoginCover) {
        loginCoverPreviewUrl.value = e.target.result as string
      } else if (logoType === LogoType.Background) {
        backgroundPreviewUrl.value = e.target.result as string
      }
    }
  }
  reader.onerror = () => {
    ElMessage.error('图片预览失败')
  }
  reader.readAsDataURL(file.raw)
}

// 上传检测
const beforeUpload = (file: File, logoType: LogoType) => {
  const allowedTypes = ref(['image/png'])

  if (logoType === LogoType.Logo) {
    allowedTypes.value = ['image/png']
  } else {
    allowedTypes.value = ['image/svg+xml']
  }

  if (!allowedTypes.value.includes(file.type)) {
    ElMessage({
      message: t('upload.typeError'),
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
      formData.append('site', JSON.stringify(webSettingForm.value.site))
      formData.append('webLogo', logoFile.value as File)
      formData.append('webSVGLogo', svgLogoFile.value as File)
      formData.append('loginCover', loginCoverFile.value as File)
      formData.append('background', backgroundFile.value as File)

      const res = await updateWebSetting(formData)
      if (res.data.messageType == 'success') {
        ElMessage.success('网站设置更新成功')
        const reloadWeb = setTimeout(() => {
          window.location.reload()
          clearTimeout(reloadWeb)
        }, 1000)
      }
    }
  })
}

// 获取表单数据
const initWebSetting = async () => {
  const res = await getWebSetting()
  webSettingForm.value.site = res.data.site
  webSettingForm.value.webLogoUrl = res.data.webLogoUrl
  webSettingForm.value.webSVGLogoUrl = res.data.webSVGLogoUrl
  webSettingForm.value.loginCoverUrl = res.data.webLoginBgUrl
  webSettingForm.value.backgroundUrl = res.data.webBackgroundUrl
}
onMounted(() => {
  initWebSetting()
})
</script>
<template>
  <el-form
    ref="webSettingFormRef"
    :model="webSettingForm"
    :rules="webSettingFormRules"
    class="web-setting-form"
    label-width="auto"
  >
    <el-form-item label="网页名称" prop="site.name">
      <el-input
        v-model="webSettingForm.site.name"
        placeholder="请输入网页名称"
        class="web-name"
        autocomplete="off"
      ></el-input>
    </el-form-item>
    <el-form-item label="网页标题" prop="webTitle">
      <el-input
        v-model="webSettingForm.site.webTitle"
        placeholder="请输入网页标题"
        class="web-title"
        autocomplete="off"
      ></el-input>
    </el-form-item>
    <el-form-item label="主标题" prop="mainTitle">
      <el-input
        v-model="webSettingForm.site.mainTitle"
        placeholder="请输入主标题"
        class="main-title"
        autocomplete="off"
      ></el-input>
    </el-form-item>
    <el-form-item label="副标题01" prop="subTitle01">
      <el-input
        v-model="webSettingForm.site.subTitle01"
        placeholder="请输入副标题01"
        class="sub-title01"
        autocomplete="off"
      ></el-input>
    </el-form-item>
    <el-form-item label="副标题02" prop="subTitle02">
      <el-input
        v-model="webSettingForm.site.subTitle02"
        placeholder="请输入副标题02"
        class="sub-title02"
        autocomplete="off"
      ></el-input>
    </el-form-item>
    <el-form-item label="页脚" prop="footerText">
      <el-input
        v-model="webSettingForm.site.footerText"
        placeholder="请输入页脚"
        class="footer-text"
        autocomplete="off"
      ></el-input>
    </el-form-item>
    <el-form-item label="备案号" prop="registrationNumber">
      <el-input
        v-model="webSettingForm.site.icpNo"
        placeholder="请输入备案号"
        class="registration-number"
        autocomplete="off"
      ></el-input>
    </el-form-item>
    <el-form-item label="网站 Logo" prop="logo">
      <img v-if="webSettingForm.webLogoUrl" :src="webSettingForm.webLogoUrl" class="web-image" />
      <img v-if="logoPreviewUrl" :src="logoPreviewUrl" class="web-image" />
      <el-upload
        class="web-image-uploader"
        :show-file-list="false"
        :auto-upload="false"
        :on-change="(file: UploadFile) => handleLogoChange(file, LogoType.Logo)"
        :before-upload="(file: File) => beforeUpload(file, LogoType.Logo)"
        action="#"
      >
        <el-icon class="web-image-uploader-icon"><Plus /></el-icon>
      </el-upload>
    </el-form-item>
    <el-form-item label="网站 SVG Logo" prop="svgLogo">
      <img
        v-if="webSettingForm.webSVGLogoUrl"
        :src="webSettingForm.webSVGLogoUrl"
        class="web-image"
      />
      <img v-if="svgLogoPreviewUrl" :src="svgLogoPreviewUrl" class="web-image" />
      <el-upload
        class="web-image-uploader"
        :show-file-list="false"
        :auto-upload="false"
        :on-change="(file: UploadFile) => handleLogoChange(file, LogoType.SvgLogo)"
        :before-upload="(file: File) => beforeUpload(file, LogoType.SvgLogo)"
        action="#"
      >
        <el-icon class="web-image-uploader-icon"><Plus /></el-icon>
      </el-upload>
    </el-form-item>
    <el-form-item label="登录页封面" prop="loginCover">
      <img
        v-if="webSettingForm.loginCoverUrl"
        :src="webSettingForm.loginCoverUrl"
        class="web-image login-cover"
      />
      <img v-if="loginCoverPreviewUrl" :src="loginCoverPreviewUrl" class="web-image" />
      <el-upload
        class="web-image-uploader"
        :show-file-list="false"
        :auto-upload="false"
        :on-change="(file: UploadFile) => handleLogoChange(file, LogoType.LoginCover)"
        :before-upload="(file: File) => beforeUpload(file, LogoType.LoginCover)"
        action="#"
      >
        <el-icon class="web-image-uploader-icon"><Plus /></el-icon>
      </el-upload>
    </el-form-item>
    <el-form-item label="页面背景图片" prop="background">
      <img
        v-if="webSettingForm.backgroundUrl"
        :src="webSettingForm.backgroundUrl"
        class="web-image background-cover"
      />
      <img
        v-if="backgroundPreviewUrl"
        :src="backgroundPreviewUrl"
        class="web-image background-cover"
      />
      <el-upload
        class="web-image-uploader"
        :show-file-list="false"
        :auto-upload="false"
        :on-change="(file: UploadFile) => handleLogoChange(file, LogoType.Background)"
        :before-upload="(file: File) => beforeUpload(file, LogoType.Background)"
        action="#"
      >
        <el-icon class="web-image-uploader-icon"><Plus /></el-icon>
      </el-upload>
    </el-form-item>
    <el-form-item label="是否启用 API" prop="api">
      <el-switch v-model="webSettingForm.site.useAPI"></el-switch>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm(webSettingFormRef)">保存更改</el-button>
    </el-form-item>
  </el-form>
</template>

<style lang="scss">
.web-setting-form {
  .web-image {
    display: block;
    width: 100px;
    min-height: 100px;
    margin-right: 16px;
    border-radius: 8px;
    background-size: cover;
  }

  .login-cover,
  .background-cover {
    height: auto;
  }

  .background-cover {
    width: 200px;
  }

  .web-image-uploader .el-upload {
    border: 1px dashed #8c939d;
    border-radius: 8px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: all 0.3s;
    height: auto;
  }

  .web-image-uploader .el-upload:hover {
    border-color: #32aaff;

    .el-icon.web-image-uploader-icon {
      color: #32aaff;
    }
  }

  .el-icon.web-image-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    transition: all 0.3s;
    text-align: center;
  }
}
</style>
