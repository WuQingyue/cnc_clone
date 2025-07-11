<template>
  <!-- 新增：无权限遮罩弹窗 -->
  <el-dialog
    v-model="showNoPermission"
    title="权限不足"
    width="350px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    align-center
    style="z-index: 9999"
    lock-scroll
    append-to-body
    >
    <div style="text-align:center;font-size:18px;color:#d32f2f;font-weight:bold;margin-bottom:24px;">
      您的权限不足
    </div>
    <el-button
      type="danger"
      style="width:100%;color:white;font-weight:bold"
      @click="returnHome"
    >返回首页</el-button>
  </el-dialog>

  <div class="admin-container">
    <!-- 左侧导航栏 -->
    <div class="sidebar">
      <div class="logo">
        <!-- Replaced img with SVG for Tongtron Logo -->
        <!-- 核心修改：调整 viewBox 高度为 65，为 'g' 字母的下伸部分留出空间 -->
        <svg class="logo-svg" viewBox="0 0 150 65">
          <!-- 调整图标颜色为更亮的蓝色 #6CB2ED -->
          <g fill="#6CB2ED">
            <!-- Left horizontal bar of the 'T' top -->
            <rect x="60" y="0" width="10" height="3" rx="1.5" ry="1.5"/>
            <!-- Right horizontal bar of the 'T' top -->
            <rect x="80" y="0" width="10" height="3" rx="1.5" ry="1.5"/>
            <!-- Vertical bar of the 'T' -->
            <rect x="73.5" y="0" width="3" height="25" rx="1.5" ry="1.5"/>

            <!-- Dots -->
            <circle cx="60" cy="1.5" r="2.5"/> <!-- Leftmost dot -->
            <circle cx="90" cy="1.5" r="2.5"/> <!-- Rightmost dot -->
            <circle cx="75" cy="25" r="2.5"/>  <!-- Bottom dot -->
          </g>
          <!-- 核心修改：调整 text 的 y 坐标为 55，同时优化 font-family 提高可读性 -->
          <text x="75" y="55" font-family="Verdana, Arial, sans-serif" font-size="28" fill="#FFFFFF" text-anchor="middle">Tongtron</text>
        </svg>
      </div>
      <div
        class="nav-item"
        v-for="item in navItems"
        :key="item.name"
        :class="{ active: currentComponent === item.component }"
        @click="navigate(item)"
      >
        <el-icon :component="item.icon" />
        <span>{{ item.name }}</span>
      </div>
    </div>

    <!-- 右侧内容区域 -->
    <div class="content">
      <!-- 顶部栏 -->
      <div class="admin-header">
        <div class="header-left">
          <h2>管理员控制台</h2>
        </div>
        <div class="header-right">
          <el-dropdown @command="handleCommand">
            <span class="admin-info">
              Admin
              <el-icon><CaretBottom /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>

      <!-- 组件显示区域 -->
      <div class="component-wrapper">
        <component
          v-if="permissionChecked && !showNoPermission"
          :is="currentComponent"
          :data="componentData"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
// 引入新的图标 Histogram (柱状图)
import { Search, CaretBottom, Document, List, User, Truck, Histogram } from '@element-plus/icons-vue'
import { ElMessage, ElDialog, ElButton, ElIcon, ElDropdown, ElDropdownMenu, ElDropdownItem } from 'element-plus'
import axios from 'axios'

import DataDashboard from '@/components/SignIn/DataDashboard.vue'
import OrderInfo from '@/components/SignIn/OrderInfo.vue'
import UserInfo from '@/components/SignIn/UserInfo.vue'
import LogisticsInfo from '@/components/SignIn/LogisticsInfo.vue'

// 导航项
const navItems = [
  // 数据看板图标更换为 Histogram
  { name: '数据看板', component: DataDashboard, icon: Histogram },
  { name: '订单信息', component: OrderInfo, icon: List },
  { name: '用户信息', component: UserInfo, icon: User },
  { name: '物流信息', component: LogisticsInfo, icon: Truck }
]

const currentComponent = ref(DataDashboard)
const componentData = ref(null) // 用于存储从后端获取的数据

// 导航到指定组件
const navigate = async (item) => {
  currentComponent.value = item.component
  // 这里可以根据需要添加对应组件的数据获取逻辑
  if (item.name === '数据看板') {
    // await fetchDashboardData();
  } else {
    componentData.value = null // 清空数据
  }
}

// 处理下拉菜单命令
const handleCommand = (command) => {
  if (command === 'logout') {
    // 清除管理员登录状态
    localStorage.removeItem('adminToken')
    // 关闭当前标签页
    window.close()
  }
}

// 新增：权限弹窗相关
const showNoPermission = ref(false)
const permissionChecked = ref(false)
const checkPermission = async () => {
  try {
    const res = await axios.get('/api/login/check-permission', {
      withCredentials: true
    })
    if (!res.data.success) {
      showNoPermission.value = true
    }
  } catch (e) {
    // 假设网络错误也表示无权限
    showNoPermission.value = true
  } finally {
    permissionChecked.value = true
  }
}

