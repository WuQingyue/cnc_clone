<template>
  <header class="nav-header" :class="{ 'is-fixed': isScrolled }">
    <div class="container">
      <div class="header-content">
        <!-- Logo -->
        <router-link to="/" class="logo">
          <img src="@/assets/images/logo.png" alt="嘉立诚数控">
        </router-link>

        <!-- 主导航菜单 -->
        <nav class="nav-menu">
          <ul class="menu-list">
            <li class="menu-item">
              <router-link to="/quote">在线报价</router-link>
            </li>
            <li class="menu-item">
              <router-link to="/sample">CNC1元打样</router-link>
            </li>
            <li class="menu-item">
              <router-link to="/coupons">领券中心</router-link>
            </li>
            <li class="menu-item">
              <router-link to="/materials">材料介绍</router-link>
            </li>
            <!-- 服务指引下拉菜单 -->
            <li class="menu-item has-submenu">
              <span class="menu-title">服务指引</span>
              <div class="submenu">
                <router-link to="/guide">服务指引</router-link>
                <router-link to="/reviews">客户评价</router-link>
                <router-link to="/tech">技术专栏</router-link>
                <router-link to="/forum">技术论坛</router-link>
              </div>
            </li>
            <!-- 关于我们下拉菜单 -->
            <li class="menu-item has-submenu">
              <span class="menu-title">关于我们</span>
              <div class="submenu">
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
          <div class="cart-icon">
            <router-link to="/cart">
              <el-icon><ShoppingCart /></el-icon>
              <span>购物车</span>
            </router-link>
          </div>
          <div class="user-actions">
            <router-link to="/register" class="register-btn">注册</router-link>
            <router-link to="/login" class="login-btn">登录</router-link>
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
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { ShoppingCart, Menu, Close } from '@element-plus/icons-vue'

const route = useRoute()
const isScrolled = ref(false)
const isMenuOpen = ref(false)

// 检查当前路径
const isCurrentPath = (path) => {
  return route.path === path
}

// 切换移动端菜单
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

// 监听滚动事件
const handleScroll = () => {
  isScrolled.value = window.scrollY > 0
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style lang="scss" scoped>
.nav-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 15px;
  }

  .header-content {
    display: flex;
    align-items: center;
    height: 60px;
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
    }

    .menu-item {
      position: relative;

      a, .menu-title {
        color: #333;
        font-size: 14px;
        text-decoration: none;
        padding: 8px 0;
        cursor: pointer;

        &:hover {
          color: var(--primary-color);
        }
      }

      &.has-submenu {
        &:hover {
          .submenu {
            display: block;
          }
        }
      }
    }

    .submenu {
      display: none;
      position: absolute;
      top: 100%;
      left: 0;
      background: white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      border-radius: 4px;
      padding: 8px 0;
      min-width: 120px;

      a {
        display: block;
        padding: 8px 16px;
        white-space: nowrap;

        &:hover {
          background: #f5f7fa;
        }
      }
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 20px;

    .cart-icon {
      a {
        display: flex;
        align-items: center;
        gap: 4px;
        color: #333;
        text-decoration: none;

        &:hover {
          color: var(--primary-color);
        }
      }
    }

    .user-actions {
      display: flex;
      gap: 16px;

      a {
        color: #333;
        text-decoration: none;
        font-size: 14px;

        &:hover {
          color: var(--primary-color);
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
  }
}
</style>