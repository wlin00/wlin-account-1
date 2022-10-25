import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx({
      transformOn: true, // 支持jsx中写on来配置点击时间
      mergeProps: true, // 自动把class、style、onClick等属性绑定到子组件的root元素
    })
  ]
})
