<script lang="ts" setup>
import request from '@/api/request'
import type { UploadFilled } from '@element-plus/icons-vue'
import {
  ElMessage,
  type UploadFile,
  type UploadProgressEvent,
  type UploadRequestOptions,
} from 'element-plus'
import { onMounted, ref, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { formatFileSize, getDomain } from '@/utils/utils'
import type { UploadAjaxError } from 'element-plus/es/components/upload/src/ajax.mjs'
import { getAlbumList } from '@/api/pic/album'
import type { Album } from '@/modules/album'
import { getPicCount } from '@/api/pic/pic'
import { Motion } from 'motion-v'
import { type CustomUploadFile, uploadAcceptList, allowedTypes } from '@/type/upload'

// i18n
const { t } = useI18n()

// 图库已上传图片数量
const picCount = ref(0)
// 上传组件 Ref
const uploadRef = ref()
// 上传到的文件夹
const uploadSelectOptions = ref([{ label: t('upload.default'), value: 1 }])
const uploadAlbumId = ref(uploadSelectOptions.value[0].value)
// 文件列表
const fileList = ref<CustomUploadFile[]>([])
// 文件上传失败列表
const uploadFailedList = ref<string[]>([])

// 进度条颜色
const customColors = [
  { color: '#F56C6C', percentage: 33 },
  { color: '#E6A23C', percentage: 66 },
  { color: '#409EFF', percentage: 99 },
  { color: '#67C23A', percentage: 100 },
]

// 一键上传
const submitUpload = (event: Event) => {
  // 取消冒泡
  event?.stopPropagation()

  // 判断 fileList 文件长度
  if (!fileList.value.length) {
    ElMessage({
      message: t('upload.empty'),
      type: 'warning',
      grouping: true,
    })
    return
  }

  // 调用 Upload 组件的 sumbit 方法
  uploadRef.value.submit()
}

// 自定义上传方法
const customUpload = async (options: UploadRequestOptions) => {
  // 获取 文件 与 方法
  const { file, onProgress, onError, onSuccess } = options

  // 创建 表单对象
  const formData = new FormData()
  formData.append('file', file)
  formData.append('albumId', String(uploadAlbumId.value))

  // 尝试上传文件
  try {
    const res = await request.post('/upload', formData, {
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress({ percent } as UploadProgressEvent) // 回调 el-upload 的进度条
          // 监听上传进度
          // console.log('📦 progress:', percent + '%', file, fileList)
        }
      },
    })

    const response = res.data
    console.log('response:' + response?.url)

    const finalUrl = getDomain() + response.url
    const thumbnailUrl = getDomain() + response.thumbnail

    // 更新文件列表
    nextTick(() => {
      updateFileInList(file.uid, finalUrl, thumbnailUrl)
    })

    // console.log('✅ success:', response, file, fileList)

    onSuccess(res.data) // 通知 el-upload 上传成功
  } catch (err) {
    // 监听上传失败
    // console.error('❌ error:', err, file, fileList)
    ElMessage({
      message: t('upload.uploadError', { fileName: file.name }),
      type: 'error',
      grouping: true,
    })
    uploadFailedList.value.push(file.name)
    onError(err as UploadAjaxError) // 通知 el-upload 上传失败
  }
}

// 更新文件列表的方法
const updateFileInList = (fileUid: number, url: string, thumbnail: string) => {
  const fileIndex = fileList.value.findIndex((item: UploadFile) => item.uid === fileUid)
  if (fileIndex !== -1) {
    const newFileList = [...fileList.value]
    newFileList[fileIndex] = {
      ...newFileList[fileIndex],
      url,
      html: `<img src="${url}" alt="image" />`,
      bbcode: `[img]${url}[/img]`,
      markdown: `![image](${url})`,
      thumbnail,
    }
    fileList.value = newFileList
  }
}

// 监听文件移除
const handleRemove = (file: UploadFile) => {
  fileList.value = fileList.value.filter((f: UploadFile) => f.uid !== file.uid)
  // 取消上传
  uploadRef.value.abort(file)
  // console.log('🗑 remove:', file, fileList)
}

// 监听文件状态变化
const handleChange = (file: UploadFile, fileList: UploadFile[]) => {
  // console.log('🔄 change:', file, fileList)

  // 调用校验方法
  const isValid = beforeUpload(file)

  if (!isValid) {
    // 如果文件类型不合法，从文件列表中移除该文件
    // 找到该文件在列表中的索引
    const index = fileList.findIndex((f: UploadFile) => f.uid === file.uid)
    if (index !== -1) {
      fileList.splice(index, 1)
    }
  }
}

