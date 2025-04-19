<template>
  <header class="nav-header" :class="{ 'is-fixed': isScrolled }">
    <div class="container">
      <div class="header-content">
        <!-- Logo -->
        <div class="logo">
          <router-link to="/">
            <img src="@/assets/images/logo.jpg" alt="嘉立诚数控">
          </router-link>
        </div>

        <!-- 主导航菜单 -->
        <nav class="nav-menu">
          <ul class="menu-list">
            <li class="menu-item">
              <router-link to="/quote">在线报价</router-link>
            </li>
            <li class="menu-item">
              <router-link to="/sales-promotion">CNC1元打样</router-link>
            </li>
            <li class="menu-item">
              <el-icon style="color: red"><Flag /></el-icon>
              <router-link to="/coupons">领券中心</router-link>
            </li>
            <li class="menu-item">
              <router-link to="/materials">材料介绍</router-link>
            </li>
            <!-- 服务指引下拉菜单 -->
            <li class="menu-item has-submenu" 
                @click="toggleService('service')" 
                @mouseenter="showService('service')"
                @mouseleave="hideService('service')">
              <span class="menu-title">
                服务指引
                <el-icon class="submenu-icon" :class="{ 'is-active': activeSubmenu === 'service' }">
                  <ArrowUpBold v-if="activeSubmenu === 'service'" />
                  <ArrowDownBold v-else />
                </el-icon>
              </span>
              <div class="submenu" :class="{ 'is-visible': activeSubmenu === 'service' }">
                <router-link to="/service-guidance">服务指引</router-link>
                <router-link to="/user-evaluation">客户评价</router-link>
                <router-link to="/technical-column">技术专栏</router-link>
                <router-link to="/forum">技术论坛</router-link>
              </div>
            </li>
            <!-- 关于我们下拉菜单 -->
            <li class="menu-item has-submenu" 
              @click="toggleAbout('about')" 
              @mouseenter="showAbout('about')"
              @mouseleave="hideAbout('about')">
            <span class="menu-title">
              关于我们
              <el-icon class="submenu-icon" :class="{ 'is-active': activeSubmenu2 === 'about' }">
                <ArrowUpBold v-if="activeSubmenu2 === 'about'" />
                <ArrowDownBold v-else />
              </el-icon>
            </span>
            <div class="submenu" :class="{ 'is-visible': activeSubmenu2 === 'about' }">
              <router-link to="/news">公司动态</router-link>
              <router-link to="/about">公司简介</router-link>
            </div>
          </li>
            <li class="menu-item">
              <router-link to="/contact">联系我们</router-link>
            </li>
          </ul>
        </nav>

        <!-- 右侧功能区 -->
        <div class="header-right">
          <!-- 购物车按钮 -->
          <div class="action-button">
            <router-link to="/cart">
              <el-icon><ShoppingCart /></el-icon>
              <span>购物车</span>
            </router-link>
          </div>
          <div id="translate" class="translate-select-language"></div>
          <!-- 用户区域 -->
          <div class="user-area">
            <!-- 未登录状态 -->
            <template v-if="!userStore.isLoggedIn">
              <el-button class="action-button" @click="$router.push('/register')">注册</el-button>
              <el-button class="action-button" @click="$router.push('/login')">登录</el-button>
            </template>

            <!-- 已登录状态 -->
            <template v-else>
              <Profile>
                <template #trigger>
                  <div class="user-info">
                    <el-avatar 
                      :size="32" 
                      :src="userStore.user.user.picture" 
                    />
                    <span>{{ userStore.user.user.name }}</span>
                  </div>
                </template>
              </Profile>
            </template>
            
          </div>
          

        </div>
        <!-- 移动端菜单按钮 -->
        <div class="menu-toggle" @click="toggleMenu">
          <el-icon v-if="!isMenuOpen"><Menu /></el-icon>
          <el-icon v-else><Close /></el-icon>
        </div>
      </div>
    </div>
  </header>
  <div class="login-options">
    <div id="googleButton"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ShoppingCart, Menu, Close, ArrowUpBold, ArrowDownBold, Flag } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/user'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import Profile from '@/views/Profile/Profile.vue' // 引入新组件

const router = useRouter()
const userStore = useUserStore()

const isScrolled = ref(false)
const isMenuOpen = ref(false)

const activeSubmenu2 = ref(null)

