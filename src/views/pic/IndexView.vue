<script lang="ts" setup>
import { getPicList, movePic } from '@/api/pic/pic'
import type { PicImages } from '@/modules/pic'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import SelectView from '@/components/layout/select/IndexView.vue'
import { Motion } from 'motion-v'
import { addAlbum, deleteAlbum, editAlbum, getAlbumList } from '@/api/pic/album'
import type { Album } from '@/modules/album'
import { ElMessage, ElMessageBox, type MessageOptions } from 'element-plus'
import { formatFileSize } from '@/utils/utils'

// i18n
const { t } = useI18n()

// 显示图片信息滑块
const showImageInfo = ref(false)

// 当前相册
const activeAlbumId = ref(1)
const activeAlbumName = computed(() => {
  if (activeAlbumId.value == 1) {
    return t('pic.default')
  } else if (activeAlbumId.value == 0) {
    return t('pic.love')
  } else {
    return albumList.value?.find((album) => album.aid == activeAlbumId.value)?.albumName
  }
})

// 相册列表
const albumList = ref<Album[]>()

// 每页显示图片数量
const page = ref(1)
const perPage = ref(30)
const imageCountOptions = [
  {
    label: t('pic.perPageCount', 30),
    value: 30,
  },
  {
    label: t('pic.perPageCount', 40),
    value: 40,
  },
  {
    label: t('pic.perPageCount', 50),
    value: 50,
  },
]

// 图片列表
const images = ref<PicImages[]>([])

// 分页
const total = ref(100)
const handleCurrentChange = (val: number) => {
  page.value = val
  handleGetPicList()
}

// 相册抽屉
const albumDrawer = ref(false)
const albumDirection = ref('btt')

// 相册查询
const handleSetActiveAlbum = (album: number) => {
  activeAlbumId.value = album
  page.value = 1
  handleGetPicList()
}

// 相册操作弹出框
enum AlbumDialogType {
  Add,
  Edit,
  Move,
}
const albumDialogVisible = ref(false)
const albumDialogType = ref<AlbumDialogType>()
const albumId = ref(0)
const albumName = ref()
const showAlbumDialog = (showAlbumDialogType: AlbumDialogType, pid?: number, name?: string) => {
  albumDialogVisible.value = true
  albumDialogType.value = showAlbumDialogType

  if (showAlbumDialogType === AlbumDialogType.Edit) {
    albumId.value = pid!
    albumName.value = name
  }
}
const albumDialogTitle = computed(() => {
  switch (albumDialogType.value) {
    case AlbumDialogType.Add:
      return t('pic.addAlbum')
    case AlbumDialogType.Edit:
      return t('pic.editAlbum')
    case AlbumDialogType.Move:
      return t('pic.moveAlbum')
    default:
      return ''
  }
})

// 新增相册
const handleAddAlbum = async () => {
  if (albumName.value) {
    const res = await addAlbum(albumName.value)

    ElMessage({
      message: t(res.data.message),
      type: res.data.messageType,
      grouping: true,
    } as MessageOptions)

    if (res.data.messageType === 'success') {
      albumName.value = ''
      albumDialogVisible.value = false
      handleGetPicFolder()
    }
  } else {
    ElMessage({
      message: t('pic.message.albumNameEmpty'),
      type: 'warning',
      grouping: true,
    })
  }
}

// 编辑相册
const handleEditAlbum = async () => {
  if (albumName.value) {
    const res = await editAlbum(albumName.value, albumId.value)

    ElMessage({
      message: t(res.data.message),
      type: res.data.messageType,
      grouping: true,
    } as MessageOptions)

    if (res.data.messageType === 'success') {
      albumName.value = ''
      albumId.value = 0
      albumDialogVisible.value = false
      handleGetPicFolder()
    }
  } else {
    ElMessage({
      message: t('pic.message.albumNameEmpty'),
      type: 'warning',
      grouping: true,
    })
  }
}

// 删除相册
const handleDeleteFolder = (pid: number, name: string) => {
  ElMessageBox.confirm(t('pic.deleteAlbumConfirm', { name }), {
    cancelButtonText: t('cancel'),
    confirmButtonText: t('confirm'),
    confirmButtonClass: 'el-button--danger',
    autofocus: false,
  }).then(async () => {
    const res = await deleteAlbum(pid)

    ElMessage({
      message: t(res.data.message),
      type: res.data.messageType,
      grouping: true,
    } as MessageOptions)

    if (res.data.messageType == 'success') {
      handleGetPicFolder()
      if (activeAlbumId.value == pid) {
        activeAlbumId.value = 1
        handleGetPicList()
      }
    }
  })
}

// 显示图片详细信息
const picInfo = ref<PicImages>()
const picInfoDrawer = ref(false)
const handleShowPicInfo = (image: PicImages) => {
  picInfoDrawer.value = true
  picInfo.value = image
}

