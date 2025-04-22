<template>
  <div class="qrcode-container">
    <!-- <el-button @click="generateQrCode">手动生成二维码</el-button> -->
    <!-- 二维码区域 -->
    <div class="qrcode-wrapper" ref="qrcodeRef">
      <!-- 使用 v-show 替代 v-if -->
      <div v-show="isLoading" class="loading-state">
        <el-icon class="is-loading"><loading /></el-icon>
        <span>二维码加载中...</span>
      </div>
      
      <div v-show="isExpired" class="expired-state" @click="handleRefresh">
        <el-icon><RefreshRight /></el-icon>
        <span>二维码已过期，点击刷新</span>
      </div>
      
      <div v-show="isScanned" class="success-state">
        <el-icon><CircleCheckFilled /></el-icon>
        <span>扫码成功，请在手机上确认</span>
      </div>
      
      <div v-show="!isLoading && !isExpired && !isScanned" class="qrcode">
        <img 
          v-if="qrcodeUrl" 
          :src="qrcodeUrl" 
          alt="微信扫码"
          @load="handleImageLoad"
          @error="handleImageError"
        />
      </div>
    </div>
    
    <!-- 状态提示 -->
    <div class="status-tip" :class="statusClass">
      {{ statusText }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Loading, RefreshRight, CircleCheckFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'
console.log('QrCode 组件被导入')  // 添加这行

const API_BASE_URL = 'http://66.42.110.47:5000' // 或者使用环境变量

const props = defineProps({
  pollInterval: {
    type: Number,
    default: 2000
  },
  expireTime: {
    type: Number,
    default: 120000
  }
})

const emit = defineEmits(['expired', 'scan-success', 'refresh'])

const qrCode = ref('')
const isLoading = ref(true)
const isExpired = ref(false)
const isScanned = ref(false)
const qrcodeUrl = ref('')

// 状态文本
const statusText = computed(() => {
  if (isLoading.value) return '二维码加载中...'
  if (isExpired.value) return '二维码已过期，点击刷新'
  if (isScanned.value) return '扫码成功，请在手机上确认'
  return '请使用微信扫描二维码'
})

// 状态样式
const statusClass = computed(() => ({
  'is-loading': isLoading.value,
  'is-expired': isExpired.value,
  'is-success': isScanned.value
}))

let pollTimer = null
let expireTimer = null

const generateQrCode = async () => {
  try {
    console.log('开始请求二维码') // 添加日志
    isLoading.value = true
    isExpired.value = false
    isScanned.value = false
    
    console.log('请求地址:', `${API_BASE_URL}/api/qrcode/generate`) // 打印完整请求地址
    const response = await axios.get(`${API_BASE_URL}/api/qrcode/generate`)
    console.log('请求响应:', response)
    
    const data = response.data
    console.log('二维码数据:', data)
    
    qrcodeUrl.value = data.qrcodeUrl
    qrCode.value = data.code
    
    startPolling()
    startExpireTimer()
  } catch (error) {
    console.error('生成二维码失败:', error.message)
    console.error('错误详情:', error.response || error)  // 添加更详细的错误信息
    isExpired.value = true
    ElMessage.error('生成二维码失败，请重试')
  } finally {
    isLoading.value = false
  }
}

// 同时也更新轮询函数
const startPolling = () => {
  clearInterval(pollTimer)
  pollTimer = setInterval(async () => {
    try {
      if (!qrCode.value) return
      
      const response = await axios.get(`${API_BASE_URL}/api/qrcode/check-status/${qrCode.value}`)
      const data = response.data
      
      if (data.isScanned) {
        isScanned.value = true
        clearInterval(pollTimer)
        emit('scan-success')
      }
    } catch (error) {
      console.error('检查扫码状态失败:', error)
    }
  }, props.pollInterval)
}

const startExpireTimer = () => {
  clearTimeout(expireTimer)
  expireTimer = setTimeout(() => {
    isExpired.value = true
    clearInterval(pollTimer)
    emit('expired')
  }, props.expireTime)
}

const handleRefresh = () => {
  generateQrCode()
  emit('refresh')
}

const handleImageLoad = () => {
  isLoading.value = false
}

const handleImageError = () => {
  isLoading.value = false
  isExpired.value = true
  ElMessage.error('二维码加载失败，请刷新重试')
}

onMounted(() => {
  console.log('1. 组件开始挂载')
  console.log('2. 准备生成二维码')
  generateQrCode()
  console.log('3. 二维码生成函数已调用')
})

onUnmounted(() => {
  clearInterval(pollTimer)
  clearTimeout(expireTimer)
})
</script>

<style lang="scss" scoped>
.qrcode-container {
  width: 200px;
  margin: 0 auto;
  
  .qrcode-wrapper {
    width: 200px;
    height: 200px;
    border: 1px solid #dcdfe6;
    border-radius: 8px;
    overflow: hidden;
    position: relative;
    
    .loading-state,
    .expired-state,
    .success-state,
    .qrcode {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background: rgba(255, 255, 255, 0.9);
    }
    
    .loading-state,
    .expired-state,
    .success-state {
      .el-icon {
        font-size: 40px;
        margin-bottom: 12px;
      }
      
      span {
        font-size: 14px;
        color: #606266;
      }
    }
    
    .expired-state {
      cursor: pointer;
      
      &:hover {
        background: rgba(255, 255, 255, 0.95);
        
        .el-icon {
          color: #409eff;
        }
      }
    }
    
    .success-state {
      .el-icon {
        color: #67c23a;
      }
    }
    
    .qrcode {
      img {
        max-width: 100%;
        max-height: 100%;
      }
    }
  }
  
  .status-tip {
    text-align: center;
    margin-top: 12px;
    font-size: 14px;
    color: #606266;
    
    &.is-loading {
      color: #909399;
    }
    
    &.is-expired {
      color: #f56c6c;
    }
    
    &.is-success {
      color: #67c23a;
    }
  }
}
</style>