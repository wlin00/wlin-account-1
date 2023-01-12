import { defineConfig, splitVendorChunkPlugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
// @ts-nocheck
import { svgstore } from './src/vite_plugins/svgstore'
// vite dynamic import
import styleImport, { VantResolve } from 'vite-plugin-style-import';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: any) {
          if (id.includes('echarts')) {
            return 'echarts'
          }
          if (id.includes('mock') || id.includes('faker')) {
            return 'mock'
          }
          if (id.includes('vant')) {
            return 'vant'
          }
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        }
      }
    }
  },
  plugins: [
    vue(),
    vueJsx({
      transformOn: true,
      mergeProps: true
    }),
    svgstore(),
    styleImport({
      resolves: [VantResolve()],
    }),
  ],
  server: { // 开发环境反向代理到云服务器
    host: '0.0.0.0',
    proxy: {
      '/api/v1': {
        target: 'http://47.94.212.148:3000/'
      }
    }

  }
})
