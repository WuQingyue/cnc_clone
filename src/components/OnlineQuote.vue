<template>
  <div class="online-quote">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="container">
        <div class="breadcrumb">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>在线报价</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>
    </div>

    <!-- 主要内容区 -->
    <div class="quote-content">
      <div class="container">
        <!-- 报价步骤 -->
        <el-steps :active="currentStep" finish-status="success" class="quote-steps">
          <el-step title="上传文件" />
          <el-step title="选择工艺" />
          <el-step title="确认订单" />
        </el-steps>

        <!-- 步骤内容 -->
        <div class="step-content">
          <!-- 第一步：上传文件 -->
          <div v-if="currentStep === 0" class="upload-section">
            <el-upload
              class="upload-area"
              drag
              action="/api/upload"
              multiple
              :on-success="handleUploadSuccess"
              :on-error="handleUploadError"
              :before-upload="beforeUpload"
            >
              <el-icon class="el-icon--upload"><upload-filled /></el-icon>
              <div class="el-upload__text">
                将文件拖到此处，或<em>点击上传</em>
              </div>
              <template #tip>
                <div class="el-upload__tip">
                  支持上传 STEP、STP、IGS、IGES、X_T、PRT、STL 格式文件
                </div>
              </template>
            </el-upload>
          </div>

          <!-- 第二步：选择工艺 -->
          <div v-if="currentStep === 1" class="process-section">
            <el-form :model="processForm" label-width="120px">
              <el-form-item label="加工工艺">
                <el-radio-group v-model="processForm.type">
                  <el-radio label="cnc">CNC加工</el-radio>
                  <el-radio label="sheet">钣金加工</el-radio>
                  <el-radio label="3d">3D打印</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="材料">
                <el-select v-model="processForm.material" placeholder="请选择材料">
                  <el-option label="铝合金" value="aluminum" />
                  <el-option label="不锈钢" value="steel" />
                  <el-option label="塑料" value="plastic" />
                </el-select>
              </el-form-item>

              <el-form-item label="表面处理">
                <el-select v-model="processForm.surface" placeholder="请选择表面处理">
                  <el-option label="阳极氧化" value="anodizing" />
                  <el-option label="喷砂" value="sandblasting" />
                  <el-option label="抛光" value="polishing" />
                </el-select>
              </el-form-item>

              <el-form-item label="数量">
                <el-input-number v-model="processForm.quantity" :min="1" />
              </el-form-item>
            </el-form>
          </div>

          <!-- 第三步：确认订单 -->
          <div v-if="currentStep === 2" class="confirm-section">
            <el-descriptions title="订单信息" :column="1" border>
              <el-descriptions-item label="文件名称">
                {{ orderInfo.fileName }}
              </el-descriptions-item>
              <el-descriptions-item label="加工工艺">
                {{ orderInfo.processType }}
              </el-descriptions-item>
              <el-descriptions-item label="材料">
                {{ orderInfo.material }}
              </el-descriptions-item>
              <el-descriptions-item label="表面处理">
                {{ orderInfo.surface }}
              </el-descriptions-item>
              <el-descriptions-item label="数量">
                {{ orderInfo.quantity }}
              </el-descriptions-item>
              <el-descriptions-item label="预估价格">
                ¥{{ orderInfo.price }}
              </el-descriptions-item>
            </el-descriptions>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="step-actions">
          <el-button v-if="currentStep > 0" @click="prevStep">上一步</el-button>
          <el-button 
            type="primary" 
            @click="nextStep"
            :disabled="!canProceed"
          >
            {{ currentStep === 2 ? '提交订单' : '下一步' }}
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { UploadFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'


import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
// // 添加翻译监听
// const setupTranslation = () => {
//   if (window.translate) {
//     // 获取当前语言
//     const currentLang = localStorage.getItem('preferred_language')
//     if (currentLang && currentLang !== 'zh') {
//       // 延迟执行翻译，确保DOM已完全加载
//       setTimeout(() => {
//         window.translate.execute(window.translate.language.getLocal())
//       }, 300)
//     }
//   }
// }

// // 组件挂载时设置翻译
// onMounted(() => {
//   setupTranslation()
  
//   // 监听路由变化
//   if (window.translate) {
//     window.translate.observer.start()
//   }
// })

// // 组件卸载前清理
// onBeforeUnmount(() => {
//   if (window.translate) {
//     window.translate.observer.stop()
//   }
// })

const currentStep = ref(0)
const uploadFiles = ref([])
const processForm = ref({
  type: '',
  material: '',
  surface: '',
  quantity: 1
})

const orderInfo = ref({
  fileName: '',
  processType: '',
  material: '',
  surface: '',
  quantity: 0,
  price: 0
})

// 是否可以进行下一步
const canProceed = computed(() => {
  switch (currentStep.value) {
    case 0:
      return uploadFiles.value.length > 0
    case 1:
      return processForm.value.type && 
             processForm.value.material && 
             processForm.value.surface && 
             processForm.value.quantity > 0
    case 2:
      return true
    default:
      return false
  }
})

// 上传相关方法
const beforeUpload = (file) => {
  const validTypes = ['step', 'stp', 'igs', 'iges', 'x_t', 'prt', 'stl']
  const extension = file.name.split('.').pop().toLowerCase()
  if (!validTypes.includes(extension)) {
    ElMessage.error('不支持的文件格式！')
    return false
  }
  return true
}

const handleUploadSuccess = (response, file) => {
  uploadFiles.value.push(file)
  ElMessage.success('文件上传成功')
}

const handleUploadError = () => {
  ElMessage.error('文件上传失败')
}

// 步骤控制
const nextStep = () => {
  if (currentStep.value === 2) {
    submitOrder()
    return
  }
  if (canProceed.value) {
    currentStep.value++
    if (currentStep.value === 2) {
      prepareOrderInfo()
    }
  }
}

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

// 准备订单信息
const prepareOrderInfo = () => {
  orderInfo.value = {
    fileName: uploadFiles.value[0]?.name || '',
    processType: processForm.value.type === 'cnc' ? 'CNC加工' :
                 processForm.value.type === 'sheet' ? '钣金加工' : '3D打印',
    material: processForm.value.material,
    surface: processForm.value.surface,
    quantity: processForm.value.quantity,
    price: calculatePrice() // 这里需要实现价格计算逻辑
  }
}

// 提交订单
const submitOrder = () => {
  // 这里实现提交订单的逻辑
  ElMessage.success('订单提交成功！')
}

// 计算价格（示例）
const calculatePrice = () => {
  // 这里实现价格计算逻辑
  return 999.99
}
</script>

<style lang="scss" scoped>
.online-quote {
  background: #f5f7fa;
  min-height: calc(100vh - 60px);

  .page-header {
    background: #fff;
    padding: 20px 0;
    margin-bottom: 30px;
  }

  .quote-content {
    padding: 30px 0;

    .quote-steps {
      margin-bottom: 40px;
    }

    .step-content {
      background: #fff;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      min-height: 400px;

      .upload-section {
        .upload-area {
          width: 100%;
          
          .el-upload__tip {
            color: #909399;
            font-size: 14px;
            margin-top: 10px;
          }
        }
      }

      .process-section {
        max-width: 600px;
        margin: 0 auto;
      }

      .confirm-section {
        max-width: 800px;
        margin: 0 auto;
      }
    }

    .step-actions {
      margin-top: 30px;
      display: flex;
      justify-content: center;
      gap: 20px;
    }
  }
}

// 响应式布局
@media (max-width: 768px) {
  .online-quote {
    .quote-content {
      padding: 20px 0;

      .step-content {
        padding: 20px;
      }
    }
  }
}
</style>
