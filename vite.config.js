import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'  // 注意这里的导入路径修正

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'http://66.42.110.47:5000',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})