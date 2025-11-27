<script lang="ts" setup>
import { deletePic, updatePic } from '@/api/pic/pic'
import type { PicImages } from '@/modules/pic'
import { getDomain } from '@/utils/utils'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

// i18n
const { t } = useI18n()

// 父组件
const props = defineProps<{
  selection: PicImages[]
  updatePicList: () => void
  handleShowPicInfo: (pic: PicImages) => void
  handleShowPicList: (picList: number[]) => void
  handleMovePic: (picList: number[], targetId: number) => void
}>()

// 菜单组件配置
const optionsComponent = ref({
  zIndex: 3,
  minWidth: 160,
  x: 500,
  y: 200,
})

// 菜单显隐 & 坐标
const showMenu = ref(false)
const menuType = ref<'global' | 'single' | 'multi'>('global')
// 右击的目标图片（单选用）
const currentImage = ref<PicImages | null>()

const onContextMenu = (e: MouseEvent, image?: PicImages) => {
  // 判断是否点击在 .image-view 内
  const target = e.target as HTMLElement
  // 点击在 .image-view 内
  if (target.closest('.image-view')) {
    if (props.selection.length > 1) {
      menuType.value = 'multi'
      currentImage.value = null
    } else {
      menuType.value = 'single'
      currentImage.value = image ?? null
    }
  } else {
    menuType.value = 'global'
    currentImage.value = null
  }

  //显示组件菜单
  showMenu.value = true
  optionsComponent.value.x = e.x
  optionsComponent.value.y = e.y
}

// 菜单功能函数
// 刷新
const refresh = () => {
  window.location.reload()
}
// 复制图片
const copyImage = async () => {
  try {
    const img = new Image()
    img.crossOrigin = 'anonymous' // 避免跨域问题
    img.src = currentImage.value?.url || ''

    await new Promise((resolve, reject) => {
      img.onload = resolve
      img.onerror = reject
    })

    const canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(img, 0, 0)

    // 转成 PNG Blob
    canvas.toBlob(async (blob) => {
      if (!blob) return
      const data = [new ClipboardItem({ 'image/png': blob })]
      await navigator.clipboard.write(data)
      ElMessage({
        message: t('copySuccess'),
        type: 'success',
        grouping: true,
      })
    }, 'image/png')
  } catch (err) {
    ElMessage({
      message: t('copyFail') + err,
      type: 'error',
      grouping: true,
    })
  }
}

// 复制
const copyUrl = (urlType: string) => {
  switch (urlType) {
    case 'url':
      navigator.clipboard.writeText(getDomain() + currentImage.value?.url)
      break
    case 'markdown':
      navigator.clipboard.writeText(
        `![${currentImage.value?.picName ?? ''}](${getDomain() + currentImage.value?.url})`,
      )
      break
    case 'html':
      navigator.clipboard.writeText(
        `<img src="${currentImage.value?.url ?? ''}" alt="${getDomain() + currentImage.value?.picName}" />`,
      )
      break
    case 'bbcode':
      navigator.clipboard.writeText(`[img]${getDomain() + currentImage.value?.url}[/img]`)
      break
    case 'thumbnail':
      navigator.clipboard.writeText(getDomain() + currentImage.value?.thumbnailUrl)
      break
    default:
      break
  }

  ElMessage({
    message: t('copySuccess'),
    type: 'success',
    grouping: true,
  })
}

// 新窗口打开
const openNewWindow = () => {
  window.open(currentImage.value?.url, '_blank')
}

// 移动到相册
const moveToAlbum = (moveType: string) => {
  const movePicList: number[] = []
  if (props.selection.length === 0) {
    movePicList.push(currentImage.value?.pid || 0)
  } else {
    const picList = props.selection.map((item) => item.pid)
    movePicList.push(...picList)
  }

  if (moveType === 'move') {
    props.handleShowPicList(movePicList)
  } else {
    props.handleMovePic(movePicList, 1)
  }
}

// 详细信息
const showDetails = () => {
  if (currentImage.value) {
    props.handleShowPicInfo(currentImage.value)
  }
}

