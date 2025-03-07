<template>
  <header class="nav-header" :class="{ 'is-fixed': isScrolled }">
    <div class="container">
      <div class="header-content">
        <!-- Logo -->
        <div class="logo">
          <router-link to="/">
            <img src="@/assets/images/logo.png" alt="嘉立诚数控">
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

          <!-- 注册按钮 -->
          <div class="action-button">
            <router-link to="/register">
              <span>注册</span>
            </router-link>
          </div>

          <!-- 登录按钮 -->
          <div class="action-button">
            <router-link to="/login">
              <span>登录</span>
            </router-link>
          </div>

          <!-- 语言切换按钮 -->
          <div class="action-button has-submenu" 
               @click="toggleLanguage('language')"
               @mouseenter="showLanguage('language')"
               @mouseleave="hideLanguage('language')">
            <span class="menu-title">
              <el-icon><Language /></el-icon>
              {{ getLanguageLabel(currentLang) }}
              <el-icon class="submenu-icon" :class="{ 'is-active': activeLang === 'language' }">
                <ArrowUpBold v-if="activeLang === 'language'" />
                <ArrowDownBold v-else />
              </el-icon>
            </span>
            <div class="submenu language-submenu" :class="{ 'is-visible': activeLang === 'language' }">
              <!-- 亚洲语言 -->
              <div class="submenu-group">
                <div class="group-title">亚洲</div>
                <div class="submenu-item" @click="handleLanguageChange('zh')" :class="{ 'active': currentLang === 'zh' }">
                  中文（简体）
                </div>
                <div class="submenu-item" @click="handleLanguageChange('zh-TW')" :class="{ 'active': currentLang === 'zh-TW' }">
                  中文（繁體）
                </div>
                <div class="submenu-item" @click="handleLanguageChange('ja')" :class="{ 'active': currentLang === 'ja' }">
                  日本語
                </div>
                <div class="submenu-item" @click="handleLanguageChange('ko')" :class="{ 'active': currentLang === 'ko' }">
                  한국어
                </div>
              </div>
              <!-- 欧美语言 -->
              <div class="submenu-group">
                <div class="group-title">欧美</div>
                <div class="submenu-item" @click="handleLanguageChange('en')" :class="{ 'active': currentLang === 'en' }">
                  English
                </div>
                <div class="submenu-item" @click="handleLanguageChange('fr')" :class="{ 'active': currentLang === 'fr' }">
                  Français
                </div>
                <div class="submenu-item" @click="handleLanguageChange('de')" :class="{ 'active': currentLang === 'de' }">
                  Deutsch
                </div>
                <div class="submenu-item" @click="handleLanguageChange('es')" :class="{ 'active': currentLang === 'es' }">
                  Español
                </div>
              </div>
            </div>
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
import { ShoppingCart, Menu, Close, ArrowUpBold, ArrowDownBold, Language } from '@element-plus/icons-vue'

const route = useRoute()
const isScrolled = ref(false)
const isMenuOpen = ref(false)
const activeSubmenu = ref(null)
const activeSubmenu2 = ref(null)
const activeLang = ref(null)
const currentLang = ref(localStorage.getItem('preferred_language') || 'zh')
let isTranslating = ref(false)

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

// 语言菜单控制
const toggleLanguage = (menu) => {
  activeLang.value = activeLang.value === menu ? null : menu
}

const showLanguage = (menu) => {
  activeLang.value = menu
}

const hideLanguage = (menu) => {
  if (activeLang.value === menu) {
    activeLang.value = null
  }
}

// 语言配置
const languages = {
  // 亚洲语言
  'zh': {
    label: '中文（简体）',
    translateCode: 'chinese_simplified'
  },
  'zh-TW': {
    label: '中文（繁體）',
    translateCode: 'chinese_traditional'
  },
  'ja': {
    label: '日本語',
    translateCode: 'japanese'
  },
  'ko': {
    label: '한국어',
    translateCode: 'korean'
  },
  // 欧美语言
  'en': {
    label: 'English',
    translateCode: 'english'
  },
  'fr': {
    label: 'Français',
    translateCode: 'french'
  },
  'de': {
    label: 'Deutsch',
    translateCode: 'german'
  },
  'es': {
    label: 'Español',
    translateCode: 'spanish'
  }
}

