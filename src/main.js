import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'



import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
// 引入你需要的具体图标，例如点赞图标（这里以 solid 图标集中的 thumbs-up 为例）
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons'
// // 将图标添加到库中
// library.add(faThumbsUp)

// 自定义指令
import directives from './directives'

// API 服务
import api from './api'

// 全局样式
import '@/assets/styles/index.scss'

const app = createApp(App)

// // 全局注册 FontAwesomeIcon 组件
// app.component('font-awesome-icon', FontAwesomeIcon)
// app.mount('#app')

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