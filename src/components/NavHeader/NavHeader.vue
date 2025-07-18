<template>
  <header class="nav-header" :class="{ 'is-fixed': isScrolled }">
    <div class="container">
      <div class="header-content">
        <!-- Logo -->
        <div class="logo">
          <router-link to="/">
            <!-- Keeping logo.png as it is, although image shows 'Tongtron' -->
            <img src="@/assets/images/logo.png" alt="SmartCNC">
          </router-link>
        </div>

        <!-- 主导航菜单 (Desktop) -->
        <nav class="nav-menu">
          <ul class="menu-list">
            <li class="menu-item">
              <router-link to="/quote">在线报价</router-link>
            </li>
            <li class="menu-item">
              <router-link to="/materials">材料介绍</router-link>
            </li>
            <li class="menu-item">
              <router-link to="/cnc_order">我的订单</router-link>
            </li>
            
            <!-- 购物车按钮 - 添加 'shopping-cart-item' 类用于右对齐 -->
            <li class="menu-item shopping-cart-item">
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
                <!-- START MODIFICATION -->
                <el-dropdown trigger="hover" @command="handleCommand">
                  <!-- Dropdown Trigger -->
                  <div class="user-info">
                    <el-avatar 
                      :size="32" 
                      :src="userStore.user.picture" 
                    />
                    <span class="username">{{ userStore.user.user_name }}</span>
                    <!-- Add an arrow icon to indicate dropdown -->
                    <el-icon class="el-icon--right"><ArrowDown /></el-icon>
                  </div>
                  <!-- Dropdown Menu -->
                  <template #dropdown>
                    <el-dropdown-menu>
                      <!-- <el-dropdown-item command="profile">个人中心</el-dropdown-item>
                      <el-dropdown-item command="orders">我的订单</el-dropdown-item> -->
                      <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
                <!-- END MODIFICATION -->
              </template>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </header>
  <!-- <div class="login-options">
    <div id="googleButton"></div>
  </div> -->
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick, onUpdated } from 'vue'
import { useRouter } from 'vue-router'
// Import ElDropdown components and ArrowDown icon
import { ElDropdown, ElDropdownMenu, ElDropdownItem } from 'element-plus'
import { ShoppingCart, ArrowUpBold, ArrowDownBold, Flag, ArrowDown } from '@element-plus/icons-vue' // Ensure ArrowDown is imported
import { useUserStore } from '@/store/user'
import { ElMessage } from 'element-plus'
// import Profile from '@/views/Profile/Profile.vue' // Profile component is no longer needed here
import axios from 'axios'
import service from '@/utils/request'

const router = useRouter()
const userStore = useUserStore()

const isScrolled = ref(false)
const activeSubmenu2 = ref(null)
const isUserMenuVisible = ref(false) // This might become redundant with el-dropdown
const activeSubmenu = ref(null) // This might become redundant with el-dropdown

const handleScroll = () => {
  isScrolled.value = window.scrollY > 0
}

// These functions for toggling submenus might become redundant if all dropdowns are el-dropdown
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

