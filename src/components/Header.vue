<template>
  <header class="header" :class="{ 'header-fixed': isScrolled }">
    <div class="container">
      <div class="header-content">
        <!-- Logo -->
        <div class="logo" @mouseenter="isHovered = true" @mouseleave="isHovered = false">
          <router-link to="/">
            <img :src="logoSrc" alt="嘉立创CNC" />
          </router-link>
        </div>

        <!-- 主导航 -->
        <nav class="nav-menu" :class="{ 'active': isMenuActive }">
          <div class="nav-list">
            <div class="nav-item" 
                v-for="(item, index) in navItems" 
                :key="index"
                @mouseenter="item.isHovered = true"
                @mouseleave="item.isHovered = false">
              <router-link :to="item.path">
                {{ item.name }}
                <i class="el-icon-arrow-down" v-if="item.children"></i>
              </router-link>
              <!-- 二级导航 -->
              <div class="sub-menu" v-if="item.children && item.isHovered">
                <router-link 
                  v-for="(subItem, subIndex) in item.children"
                  :key="subIndex"
                  :to="subItem.path"
                  class="sub-item">
                  {{ subItem.name }}
                </router-link>
              </div>
            </div>
          </div>
        </nav>

        <!-- 服务导航 -->
        <div class="service-menu">
          <div class="menu-item" 
               v-for="(menu, index) in serviceMenus" 
               :key="index"
               @mouseenter="menu.isHovered = true"
               @mouseleave="menu.isHovered = false">
            <span class="menu-title">{{ menu.title }}</span>
            <i class="el-icon-arrow-down"></i>
            <!-- 下拉菜单 -->
            <div class="dropdown-menu" v-show="menu.isHovered">
              <router-link 
                v-for="(item, idx) in menu.items" 
                :key="idx" 
                :to="item.path">
                {{ item.name }}
              </router-link>
            </div>
          </div>
        </div>

        <!-- 用户操作区 -->
        <div class="user-actions">
          <div class="cart-icon">
            <el-badge :value="cartCount" class="cart-badge">
              <i class="el-icon-shopping-cart-2"></i>
            </el-badge>
          </div>
          <div class="auth-buttons" v-if="!isLoggedIn">
            <router-link to="/register" class="register-btn">注册</router-link>
            <router-link to="/login" class="login-btn">登录</router-link>
          </div>
          <div class="user-info" v-else>
            <!-- 用户信息展示 -->
          </div>
        </div>

        <!-- 移动端菜单按钮 -->
        <div class="menu-toggle" @click="toggleMenu">
          <i class="el-icon-menu"></i>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const isScrolled = ref(false)
const isMenuActive = ref(false)
const isHovered = ref(false)
const cartCount = ref(0)
const isLoggedIn = ref(false)

// 导航菜单数据
const navItems = ref([
  {
    name: '在线报价',
    path: '/quote',
    isHovered: false
  },
  {
    name: 'CNC1元打样',
    path: '/sample',
    isHovered: false
  },
  {
    name: '领券中心',
    path: '/coupons',
    isHovered: false
  },
  {
    name: '材料介绍',
    path: '/materials',
    isHovered: false,
    children: [
      { 
        name: '金属材料', 
        path: '/materials/metal',
        children: [
          { name: '铝合金6061', path: '/materials/metal/aluminum-6061' },
          { name: '紫铜T2', path: '/materials/metal/copper-t2' },
          { name: '碳钢Q235', path: '/materials/metal/steel-q235' },
          { name: '不锈钢304', path: '/materials/metal/stainless-304' },
          { name: '镀锌板', path: '/materials/metal/galvanized' }
        ]
      },
      { 
        name: '塑料材料', 
        path: '/materials/plastic',
        children: [
          { name: '工程塑料-ABS', path: '/materials/plastic/abs' },
          { name: '亚克力', path: '/materials/plastic/acrylic' },
          { name: '电木', path: '/materials/plastic/bakelite' }
        ]
      },
      {
        name: '钣金材料',
        path: '/materials/sheet-metal',
        children: [
          { name: '冷轧板', path: '/materials/sheet-metal/cold-rolled' },
          { name: '热轧板', path: '/materials/sheet-metal/hot-rolled' },
          { name: '不锈钢板', path: '/materials/sheet-metal/stainless-steel' },
          { name: '铝板', path: '/materials/sheet-metal/aluminum' },
          { name: '镀锌板', path: '/materials/sheet-metal/galvanized' }
        ]
      }
    ]
  },
  {
    name: '服务指引',
    path: '/service-guidance',
    isHovered: false
  }
])