const returnHome = () => {
  window.location.href = '/'
}

onMounted(() => {
  checkPermission()
  // 可以在这里根据当前路由或默认组件预加载数据
});
</script>

<style scoped>
/* 全局容器，设置整个页面的背景色 */
.admin-container {
  display: flex;
  min-height: 100vh;
  background-color: #f5f7fa; /* 页面整体的浅灰背景 */
}

/* 左侧导航栏 */
.sidebar {
  width: 240px; /* 进一步增加宽度，提供更多空间 */
  background-color: #2a3249; /* 更专业、深沉的蓝灰色 */
  color: white;
  display: flex;
  flex-direction: column;
  padding: 20px 0; /* 垂直内边距 */
  box-shadow: 4px 0 12px rgba(0, 0, 0, 0.1); /* 柔和的右侧阴影，增加深度 */
  position: relative; /* 确保 z-index 有效 */
  z-index: 100; /* 确保在内容之上 */
}

.logo {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 25px 0; /* 增大 Logo 区域的垂直内边距 */
  margin-bottom: 15px; /* Logo 下方空间 */
  border-bottom: 1px solid rgba(255, 255, 255, 0.08); /* 更明显的底部细分隔线 */
}

/* New style for the inline SVG logo */
.logo-svg {
  max-width: 140px; /* Same max-width as the original image */
  height: auto;
  /* Opacity removed as colors are now explicitly set for contrast on dark background */
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 15px 25px; /* 增加内边距 */
  margin: 8px 15px; /* 导航项之间的外边距和距离侧边栏边缘的距离 */
  cursor: pointer;
  transition: all 0.3s ease; /* 所有属性平滑过渡 */
  border-radius: 8px; /* 增加圆角，更现代 */
  font-size: 16px; /* 稍大字体 */
  color: #a0a3bd; /* 柔和的默认文字颜色，在深色背景下更舒适 */
  font-weight: 400; /* 默认字重 */
}

.nav-item:hover {
  background-color: rgba(255, 255, 255, 0.15); /* 悬停时背景色更明显 */
  color: white; /* 悬停时文字变为纯白 */
  transform: translateY(-2px); /* 悬停时轻微上浮效果 */
}

.nav-item.active {
  background-color: #409eff; /* Element Plus 主题蓝作为激活背景 */
  color: white; /* 激活时文字纯白 */
  font-weight: 600; /* 激活时字体加粗 */
  box-shadow: 0 6px 16px rgba(64, 158, 255, 0.3); /* 激活时增加明显的蓝色阴影，使其有浮起效果 */
  transform: translateY(0); /* 确保激活时不浮动 */
}

.nav-item .el-icon {
  margin-right: 12px; /* 图标与文字间距 */
  font-size: 20px; /* 图标大小 */
}

/* 右侧内容区域 */
.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #ffffff; /* 主内容区域的背景色，模拟一个大卡片 */
  border-radius: 12px; /* 略大的圆角 */
  margin: 15px; /* 与 admin-container 边缘的间距 */
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08); /* 整个内容区域的柔和阴影 */
  overflow: hidden; /* 隐藏可能溢出的内容，特别是内部组件 */
}

/* 顶部栏 */
.admin-header {
  background-color: #ffffff;
  padding: 0 30px; /* 增加左右内边距 */
  height: 70px; /* 略微增加高度，更显大气 */
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04); /* 更细腻的顶部阴影 */
  border-bottom: 1px solid #ebf0f5; /* 增加底部边框，与内容区域分隔 */
  z-index: 99; /* 确保在内容之上 */
}

.header-left h2 {
  margin: 0; /* 移除默认外边距 */
  font-size: 24px; /* 增大标题字体 */
  color: #333333; /* 更深的文字颜色 */
  font-weight: 600; /* 标题字重，更具权威感 */
  letter-spacing: 0.5px; /* 增加字母间距 */
}

.admin-info {
  display: flex;
  align-items: center;
  gap: 8px; /* Admin 文字与小箭头之间间距 */
  cursor: pointer;
  color: #555555; /* 灰色文字，更显专业 */
  font-size: 15px; /* 标准字体大小 */
  padding: 5px 10px; /* 增加点击区域 */
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.admin-info:hover {
  background-color: #f0f2f5; /* 悬停时背景色 */
}

.admin-info .el-icon {
  font-size: 14px; /* 调整小箭头图标大小 */
  color: #888888; /* 小箭头颜色 */
}

/* 组件内容的包裹层，确保内部组件有统一的内边距 */
.component-wrapper {
  padding: 20px; /* 为所有内部组件提供统一的内边距 */
  flex-grow: 1; /* 允许其填充剩余空间 */
  overflow-y: auto; /* 当内容超出时，只在内部滚动 */
}
</style>