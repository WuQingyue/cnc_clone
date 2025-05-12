
<template>
  <header class="nav-header" :class="{ 'is-fixed': isScrolled }">
    <div class="container">
      <div class="header-content">
        <!-- Logo -->
        <div class="logo">
          <router-link to="/">
            <img src="@/assets/images/logo.jpg" alt="SmartCNC">
          </router-link>
        </div>

        <!-- 主导航菜单 (Desktop) -->
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
            <!-- 购物车按钮 -->
            <li class="menu-item">
              <el-button class="action-button no-border" @click="$router.push('/cart')" type="default">
                <el-icon><ShoppingCart /></el-icon>
                <span>购物车</span>
              </el-button>
            </li>
            <!-- 语言切换按钮 -->
            <li class="menu-item">
              <div id="translate" class="translate-select-language"></div>
            </li>
            <!-- 用户区域 -->
            <li class="menu-item user-area">
              <!-- 未登录状态 -->
              <template v-if="!userStore.isLoggedIn">
                <el-button class="action-button no-border" @click="$router.push('/register')">注册</el-button>
                <el-button class="action-button no-border" @click="$router.push('/login')">登录</el-button>
              </template>
              <!-- 已登录状态 -->
              <template v-else>
                <Profile>
                  <template #trigger>
                    <div class="user-info">
                      <el-avatar 
                        :size="32" 
                        :src="userStore.user.picture" 
                      />
                      <span>{{ userStore.user.user_name }}</span>
                    </div>
                  </template>
                </Profile>
              </template>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </header>
  <div class="login-options">
    <div id="googleButton"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ShoppingCart, ArrowUpBold, ArrowDownBold, Flag } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/user'
import { ElMessage } from 'element-plus'
import Profile from '@/views/Profile/Profile.vue'
import axios from 'axios'
const router = useRouter()
const userStore = useUserStore()

const isScrolled = ref(false)
const activeSubmenu2 = ref(null)
const isUserMenuVisible = ref(false)
const activeSubmenu = ref(null)

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

import service from '@/utils/request'
const handleCommand = async (command) => {
  switch (command) {
    case 'profile':
      router.push('/profile')
      break
    case 'orders':
      router.push('/orders')
      break
    case 'logout':
      try {
        const response = await service.post(
          '/api/login/logout',     
          {},  
          {
            withCredentials: true,
            headers: { 'Content-Type': 'application/json' }
          }
        )
        if (response.data.success) {
          userStore.clearUser()
          localStorage.removeItem('userInfo')
          sessionStorage.removeItem('userInfo')
          delete axios.defaults.headers.common['Authorization']
          ElMessage.success('退出成功')
          router.push('/login')
        } else {
          ElMessage.error(response.data.message || '退出失败，请重试')
        }
      } catch (error) {
        ElMessage.error(error.response?.data?.detail || '退出失败，请重试')
      }
      break
  }
}

