import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import packageJson from './package.json' // 确保有 "type": "module" 在 package.json

import fs from 'fs'
import path from 'node:path'

const baseUrl = 'http://127.0.0.1:20521'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 20520,
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'keys/key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, 'keys/cert.pem')),
    },
    proxy: {
      // 代理 /api 请求到 Flask
      '/api': {
        target: baseUrl, // Flask 端口
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
      // 代理 /i 请求（图片）
      '/i/': {
        target: baseUrl,
        changeOrigin: true,
      },
      // 代理 /web 请求（例如文件、logo等）
      '/web': {
        target: baseUrl,
        changeOrigin: true,
      },
      // 代理 /thumbnail 请求
      '/thumbnail': {
        target: baseUrl,
        changeOrigin: true,
      },
    },
  },
  plugins: [
    vue(),
    vueDevTools(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  define: {
    __APP_VERSION__: JSON.stringify(packageJson.version),
  },
})
