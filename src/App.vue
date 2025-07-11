<template>
  <div id="app">
    <!-- <div v-if="appStore.isLoading" class="global-loading-mask">
      <div class="spinner"></div>
      <span>正在加载，请稍候…</span>
    </div> -->
    <!-- 界面内容，使用 v-show 可以在加载完毕后保留 DOM，避免重新渲染 -->
    <!-- <div v-show="!appStore.isLoading" style="height: 100%; display: flex; flex-direction: column;"> -->
    <div style="height: 100%; display: flex; flex-direction: column;">
      <!-- 管理员界面 -->
      <Admin v-if="userStore.checkIsAdmin()" />
      
      <!-- 普通用户界面 -->
      <div v-else>
        <!-- 顶部导航栏 -->
        <nav-header />

        <!-- 路由视图 -->
        <router-view v-slot="{ Component }" :key="route.fullPath">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>

        <!-- 页脚 -->
        <nav-footer />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref,watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { useAppStore } from '@/store/app'
import { ElMessage } from 'element-plus'
import axios from 'axios'
import NavHeader from '@/components/NavHeader/NavHeader.vue'
import NavFooter from '@/components/Footer.vue'
import Admin from '@/views/Admin/Admin.vue'
import service from '@/utils/request'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const appStore = useAppStore()
const isLoading = ref(false)

// 登录状态检测方法
const checkLoginStatus = async () => {
  try {
    const user_Info = await service.get(
      '/api/login/check_login',
      { withCredentials: true }
    )
    if (user_Info.data.success) {
      userStore.setUser(user_Info.data)
    } else {
      userStore.clearUser()
      // 如果未登录，并且当前不在登录页，则跳转
      if (route.path !== '/login') {
        router.push('/login')
      }
    }
  } catch (error) {
    userStore.clearUser()
    if (route.path !== '/login') {
      router.push('/login')
    }
  }
}

// 初始化检查用户登录状态
onMounted(() => {
  // 从 localStorage 获取用户信息
  const savedUser = localStorage.getItem('userInfo')
  if (savedUser) {
    try {
      const userData = JSON.parse(savedUser)
      userStore.setUser(userData)
    } catch (error) {
      localStorage.removeItem('user')
      userStore.clearUser()
    }
  } 
  // 首次挂载时检测登录
  checkLoginStatus()
})

// 监听路由变化，每次路由变化都检测登录
watch(
  () => route.fullPath,
  () => {
    checkLoginStatus()
  }
)

watch(
  () => route.fullPath,
  (newPath, oldPath) => {
    // 避免从登录回调页跳转时重复检查
    if (newPath.startsWith('/login') || oldPath.startsWith('/login')) {
      return
    }
    // 仅在非登录页和非管理员页面时检查
    if (!newPath.startsWith('/login') && !newPath.startsWith('/admin')) {
      checkLoginStatus()
    }
  }
)

// 监听路由变化
watch(
  () => route.query,
  async (newQuery) => {
    // 打印完整的路由信息
    console.log('路由变化:', {
      fullPath: route.fullPath,
      query: route.query,
      params: route.params
    })

    // 检查是否有 Google 授权码
    const code = newQuery.code
    if (code) {
      try {
        console.log('检测到 Google 授权码:', code)
        
        // 调用后端 callback 接口
        const response = await service.get('/api/login/callback', {
          params: { code },
          withCredentials: true
        } )

        console.log('Google 登录响应:', response.data)

        if (response.data) {
          // 保存用户信息到 localStorage
          localStorage.setItem('userInfo', JSON.stringify(response.data))
          // 保存用户信息到 store
          userStore.setUser(response.data)
          
          // 清除 URL 中的授权码
          router.replace({ query: {} })
          
          ElMessage.success('Google 登录成功！')
          router.push('/')
        }
      } catch (error) {
        console.error('Google 登录失败:', error)
        ElMessage.error('登录失败，请重试')
        router.push('/login')
      }
    }
  },
  { 
    immediate: true,
    deep: true
  }
)
</script>

<style lang="scss">
:root {
  --primary-color: #1890ff;
  --success-color: #52c41a;
  --warning-color: #faad14;
  --error-color: #f5222d;
  --text-color: #2c3e50;
  --text-color-secondary: #606266;
  --text-color-light: #909399;
  --border-color: #dcdfe6;
  --bg-color: #ffffff;
  --bg-color-light: #f5f7fa;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
               'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  line-height: 1.5;
  color: var(--text-color);
  background: var(--bg-color);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  min-height: 100%;
  display: flex;
  flex-direction: column;
}

.global-loading-mask {
  position: fixed;
  z-index: 9999;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(255,255,255,0.8); /* 稍微调高不透明度 */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px); /* 添加毛玻璃效果，现代浏览器支持 */
  -webkit-backdrop-filter: blur(4px);
  color: var(--text-color-secondary);
  font-size: 16px;
}
.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #409EFF;
  border-radius: 50%;
  width: 40px; height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 15px; /* 增加间距 */
}
@keyframes spin {
  0% { transform: rotate(0deg);}
  100% { transform: rotate(360deg);}
}
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}


.section-title {
  font-size: 32px;
  text-align: center;
  margin-bottom: 15px;
  color: var(--text-color);
}

.section-subtitle {
  font-size: 16px;
  text-align: center;
  margin-bottom: 40px;
  color: var(--text-color-secondary);
}

.global-loading-mask {
  position: fixed;
  z-index: 9999;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(255,255,255,0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #409EFF;
  border-radius: 50%;
  width: 40px; height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 12px;
}
@keyframes spin {
  0% { transform: rotate(0deg);}
  100% { transform: rotate(360deg);}
}

@media (max-width: 1200px) {
  .container {
    max-width: 960px;
  }
}

@media (max-width: 992px) {
  .container {
    max-width: 720px;
  }
}

@media (max-width: 768px) {
  .container {
    max-width: 540px;
  }
}

@media (max-width: 576px) {
  .container {
    max-width: none;
  }
}
</style>