<template>
  <div class="history-section" v-if="isUserLoggedIn && historyData.length > 0">
    <div class="section-header">
      <h3>上传历史</h3>
    </div>

    <el-table 
      :data="historyData" 
      stripe 
      style="width: 100%"
      :cell-style="{ padding: '8px 0' }"
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
              @confirm="$emit('delete', scope.row.id)"
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
  </div>
  <div class="history-section" v-else>
    <div class="section-header">
      <h3>上传历史</h3>
    </div>
    <div class="no-data-message">
      <el-icon><el-icon-info-filled /></el-icon>
      <span>暂无数据</span>
    </div>
  </div>
</template>

<script setup>
import {  PictureFilled, Document, InfoFilled } from '@element-plus/icons-vue'
import { ref } from 'vue'
// 定义props
const props = defineProps({
  historyData: {
    type: Array,
    required: true,
    default: () => []
  }
})

// 定义事件
const emit = defineEmits([ 'fileInfoAccessId', 'delete'])

// 格式化文件大小
const formatFileSize = (bytes) => {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
}
import service from '@/utils/request'
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
      emit('fileInfo', { fileInfoAccessId: fileInfoAccessId.value, 
      productModelAccessId:response.data.data.productModelAccessId,
      sizeX:response.data.data.sizeX,
      sizeY:response.data.data.sizeY,
      sizeZ:response.data.data.sizeZ,
      modelVolume:response.data.data.modelVolume,
      modelSurfaceArea:response.data.data.modelSurfaceArea,
      file_name: row.file_name  // 添加文件名
    })
    })
}

import { watch } from 'vue'

// 监听historyData的变化
watch(() => props.historyData, (newVal) => {
  console.log('历史记录已更新:', newVal)
}, { deep: true })

import { useUserStore } from '@/store/user'
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
</style>
    