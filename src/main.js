import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)


// 自定义指令
import directives from './directives'

// API 服务
import api from './api'

// 全局样式
import '@/assets/styles/index.scss'

const app = createApp(App)

app.use(pinia)
// 注册 Element Plus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 注册全局指令
Object.keys(directives).forEach(key => {
  app.directive(key, directives[key])
})

// 全局属性
app.config.globalProperties.$api = api

// 错误处理
app.config.errorHandler = (err, vm, info) => {
  console.error('全局错误:', err, vm, info)
  // 可以添加错误上报逻辑
}

app.use(store)
   .use(router)
   .use(ElementPlus, {
     locale: zhCn,
     size: 'default',
     zIndex: 3000
   })
   .mount('#app')

// 开发环境下的提示
if (process.env.NODE_ENV === 'development') {
  console.log('当前运行在开发环境')
}

