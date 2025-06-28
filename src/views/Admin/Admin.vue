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
        <img src="@/assets/images/logo.png" alt="Logo" class="logo-image" />
      </div>
      <div class="nav-item" v-for="item in navItems" :key="item.name" @click="navigate(item)">
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
      <component
        v-if="permissionChecked && !showNoPermission"
        :is="currentComponent"
        :data="componentData"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Search, CaretBottom, Document, List, User, Truck } from '@element-plus/icons-vue'
import { ElMessage, ElDialog, ElButton } from 'element-plus'
import axios from 'axios'

import DataDashboard from '@/components/SignIn/DataDashboard.vue'
import OrderInfo from '@/components/SignIn/OrderInfo.vue'
import UserInfo from '@/components/SignIn/UserInfo.vue'
import LogisticsInfo from '@/components/SignIn/LogisticsInfo.vue'
// 导航项
const navItems = [
  { name: '数据看板', component: DataDashboard, icon: Truck },
  { name: '订单信息', component: OrderInfo, icon: List },
  { name: '用户信息', component: UserInfo, icon: User },
  { name: '物流信息', component: LogisticsInfo, icon: Truck }
]

const currentComponent = ref(DataDashboard)
const componentData = ref(null) // 用于存储从后端获取的数据

// 导航到指定组件
const navigate = async (item) => {
  currentComponent.value = item.component 
  if (item.name === '数据看板') {
    // await fetchPartAuditData() // 获取零件审核信息
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
    showNoPermission.value = true
  } finally {
    // 权限检查结束
    permissionChecked.value = true
  }
}

const returnHome = () => {
  window.location.href = '/'
}
onMounted(() => {
  checkPermission()
  // fetchPartAuditData(); // 直接调用获取数据的方法
});
</script>

<style scoped>
.admin-container {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 200px;
  background-color: #001f3f;
  color: white;
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.logo {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

.logo-image {
  max-width: 100%;
  height: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.nav-item:hover {
  background-color: #00509e;
}

.nav-item span {
  margin-left: 10px;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.admin-header {
  background-color: #fff;
  padding: 0 20px;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.admin-info {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}
</style>