// 图片描述
const showUpdatePicBox = (updateType: string) => {
  let boxTitle = t('pic.descriptionBox')
  let oldValue = currentImage.value?.picDesc || ''

  if (updateType === 'rename') {
    boxTitle = t('pic.renameBox')
    oldValue = currentImage.value?.picName || ''
  }

  ElMessageBox.prompt(boxTitle, t('tips'), {
    confirmButtonText: t('confirm'),
    cancelButtonText: t('cancel'),
    inputPattern: /^[\u4e00-\u9fa5a-zA-Z0-9_ \-\.]+$/,
    inputErrorMessage: t('pic.descriptionError'),
    inputValue: oldValue,
  }).then(async ({ value }) => {
    const newValue = ref<{
      description?: string
      rename?: string
    }>({ description: value })

    if (updateType === 'rename') {
      newValue.value = { rename: value }
    }

    const res = await updatePic(currentImage.value?.pid || 0, newValue.value)
    ElMessage({
      message: t(res.data.message),
      type: res.data.messageType,
      grouping: true,
    })
    if (res.data.messageType === 'success') {
      props.updatePicList()
    }
  })
}

// 设为最爱
const setLove = async () => {
  const res = await updatePic(currentImage.value?.pid || 0, {
    love: currentImage.value?.picLove ? 0 : 1,
  })
  ElMessage({
    message: t(res.data.message),
    type: res.data.messageType,
    grouping: true,
  })
  props.updatePicList()
}

// 删除
const deleteImage = () => {
  ElMessageBox.confirm(t('pic.deleteBox'), t('tips'), {
    confirmButtonText: t('confirm'),
    cancelButtonText: t('cancel'),
    type: 'warning',
    confirmButtonClass: 'el-button--danger',
  }).then(async () => {
    const deletePicList: number[] = []

    if (props.selection.length == 1) {
      deletePicList.push(currentImage.value?.pid || 0)
    } else {
      const picList = props.selection.map((item) => item.pid)
      deletePicList.push(...picList)
    }

    const res = await deletePic(deletePicList)
    ElMessage({
      message: t(res.data.message),
      type: res.data.messageType,
      grouping: true,
    })
    if (res.data.messageType === 'success') {
      props.updatePicList()
    }
  })
}

// 导出子组件方法
defineExpose({
  onContextMenu,
})
</script>

<template>
  <context-menu v-model:show="showMenu" :options="optionsComponent">
    <!-- 全局菜单 -->
    <template v-if="menuType === 'global'">
      <context-menu-item :label="t('contextMenu.reload')" @click="refresh" />
    </template>

    <!-- 单选菜单 -->
    <template v-else-if="menuType === 'single'">
      <context-menu-item :label="t('contextMenu.copy')" @click="copyImage" />
      <context-menu-group :label="t('contextMenu.copyLink')">
        <context-menu-item label="URL" @click="copyUrl('url')" />
        <context-menu-item label="Markdown" @click="copyUrl('markdown')" />
        <context-menu-item label="HTML" @click="copyUrl('html')" />
        <context-menu-item label="BBCode" @click="copyUrl('bbcode')" />
        <context-menu-item label="Thumbnail Url" @click="copyUrl('thumbnail')" />
      </context-menu-group>
      <context-menu-item :label="t('contextMenu.newWindow')" @click="openNewWindow" />
      <context-menu-item :label="t('contextMenu.move')" @click="moveToAlbum('move')" />
      <context-menu-item :label="t('contextMenu.detail')" @click="showDetails" />
      <context-menu-item
        :label="t('contextMenu.setDescription')"
        @click="showUpdatePicBox('description')"
      />
      <context-menu-item
        :label="currentImage?.picLove ? t('contextMenu.unsetLove') : t('contextMenu.setLove')"
        @click="setLove"
      />
      <context-menu-separator />
      <context-menu-item :label="t('contextMenu.rename')" @click="showUpdatePicBox('rename')" />
      <context-menu-item :label="t('contextMenu.delete')" @click="deleteImage" />
    </template>

    <!-- 多选菜单 -->
    <template v-else-if="menuType === 'multi'">
      <context-menu-item :label="t('contextMenu.move')" @click="moveToAlbum('move')" />
      <context-menu-item
        v-if="selection[0]?.albumId != 1"
        :label="t('contextMenu.moveOut')"
        @click="moveToAlbum('remove')"
      />
      <context-menu-item :label="t('contextMenu.delete')" @click="deleteImage"> </context-menu-item>
    </template>
  </context-menu>
</template>

<style lang="scss" scoped></style>
