<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Motion } from 'motion-v'
import * as echarts from 'echarts'
import { getDashBoardData } from '@/api/dashboard'
import { formatStorageSize } from '@/utils/utils'

// i18n
const { t } = useI18n()

// 数据板
const dataPanel = ref([
  {
    icon: 'picture',
    text: t('dashboard.dataPanel.picCount'),
    count: 0,
  },
  {
    icon: 'today',
    text: t('dashboard.dataPanel.today'),
    count: 0,
  },
  {
    icon: 'month',
    text: t('dashboard.dataPanel.month'),
    count: 0,
  },
  {
    icon: 'album',
    text: t('dashboard.dataPanel.albumCount'),
    count: 0,
  },
])

// 空间数据块
const dataBlock = ref([
  {
    text: t('dashboard.dataBlock.total'),
    size: 0,
  },
  {
    text: t('dashboard.dataBlock.used'),
    size: 0,
  },
  {
    text: t('dashboard.dataBlock.available'),
    size: 0,
  },
  {
    text: t('dashboard.dataBlock.occupation'),
    size: 0,
  },
])

// ----------------ECharts----------------
// 空间饼状图
const spacePieInit = (used: number | 0, free: number | 0) => {
  type EChartsOption = echarts.EChartsOption

  const spaceChartDom = document.getElementById('spacePie')!
  const spaceChart = echarts.init(spaceChartDom)
  const option: EChartsOption = {
    color: ['#3D3D3D', '#2EFF9D'],
    title: {
      text: t('dashboard.spacePie.title'),
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        // 对于饼图，params 可能是数组或单个对象
        if (Array.isArray(params)) {
          // 如果是数组，取第一个元素
          const item = params[0]
          return `${item.name}<br/>${formatStorageSize(item.value as number)} (${item.percent}%)`
        } else {
          // 如果是单个对象
          return `${params.name}<br/>${formatStorageSize(params.value as number)} (${params.percent}%)`
        }
      },
    },
    series: [
      {
        name: t('dashboard.spacePie.name'),
        type: 'pie',
        radius: '50%',
        data: [
          { value: used, name: t('dashboard.spacePie.used') },
          { value: free, name: t('dashboard.spacePie.free') },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  }
  spaceChart.setOption(option)
}

// 图片类型饼状图
const imgPieInit = (imgPieData: []) => {
  type EChartsOption = echarts.EChartsOption

  const imgChartDom = document.getElementById('imgPie')!
  const imgChart = echarts.init(imgChartDom)
  const option: EChartsOption = {
    color: [
      '#FF6B6B',
      '#4ECDC4',
      '#45B7D1',
      '#96CEB4',
      '#FFEAA7',
      '#DDA0DD',
      '#98D8C8',
      '#F7DC6F',
      '#BB8FCE',
      '#85C1E9',
    ],
    title: {
      text: t('dashboard.imgPie.title'),
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
    },
    series: {
      name: t('dashboard.imgPie.name'),
      type: 'pie',
      radius: '50%',
      data: imgPieData,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
    },
  }
  imgChart.setOption(option)
}

// 近 30天 上传趋势
const uploadLineInit = (uploadTrend: { dates: []; counts: [] }) => {
  type EChartsOption = echarts.EChartsOption

  const uploadChartDom = document.getElementById('uploadLine')!
  const uploadChart = echarts.init(uploadChartDom)
  const option: EChartsOption = {
    title: {
      text: t('dashboard.uploadLine.title'),
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
    },
    grid: {
      left: '2%', // 左边距 0%
      right: '2%', // 右边距 0%
      top: '20%', // 顶部留出标题空间
      bottom: '2%', // 底部距 0%
      containLabel: true, // 确保坐标轴标签在 grid 区域内
    },
    xAxis: {
      type: 'category',
      data: uploadTrend.dates,
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: uploadTrend.counts,
        type: 'line',
      },
    ],
  }

  uploadChart.setOption(option)
}
// ECharts
onMounted(async () => {
  const res = await getDashBoardData()

  dataPanel.value[0].count = res.data.dashboard.picCount
  dataPanel.value[1].count = res.data.dashboard.todayPicCount
  dataPanel.value[2].count = res.data.dashboard.monthPicCount
  dataPanel.value[3].count = res.data.dashboard.albumCount

  dataBlock.value[0].size = res.data.storage.totalSize
  dataBlock.value[1].size = res.data.storage.diskUsed
  dataBlock.value[2].size = res.data.storage.freeSize
  dataBlock.value[3].size = res.data.storage.usedSize

  spacePieInit(res.data.storage.diskUsed, res.data.storage.freeSize)
  imgPieInit(res.data.imgPieData)
  uploadLineInit(res.data.uploadTrend)
})

const appVersion = ref(__APP_VERSION__)
</script>

<template>
  <Motion
    as="div"
    id="dashboard"
    :initial="{ y: 20, opacity: 0 }"
    :animate="{ y: 0, opacity: 1 }"
    :transition="{ delay: 0.1, duration: 0.3 }"
  >
    <!-- 数据板 -->
    <el-row :gutter="20" class="data-panel">
      <el-col :span="6" v-for="item in dataPanel" :key="item">
        <el-card shadow="always" class="data-card">
          <div class="icon" :class="item.icon"></div>
          <div class="text-box">
            <p class="text">{{ t(item.text) }}</p>
            <p class="sub-tetxt">{{ item.count }}</p>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 空间数据块 -->
    <el-row :gutter="20" class="space-data-block">
      <el-col :span="6">
        <el-card v-for="(item, index) in dataBlock" :key="item" shadow="always" class="data-card">
          <div class="icon" :class="'disk-' + (index + 1)"></div>
          <div class="text-box">
            <p class="text">{{ item.text }}</p>
            <p class="sub-tetxt">{{ formatStorageSize(item.size) }}</p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="9" class="space-pie">
        <div id="spacePie" style="width: 100%; height: 100%"></div>
      </el-col>

      <el-col :span="9" class="img-pie">
        <div id="imgPie" style="width: 100%; height: 100%"></div>
      </el-col>
    </el-row>

    <!-- 近 30天 上传趋势 -->
    <el-row class="upload-line-panel">
      <el-col :span="24">
        <div id="uploadLine" style="width: 100%; height: 100%"></div>
      </el-col>
    </el-row>

    <!-- 软件信息 -->
    <el-row class="software-info">
      <el-col :span="24">
        <el-card shadow="always" class="data-card">
          <template #header>
            <h3>{{ t('dashboard.softwareInfo') }}</h3>
          </template>
          <div class="software-info-box">
            <el-row :span="24" class="text">
              <el-col :span="8">
                <p>{{ t('dashboard.softwareVersion') }}</p>
              </el-col>
              <el-col :span="16">
                <p>V {{ appVersion }}</p>
              </el-col>
            </el-row>
            <el-row :span="24" class="text">
              <el-col :span="8">
                <p>{{ t('dashboard.officialWebsite') }}</p>
              </el-col>
              <el-col :span="16">
                <p>https://yc.ksamar.top</p>
              </el-col>
            </el-row>
            <el-row :span="24" class="text">
              <el-col :span="8">
                <p>{{ t('dashboard.userManual') }}</p>
              </el-col>
              <el-col :span="16">
                <p>https://docs.yc.ksamar.top</p>
              </el-col>
            </el-row>
            <el-row :span="24" class="text">
              <el-col :span="8">
                <p>{{ t('dashboard.github') }}</p>
              </el-col>
              <el-col :span="16">
                <p>https://github.com</p>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </Motion>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/dashboard/index.scss' as *;
</style>
