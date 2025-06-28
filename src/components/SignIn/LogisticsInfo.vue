<template>
  <div class="logistics-info">
    <!-- 搜索区域 -->
    <div class="search-bar">
      <el-input
        v-model="searchQuery"
        placeholder="搜索物流公司/联系人"
        class="search-input"
        clearable
        @clear="handleSearch"
        @input="handleSearch"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
    </div>

    <!-- 物流信息表格 -->
    <el-table
      :data="filteredRecords"
      style="width: 100%"
      border
      stripe
      v-loading="loading"
    >
      <el-table-column type="index" label="序号" width="80" align="center" />
      <el-table-column prop="company" label="物流公司" width="200" align="center" />
      <el-table-column prop="contact" label="联系人" width="150" align="center" />
      <el-table-column prop="phone" label="联系方式" width="180" align="center" />
      <el-table-column label="操作" fixed="right" width="220" align="center">
        <template #default="scope">
          <div class="button-group">
            <el-button
              class="edit-btn"
              @click="editLogistics(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              class="delete-btn"
              @click="deleteLogistics(scope.row)"
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
const loading = ref(false)
const records = ref([])
const filteredRecords = ref([])

// 搜索过滤
const handleSearch = () => {
  loading.value = true
  setTimeout(() => {
    filteredRecords.value = records.value.filter(item => {
      const matchQuery =
        !searchQuery.value ||
        item.company?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        item.contact?.toLowerCase().includes(searchQuery.value.toLowerCase())
      return matchQuery
    })
    loading.value = false
  }, 300)
}

// 编辑物流信息
const editLogistics = (row) => {
  ElMessage.info(`编辑物流公司：${row.company}`)
  // 可弹出编辑对话框或跳转编辑页面
}

// 删除物流信息
const deleteLogistics = (row) => {
  ElMessage.warning(`删除物流公司：${row.company}`)
  // 可弹出确认框并执行删除逻辑
}

// 获取物流信息
const fetchLogisticsData = async () => {
  loading.value = true
  try {
    const response = await service.get('/api/logistics/get_all_info', { withCredentials: true }) // 替换为你的实际API
    if (response.status !== 200) throw new Error('网络响应不是 OK')
    // 这里做修改：取 response.data.data
    records.value = response.data.data
    filteredRecords.value = response.data.data
    console.log('物流信息:', records.value)
  } catch (error) {
    console.error('请求失败:', error)
    ElMessage.error('获取物流信息失败')
  }
  loading.value = false
}

onMounted(() => {
  fetchLogisticsData()
})
</script>

<style scoped>
.logistics-info {
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

/* 编辑按钮为蓝色白字 */
.edit-btn {
  background-color: #409eff !important;
  color: #fff !important;
  border: none !important;
}

/* 删除按钮为红色白字 */
.delete-btn {
  background-color: #f56c6c !important;
  color: #fff !important;
  border: none !important;
}
</style>