// 上传检测
const beforeUpload = (file: UploadFile) => {
  // console.log('📦 beforeUpload:', file)

  // 获取文件扩展名
  const fileExtension = file.name.split('.').pop()?.toLowerCase() || ''

  if (!allowedTypes.includes(fileExtension)) {
    ElMessage({
      message: t('upload.typeError'),
      type: 'error',
      grouping: true,
    })
    return false // 阻止上传
  }

  return true // 允许上传
}

// 获取相册列表
const handleGetPicFolder = async () => {
  const res = await getAlbumList()
  const options = res.data.albumList.map((item: Album) => {
    return {
      value: item.aid,
      label: item.albumName,
    }
  })
  uploadSelectOptions.value = options
}

// 复制连接
const copyText = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    ElMessage({
      message: t('copy.success'),
      type: 'success',
      grouping: true,
    })
  } catch (err) {
    ElMessage({
      message: t('copy.error') + err,
      type: 'error',
      grouping: true,
    })
  }
}

// 初始化
onMounted(async () => {
  const res = await getPicCount()
  picCount.value = res.data.picCount
  handleGetPicFolder()
})
</script>
<template>
  <Motion
    as="div"
    id="upload"
    :initial="{ y: 20, opacity: 0 }"
    :animate="{ y: 0, opacity: 1 }"
    :transition="{ delay: 0.1, duration: 0.3 }"
  >
    <h1 class="title">Image Upload</h1>
    <div class="tips">
      {{ t('upload.tips', { picCount }) }}
    </div>
    <el-upload
      ref="uploadRef"
      action=""
      drag
      multiple
      class="upload"
      list-type="picture"
      :accept="uploadAcceptList"
      v-model:file-list="fileList"
      :http-request="customUpload"
      :auto-upload="false"
      :on-change="handleChange"
      :on-remove="handleRemove"
    >
      <el-tooltip effect="dark" :content="t('upload.tooltip')" placement="right">
        <el-icon class="el-icon--upload" @click="submitUpload"><upload-filled /></el-icon>
      </el-tooltip>
      <p>{{ t('upload.tooltipText01') }}</p>
      <p>{{ t('upload.tooltipText02') }}</p>

      <template #tip>
        <div class="select-options">
          <p class="select-text">{{ t('upload.uploadTo') }}</p>
          <el-select v-model="uploadAlbumId" class="upload-select" placeholder="Select">
            <el-option
              v-for="item in uploadSelectOptions"
              :key="item.value"
              :label="
                item.value == 1
                  ? t('upload.default')
                  : item.value == 0
                    ? t('upload.love')
                    : item.label
              "
              :value="item.value"
            />
          </el-select>
        </div>

        <!-- 上传失败列表 -->
        <div v-if="uploadFailedList.length != 0" class="upload-failed-tips">
          <p class="upload-failed-text">{{ t('upload.uploadFailed') }}</p>
          <div class="upload-failed-items">
            <span v-for="item in uploadFailedList" :key="item" class="upload-failed-item">
              {{ item }}
            </span>
          </div>
        </div>
      </template>
      <template #file="{ file }">
        <div class="custom-file">
          <div class="custom-file-right">
            <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
          </div>
          <div class="custom-file-mid">
            <div class="file-info">
              <div class="text">
                <p>{{ file.name }}</p>
                <p>
                  {{ formatFileSize(file.size) }} -
                  {{
                    file.percentage == 0
                      ? t('upload.waitingForUpload')
                      : file.percentage == 100
                        ? t('upload.uploadSuccess')
                        : file.percentage + '%'
                  }}
                </p>
              </div>

              <div v-if="file.percentage == 100" class="link-text">
                <el-popover
                  :title="link.name"
                  :content="link.value"
                  class="box-item"
                  placement="top"
                  width="auto"
                  v-for="link in [
                    { name: 'Url', value: file.url },
                    { name: 'HTML', value: file.html },
                    { name: 'Markdown', value: file.markdown },
                    { name: 'BBCode', value: file.bbcode },
                    { name: 'Thumbnail url', value: file.thumbnail },
                  ]"
                  :key="link.name"
                >
                  <template #reference>
                    <p class="link" @click="copyText(link.value)">{{ link.name }}</p>
                  </template>
                </el-popover>
              </div>
            </div>

            <!-- 进度条显示 -->
            <el-progress
              class="progress"
              v-if="file.percentage > 0"
              :percentage="file.percentage"
              :stroke-width="6"
              :color="customColors"
            />
          </div>
          <div class="custom-file-left">
            <el-tooltip effect="dark" :content="t('upload.remove')" placement="bottom">
              <span class="remove-file" @click="handleRemove(file)"
                ><el-icon><CloseBold /></el-icon></span
            ></el-tooltip>
          </div>
        </div>
      </template>
    </el-upload>
  </Motion>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/upload/index.scss';
</style>
