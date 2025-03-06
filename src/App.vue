<template>
  <div id="app">
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
</template>

<script>
import NavHeader from '@/components/NavHeader.vue'
import NavFooter from '@/components/Footer.vue'

export default {
  name: 'App',
  components: {
    NavHeader,
    NavFooter
  }
}
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