// 显示相册列表
const movePicList = ref([] as number[])
const handleShowPicList = (picList: number[]) => {
  handleGetPicFolder()
  albumDrawer.value = true
  movePicList.value = picList
}

// 移动图片
const handleMovePic = async (pidList: number[], pathId: number) => {
  const res = await movePic(pidList, pathId)
  ElMessage({
    message: t(res.data.message),
    type: res.data.messageType,
    grouping: true,
  } as MessageOptions)

  if (res.data.messageType == 'success') {
    albumDrawer.value = false
    handleGetPicList()
    handleGetPicFolder()
  }
}

// 获取相册列表
const handleGetPicFolder = async () => {
  const res = await getAlbumList()
  albumList.value = res.data.albumList
}

// 获取图片列表
const handleGetPicList = async () => {
  const res = await getPicList({
    page: page.value,
    perPage: perPage.value,
    albumId: activeAlbumId.value,
    order: order.value,
    keyword: keyword.value,
  })

  images.value = res.data.images
  total.value = res.data.total
}

// 打开相册列表
const showAlbumList = () => {
  albumDrawer.value = true
  movePicList.value = []
  handleGetPicFolder()
}

// 根据关键字搜索图片
const keyword = ref('')
const searchImages = () => {
  handleGetPicList()
}

// 图片排序
const order = ref('newest')
const sortImages = (orderType: string) => {
  order.value = orderType
  handleGetPicList()
}