onMounted(() => {
  checkLoginStatus()
});
const checkLoginStatus = async () => {
  const uesr_Info = await service.get(
      '/api/login/check_login',
      { withCredentials: true }
  )
  if(uesr_Info.status == 200){
    userStore.setUser(uesr_Info.data)
  }else{
    ElMessage.error('用户登录已失效，请重新登录')
    router.push('/login')
  }
}

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
const initializeGoogleLogin = () => {
   if (window.gapi) {
    window.gapi.load('auth2', () => {
      const auth2 = window.gapi.auth2.init({
        client_id: 'your-google-client-id'
      });
      
    window.google.accounts.id.initialize({
      client_id: 'your-google-client-id',
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
    });
  }
}
const handleCredentialResponse = async (response) => {
  try {
    await userStore.handleGoogleLogin(response)
    router.push('/')
  } catch (error) {
    console.error('登录失败：', error)
  }
}
import { nextTick, onUpdated } from 'vue'

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

onUpdated(() => {
  if (window.translate && typeof window.translate.execute === 'function') {
    window.translate.execute();
  }
});
</script>
<style lang="scss" scoped>
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
    width: 100%;
    min-width: 0;
    padding: 0;
  
    .container {
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;
      padding: 0 15px;
      box-sizing: border-box;
      // 不设置高度
      @media (max-width: 1200px) {
        max-width: 100vw;
        padding: 0 8px;
      }
      @media (max-width: 768px) {
        padding: 0 4px;
      }
      @media (max-width: 480px) {
        padding: 0 2vw;
      }
    }
    .header-content {
      display: flex;
      flex-wrap: wrap; // 允许内容换行
      align-items: center;
      width: 100%;
      min-width: 0;
      height: auto; // 高度自适应
      padding: 8px 0;
      gap: 0.5vw;
      // 不设置min/max-height
    }
    .logo {
      flex: 0 0 auto;
      height: 40px;
      margin-right: 2vw;
      display: flex;
      align-items: center;
      img {
        height: 100%;
        width: auto;
        display: block;
        max-width: 120px;
        @media (max-width: 768px) {
          max-width: 80px;
        }
        @media (max-width: 480px) {
          max-width: 60px;
        }
      }
    }
    .nav-menu {
      flex: 1 1 200px;
      min-width: 0;
      .menu-list {
        display: flex;
        flex-wrap: wrap; // 允许菜单项换行
        gap: 1vw;
        list-style-type: none;
        margin: 0;
        padding: 0;
        align-items: center;
        width: 100%;
        @media (max-width: 768px) {
          gap: 0.5vw;
        }
        @media (max-width: 480px) {
          gap: 0.2vw;
        }
      }
      .menu-item {
        color: #333;
        font-size: clamp(12px, 1.1vw, 16px);
        text-decoration: none;
        padding: 0 0.6vw;
        min-width: 0;
        white-space: nowrap;
        text-align: center;
        transition: color 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 0 1 auto;
        margin-bottom: 4px; // 换行时有间距
        a,
        .menu-title {
          color: #333;
          text-decoration: none;
          white-space: nowrap;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: inherit;
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
            gap: 0.3vw;
            .submenu-icon {
              font-size: 0.9em;
              transition: transform 0.3s ease;
              margin-left: 0.3vw;
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
            min-width: 120px;
            padding: 0.4em 0;
            border-radius: 4px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
            opacity: 0;
            visibility: hidden;
            transform: translateY(10px);
            transition: all 0.3s ease;
            z-index: 1000;
            font-size: clamp(12px, 1vw, 14px);
            &.is-visible {
              opacity: 1;
              visibility: visible;
              transform: translateY(0);
            }
            a {
              display: block;
              padding: 0.4em 1em;
              color: #333;
              text-decoration: none;
              transition: all 0.3s ease;
              font-size: inherit;
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
        &.user-area {
          gap: 0.5vw;
          .action-button {
            margin-left: 0;
          }
        }
      }
    }
  }
  
  /* 新增：无边框按钮样式 */
  .action-button.no-border {
    border: none !important;
    background: transparent !important;
    box-shadow: none !important;
    outline: none !important;
    color: #333;
    padding: 0 0.7vw;
    transition: background 0.2s;
    font-size: inherit;
  }
  .action-button.no-border:hover,
  .action-button.no-border:focus {
    background: #f5f7fa !important;
    color: var(--primary-color) !important;
  }
  
  .user-area {
    display: flex;
    align-items: center;
    gap: 0.5vw;
    font-size: inherit;
  }
  .user-info {
    display: flex;
    align-items: center;
    gap: 0.5vw;
    cursor: pointer;
    padding: 0.2em 0.5em;
    border-radius: 4px;
    font-size: inherit;
  }
  .user-info:hover {
    background-color: #f5f7fa;
  }
  .user-info .username {
    max-width: 80px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .user-submenu {
    width: 200px;
    padding: 0;
    font-size: clamp(12px, 1vw, 16px);
    .user-header {
      padding: 1em;
      display: flex;
      align-items: center;
      gap: 0.7vw;
      border-bottom: 1px solid #eee;
      .user-info {
        flex: 1;
        overflow: hidden;
        .name {
          font-weight: 500;
          margin-bottom: 4px;
        }
        .email {
          font-size: 0.8em;
          color: #999;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
    .menu-items {
      padding: 0.5em 0;
      a {
        display: block;
        padding: 0.5em 1em;
        color: #333;
        text-decoration: none;
        transition: all 0.3s;
        font-size: inherit;
        &:hover {
          color: var(--primary-color);
          background: #f5f7fa;
        }
      }
    }
  }
  .login-options {
    margin-top: 1.5vw;
    display: flex;
    justify-content: center;
    font-size: inherit;
    #googleButton {
      width: 100%;
      display: flex;
      justify-content: center;
    }
  }
  
  /* 小屏幕适配，减小字体和间距 */
  @media (max-width: 768px) {
    .nav-header .logo {
      margin-right: 1vw;
      height: 32px;
      img {
        max-width: 60px;
      }
    }
    .nav-header .nav-menu .menu-list {
      gap: 0.3vw;
    }
    .nav-header .menu-item {
      font-size: clamp(11px, 2.5vw, 14px);
      padding: 0 0.4vw;
    }
    .user-info .username {
      max-width: 60px;
    }
  }
  @media (max-width: 480px) {
    .nav-header .logo {
      margin-right: 0.5vw;
      height: 24px;
      img {
        max-width: 40px;
      }
    }
    .nav-header .menu-item {
      font-size: clamp(10px, 3vw, 13px);
      padding: 0 0.2vw;
    }
    .user-info .username {
      max-width: 40px;
    }
  }
</style>