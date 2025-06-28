<template>
  <div class="part-audit">
    <!-- 搜索和过滤区域 -->
    <div class="search-bar">
      <el-input
        v-model="searchQuery"
        placeholder="搜索用户名/用户邮箱"
        class="search-input"
        clearable
        @clear="handleSearch"
        @input="handleSearch"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>

      <el-select v-model="loginType" placeholder="登录类型" @change="handleSearch">
        <el-option label="全部" value="" />
        <el-option label="普通登录" value="normal" />
        <el-option label="谷歌登录" value="google" />
      </el-select>
    </div>

    <!-- 用户数据表格 -->
    <el-table
      :data="filteredUsers"
      style="width: 100%"
      border
      stripe
      v-loading="loading"
    >
      <el-table-column type="index" label="序号" min-width="80" max-width="120" align="center" />
      <el-table-column prop="name" label="用户名" min-width="150" align="center" />
      <el-table-column prop="email" label="用户邮箱" min-width="200" align="center" />
      <el-table-column prop="password" label="用户密码" min-width="200" align="center" />
      <el-table-column prop="auth_type" label="登录类型" min-width="120" align="center">
        <template #default="scope">
          <el-tag :type="scope.row.auth_type === 'google' ? 'success' : 'info'">
            {{ getLoginTypeText(scope.row.auth_type) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="google_id" label="谷歌ID" min-width="200" align="center" />
      <el-table-column prop="created_at" label="创建时间" min-width="150" align="center">
        <template #default="scope">
          {{ formatDate(scope.row.created_at) }}
        </template>
      </el-table-column>
      <el-table-column prop="updated_at" label="更新时间" min-width="150" align="center">
        <template #default="scope">
          {{ formatDate(scope.row.updated_at) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" min-width="220" align="center">
        <template #default="scope">
          <div class="button-group">
            <el-button
              class="edit-btn"
              @click="editUser(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              class="delete-btn"
              @click="deleteUser(scope.row)"
            >
              删除
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import service from '@/utils/request'

// 数据状态
const searchQuery = ref('')
const loginType = ref('')
const loading = ref(false)
const users = ref([])
const filteredUsers = ref([])

// 格式化日期
const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleString()
}

// 登录类型文本
const getLoginTypeText = (type) => {
  if (type === 'google') return '谷歌登录'
  if (type === 'normal') return '普通登录'
  return type || '未知'
}

// 搜索过滤
const handleSearch = () => {
  loading.value = true
  setTimeout(() => {
    filteredUsers.value = users.value.filter(user => {
      const matchQuery =
        !searchQuery.value ||
        user.username?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.value.toLowerCase())
      const matchType = !loginType.value || user.auth_type === loginType.value
      return matchQuery && matchType
    })
    loading.value = false
  }, 300)
}

// 编辑用户
const editUser = (user) => {
  ElMessage.info(`编辑用户：${user.username}`)
  // 这里可以弹出编辑对话框或跳转到编辑页面
}

// 删除用户
const deleteUser = (user) => {
  ElMessage.warning(`删除用户：${user.username}`)
  // 这里可以弹出确认框并执行删除逻辑
}

// 获取用户信息
const fetchUserData = async () => {
  loading.value = true
  try {
    const response = await service.get('/api/login/get_all_users', { withCredentials: true }) // 替换为你的实际API
    if (response.status !== 200) throw new Error('网络响应不是 OK')
    users.value = response.data
    filteredUsers.value = response.data
    console.log('用户信息:', users.value)
  } catch (error) {
    console.error('请求失败:', error)
    ElMessage.error('获取用户信息失败')
  }
  loading.value = false
}

onMounted(() => {
  fetchUserData()
})
</script>

<style scoped>
.part-audit {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.search-bar {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
  align-items: center;
}

.search-input {
  width: 300px;
}

.el-table {
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
}

.el-table th, .el-table td {
  text-align: center;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 5px;
}

.el-button {
  margin: 0;
}

.el-tag {
  font-size: 14px;
  padding: 5px 10px;
}

/* 新增：编辑按钮为蓝色，白色文字 */
.edit-btn {
  background-color: #409eff !important;
  color: #fff !important;
  border: none !important;
}

/* 新增：删除按钮为红色，白色文字 */
.delete-btn {
  background-color: #f56c6c !important;
  color: #fff !important;
  border: none !important;
}
</style>