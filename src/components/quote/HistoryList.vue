<template>
  <div class="history-section">
    <div class="section-header">
      <h3>上传历史</h3>
    </div>

    <!-- 有数据时显示正常表格 -->
    <div v-if="isUserLoggedIn && historyData.length > 0">
      <el-table 
        :data="paginatedHistoryData" 
        stripe 
        style="width: 100%"
        :cell-style="{ padding: '8px 0' }"
        v-loading="props.loading" 
      >
        <!-- 序号列 -->
        <el-table-column type="index" label="序号" width="60" align="center" />

        <!-- 文件名列 -->
        <el-table-column prop="file_name" label="文件名" min-width="160">
          <template #default="scope">
            <el-tooltip :content="scope.row.file_name" placement="top">
              <span class="filename-text">{{ scope.row.file_name }}</span>
            </el-tooltip>
          </template>
        </el-table-column>

        <!-- 上传时间列 -->
        <el-table-column prop="upload_time" label="上传时间" width="160">
          <template #default="scope">
            {{ new Date(scope.row.upload_time).toLocaleString() }}
          </template>
        </el-table-column>

        <!-- 文件大小列 -->
        <el-table-column prop="file_size" label="文件大小" width="100" align="center">
          <template #default="scope">
            {{ formatFileSize(scope.row.file_size) }}
          </template>
        </el-table-column>

        <!-- 状态列 -->
        <el-table-column prop="status" label="状态" width="80" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'success' ? 'success' : 'warning'" size="small">
              {{ scope.row.status === 'success' ? '成功' : '处理中' }}
            </el-tag>
          </template>
        </el-table-column>

        <!-- 预览图列 -->
        <el-table-column label="预览" width="80" align="center">
          <template #default="scope">
            <a v-if="scope.row.preview_url" :href="scope.row.preview_url" target="_blank">
              <el-image 
                :src="scope.row.preview_url"
                fit="cover"
                class="preview-image"
              >
                <template #error>
                  <div class="image-error">
                    <el-icon><picture-filled /></el-icon>
                  </div>
                </template>
              </el-image>
            </a>
            <div v-else class="no-preview">
              <el-icon><document /></el-icon>
            </div>
          </template>
        </el-table-column>

        <!-- 操作列 -->
        <el-table-column label="操作" width="220" fixed="right" align="center">
          <template #default="scope">
            <div class="operation-buttons">
              <el-button
                type="primary"
                size="small"
                :disabled="scope.row.status !== 'success'"
                @click="handleOrder(scope.row)"
              >
                下单
              </el-button>
              <el-popconfirm
                title="确定要删除这条记录吗？"
                confirm-button-text="确定"
                cancel-button-text="取消"
                width="200"
                @confirm="handleDelete(scope.row.id)"
              >
                <template #reference>
                  <el-button
                    type="danger"
                    size="small"
                  >
                    删除
                  </el-button>
                </template>
              </el-popconfirm>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[5,10,20]"
          :total="historyData.length"
          layout="total, sizes, prev, pager, next, jumper"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- 无数据时显示带列名的骨架表格 -->
    <div v-else>
      <el-table 
        :data="[]" 
        stripe 
        style="width: 100%"
        :cell-style="{ padding: '8px 0' }"
        class="empty-table"
      >
        <!-- 序号列 -->
        <el-table-column type="index" label="序号" width="60" align="center" />

        <!-- 文件名列 -->
        <el-table-column label="文件名" min-width="160" />

        <!-- 上传时间列 -->
        <el-table-column label="上传时间" width="160" />

        <!-- 文件大小列 -->
        <el-table-column label="文件大小" width="100" align="center" />

        <!-- 状态列 -->
        <el-table-column label="状态" width="80" align="center" />

        <!-- 预览图列 -->
        <el-table-column label="预览" width="80" align="center" />

        <!-- 操作列 -->
        <el-table-column label="操作" width="220" fixed="right" align="center" />
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { PictureFilled, Document } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/user'
import { ElMessage } from 'element-plus'
import service from '@/utils/request'