// 初始化
onMounted(() => {
  handleGetPicList()
})
</script>
<template>
  <Motion
    as="div"
    id="pic"
    :initial="{ y: 20, opacity: 0 }"
    :animate="{ y: 0, opacity: 1 }"
    :transition="{ delay: 0.1, duration: 0.3 }"
  >
    <el-container>
      <el-main class="main">
        <el-header class="options">
          <div class="options-left">
            <div class="show-folder-panel">
              <el-button type="primary" @click="showAlbumList">
                {{ t('pic.showFolderPanel') }}
              </el-button>
            </div>

            <div class="show-image-count">
              <el-select
                v-model="perPage"
                :placeholder="t('pic.perPage')"
                style="width: 10rem"
                @change="handleGetPicList"
              >
                <el-option
                  v-for="item in imageCountOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>

            <div class="show-image-info">
              <el-switch v-model="showImageInfo" />
              <span>{{ t('pic.showImageInfo') }}</span>
            </div>
          </div>

          <div class="options-mid">
            <p>
              {{ activeAlbumName }}
            </p>
          </div>

          <div class="options-right">
            <div class="search-image-input">
              <el-input v-model="keyword" :placeholder="t('pic.pleaseInputKeyword')"></el-input>
              <el-button @click="searchImages" type="primary">{{ t('pic.searchImage') }}</el-button>
            </div>
            <div class="image-sort-option">
              <el-dropdown placement="bottom">
                <div class="dropdown-text">
                  <span class="el-dropdown-link">
                    {{ t('pic.sort.' + order) }}
                  </span>
                  <el-icon><Sort /></el-icon>
                </div>

                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="sortImages('newest')">{{
                      t('pic.sort.newest')
                    }}</el-dropdown-item>
                    <el-dropdown-item @click="sortImages('earliest')">{{
                      t('pic.sort.earliest')
                    }}</el-dropdown-item>
                    <el-dropdown-item @click="sortImages('utmost')">{{
                      t('pic.sort.utmost')
                    }}</el-dropdown-item>
                    <el-dropdown-item @click="sortImages('least')">{{
                      t('pic.sort.least')
                    }}</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
        </el-header>
        <el-main style="padding: 0">
          <div v-if="!images.length" class="empty-info">
            <p>{{ t('pic.emptyInfo') }}</p>
          </div>

          <SelectView
            :show-image-info="showImageInfo"
            :images="images"
            :handle-get-pic-list="handleGetPicList"
            :handle-get-pic-folder="handleGetPicFolder"
            :handle-show-pic-info="handleShowPicInfo"
            :handle-show-pic-list="handleShowPicList"
            :handle-move-pic="handleMovePic"
          ></SelectView>

          <div class="pagination-box">
            <el-pagination
              v-if="images.length != 0"
              background
              layout="prev, pager, next"
              :total="total"
              :page-size="perPage"
              @current-change="handleCurrentChange"
            ></el-pagination>
          </div>
        </el-main>
      </el-main>
    </el-container>

    <!-- 相册抽屉 -->
    <el-drawer
      v-model="albumDrawer"
      :direction="albumDirection"
      class="album-drawer"
      header-class="album-drawer-header"
    >
      <template #header>
        <h2>{{ t('pic.albumDrawer') }}</h2>
      </template>
      <template #default>
        <!-- 相册选择抽屉 -->
        <div class="album-list" v-if="movePicList.length == 0">
          <div
            v-for="(album, index) in albumList"
            :key="index"
            class="album"
            @click="handleSetActiveAlbum(album.aid)"
          >
            <p>
              {{
                (album.albumName == 'default'
                  ? t('pic.default')
                  : album.albumName == 'love'
                    ? t('pic.love')
                    : album.albumName) +
                ' (' +
                album.picCount +
                ')'
              }}
            </p>
            <div class="options-button" v-if="album.aid != 1 && album.aid != 0">
              <el-tooltip effect="dark" :content="t('pic.editAlbumName')" placement="top">
                <el-icon
                  class="edit"
                  @click.stop="showAlbumDialog(AlbumDialogType.Edit, album.aid, album.albumName)"
                  ><Edit
                /></el-icon>
              </el-tooltip>
              <el-tooltip effect="dark" :content="t('pic.deleteAlbum')" placement="top">
                <el-icon class="delete" @click.stop="handleDeleteFolder(album.aid, album.albumName)"
                  ><Delete
                /></el-icon>
              </el-tooltip>
            </div>
          </div>
          <div class="album" @click="showAlbumDialog(AlbumDialogType.Add)">
            <p>{{ t('pic.addAlbum') }}</p>
            <div class="options-button">
              <el-icon><Plus /></el-icon>
            </div>
          </div>
        </div>

        <!-- 移动相册抽屉 -->
        <div class="album-list" v-else>
          <div
            v-for="(album, index) in albumList"
            :key="index"
            class="album"
            @click="handleMovePic(movePicList, album.aid)"
          >
            <p>
              {{
                (album.albumName == 'default'
                  ? t('pic.default')
                  : album.albumName == 'love'
                    ? t('pic.love')
                    : album.albumName) +
                ' (' +
                album.picCount +
                ')'
              }}
            </p>
          </div>
        </div>
      </template>
    </el-drawer>

    <el-drawer v-model="picInfoDrawer" class="pic-drawer" :title="picInfo?.picName" size="20%">
      <div class="drawer-item">
        <p class="title">{{ t('pic.drawer.albumName') }}</p>
        <p class="text">
          {{ picInfo?.albumName == 'default' ? t('pic.default') : picInfo?.albumName }}
        </p>
      </div>
      <div class="drawer-item">
        <p class="title">{{ t('pic.drawer.picName') }}</p>
        <p class="text">{{ picInfo?.picName }}</p>
      </div>
      <div class="drawer-item">
        <p class="title">{{ t('pic.drawer.picOriginalName') }}</p>
        <p class="text">{{ picInfo?.picOriginalName }}</p>
      </div>
      <div class="drawer-item">
        <p class="title">{{ t('pic.drawer.picDescription') }}</p>
        <p class="text">{{ picInfo?.picDesc != '' ? picInfo?.picDesc : t('null') }}</p>
      </div>
      <div class="drawer-item">
        <p class="title">{{ t('pic.drawer.picFileSize') }}</p>
        <p class="text">{{ formatFileSize(picInfo?.picFileSize || 0) }}</p>
      </div>
      <div class="drawer-item">
        <p class="title">{{ t('pic.drawer.picType') }}</p>
        <p class="text">{{ picInfo?.picType }}</p>
      </div>
      <div class="drawer-item">
        <p class="title">{{ t('pic.drawer.picSize') }}</p>
        <p class="text">{{ picInfo?.picSize }}</p>
      </div>
      <div class="drawer-item">
        <p class="title">{{ t('pic.drawer.uploadTime') }}</p>
        <p class="text">{{ picInfo?.uploadTime }}</p>
      </div>
      <div class="drawer-item">
        <p class="title">{{ t('pic.drawer.love') }}</p>
        <p class="text">{{ picInfo?.picLove != 0 ? t('yes') : t('no') }}</p>
      </div>
    </el-drawer>

    <!-- 相册操作弹出框 -->
    <el-dialog v-model="albumDialogVisible" :title="albumDialogTitle" width="35rem">
      <el-input
        v-if="albumDialogType === AlbumDialogType.Add || albumDialogType === AlbumDialogType.Edit"
        v-model="albumName"
        :placeholder="t('pic.albumInputPlaceholder')"
      ></el-input>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            v-if="albumDialogType === AlbumDialogType.Add"
            @click="handleAddAlbum"
            type="primary"
            >{{ t('add') }}</el-button
          >
          <el-button
            v-if="albumDialogType === AlbumDialogType.Edit"
            @click="handleEditAlbum"
            type="primary"
            >{{ t('edit') }}</el-button
          >
        </div>
      </template>
    </el-dialog>
  </Motion>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/pic/index.scss' as *;

:deep(.album-drawer-header) {
  margin-bottom: 0px !important;
}
</style>
