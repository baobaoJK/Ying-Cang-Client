<script lang="ts" setup>
import { getDomain } from '@/utils/utils'

// url
const apiUrl = getDomain() + '/api/x'
</script>

<template>
  <div id="api">
    <!-- 接口说明 -->
    <el-card>
      <template #header>
        <div class="card-header">
          <h3>接口说明</h3>
        </div>
      </template>
      <h3>接口URL</h3>
      <div class="url-panel">
        <p>{{ apiUrl }}</p>
      </div>
      <h3>验证方式</h3>
      <p>
        使用 HTTP 基本验证 的方式验证授权，获取到 Token 后，设置请求头 Header
        标头进行验证请求(Bearer Token)，例如：
      </p>
      <p>"Authorization": "Bearer LQhpE4L6YeOQUO4u-M8lPTtSLO3e6OE_6mqqxbvYuA4"</p>

      <h4>请求 Headers 说明</h4>
      <table class="card-table">
        <thead>
          <tr>
            <th class="table-key">字段</th>
            <th class="table-type">类型</th>
            <th class="table-des">说明</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Authorization</td>
            <td>String</td>
            <td>授权 Token</td>
          </tr>
          <tr>
            <td><span class="must">*</span>Accept</td>
            <td>String</td>
            <td>必须设置为 application/json</td>
          </tr>
        </tbody>
      </table>

      <h4>响应状态码 HTTP Status Code 说明</h4>
      <table class="card-table">
        <thead>
          <tr>
            <th class="table-key">状态码</th>
            <th>说明</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>401</td>
            <td>未登录或授权失败</td>
          </tr>
          <tr>
            <td>403</td>
            <td>Api 接口未开放</td>
          </tr>
          <tr>
            <td>500</td>
            <td>服务端出现异常</td>
          </tr>
        </tbody>
      </table>

      <p class="must">文档中接口的请求参数，使用红色「*」符号标注，则表示为必传项。</p>
    </el-card>

    <!-- 授权相关 -->
    <el-card>
      <template #header>
        <div class="card-header">
          <h3>授权相关</h3>
        </div>
      </template>

      <h3>生成 Token</h3>
      <div class="url-panel">
        <p><span class="post">POST</span> /tokens</p>
      </div>

      <h4>请求参数（Body）</h4>
      <table class="card-table">
        <thead>
          <tr>
            <th class="table-key">字段</th>
            <th class="table-type">类型</th>
            <th class="table-des">说明</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><span class="must">*</span>username</td>
            <td>String</td>
            <td>用户名</td>
          </tr>
          <tr>
            <td><span class="must">*</span>password</td>
            <td>String</td>
            <td>密码</td>
          </tr>
        </tbody>
      </table>

      <h4>返回参数</h4>
      <table class="card-table">
        <thead>
          <tr>
            <th class="table-key">字段</th>
            <th class="table-type">类型</th>
            <th class="table-des">说明</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>status</td>
            <td>Integer</td>
            <td>状态码</td>
          </tr>
          <tr>
            <td>message</td>
            <td>String</td>
            <td>状态消息</td>
          </tr>
          <tr>
            <td>data</td>
            <td>Object</td>
            <td>数据</td>
          </tr>
          <tr>
            <td class="pl-1">token</td>
            <td>String</td>
            <td>Token</td>
          </tr>
          <tr>
            <td class="pl-1">message</td>
            <td>String</td>
            <td>消息</td>
          </tr>
        </tbody>
      </table>

      <h3>清空 Token</h3>
      <div class="url-panel">
        <p><span class="delete">DELETE</span> /tokens</p>
      </div>
      <h4>返回参数</h4>
      <table class="card-table">
        <thead>
          <tr>
            <th class="table-key">字段</th>
            <th class="table-type">类型</th>
            <th class="table-des">说明</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>status</td>
            <td>Integer</td>
            <td>状态码</td>
          </tr>
          <tr>
            <td>message</td>
            <td>String</td>
            <td>状态消息</td>
          </tr>
          <tr>
            <td>data</td>
            <td>Object</td>
            <td>数据</td>
          </tr>
        </tbody>
      </table>
    </el-card>

    <!-- 图片相关 -->
    <el-card>
      <template #header>
        <div class="card-header">
          <h3>图片相关</h3>
        </div>
      </template>

      <h3>上传图片</h3>
      <div class="url-panel">
        <p><span class="post">POST</span> /upload</p>
      </div>
      <h4>Header</h4>
      <table class="card-table">
        <thead>
          <tr>
            <th class="table-key">字段</th>
            <th class="table-type">类型</th>
            <th class="table-des">说明</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><span class="must">*</span>Content-Type</td>
            <td>String</td>
            <td>需要设置为 multipart/form-data</td>
          </tr>
        </tbody>
      </table>
      <h4>请求参数（Body）</h4>
      <table class="card-table">
        <thead>
          <tr>
            <th class="table-key">字段</th>
            <th class="table-type">类型</th>
            <th class="table-des">说明</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><span class="must">*</span>file</td>
            <td>File</td>
            <td>图片文件</td>
          </tr>
          <tr>
            <td><span class="must">*</span>albumId</td>
            <td>Integer</td>
            <td>相册 ID</td>
          </tr>
        </tbody>
      </table>
      <h4>返回参数</h4>
      <table class="card-table">
        <thead>
          <tr>
            <th class="table-key">字段</th>
            <th class="table-type">类型</th>
            <th class="table-des">说明</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>status</td>
            <td>Integer</td>
            <td>状态码</td>
          </tr>
          <tr>
            <td>message</td>
            <td>String</td>
            <td>状态消息</td>
          </tr>
          <tr>
            <td>data</td>
            <td>Object</td>
            <td>数据</td>
          </tr>
          <tr>
            <td class="pl-1">filename</td>
            <td>String</td>
            <td>文件名</td>
          </tr>
          <tr>
            <td class="pl-1">thumbnail</td>
            <td>String</td>
            <td>缩略图 Url</td>
          </tr>
          <tr>
            <td class="pl-1">url</td>
            <td>String</td>
            <td>图片 Url</td>
          </tr>
        </tbody>
      </table>

      <h3>图片列表</h3>
      <div class="url-panel">
        <p><span class="get">GET</span> /getPicList</p>
      </div>
      <h4>请求参数（Query）</h4>
      <table class="card-table">
        <thead>
          <tr>
            <th class="table-key">字段</th>
            <th class="table-type">类型</th>
            <th class="table-des">说明</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>page</td>
            <td>Integer</td>
            <td>页码</td>
          </tr>
          <tr>
            <td>perPage</td>
            <td>Integer</td>
            <td>n张图片/页</td>
          </tr>
          <tr>
            <td>albumId</td>
            <td>Integer</td>
            <td>相册 ID</td>
          </tr>
          <tr>
            <td>order</td>
            <td>String</td>
            <td>排序方式，newest=最新，earliest=最早，utmost=最大，least=最小</td>
          </tr>
          <tr>
            <td>keyword</td>
            <td>String</td>
            <td>关键字</td>
          </tr>
        </tbody>
      </table>
      <h4>返回参数</h4>
      <table class="card-table">
        <thead>
          <tr>
            <th class="table-key">字段</th>
            <th class="table-type">类型</th>
            <th class="table-des">说明</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>status</td>
            <td>Integer</td>
            <td>状态码</td>
          </tr>
          <tr>
            <td>message</td>
            <td>String</td>
            <td>状态消息</td>
          </tr>
          <tr>
            <td>data</td>
            <td>Object</td>
            <td>数据</td>
          </tr>
          <tr>
            <td class="pl-1">current_page</td>
            <td>Integer</td>
            <td>当前所在页页码</td>
          </tr>
          <tr>
            <td class="pl-1">per_page</td>
            <td>Integer</td>
            <td>每页展示数据数量</td>
          </tr>
          <tr>
            <td class="pl-1">total</td>
            <td>Integer</td>
            <td>图片总数量</td>
          </tr>
          <tr>
            <td class="pl-1">images</td>
            <td>Object[]</td>
            <td>图片列表</td>
          </tr>
          <tr>
            <td class="pl-2">albumId</td>
            <td>Integer</td>
            <td>所在相册 ID</td>
          </tr>
          <tr>
            <td class="pl-2">albumName</td>
            <td>String</td>
            <td>所在相册名称</td>
          </tr>
          <tr>
            <td class="pl-2">pid</td>
            <td>Integer</td>
            <td>图片 ID</td>
          </tr>
          <tr>
            <td class="pl-2">picDesc</td>
            <td>String</td>
            <td>图片描述</td>
          </tr>
          <tr>
            <td class="pl-2">picFileSize</td>
            <td>Integer</td>
            <td>图片文件大小</td>
          </tr>
          <tr>
            <td class="pl-2">picLove</td>
            <td>Integer</td>
            <td>图片是否最爱</td>
          </tr>
          <tr>
            <td class="pl-2">picName</td>
            <td>String</td>
            <td>图片名称</td>
          </tr>
          <tr>
            <td class="pl-2">picOriginalName</td>
            <td>String</td>
            <td>图片原始名称</td>
          </tr>
          <tr>
            <td class="pl-2">picSize</td>
            <td>String</td>
            <td>图片尺寸</td>
          </tr>
          <tr>
            <td class="pl-2">picSuffix</td>
            <td>String</td>
            <td>图片后缀名</td>
          </tr>
          <tr>
            <td class="pl-2">uuid</td>
            <td>String</td>
            <td>图片 uuid</td>
          </tr>

          <tr>
            <td class="pl-2">uploadTime</td>
            <td>String</td>
            <td>图片上传时间</td>
          </tr>
          <tr>
            <td class="pl-2">picType</td>
            <td>String</td>
            <td>图片类型</td>
          </tr>

          <tr>
            <td class="pl-2">relativePath</td>
            <td>String</td>
            <td>图片相对路径</td>
          </tr>
          <tr>
            <td class="pl-2">thumbnailUrl</td>
            <td>String</td>
            <td>图片缩略图 Url</td>
          </tr>
          <tr>
            <td class="pl-2">url</td>
            <td>String</td>
            <td>图片 Url</td>
          </tr>
        </tbody>
      </table>

      <h3>删除图片</h3>
      <div class="url-panel">
        <p><span class="delete">DELETE</span> /pic</p>
      </div>
      <h4>请求参数（Params）</h4>
      <table class="card-table">
        <thead>
          <tr>
            <th class="table-key">字段</th>
            <th class="table-type">类型</th>
            <th class="table-des">说明</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><span class="must">*</span>deletePicList</td>
            <td>Integer[]</td>
            <td>要删除的图片 ID 列表</td>
          </tr>
        </tbody>
      </table>
      <h4>返回参数</h4>
      <table class="card-table">
        <thead>
          <tr>
            <th class="table-key">字段</th>
            <th class="table-type">类型</th>
            <th class="table-des">说明</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>status</td>
            <td>Integer</td>
            <td>状态码</td>
          </tr>
          <tr>
            <td>message</td>
            <td>String</td>
            <td>状态消息</td>
          </tr>
          <tr>
            <td>data</td>
            <td>Object</td>
            <td>数据</td>
          </tr>
        </tbody>
      </table>
    </el-card>

    <!-- 相册相关 -->
    <el-card>
      <template #header>
        <div class="card-header">
          <h3>相册相关</h3>
        </div>
      </template>

      <h3>相册列表</h3>
      <div class="url-panel">
        <p><span class="get">GET</span> /album</p>
      </div>
      <h4>返回参数</h4>
      <table class="card-table">
        <thead>
          <tr>
            <th class="table-key">字段</th>
            <th class="table-type">类型</th>
            <th class="table-des">说明</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>status</td>
            <td>Integer</td>
            <td>状态码</td>
          </tr>
          <tr>
            <td>message</td>
            <td>String</td>
            <td>状态消息</td>
          </tr>
          <tr>
            <td>data</td>
            <td>Object</td>
            <td>数据</td>
          </tr>
          <tr>
            <td class="pl-1">albumList</td>
            <td>Object[]</td>
            <td>相册列表</td>
          </tr>
          <tr>
            <td class="pl-2">pid</td>
            <td>Integer</td>
            <td>相册 ID</td>
          </tr>
          <tr>
            <td class="pl-2">albumName</td>
            <td>String</td>
            <td>相册名称</td>
          </tr>
          <tr>
            <td class="pl-2">picCount</td>
            <td>Integer</td>
            <td>相册图片数量</td>
          </tr>
        </tbody>
      </table>
      <h3>创建相册</h3>
      <div class="url-panel">
        <p><span class="post">POST</span> /album</p>
      </div>
      <h4>请求参数（Body）</h4>
      <table class="card-table">
        <thead>
          <tr>
            <th class="table-key">字段</th>
            <th class="table-type">类型</th>
            <th class="table-des">说明</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><span class="must">*</span>albumName</td>
            <td>String</td>
            <td>相册名称</td>
          </tr>
        </tbody>
      </table>
      <h4>返回参数</h4>
      <table class="card-table">
        <thead>
          <tr>
            <th class="table-key">字段</th>
            <th class="table-type">类型</th>
            <th class="table-des">说明</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>status</td>
            <td>Integer</td>
            <td>状态码</td>
          </tr>
          <tr>
            <td>message</td>
            <td>String</td>
            <td>状态消息</td>
          </tr>
          <tr>
            <td>data</td>
            <td>Object</td>
            <td>数据</td>
          </tr>
        </tbody>
      </table>

      <h3>删除相册</h3>
      <div class="url-panel">
        <p><span class="delete">DELETE</span> /album</p>
      </div>
      <h4>请求参数（Params）</h4>
      <table class="card-table">
        <thead>
          <tr>
            <th class="table-key">字段</th>
            <th class="table-type">类型</th>
            <th class="table-des">说明</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><span class="must">*</span>id</td>
            <td>Integer</td>
            <td>相册 ID</td>
          </tr>
        </tbody>
      </table>
      <h4>返回参数</h4>
      <table class="card-table">
        <thead>
          <tr>
            <th class="table-key">字段</th>
            <th class="table-type">类型</th>
            <th class="table-des">说明</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>status</td>
            <td>Integer</td>
            <td>状态码</td>
          </tr>
          <tr>
            <td>message</td>
            <td>String</td>
            <td>状态消息</td>
          </tr>
          <tr>
            <td>data</td>
            <td>Object</td>
            <td>数据</td>
          </tr>
        </tbody>
      </table>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variable.scss' as *;
#api {
  font-size: pxTorem(14px);

  p {
    margin: pxTorem(8px) 0;
  }

  .must {
    color: red;
  }

  .post {
    color: #67c23a;
  }

  .get {
    color: #409eff;
  }

  .delete {
    color: #f56c6c;
  }

  .pl-1 {
    padding-left: pxTorem(28px) !important;
  }

  .pl-2 {
    padding-left: pxTorem(56px) !important;
  }

  .url-panel {
    padding: pxTorem(4px) pxTorem(12px);
    background-color: #6b7280;
    color: white;
    border-radius: pxTorem(6px);
    margin: pxTorem(16px) 0;
  }

  .card-table {
    $borderColor: #f2f2f2;
    width: 100%;
    border-collapse: collapse;
    border: pxTorem(1px) solid $borderColor;
    margin: pxTorem(16px) 0;
    text-align: left;

    tr {
      border-bottom: pxTorem(1px) solid $borderColor;
    }

    th,
    td {
      padding: pxTorem(8px);
    }

    .table-key,
    .table-type {
      width: 20%;
    }
  }

  .el-card {
    margin-bottom: pxTorem(32px);
  }
}
</style>
