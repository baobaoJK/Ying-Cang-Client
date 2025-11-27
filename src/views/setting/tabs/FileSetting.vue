<script lang="ts" setup>
import request from '@/api/request'
import { downloadFile, downloadSqlFile, exportFile, getExportProgressStatus } from '@/api/setting'
import { ref } from 'vue'

import { ElMessage, genFileId } from 'element-plus'

import type {
  UploadFile,
  UploadFiles,
  UploadInstance,
  UploadProps,
  UploadRawFile,
  UploadRequestOptions,
} from 'element-plus'
import { useI18n } from 'vue-i18n'

// i18n
const { t } = useI18n()

const progress = ref(0)
const downloadImageFileVisible = ref(false)

// 监听 图片 打包进度
const downloadImages = async () => {
  downloadImageFileVisible.value = true
  progress.value = 0

  await exportFile()

  // 监听打包进度
  const interval = setInterval(async () => {
    const res = await getExportProgressStatus()
    progress.value = res.data.progress
    if (progress.value >= 100) {
      clearInterval(interval)

      handleDownloadFile('image')
    }
  }, 200)
}

// 下载 图片 / SQL 文件
const handleDownloadFile = async (fileType: 'sql' | 'image') => {
  try {
    let res = null
    let downloadType = null
    let fileName = null

    if (fileType === 'image') {
      res = await downloadFile()
      downloadType = 'application/zip'
      fileName = 'imaegs.zip'
    } else if (fileType === 'sql') {
      res = await downloadSqlFile()
      downloadType = 'application/zip'
      fileName = 'database.sql'
    } else {
      return
    }

    const blob = new Blob([res.data], { type: downloadType })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName // 保存的文件名
    a.click()
    a.remove()
    window.URL.revokeObjectURL(url)
  } catch (err) {
    ElMessage({
      message: t('setting.fileManager.message.downloadFailed'),
      type: 'error',
      grouping: true,
    })
    console.error('DownloadFailed', err)
  }
}

// 更新文件列表
const handleFileChange = (file: UploadFile, files: UploadFiles, fileType: 'image' | 'sql') => {
  if (fileType === 'image') {
    imageFileList.value = files
  } else if (fileType === 'sql') {
    sqlFileList.value = files
  }
}

// 导入图片文件
const uploadImagesRef = ref<UploadInstance>()
const imageFileList = ref<UploadFile[]>([])
const handleImagesExceed: UploadProps['onExceed'] = (files) => {
  uploadImagesRef.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  uploadImagesRef.value!.handleStart(file)
}

// 导入SQL文件
const uploadSqlRef = ref<UploadInstance>()
const sqlFileList = ref<UploadFile[]>([])
const handleSqlExceed: UploadProps['onExceed'] = (files) => {
  uploadSqlRef.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  uploadSqlRef.value!.handleStart(file)
}

// 图片 / SQL 文件上传
const customUploadFile = async (options: UploadRequestOptions, fileType: 'image' | 'sql') => {
  // 获取文件与方法
  const { file, onSuccess } = options

  // 创建表单对象
  const formData = new FormData()
  formData.append('file', file)

  if (fileType === 'image') {
    imageFileList.value = []
  } else if (fileType === 'sql') {
    sqlFileList.value = []
  }

  try {
    let res = null
    if (fileType === 'image') {
      res = await request.post('/importImages', formData)
    } else if (fileType === 'sql') {
      res = await request.post('/importSql', formData)
    } else {
      return
    }

    const response = res.data
    if (response) {
      ElMessage({
        message: t(response.message),
        type: response.messageType,
        grouping: true,
      })
    }
    onSuccess(response)
  } catch (err) {
    ElMessage({
      message: t('setting.fileManager.message.uploadFailed'),
      type: 'error',
      grouping: true,
    })
    console.error('UploadFailed', err)
  }
}

const submitUploadFile = (event: Event, fileType: 'image' | 'sql') => {
  event?.stopPropagation()

  if (fileType === 'image') {
    if (imageFileList.value?.length == 0) {
      ElMessage({
        message: t('setting.fileManager.message.selectFile'),
        type: 'warning',
        grouping: true,
      })
      return
    }
    uploadImagesRef.value!.submit()
  } else if (fileType === 'sql') {
    if (sqlFileList.value?.length == 0) {
      ElMessage({
        message: t('setting.fileManager.message.selectFile'),
        type: 'warning',
        grouping: true,
      })
      return
    }
    uploadSqlRef.value!.submit()
  }
}
</script>

<template>
  <div id="file">
    <el-card>
      <template #header>
        <span>文件管理</span>
      </template>

      <h3>图片导出</h3>
      <el-button type="primary" @click="downloadImages">下载图片文件</el-button>
      <el-button type="primary" @click="handleDownloadFile('sql')">下载数据库文件</el-button>

      <h3>图片导入</h3>
      <el-upload
        ref="uploadImagesRef"
        class="upload"
        :limit="1"
        :on-exceed="handleImagesExceed"
        :on-change="
          (file: UploadFile, files: UploadFiles) => {
            handleFileChange(file, files, 'image')
          }
        "
        :http-request="
          (e: UploadRequestOptions) => {
            customUploadFile(e, 'image')
          }
        "
        :auto-upload="false"
        :file-list="imageFileList"
        accept=".zip"
      >
        <template #trigger>
          <el-button type="primary" class="select-button">选择图片 ZIP</el-button>
        </template>
        <el-button type="success" @click="(e: Event) => submitUploadFile(e, 'image')">
          上传至服务器
        </el-button>
      </el-upload>

      <el-upload
        ref="uploadSqlRef"
        class="upload"
        :limit="1"
        :on-exceed="handleSqlExceed"
        :on-change="
          (file: UploadFile, files: UploadFiles) => {
            handleFileChange(file, files, 'sql')
          }
        "
        :http-request="
          (e: UploadRequestOptions) => {
            customUploadFile(e, 'sql')
          }
        "
        :auto-upload="false"
        :file-list="sqlFileList"
        accept=".sql"
      >
        <template #trigger>
          <el-button type="primary" class="select-button">选择 SQL 文件</el-button>
        </template>
        <el-button type="success" @click="(e: Event) => submitUploadFile(e, 'sql')">
          上传至服务器
        </el-button>
      </el-upload>
    </el-card>

    <!-- 图片文件下载弹出框 -->
    <el-dialog v-model="downloadImageFileVisible" width="25rem" title="下载图片文件" align-center>
      <template #footer>
        <div class="download-panel">
          <p>导出进度：</p>
          <el-progress :percentage="progress" class="download-progress" />
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variable.scss' as *;

#file {
  h3 {
    margin: pxTorem(8px) 0;
  }

  .download-panel {
    display: flex;
    align-items: center;

    .download-progress {
      width: pxTorem(250px);
      margin-right: pxTorem(32px);
    }
  }

  .select-button {
    width: pxTorem(200px);
    margin-right: pxTorem(32px);
  }
}
</style>
