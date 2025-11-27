<script setup lang="ts">
import { ref, defineProps, computed } from 'vue'
import type { PicImages } from '@/modules/pic'
import ContextMenu from '@/components/context-menu/IndexView.vue'
import { getDomain } from '@/utils/utils'

const props = defineProps<{
  images: PicImages[]
  showImageInfo: boolean
  handleGetPicList: () => void
  handleGetPicFolder: () => void
  handleShowPicInfo: (pic: PicImages) => void
  handleShowPicList: (picList: number[]) => void
  handleMovePic: (picList: number[], targetPid: number) => void
}>()

const selection = ref([] as PicImages[])

const images = computed(() => {
  return props.images
})
// 菜单
const contextMenuRef = ref()
const onContextMenu = (e: MouseEvent, image?: PicImages) => {
  // 如果右键点到某张图片
  if (image) {
    // 如果这张图不在 selection 里，清空原有选中，单独选中它
    if (!selection.value.some((sel: PicImages) => sel.pid === image.pid)) {
      selection.value.push(image) // 保留原有选中，再加上这一张
    }
  }

  contextMenuRef.value?.onContextMenu(e, image)
}

// 更新列表
const updatePicList = () => {
  selection.value = []
  props.handleGetPicList()
  props.handleGetPicFolder()
}
</script>
<template>
  <el-scrollbar class="scrollbar" @contextmenu.prevent.stop="onContextMenu($event)">
    <drag-select
      v-viewer
      v-model="selection"
      :key="images.map((img) => img.pid).join(',')"
      class="gallery"
    >
      <drag-select-option
        v-for="image in images"
        :key="image.pid"
        :value="image"
        @contextmenu.prevent.stop="onContextMenu($event, image)"
        class="image-view"
      >
        <img :src="getDomain() + image.thumbnailUrl" :data-url="getDomain() + image.url" />

        <div v-if="props.showImageInfo" class="image-info">
          <span>{{ image.picName }}</span>
          <p>{{ image.uploadTime }}</p>
        </div>
      </drag-select-option>
    </drag-select>
  </el-scrollbar>

  <!-- 菜单 -->
  <ContextMenu
    ref="contextMenuRef"
    :selection="selection"
    :update-pic-list="updatePicList"
    :handle-show-pic-info="props.handleShowPicInfo"
    :handle-show-pic-list="props.handleShowPicList"
    :handle-move-pic="props.handleMovePic"
  ></ContextMenu>
</template>
<style scoped lang="scss">
@use '@/assets/styles/variable.scss' as *;

.scrollbar {
  height: pxTorem(700px);
}

.gallery {
  position: relative;
  padding: pxTorem(18px);
  width: 100%;
  box-sizing: border-box;

  .image-view {
    position: relative;
    display: flex;
    width: 100%;
    height: 100%;
    margin-bottom: 10px;
    border-radius: 8px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    border: 2px solid transparent;
    box-sizing: border-box;
    padding: 2px;
    overflow: hidden;
    cursor: pointer;

    &:hover {
      border: 2px solid $mainColor;
    }

    &.selected {
      border: 2px solid $subColor;
    }

    img {
      width: 100%;
      height: 100%;
      border-radius: 8px;
    }

    .image-info {
      position: absolute;
      width: 100%;
      padding: 6px;
      bottom: 0px;
      font-size: 12px;
      color: white;
      box-sizing: border-box;
      background: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1));

      span {
        // 超出显示省略号
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
.gallery :deep(.drag-select) {
  columns: 8;
  column-gap: 10px;
  width: 100%;
}

.drag-select-option--selected {
  border: #2196f3 2px solid !important;
}
</style>
