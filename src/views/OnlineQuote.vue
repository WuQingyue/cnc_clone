<template>
  <div class="online-quote">
    <!-- 工艺选择部分 -->
    <div class="quote-section">
      <h2 class="section-title">选择工艺</h2>
      <process-selector 
        :selected-process="currentProcess?.type"
        @process-change="handleProcessChange"
      />
    </div>

    <!-- 文件上传部分 -->
    <div class="quote-section">
      <h2 class="section-title">上传图纸</h2>
      <file-uploader 
        :process-info="currentProcess"
        @upload-success="handleUploadSuccess"
      />
    </div>

    <!-- 历史记录部分 -->
    <div class="quote-section">
      <h2 class="section-title">历史上传记录</h2>
      <history-list 
        :process-type="currentProcess?.type"
        :history-data="currentHistoryData"
        @delete="handleDeleteHistory"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import ProcessSelector from '@/components/quote/ProcessSelector.vue'
import FileUploader from '@/components/quote/FileUploader.vue'
import HistoryList from '@/components/quote/HistoryList.vue'

// 当前选择的工艺
const currentProcess = ref(null)

// 上传历史记录（按工艺类型分类）
const uploadHistory = ref({
  '3dprint': [],
  'cnc': [],
  'sheet': [],
  'mold': []
})

// 当前工艺的历史记录
const currentHistoryData = computed(() => {
  if (!currentProcess.value) return []
  return uploadHistory.value[currentProcess.value.type] || []
})

// 获取历史记录
const fetchHistory = async (processType) => {
  try {
    const response = await axios.get(`http://localhost:8000/api/upload/history/${processType}`,
    { withCredentials: true })
    if (response.data.success) {
      console.log('response', response)
      
      return response.data.data
    }
    return []
  } catch (error) {
    ElMessage.error('获取历史记录失败')
    return []
  }
}

// 处理工艺变更
const handleProcessChange = async (process) => {
  currentProcess.value = process
  // 切换工艺时获取对应的历史记录
  const history = await fetchHistory(process.type)
  uploadHistory.value[process.type] = history
}

// 处理上传成功
const handleUploadSuccess = async (response, file) => {
  if (response.success) {
    // 重新获取当前工艺的历史记录
    const history = await fetchHistory(currentProcess.value.type)
    uploadHistory.value[currentProcess.value.type] = history
    ElMessage.success('上传成功')
  }
}

// 处理删除历史记录
const handleDeleteHistory = async (file) => {
  try {
    const response = await axios.delete(`/api/history/${file.id}`)
    if (response.data.success) {
      // 重新获取当前工艺的历史记录
      const history = await fetchHistory(currentProcess.value.type)
      uploadHistory.value[currentProcess.value.type] = history
      ElMessage.success('删除成功')
    }
  } catch (error) {
    ElMessage.error('删除失败')
  }
}
</script>

<style lang="scss" scoped>
.online-quote {
  padding: 100px;
  background: #f5f7fa;
  min-height: 100vh;

  .quote-section {
    background: #fff;
    border-radius: 8px;
    padding: 24px;
    margin-bottom: 20px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

    .section-title {
      font-size: 18px;
      font-weight: bold;
      color: #303133;
      margin-bottom: 20px;
      display: flex; // 添加 flex 布局
      align-items: center; // 垂直居中对齐

      &::before { // 使用伪元素创建竖线
        content: '';
        width: 4px;
        height: 18px; // 与文字大小相同
        background-color: #409eff;
        margin-right: 8px; // 设置竖线和文字的间距为8px
        border-radius: 2px; // 可选：添加圆角效果
      }
    }
  }
}
</style>