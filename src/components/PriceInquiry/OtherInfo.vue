<template>
    <div class="other-info">
      <el-card class="info-card">
        <template #header>
          <div class="card-header" @click="toggleCollapse">
            <span>其他信息</span>
            <el-icon class="collapse-icon" :class="{ 'is-collapsed': isCollapsed }">
              <ArrowDown />
            </el-icon>
          </div>
        </template>
        
        <el-collapse-transition>
          <div v-show="!isCollapsed">
            <el-form :model="otherForm" label-width="120px">
              <el-form-item label="特殊要求">
                <el-checkbox-group v-model="otherForm.specialRequirements">
                  <el-checkbox label="quality">质量要求</el-checkbox>
                  <el-checkbox label="package">包装要求</el-checkbox>
                  <el-checkbox label="surface">表面处理</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              
              <el-form-item label="补充说明">
                <el-input
                  v-model="otherForm.remarks"
                  type="textarea"
                  :rows="4"
                  placeholder="请输入其他补充说明"
                />
              </el-form-item>
  
              <el-form-item label="附件上传">
                <el-upload
                  action="/api/upload"
                  :on-success="handleUploadSuccess"
                  :on-error="handleUploadError"
                  multiple
                >
                  <el-button type="primary">点击上传</el-button>
                </el-upload>
              </el-form-item>
            </el-form>
          </div>
        </el-collapse-transition>
      </el-card>
    </div>
  </template>
  
  <script>
  import { ArrowDown } from '@element-plus/icons-vue'
  
  export default {
    name: 'OtherInfo',
    components: {
      ArrowDown
    },
    data() {
      return {
        isCollapsed: false,
        otherForm: {
          specialRequirements: [],
          remarks: '',
          attachments: []
        }
      }
    },
    methods: {
      toggleCollapse() {
        this.isCollapsed = !this.isCollapsed
      },
      handleUploadSuccess(response, file) {
        this.otherForm.attachments.push({
          name: file.name,
          url: response.url
        })
      },
      handleUploadError() {
        this.$message.error('上传失败，请重试')
      }
    }
  }
  </script>
  
  <style scoped>
  .info-card {
    margin-bottom: 20px;
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: bold;
    cursor: pointer;
    user-select: none;
    padding: 10px 0;
  }
  
  .collapse-icon {
    transition: transform 0.3s;
    font-size: 20px;
    color: #909399;
  }
  
  .collapse-icon.is-collapsed {
    transform: rotate(-180deg);
  }
  
  .el-form {
    margin-top: 20px;
  }
  
  .el-form-item {
    margin-bottom: 20px;
  }
  
  .price {
    color: #ff4d4f;
    font-size: 18px;
    font-weight: bold;
  }
  
  /* 添加过渡动画 */
  .el-collapse-transition {
    transition: all 0.3s ease;
  }
  </style>