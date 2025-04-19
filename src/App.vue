<template>
  <div id="app">
    <!-- 管理员界面 -->
    <Admin v-if="userStore.checkIsAdmin()" />
    
    <!-- 普通用户界面 -->
    <div v-else>
      <!-- 顶部导航栏 -->
      <nav-header />

      <!-- 路由视图 -->
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>

      <!-- 页脚 -->
      <nav-footer />
    </div>
  </div>
</template>

<script setup>
import { ref,watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { ElMessage } from 'element-plus'
import axios from 'axios'
import NavHeader from '@/components/NavHeader/NavHeader.vue'
import NavFooter from '@/components/Footer.vue'
import Admin from '@/views/Admin/Admin.vue'
import service from '@/utils/request'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

// 初始化检查用户登录状态
onMounted(() => {
  // 从 localStorage 获取用户信息
  const savedUser = localStorage.getItem('userInfo')
  if (savedUser) {
    try {
      const userData = JSON.parse(savedUser)
      console.log('已从本地存储恢复用户信息:', userData)
    } catch (error) {
      console.error('解析本地存储的用户信息失败:', error)
      localStorage.removeItem('user')
      userStore.clearUser()
    }
  } 
})
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
// 全局样式
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

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

// 页面过渡动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

// 通用样式类
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

// 响应式布局
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