watch(
  () => userStore.isLoggedIn,
  (isLoggedIn) => {
    // 登录状态变化时的处理
  }
)

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
  
  // 初始化翻译功能
  if (window.translate) {
    // ***** START OF MODIFICATION *****
    // 明确使用 window.translate 来避免 ESLint 报错
    window.translate.selectLanguageTag.languages = [
      'chinese_simplified', // 简体中文
      'english',            // 英语
      'japanese',           // 日语
      'korean',             // 韩语
      'german',             // 德语
      'french',             // 法语
      'russian',            // 俄语
      'spanish',            // 西班牙语
      'arabic',             // 阿拉伯语
      'hindi',              // 印地语
      'portuguese',         // 葡萄牙语
    ];

    // 设置本地语种（当前网页的语种）
    window.translate.language.setLocal('chinese_simplified');
    
    // 启用翻译过程中的遮罩提示
    window.translate.progress.api.startUITip();
    
    // 开启页面变化监控，自动翻译
    window.translate.listener.start();
    
    // 执行翻译初始化
    window.translate.execute();
    
    // ***** END OF MODIFICATION *****
    console.log('translate.js initialized with a specific language list.');
  } else {
    console.error('translate.js library not loaded.');
  }

  // 初始化谷歌登录
  initializeGoogleLogin()
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const initializeGoogleLogin = () => {
  // 确保 gapi 和 google.accounts.id 都存在
  if (window.google && window.google.accounts && window.google.accounts.id) {
    try {
      window.google.accounts.id.initialize({
        client_id: 'your-google-client-id',
        callback: handleCredentialResponse
      });
      window.google.accounts.id.renderButton(
        document.getElementById('googleButton'),
        { 
          theme: 'outline', 
          size: 'large',
          text: '使用Google账号登录',
          width: 250
        }
      );
    } catch (error) {
       console.error("Google Login Error:", error);
    }
  } else {
    console.warn('Google Identity Services (GIS) library not loaded. Google login button will not render.');
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

nextTick(() => {
  if (window.translate && typeof window.translate.execute === 'function') {
    window.translate.execute();
    setTimeout(() => {
      window.translate.execute();
    }, 500);
    if (window.translate.listener && typeof window.translate.listener.start === 'function') {
      window.translate.listener.start();
    }
  } else {
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
  box-shadow: none;
  width: 100%;
  min-width: 0;
  padding: 0;

  .container {
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
    padding: 0 15px;
    box-sizing: border-box;

    @media (max-width: 1200px) {
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
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: auto;
    padding: 15px 0;
    flex-wrap: nowrap;
  }

  .logo {
    flex: 0 0 auto;
    height: 28px;
    margin-right: 40px;
    display: flex;
    align-items: center;

    img {
      height: 100%;
      width: auto;
      display: block;
      max-width: 120px;

      @media (max-width: 768px) {
        max-width: 80px;
        height: 24px;
      }
      @media (max-width: 480px) {
        max-width: 60px;
        height: 20px;
      }
    }
  }

  .nav-menu {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    min-width: 0;

    .menu-list {
      display: flex;
      flex-wrap: nowrap;
      gap: 24px;
      list-style-type: none;
      margin: 0;
      padding: 0;
      align-items: center;
      width: 100%;

      @media (max-width: 768px) {
        gap: 15px;
      }
      @media (max-width: 480px) {
        gap: 10px;
      }
    }

    .menu-item {
      color: #666;
      font-size: 15px;
      text-decoration: none;
      padding: 0;
      white-space: nowrap;
      text-align: center;
      transition: color 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;

      a,
      .menu-title {
        color: inherit;
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

      // 购物车项及后续项目右对齐
      &.shopping-cart-item {
        margin-left: auto;
      }

      .el-icon {
        font-size: 1.1em;
        margin-right: 4px;
      }
    }
  }
}

/* 无边框按钮样式 */
.action-button.no-border {
  border: none !important;
  background: transparent !important;
  box-shadow: none !important;
  outline: none !important;
  color: #666;
  padding: 0;
  transition: color 0.3s ease;
  font-size: inherit;
  display: flex;
  align-items: center;

  &:hover,
  &:focus {
    background: transparent !important;
    color: var(--primary-color) !important;
  }
}

/* 购物车按钮特定样式 */
.menu-item.shopping-cart-item .action-button {
  color: var(--primary-color);

  &:hover {
    color: var(--primary-color) !important;
  }
}

.user-area {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: inherit;

  /* Style for el-dropdown trigger */
  .user-info {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    padding: 4px 6px;
    border-radius: 4px;
    font-size: inherit;
    color: #666; /* Ensure text color is consistent */

    span {
      color: inherit; /* Inherit color from parent .user-info */
    }

    .el-icon--right {
      margin-left: 4px; /* Adjust spacing for the dropdown arrow */
      margin-right: 0; /* Override default margin-right if any */
      font-size: 1em; /* Adjust icon size if needed */
    }
  }

  .user-info:hover {
    background-color: #f5f7fa;
    color: var(--primary-color); /* Highlight on hover */

    .username {
      color: var(--primary-color);
    }
  }

  .username {
    max-width: 80px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

/* No longer needed as Profile component is removed */
// .user-submenu {
//   width: 200px;
//   padding: 0;
//   font-size: clamp(12px, 1vw, 16px);

//   .user-header {
//     padding: 1em;
//     display: flex;
//     align-items: center;
//     gap: 0.7vw;
//     border-bottom: 1px solid #eee;

//     .user-info {
//       flex: 1;
//       overflow: hidden;

//       .name {
//         font-weight: 500;
//         margin-bottom: 4px;
//       }

//       .email {
//         font-size: 0.8em;
//         color: #999;
//         overflow: hidden;
//         text-overflow: ellipsis;
//       }
//     }
//   }

//   .menu-items {
//     padding: 0.5em 0;

//     a {
//       display: block;
//       padding: 0.5em 1em;
//       color: #333;
//       text-decoration: none;
//       transition: all 0.3s;
//       font-size: inherit;

//       &:hover {
//         color: var(--primary-color);
//         background: #f5f7fa;
//       }
//     }
//   }
// }

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

/* 响应式调整 */
@media (max-width: 768px) {
  .nav-header .logo {
    margin-right: 20px;
    height: 24px;

    img {
      max-width: 80px;
      height: 24px;
    }
  }

  .header-content {
    padding: 10px 0;
  }

  .nav-header .nav-menu .menu-list {
    gap: 15px;
    font-size: 14px;
  }

  .nav-header .menu-item {
    font-size: 14px;
  }

  .user-info .username {
    max-width: 60px;
  }
}

@media (max-width: 480px) {
  .nav-header .logo {
    margin-right: 10px;
    height: 20px;

    img {
      max-width: 60px;
      height: 20px;
    }
  }

  .header-content {
    padding: 8px 0;
  }

  .nav-header .nav-menu .menu-list {
    gap: 8px;
    font-size: 13px;
  }

  .nav-header .menu-item {
    font-size: 13px;
  }

  .user-info .username {
    max-width: 40px;
  }
}
</style>