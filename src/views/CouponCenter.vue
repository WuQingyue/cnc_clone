<template>
  <div class="online-quote">
    <!-- 工艺选择部分 -->
    <div class="section-card">
      <h2 class="section-title">选择工艺</h2>
      <process-selector 
        :selected-process="currentProcess"
        @process-change="handleProcessChange"
      />
    </div>

    <!-- 文件上传部分 -->
    <div class="section-card" v-if="showUploadSection">
      <h2 class="section-title">上传图纸</h2>
      <file-uploader 
        :process-type="currentProcess"
        @upload-success="handleUploadSuccess"
      />
    </div>

    <!-- 历史记录部分 -->
    <div class="section-card" v-if="showUploadSection">
      <h2 class="section-title">历史上传记录</h2>
      <history-list 
        :process-type="currentProcess"
        :history-data="uploadHistory"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ProcessSelector from '@/components/quote/ProcessSelector.vue'
import FileUploader from '@/components/quote/FileUploader.vue'
import HistoryList from '@/components/quote/HistoryList.vue'

// 当前选择的工艺
const currentProcess = ref('')

// 是否显示上传部分
const showUploadSection = computed(() => {
  return currentProcess.value && 
         !['mechanical', 'aluminum'].includes(currentProcess.value)
})

// 历史记录数据
const uploadHistory = ref([])

// 处理工艺变更
const handleProcessChange = (process) => {
  currentProcess.value = process
}

// 处理上传成功
const handleUploadSuccess = (fileInfo) => {
  uploadHistory.value.unshift({
    ...fileInfo,
    uploadTime: new Date().toISOString()
  })
}
</script>

<style lang="scss" scoped>
.online-quote {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;

  .section-card {
    background: #fff;
    border-radius: 8px;
    padding: 24px;
    margin-bottom: 20px;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);

    .section-title {
      font-size: 18px;
      font-weight: bold;
      color: #303133;
      margin-bottom: 20px;
      padding-left: 10px;
      border-left: 4px solid #409EFF;
    }
  }
}
</style>