// 获取语言显示标签
const getLanguageLabel = (lang) => {
  return languages[lang]?.label || languages['zh'].label
}

// 初始化翻译
const initTranslate = () => {
  if (window.translate) {
    // 设置翻译前回调
    window.translate.beforeTranslate = () => {
      isTranslating.value = true
    }

    // 设置翻译后回调
    window.translate.afterTranslate = () => {
      isTranslating.value = false
    }

    // 设置本地语言
    window.translate.language.setLocal('chinese_simplified')
    
    // 使用客户端翻译服务
    window.translate.service.use('client.edge')
    
    // 设置防抖
    window.translate.debounce = 300
    
    // 设置缓存
    window.translate.cache.enable = true
  }
}

// 处理语言切换
const handleLanguageChange = async (lang) => {
  if (isTranslating.value) return // 如果正在翻译，则不执行
  
  currentLang.value = lang
  activeLang.value = null  // 关闭下拉菜单
  
  try {
    if (window.translate) {
      // 添加加载状态
      isTranslating.value = true
      
      const translateCode = languages[lang]?.translateCode || 'chinese_simplified'
      await window.translate.changeLanguage(translateCode)
      
      // 保存语言选择
      localStorage.setItem('preferred_language', lang)
    }
  } catch (error) {
    console.error('翻译出错：', error)
  } finally {
    isTranslating.value = false
  }
  
  // 更新 HTML 标签的语言属性
  document.documentElement.lang = lang
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  // 初始化翻译
  initTranslate()
  
  // 恢复上次的语言选择
  const savedLang = localStorage.getItem('preferred_language')
  if (savedLang && savedLang !== 'zh') {
    // 延迟执行翻译，等待页面完全加载
    setTimeout(() => {
      currentLang.value = savedLang
      handleLanguageChange(savedLang)
    }, 500)
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
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

/* 添加翻译过渡样式 */
.translating {
  opacity: 0.5;
  pointer-events: none;
}

.translate-btn {
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.8);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
  }
  
  &.is-translating::after {
    opacity: 1;
    visibility: visible;
  }
}

.header-right {
  .action-button {
    &.has-submenu {
      position: relative;
      
      .menu-title {
        display: flex;
        align-items: center;
        gap: 4px;
        cursor: pointer;

        .el-icon {
          font-size: 16px;
        }

        .submenu-icon {
          font-size: 12px;
          transition: transform 0.3s ease;
          margin-left: 4px;

          &.is-active {
            transform: rotate(180deg);
          }
        }
      }

      .language-submenu {
        position: absolute;
        top: 100%;
        right: 0;  // 改为右对齐
        background: #fff;
        min-width: 120px;
        padding: 8px 0;
        margin-top: 4px;
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

        .submenu-item {
          padding: 8px 16px;
          font-size: 14px;
          color: #333;
          cursor: pointer;
          transition: all 0.3s ease;

          &:hover {
            color: var(--primary-color);
            background: #f5f7fa;
          }

          &.active {
            color: var(--primary-color);
            background: #f5f7fa;
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

// 响应式样式
@media (max-width: 768px) {
  .header-right {
    .action-button {
      &.has-submenu {
        .language-submenu {
          position: fixed;
          top: auto;
          right: 20px;
          bottom: 20px;
        }
      }
    }
  }
}

.language-submenu {
  .submenu-group {
    padding: 8px 0;
    border-bottom: 1px solid #eee;
    
    &:last-child {
      border-bottom: none;
    }
    
    .group-title {
      padding: 4px 16px;
      font-size: 12px;
      color: #999;
      background: #f5f7fa;
    }
    
    .submenu-item {
      padding: 8px 16px;
      font-size: 14px;
      color: #333;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        color: var(--primary-color);
        background: #f5f7fa;
      }

      &.active {
        color: var(--primary-color);
        background: #f5f7fa;
      }
    }
  }
}
</style>