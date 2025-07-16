<template>
  <div class="file-uploader">
    <div>
      <el-upload
        v-if="processInfo"
        class="upload-area"
        drag
        :limit="fileLimit"
        :accept="processInfo.acceptTypes"
        :before-upload="handleBeforeUpload"
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
  </div>
</template>

<script setup>
  import { ref, computed } from 'vue';
  import { UploadFilled } from '@element-plus/icons-vue';
  import { ElMessage } from 'element-plus';
  import service from '@/utils/request';
  
  const props = defineProps({
    processInfo: {
      type: Object,
      default: null
    }
  });
  
  const emit = defineEmits(['update-history']);
  const fileLimit = 20;
  
  const handleExceed = (files) => {
    ElMessage.error(`文件数量为 ${files.length} 个, 单次上传文件数量不能超过 ${fileLimit} 个!`);
  };
  
  // 使用 async/await 的最终重构方案
  const handleBeforeUpload = async (file) => {
    console.log('文件大小为', file.size);
    
    // 1. 同步验证
    if (!props.processInfo) {
      ElMessage.error('请先选择工艺类型!');
      return false;
    }
  
    const isLt100M = file.size / 1024 / 1024 < 100;
    if (!isLt100M) {
      ElMessage.error('文件大小不能超过 100MB!');
      return false;
    }
  
    const extension = file.name.split('.').pop().toLowerCase();
    const acceptTypes = props.processInfo.acceptTypes
      .split(',')
      .map(type => type.replace('.', '').toLowerCase());
    console.log('文件的类型为', extension);
    if (!acceptTypes.includes(extension)) {
      ElMessage.error(`不支持的文件格式: ${extension}`);
      return false;
    }
  
    // 2. 使用 try/catch 包裹所有异步操作，以实现优雅的错误处理
    try {
      // 步骤一：上传文件以获取 fileInfoAccessId
      const preUploadData = new FormData();
      preUploadData.append('file', file);
      
      const preUploadResponse = await service.post('/api/upload/uploadDrawFile', preUploadData);
  
      if (!preUploadResponse.data.success) {
        throw new Error(preUploadResponse.data.detail || '上传预处理失败');
      }
      
      const fileInfoAccessId = preUploadResponse.data.data[0].fileInfoAccessId;
      console.log('fileInfoAccessId', fileInfoAccessId);
  
      // 步骤二：并行执行主文件上传和模型分析
      const mainUploadData = new FormData();
      mainUploadData.append('file', file);
      mainUploadData.append('process_type', props.processInfo?.type || '');
      mainUploadData.append('fileInfoAccessId', fileInfoAccessId);
  
      const mainUploadPromise = service.post('/api/upload/upload', mainUploadData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });
      
      const analyzePromise = service.post('/api/upload/analyze_model', {
        clientId: "bcfc5bc581325b287abfbdba0f70399c",
        fileInfoAccessIds: [fileInfoAccessId]
      }, { withCredentials: true });
  
      // 等待两个并行的请求都完成
      const [uploadResult] = await Promise.all([mainUploadPromise, analyzePromise]);
  
      // 步骤三：处理最终结果
      if (uploadResult.status === 200) {
        ElMessage.success('上传成功');
        console.log('分析成功！');
        emit('update-history');
        // 向上游 (el-upload) 返回 true 表示整个流程成功
        return true;
      } else {
        throw new Error('文件上传失败');
      }
  
    } catch (error) {
      console.error('上传流程出错:', error);
      ElMessage.error(error.message || '上传过程中发生未知错误');
      // 向上游 (el-upload) 返回一个被拒绝的 Promise 来报告失败
      return Promise.reject(error);
    }
  };
  
  const formattedUploadTips = computed(() => {
    if (!props.processInfo?.uploadTips) return [];
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