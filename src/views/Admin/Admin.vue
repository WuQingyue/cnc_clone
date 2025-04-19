<template>
  <div class="admin-container">
    <!-- 左侧导航栏 -->
    <div class="sidebar">
      <div class="logo">
        <img src="@/assets/images/logo.jpg" alt="Logo" class="logo-image" />
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
      <component :is="currentComponent" :data="componentData" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, CaretBottom, Document, List, User, Truck } from '@element-plus/icons-vue'
import PartAuditInfo from '@/components/SignIn/PartAuditInfo.vue'
import OrderInfo from '@/components/SignIn/OrderInfo.vue'
import UserInfo from '@/components/SignIn/UserInfo.vue'
import LogisticsInfo from '@/components/SignIn/LogisticsInfo.vue'
import CNC_Operation from '@/components/SignIn/CNC_Operation.vue'
import CNC_Logistics from '@/components/SignIn/CNC_Logistics.vue'
// 导航项
const navItems = [
  { name: '零件审核信息', component: PartAuditInfo, icon: Document },
  { name: '订单信息', component: OrderInfo, icon: List },
  { name: '用户信息', component: UserInfo, icon: User },
  { name: '物流信息', component: LogisticsInfo, icon: Truck },
  { name: '模拟工厂加工操作', component: CNC_Operation, icon: Truck },
  { name: '模拟物流轨迹操作', component: CNC_Logistics, icon: Truck }
]

const currentComponent = ref(PartAuditInfo)
const componentData = ref(null) // 用于存储从后端获取的数据

// 导航到指定组件
const navigate = async (item) => {
  currentComponent.value = item.component 
  if (item.name === '零件审核信息') {
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
onMounted(() => {
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