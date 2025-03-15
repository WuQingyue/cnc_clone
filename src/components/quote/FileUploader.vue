<template>
  <div class="file-uploader">
    <div v-if="isUserLoggedIn">
      <el-upload
        v-if="processInfo"
        class="upload-area"
        drag
        :action="uploadUrl"
        :headers="uploadHeaders"
        :data="uploadData"
        :limit="fileLimit"
        :accept="processInfo.acceptTypes"
        :before-upload="handleBeforeUpload"
        :on-success="handleUploadSuccess"
        :on-error="handleUploadError"
        :on-exceed="handleExceed"
        :with-credentials="true"
        multiple
      >
        <div class="upload-content">
          <!-- 上传图标 -->
          <el-icon class="upload-icon"><upload-filled /></el-icon>
          
          <!-- 文字说明 -->
          <div class="upload-tips">
            <p>点击上传或将文件拖到这里</p>
            <template v-for="(tip, index) in formattedUploadTips" :key="index">
              <p v-html="tip"></p>
            </template>
          </div>
        </div>
      </el-upload>
    </div>
    <div v-else>
      <button class="login-button" @click="redirectToLogin">
        请登录再上传文件
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { UploadFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/user'

// 检查用户是否登录
const isUserLoggedIn = useUserStore().isLoggedIn

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

// 文件数量限制
const fileLimit = 20

// 文件数量超出限制时的处理
const handleExceed = (files) => {
  ElMessage.error(`文件数量为 ${files.length} 个, 单次上传文件数量不能超过 ${fileLimit} 个!`)
}

// 上传前检查
const handleBeforeUpload = (file) => {
  if (!props.processInfo) {
    ElMessage.error('请先选择工艺类型!')
    return false
  }

  // 检查文件大小
  const isLt100M = file.size / 1024 / 1024 < 100
  if (!isLt100M) {
    ElMessage.error('文件大小不能超过 100MB!')
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

// 重定向到登录页面
const redirectToLogin = () => {
  window.location.href = '/login' // 假设登录页面的路径是 /login
}

// 动态替换占位符为实际图片路径
const formattedUploadTips = computed(() => {
  return props.processInfo.uploadTips.map(tip =>
    tip.replace('IMAGE_PLACEHOLDER', require('@/assets/images/safety.png'))
  );
});
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

  .login-button {
    background-color: #409eff;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-left: 600px;
  }
  
  :deep(.el-upload-dragger) {
    width: 100%;
    height: auto;
    padding: 0;
  }
}
</style>