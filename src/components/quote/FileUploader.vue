<template>
  <div class="file-uploader">
    <el-upload
      v-if="processInfo"
      class="upload-area"
      drag
      :action="uploadUrl"
      :headers="uploadHeaders"
      :data="uploadData"
      :accept="processInfo.acceptTypes"
      :before-upload="handleBeforeUpload"
      :on-success="handleUploadSuccess"
      :on-error="handleUploadError"
      :with-credentials="true"
      multiple
    >
      <div class="upload-content">
        <!-- 上传图标 -->
        <el-icon class="upload-icon"><upload-filled /></el-icon>
        
        <!-- 上传按钮 -->
        <el-button type="primary" class="upload-button">
          点击上传
        </el-button>
        
        <!-- 文字说明 -->
        <div class="upload-tips">
          <p>或将文件拖到这里</p>
          <template v-for="(tip, index) in processInfo.uploadTips" :key="index">
            <p>{{ tip }}</p>
          </template>
        </div>
      </div>
    </el-upload>
    <div v-else class="no-process">
      请先选择工艺类型
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { UploadFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  processInfo: {
    type: Object,
    default: null
  }
})
const emit = defineEmits(['upload-success'])

// 上传地址
const uploadUrl = 'http://localhost:8000/api/upload/upload'

// 修改上传请求头
const uploadHeaders = computed(() => ({
  'X-Requested-With': 'XMLHttpRequest',
  'Accept': 'application/json'
}))

// 上传时附带的数据
const uploadData = computed(() => ({
  process_type: props.processInfo?.type || ''
}))

const handleBeforeUpload = (file) => {
  if (!props.processInfo) {
    ElMessage.error('请先选择工艺类型!')
    return false
  }

  // 检查文件大小
  const isLt50M = file.size / 1024 / 1024 < 50
  if (!isLt50M) {
    ElMessage.error('文件大小不能超过 50MB!')
    return false
  }

  // 检查文件类型
  const extension = file.name.split('.').pop().toLowerCase()
  const acceptTypes = props.processInfo.acceptTypes
    .split(',')
    .map(type => type.replace('.', '').toLowerCase())
  
  if (!acceptTypes.includes(extension)) {
    ElMessage.error(`不支持的文件格式: ${extension}`)
    return false
  }

  return true
}

const handleUploadSuccess = (response, file) => {
  if (response.success) {
    emit('upload-success', response)
    ElMessage.success('上传成功')
  } else {
    ElMessage.error(response.detail || '上传失败')
  }
}

const handleUploadError = (error) => {
  console.error('上传失败:', error)
  ElMessage.error('上传失败，请重试')
}
</script>

<style lang="scss" scoped>
.file-uploader {
  .upload-area {
    border: 2px dashed #dcdfe6;
    border-radius: 6px;
    cursor: pointer;
    transition: border-color 0.3s;
    
    &:hover {
      border-color: #409eff;
    }
    
    .upload-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 40px 20px;
      
      .upload-icon {
        font-size: 48px;
        color: #909399;
        margin-bottom: 20px;
      }
      
      .upload-button {
        padding: 12px 24px;
        font-size: 16px;
        margin-bottom: 20px;
      }
      
      .upload-tips {
        text-align: center;
        
        p {
          margin: 8px 0;
          color: #909399;
          font-size: 14px;
          line-height: 1.4;
          
          &:first-child {
            color: #606266;
            margin-bottom: 16px;
          }
        }
      }
    }
  }
  
  :deep(.el-upload-dragger) {
    width: 100%;
    height: auto;
    padding: 0;
  }
}

.no-process {
  text-align: center;
  padding: 40px;
  color: #909399;
  font-size: 14px;
  background: #f5f7fa;
  border-radius: 6px;
}
</style>