// 定义props
// 在 HistoryList.vue 的 <script setup> 中
  const props = defineProps({
  historyData: {
    type: Array,
    required: true,
    default: () => []
  },
  // 新增这个 prop
  loading: {
    type: Boolean,
    default: false
  }
})

// 定义事件
const emit = defineEmits(['fileInfoAccessId', 'delete'])

// 分页相关
const currentPage = ref(1)
const pageSize = ref(5)

// 计算分页后的数据
const paginatedHistoryData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return props.historyData.slice(start, end)
})

// 处理分页大小变化
const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1 // 重置到第一页
}

// 处理当前页变化
const handleCurrentChange = (val) => {
  currentPage.value = val
}

// 格式化文件大小
const formatFileSize = (bytes) => {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
}

// 处理删除操作
const handleDelete = async (fileId) => {
  try {
    const response = await service.delete(`/api/upload/history/${fileId}`, { withCredentials: true })
    
    if (response.data.success) {
      ElMessage.success('删除成功')

      // 通知父组件更新数据
      emit('delete', fileId)
    } else {
      ElMessage.error(response.data.message || '删除失败')
    }
  } catch (error) {
    console.error('删除记录失败:', error)
    ElMessage.error('删除失败，请稍后重试')
  }
}

const fileInfoAccessId = ref('')
// 处理下单点击事件
const handleOrder = async (row) => {
  console.log('row:', row)
  // 发送请求到后端查询数据
  const response = await service.get(`/api/upload/get_file_info/${row.id}`, { withCredentials: true })
  console.log('fileInfoAccessId:', response.data)

  fileInfoAccessId.value = response.data
  service.post(`/api/upload/get_analysis_result?data=${fileInfoAccessId.value}`, { withCredentials: true })
  .then(response => {
      // 发射事件，将数据传递给父组件
      emit('fileInfo', { 
      fileInfoAccessId: fileInfoAccessId.value, 
      productModelAccessId:response.data.data.productModelAccessId,
      sizeX:response.data.data.sizeX,
      sizeY:response.data.data.sizeY,
      sizeZ:response.data.data.sizeZ,
      modelVolume:response.data.data.modelVolume,
      modelSurfaceArea:response.data.data.modelSurfaceArea,
      file_name: row.file_name,  // 添加文件名
      upload_history_id:row.id
    })
  })
}

// 检查用户是否登录
const isUserLoggedIn = useUserStore().isLoggedIn
</script>

<style scoped>
.history-section {
  margin-top: 30px;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h3 {
  margin: 0;
  color: #333;
  font-size: 18px;
}

.filename-text {
  display: inline-block;
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.preview-image {
  width: 50px !important;
  height: 50px !important;
  border-radius: 4px;
  border: 1px solid #ebeef5;
  transition: all 0.3s;
}

.preview-image:hover {
  transform: scale(1.1);
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.image-error,
.no-preview {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  background: #f5f7fa;
  border-radius: 4px;
  color: #909399;
}

.operation-buttons {
  display: flex;
  justify-content: center;
  gap: 12px;
}

:deep(.el-table) {
  --el-table-header-bg-color: #f5f7fa;
  --el-table-border-color: #ebeef5;
  --el-table-header-text-color: #606266;
}

:deep(.el-table .cell) {
  padding: 0 8px;
}

:deep(.el-table th.el-table__cell) {
  background-color: #f5f7fa;
  font-weight: 600;
}

:deep(.el-button--small) {
  padding: 6px 16px;
  min-height: 28px;
}

:deep(.el-tag--small) {
  height: 22px;
  padding: 0 8px;
  font-size: 12px;
}

.no-data-message {
  text-align: center;
  color: #909399;
  font-size: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding: 40px 0;
}

.no-data-message el-icon {
  font-size: 24px;
}

/* 无数据时表格样式 */
.empty-table {
  pointer-events: none;
}
.empty-table .el-table__body-wrapper {
  visibility: hidden;
}
.empty-table .el-table__header-wrapper {
  opacity: 0.5;
}

/* 分页样式 */
.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>