// Logo切换逻辑
const logoSrc = computed(() => {
  return isHovered.value 
    ? require('@/assets/images/arrow_down.png')
    : require('@/assets/images/arrow_up.png')
})

// 服务菜单数据
const serviceMenus = ref([
  {
    title: '服务指引',
    isHovered: false,
    items: [
      { name: '服务指引', path: '/service-guide' },
      { name: '客户评价', path: '/reviews' },
      { name: '技术专栏', path: '/tech-column' },
      { name: '技术论坛', path: '/forum' }
    ]
  },
  {
    title: '关于我们',
    isHovered: false,
    items: [
      { name: '公司动态', path: '/news' },
      { name: '公司简介', path: '/about' }
    ]
  },
  {
    title: '联系我们',
    isHovered: false,
    items: [
      { name: '联系方式', path: '/contact' }
    ]
  }
])

// 处理滚动事件
const handleScroll = () => {
  isScrolled.value = window.scrollY > 0
}

// 切换菜单显示
const toggleMenu = () => {
  isMenuActive.value = !isMenuActive.value
}

// 生命周期钩子
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style lang="scss" scoped>
/* 重置默认样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  list-style: none;
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 15px;
  }

  .header-content {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .logo {
    img {
      height: 40px;
      transition: all 0.3s ease;
    }
  }

  .nav-menu {
    .nav-list {
      display: flex;
      margin: 0;
      padding: 0;
      list-style: none;

      .nav-item {
        position: relative;
        margin: 0 15px;
        list-style: none;

        a {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 20px 0;
          color: #333;
          font-size: 14px;
          transition: color 0.3s;
          text-decoration: none;

          .el-icon-arrow-down {
            font-size: 12px;
            margin-left: 4px;
          }

          &:hover {
            color: #097df1;
          }
        }
      }
    }
  }

  .service-menu {
    display: flex;
    margin-left: 20px;
    list-style: none;

    .menu-item {
      position: relative;
      padding: 0 15px;
      cursor: pointer;
      list-style: none;

      .menu-title {
        font-size: 14px;
        color: #333;
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .dropdown-menu {
        position: absolute;
        top: 100%;
        left: 0;
        min-width: 120px;
        background: #fff;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
        border-radius: 4px;
        padding: 5px 0;
        display: none;
        list-style: none;

        a {
          display: block;
          padding: 8px 15px;
          color: #333;
          text-decoration: none;
          font-size: 14px;
          list-style: none;

          &:hover {
            background: #f5f7fa;
            color: #097df1;
          }
        }
      }

      &:hover {
        .menu-title {
          color: #097df1;
        }

        .dropdown-menu {
          display: block;
        }
      }
    }
  }

  .user-actions {
    display: flex;
    align-items: center;
    gap: 20px;

    .cart-icon {
      cursor: pointer;
      
      .el-badge {
        .el-icon-shopping-cart-2 {
          font-size: 20px;
          color: #666;
        }
      }
    }

    .auth-buttons {
      display: flex;
      gap: 15px;

      a {
        text-decoration: none;
        font-size: 14px;
        
        &.register-btn {
          color: #333;
        }

        &.login-btn {
          color: #097df1;
        }
      }
    }
  }

  .menu-toggle {
    display: none;
  }

  @media (max-width: 768px) {
    .nav-menu,
    .service-menu {
      display: none;
    }

    .menu-toggle {
      display: block;
      font-size: 24px;
      cursor: pointer;
    }
  }
}

// 二级导航样式
.sub-menu {
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 150px;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  padding: 5px 0;
  z-index: 1000;
  list-style: none;

  .sub-item {
    position: relative;
    display: block;
    padding: 8px 20px;
    color: #333;
    font-size: 14px;
    white-space: nowrap;
    transition: all 0.3s;
    text-decoration: none;
    list-style: none;

    &:hover {
      color: #097df1;
      background: #f5f7fa;
    }

    // 添加箭头图标
    &.has-children {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-right: 30px;

      &::after {
        content: '>';
        position: absolute;
        right: 10px;
        font-size: 12px;
        color: #999;
      }
    }

    // 三级菜单
    .third-menu {
      position: absolute;
      top: 0;
      left: 100%;
      min-width: 150px;
      background: #fff;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      border-radius: 4px;
      padding: 5px 0;
      display: none;
      z-index: 1001;

      a {
        display: block;
        padding: 8px 20px;
        color: #333;
        font-size: 14px;
        white-space: nowrap;
        transition: all 0.3s;
        text-decoration: none;

        &:hover {
          color: #097df1;
          background: #f5f7fa;
        }
      }
    }

    &:hover {
      .third-menu {
        display: block;
      }
    }
  }
}
</style>