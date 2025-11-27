<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { configInstall } from '@/api/install'
import type { ConfigForm } from '@/type/server-config'
import { useI18n } from 'vue-i18n'

//i18n
const { t } = useI18n()

// 按钮节流
const sumbitButtonStuatus = ref(false)

// 数据库类型
const sqlTypeOptions = [
  {
    label: 'PostgreSQL',
    value: 'postgresql',
  },
  {
    label: 'Mysql 8.0+',
    value: 'mysql',
  },
]

// 表单约束
const configFormRef = ref<FormInstance>()
const configForm = reactive<ConfigForm>({
  sqlType: sqlTypeOptions[0].value,
  host: '127.0.0.1',
  port: 5432,
  database: 'ying_cang',
  username: '',
  password: '',
  account: '',
  userPassword: '',
})

// 表单规则
const rules = reactive<FormRules<ConfigForm>>({
  sqlType: [
    {
      required: true,
      message: t('install.from.pla.sqlType'),
      trigger: 'change',
    },
  ],
  host: [
    {
      required: true,
      message: t('install.from.pla.host'),
      trigger: 'blur',
    },
  ],
  port: [
    {
      required: true,
      message: t('install.from.pla.port'),
      trigger: 'blur',
    },
  ],
  database: [
    {
      required: true,
      message: t('install.from.pla.database'),
      trigger: 'blur',
    },
  ],
  username: [
    {
      required: true,
      message: t('install.from.pla.username'),
      trigger: 'blur',
    },
  ],
  password: [
    {
      required: true,
      message: t('install.from.pla.password'),
      trigger: 'blur',
    },
  ],
  account: [
    {
      required: true,
      message: t('install.from.pla.account'),
      trigger: 'blur',
    },
  ],
  userPassword: [
    {
      required: true,
      message: t('install.from.pla.userPassword'),
      trigger: 'blur',
    },
  ],
})

// 表单提交
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    sumbitButtonStuatus.value = true
    if (valid) {
      const res = await configInstall(configForm)
      ElMessage({
        message: t(res.data.message),
        type: res.data.messageType,
        grouping: true,
      })
      if (res.data.messageType == 'success') {
        const changePage = setTimeout(() => {
          window.location.href = '/'
          clearTimeout(changePage)
        }, 3000)
      } else {
        sumbitButtonStuatus.value = false
      }
    } else {
      ElMessage({
        message: t('install.sumbitFormEmpty'),
        type: 'warning',
        grouping: true,
      })
      sumbitButtonStuatus.value = false
    }
  })
}
</script>
<template>
  <div id="install">
    <div class="install-box">
      <img src="/images/Logo.png" alt="logo.png" />
      <h3>{{ t('install.title') }}</h3>
      <h5>{{ t('install.subTitle') }}</h5>
      <el-form
        ref="configFormRef"
        style="max-width: 31.25rem"
        :model="configForm"
        :rules="rules"
        label-width="auto"
        label-position="left"
      >
        <el-form-item :label="t('install.from.sqlType')" prop="sqlType" class="custom-form-item">
          <el-select v-model="configForm.sqlType" :placeholder="t('install.from.pla.sqlType')">
            <el-option
              v-for="item in sqlTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('install.from.host')" prop="host" class="custom-form-item">
          <el-input v-model="configForm.host" :placeholder="t('install.from.pla.host')" />
        </el-form-item>
        <el-form-item :label="t('install.from.port')" prop="port" class="custom-form-item">
          <el-input v-model="configForm.port" :placeholder="t('install.from.pla.port')" />
        </el-form-item>
        <el-form-item :label="t('install.from.database')" prop="database" class="custom-form-item">
          <el-input v-model="configForm.database" :placeholder="t('install.from.pla.database')" />
        </el-form-item>
        <el-form-item>
          <el-form-item
            :label="t('install.from.username')"
            prop="username"
            class="custom-form-item"
          >
            <el-input v-model="configForm.username" :placeholder="t('install.from.pla.username')" />
          </el-form-item>
          <el-form-item
            :label="t('install.from.password')"
            prop="password"
            class="custom-form-item"
          >
            <el-input
              v-model="configForm.password"
              type="password"
              :placeholder="t('install.from.pla.password')"
            />
          </el-form-item>
        </el-form-item>
        <el-form-item>
          <el-form-item :label="t('install.from.account')" prop="account" class="custom-form-item">
            <el-input v-model="configForm.account" :placeholder="t('install.from.pla.account')" />
          </el-form-item>
          <el-form-item
            :label="t('install.from.userPassword')"
            prop="userPassword"
            class="custom-form-item"
          >
            <el-input
              v-model="configForm.userPassword"
              type="password"
              :placeholder="t('install.from.pla.userPassword')"
            />
          </el-form-item>
        </el-form-item>
        <el-form-item>
          <el-button
            :disabled="sumbitButtonStuatus"
            class="submit-button"
            type="primary"
            @click="submitForm(configFormRef)"
          >
            {{ t('finish') }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@use '@/assets/styles/install/index.scss';
</style>