const isUserMenuVisible = ref(false)

// 切换移动端菜单
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

// 监听滚动事件
const handleScroll = () => {
  isScrolled.value = window.scrollY > 0
}

const toggleService = (menu) => {
  activeSubmenu.value = activeSubmenu.value === menu ? null : menu
}

const showService = (menu) => {
  activeSubmenu.value = menu
}

const hideService = (menu) => {
  if (activeSubmenu.value === menu) {
    activeSubmenu.value = null
  }
}

const toggleAbout = (menu) => {
  activeSubmenu2.value = activeSubmenu2.value === menu ? null : menu
}

const showAbout = (menu) => {
  activeSubmenu2.value = menu
}

const hideAbout = (menu) => {
  if (activeSubmenu2.value === menu) {
    activeSubmenu2.value = null
  }
}

const activeSubmenu = ref(null)

import axios from 'axios'
// 处理退出登录
const handleCommand = async (command) => {  // 添加 async
  switch (command) {
    case 'profile':
      router.push('/profile')
      break
    case 'orders':
      router.push('/orders')
      break
    case 'logout':
      try {
        // 添加 await 和 withCredentials 配置
        const response = await axios.post(
          'http://localhost:8000/api/login/logout',
          {},  // 空对象作为请求体
          {
            withCredentials: true,  // 允许发送 cookies
            headers: {
              'Content-Type': 'application/json',
            }
          }
        )
        console.log('response',response)
        // 移除调试信息，改用正确的响应处理
        if (response.data.success) {
          // 清除用户状态
          userStore.clearUser()
          
          // 清除可能存在的存储数据
          localStorage.removeItem('userInfo')
          sessionStorage.removeItem('userInfo')
          
          // 清除 axios 默认 headers
          delete axios.defaults.headers.common['Authorization']
          
          // 提示成功
          ElMessage.success('退出成功')
          
          // 重定向到首页
          router.push('/login')
        } else {
          // 如果后端返回失败信息
          ElMessage.error(response.data.message || '退出失败，请重试')
        }
      } catch (error) {
        console.error('退出失败:', error.response?.data || error)
        ElMessage.error(error.response?.data?.detail || '退出失败，请重试')
      }
      break
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)

  // 确保 google 脚本已加载
  if (window.google && window.google.accounts) {
    initializeGoogleLogin()
  } else {
    // 如果脚本还未加载完成，等待加载
    window.onload = () => {
      initializeGoogleLogin()
    }
  }
  
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// 初始化 Google 登录
const initializeGoogleLogin = () => {
  window.google.accounts.id.initialize({
    client_id: 'your-google-client-id', // 替换为你的 Google Client ID
    callback: handleCredentialResponse
  })

  window.google.accounts.id.renderButton(
    document.getElementById('googleButton'),
    { 
      theme: 'outline', 
      size: 'large',
      text: '使用Google账号登录',
      width: 250
    }
  )
}

// Google 登录回调
const handleCredentialResponse = async (response) => {
  try {
    await userStore.handleGoogleLogin(response)
    router.push('/')
  } catch (error) {
    console.error('登录失败：', error)
  }
}
import { nextTick, onUpdated } from 'vue'

// 组件挂载后初始化翻译
nextTick(() => {
  if (window.translate && typeof window.translate.execute === 'function') {
    window.translate.execute();
    setTimeout(() => {
      window.translate.execute();
    }, 500);
    if (window.translate.listener && typeof window.translate.listener.start === 'function') {
      window.translate.listener.start();
    }
  }else {
    console.warn('translate.js 未加载完成，window.translate 不可用');
  }
});

// 组件更新后再次执行翻译，确保新渲染内容也被翻译
onUpdated(() => {
  if (window.translate && typeof window.translate.execute === 'function') {
    window.translate.execute();
  }
});

</script>

<style lang="scss" scoped>
/* 定义主色调 */
:root {
  --primary-color: #007BFF;
  --border-color: #dcdfe6;
}

.nav-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  padding: 0 20px; /* 增加左右内边距 */

  .container {
    // max-width: 1200px;
    // margin: 0 auto;
    padding: 0 15px;
  }

  .header-content {
    display: flex;
    align-items: center;
    height: 100px;
  }

  .logo {
    height: 40px;
    margin-right: 40px;

    img {
      height: 100%;
      width: auto;
    }
  }

  .nav-menu {
    flex: 1;

    .menu-list {
      display: flex;
      gap: 20px;
      list-style-type: none; /* 去除列表项默认样式（小黑点） */
      margin: 0;
      padding: 0;
    }

    .menu-item {
      color: #333;
      font-size: 16px;
      text-decoration: none; /* 去掉下划线 */
      padding: 8px 0;
      cursor: pointer;
      width: 100px;
      transition: color 0.3s ease; /* 添加过渡效果 */
      text-align: center;

      a,
      .menu-title {
        color: #333;
        text-decoration: none; /* 去掉下划线 */
        width: 100px;
        text-align: center;

        &:hover {
          color: var(--primary-color);
        }
      }

      &.has-submenu {
        position: relative;
        cursor: pointer;

        .menu-title {
          display: flex;
          align-items: center;
          gap: 4px;

          .submenu-icon {
            font-size: 12px;
            transition: transform 0.3s ease;
            margin-left: 4px;

            &.is-active {
              transform: rotate(360deg);
            }
          }
        }

        .submenu {
          position: absolute;
          top: 100%;
          left: 0;
          background: #fff;
          min-width: 160px;
          padding: 8px 0;
          border-radius: 4px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
          opacity: 0;
          visibility: hidden;
          transform: translateY(10px);
          transition: all 0.3s ease;
          z-index: 1000;

          &.is-visible {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
          }

          a {
            display: block;
            padding: 8px 16px;
            color: #333;
            text-decoration: none; /* 去掉下划线 */
            transition: all 0.3s ease;
            font-size: 14px;

            &:hover {
              color: var(--primary-color);
              background: #f5f7fa;
            }

            &.active {
              color: var(--primary-color);
            }
          }
        }

        &:hover {
          .menu-title {
            color: var(--primary-color);
          }
        }
      }
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-left: 50px;

    .action-button {
      height: 32px;
      padding: 0 12px;
      border: 1px solid var(--border-color);
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      background-color: #fff;
      cursor: pointer;
      text-decoration: none;
      color: #333;
      width: 100px;

      &:hover {
        border-color: var(--primary-color);
        color: var(--primary-color);
      }

      a {
        text-decoration: none;
        color: inherit;
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .el-icon {
        font-size: 16px;
      }
    }

    .user-actions {
      display: flex;
      align-items: center;
      gap: 12px;

      .register-btn, .login-btn {
        font-size: 14px;
        color: #333;
        text-decoration: none;
        background-color: #fff;
        border: 1px solid var(--border-color);

        &:hover {
          color: var(--primary-color);
          border-color: var(--primary-color);
        }
      }
    }
  }

  .menu-toggle {
    display: none;
  }

  @media (max-width: 992px) {
    .nav-menu {
      display: none;
    }

    .menu-toggle {
      display: block;
      margin-left: 20px;
      font-size: 24px;
      cursor: pointer;
    }

    .header-right {
      gap: 8px;

      .action-button {
        height: 28px;
        padding: 0 8px;
        font-size: 12px;

        .el-icon {
          font-size: 14px;
        }
      }

      .user-actions {
        gap: 8px;
      }
    }
  }

  @media (max-width: 768px) {
    .header-right {
      .cart-icon span {
        display: none;
      }
    }

    .menu-item {
      &.has-submenu {
        .submenu {
          position: static;
          box-shadow: none;
          padding-left: 20px;
          transform: none;

          &.is-visible {
            display: block;
          }
        }
      }
    }
  }
}
.user-area {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
}

.user-info:hover {
  background-color: #f5f7fa;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  
  .username {
    max-width: 80px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.user-submenu {
  width: 200px;
  padding: 0;
  
  .user-header {
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    border-bottom: 1px solid #eee;
    
    .user-info {
      flex: 1;
      overflow: hidden;
      
      .name {
        font-weight: 500;
        margin-bottom: 4px;
      }
      
      .email {
        font-size: 12px;
        color: #999;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
  
  .menu-items {
    padding: 8px 0;
    
    a {
      display: block;
      padding: 8px 16px;
      color: #333;
      text-decoration: none;
      transition: all 0.3s;
      
      &:hover {
        color: var(--primary-color);
        background: #f5f7fa;
      }
    }
  }
}

.login-options {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  
  #googleButton {
    width: 100%;
    display: flex;
    justify-content: center;
  }
}
</style>