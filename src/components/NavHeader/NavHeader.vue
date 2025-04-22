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

        <!-- 主导航菜单 (Desktop) -->
        <nav class="nav-menu" :class="{ open: isMenuOpen }">
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

        <!-- 右侧功能区 (Desktop) -->
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
    <!-- 移动端菜单 -->
    <transition name="fade">
      <div class="mobile-menu" v-if="isMenuOpen">
        <ul class="mobile-menu-list">
          <li><router-link to="/quote" @click="toggleMenu">在线报价</router-link></li>
          <li><router-link to="/sales-promotion" @click="toggleMenu">CNC1元打样</router-link></li>
          <li>
            <el-icon style="color: red"><Flag /></el-icon>
            <router-link to="/coupons" @click="toggleMenu">领券中心</router-link>
          </li>
          <li><router-link to="/materials" @click="toggleMenu">材料介绍</router-link></li>
          <li>
            <details>
              <summary>服务指引</summary>
              <router-link to="/service-guidance" @click="toggleMenu">服务指引</router-link>
              <router-link to="/user-evaluation" @click="toggleMenu">客户评价</router-link>
              <router-link to="/technical-column" @click="toggleMenu">技术专栏</router-link>
              <router-link to="/forum" @click="toggleMenu">技术论坛</router-link>
            </details>
          </li>
          <li>
            <details>
              <summary>关于我们</summary>
              <router-link to="/news" @click="toggleMenu">公司动态</router-link>
              <router-link to="/about" @click="toggleMenu">公司简介</router-link>
            </details>
          </li>
          <li><router-link to="/contact" @click="toggleMenu">联系我们</router-link></li>
        </ul>
        <div class="mobile-actions">
          <router-link to="/cart" class="action-button" @click="toggleMenu">
            <el-icon><ShoppingCart /></el-icon>
            <span>购物车</span>
          </router-link>
          <div id="translate-mobile" class="translate-select-language"></div>
          <div class="user-area">
            <template v-if="!userStore.isLoggedIn">
              <el-button class="action-button" @click="$router.push('/register');toggleMenu()">注册</el-button>
              <el-button class="action-button" @click="$router.push('/login');toggleMenu()">登录</el-button>
            </template>
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
      </div>
    </transition>
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
import Profile from '@/views/Profile/Profile.vue'
import axios from 'axios'
const router = useRouter()
const userStore = useUserStore()

const isScrolled = ref(false)
const isMenuOpen = ref(false)
const activeSubmenu2 = ref(null)
const isUserMenuVisible = ref(false)
const activeSubmenu = ref(null)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}
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
  window.addEventListener('scroll', handleScroll)
  if (window.google && window.google.accounts) {
    initializeGoogleLogin()
  } else {
    window.onload = () => {
      initializeGoogleLogin()
    }
  }
})
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
const initializeGoogleLogin = () => {
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
    width: 100%;
    max-width: 1200px; // 可根据需要调整最大宽度
    margin: 0 auto;
    padding: 0 20px;
    box-sizing: border-box;
  }
  .header-content {
    display: flex;
    align-items: center;
    height: 100px;
    width: 100%;
    min-width: 0;
  }
  .logo {
    height: 40px;
    margin-right: 40px;
    img {
      height: 100%;
      width: auto;
      display: block;
    }
  }
  .nav-menu {
    flex: 1;
    min-width: 0;
    .menu-list {
      display: flex;
      gap: 20px;
      list-style-type: none;
      margin: 0;
      padding: 0;
    }
    .menu-item {
      color: #333;
      font-size: 16px;
      text-decoration: none;
      padding: 8px 0;
      cursor: pointer;
      width: 100px;
      min-width: 0;
      transition: color 0.3s ease;
      text-align: center;
      a,
      .menu-title {
        color: #333;
        text-decoration: none;
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
            text-decoration: none;
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

.menu-toggle {
  display: none;
  cursor: pointer;
  margin-left: 16px;
  .el-icon {
    font-size: 28px;
  }
}

@media (max-width: 900px) {
  .header-content {
    height: 60px;
  }
  .logo {
    margin-right: 12px;
    img {
      height: 32px;
    }
  }
  .nav-menu {
    display: none;
  }
  .header-right {
    display: none;
  }
  .menu-toggle {
    display: block;
  }
}

/* Mobile menu styles */
.mobile-menu {
  position: fixed;
  top: 60px;
  left: 0;
  width: 100vw;
  background: #fff;
  z-index: 9999;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  padding: 16px 0 0 0;
  .mobile-menu-list {
    list-style: none;
    margin: 0;
    padding: 0 24px;
    li {
      margin-bottom: 16px;
      a {
        color: #333;
        text-decoration: none;
        font-size: 18px;
        display: block;
        padding: 8px 0;
        &:hover {
          color: var(--primary-color);
        }
      }
      details {
        summary {
          font-size: 18px;
          cursor: pointer;
          outline: none;
          margin-bottom: 8px;
        }
        router-link {
          padding-left: 16px;
        }
      }
    }
  }
  .mobile-actions {
    padding: 16px 24px 24px 24px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    .action-button {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      width: 100%;
      border: 1px solid var(--border-color);
      border-radius: 4px;
      padding: 8px 12px;
      background: #fff;
      color: #333;
      text-decoration: none;
      font-size: 16px;
      gap: 8px;
      &:hover {
        color: var(--primary-color);
        border-color: var(--primary-color);
      }
      .el-icon {
        font-size: 20px;
      }
    }
    .translate-select-language {
      margin: 8px 0;
      text-align: left;
    }
    .user-area {
      display: flex;
      flex-direction: column;
      gap: 8px;
      .action-button {
        width: 100%;
        justify-content: flex-start;
      }
      .user-info {
        gap: 8px;
        font-size: 16px;
      }
    }
  }
}

/* Fade transition for mobile menu */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>