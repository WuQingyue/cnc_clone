<template>
  <div class="file-list">
    <h2 class="section-title">文件列表</h2>
    <div class="file-list-container">
      <!-- 左部分：文件信息和文件上传框 -->
      <div class="left-section">
        <!-- 数据展示 -->
        <table class="data-table">
          <thead>
            <tr>
              <th>序号</th>
              <th>图纸</th>
              <th>模型信息</th>
              <th>参数信息</th>
              <th>数量（件）</th>
              <th>单价</th>
              <th>总价</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(record, index) in localRecords" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ record.file_name }}</td>
              <td>
                尺寸: {{ modelInfo.size }}<br>
                体积: {{ modelInfo.volume }}<br>
                表面积: {{ modelInfo.surfaceArea }}<br>
                备注: {{ modelInfo.remarks }}
              </td>
              <td class="parameter-info-cell" @click="showParameterDialog = true">
                <div class="parameter-details">
                  <div>{{ record.parameters.material || '铝合金-6061' }}</div>
                  <div v-if="record.parameters.surfaceTreatment === 'none'">
                    表面不做处理
                  </div>
                  <div v-else>
                    <template v-if="record.parameters.selectedTreatment">
                      表面处理一: {{ record.parameters.selectedTreatment }} 
                      <span v-if="record.parameters.selectedColor">- {{ record.parameters.selectedColor }}</span>
                      <span v-if="record.parameters.glossiness">- {{ record.parameters.glossiness }}</span>
                      <span v-if="record.parameters.uploadedFileName">- {{ record.parameters.uploadedFileName }}</span>
                    </template>
                    <template v-if="record.parameters.selectedTreatment2">
                      <br>表面处理二: {{ record.parameters.selectedTreatment2 }}
                      <span v-if="record.parameters.selectedColor2">- {{ record.parameters.selectedColor2 }}</span>
                      <span v-if="record.parameters.glossiness2">- {{ record.parameters.glossiness2 }}</span>
                      <span v-if="record.parameters.uploadedFileName2">- {{ record.parameters.uploadedFileName2 }}</span>
                    </template>
                  </div>
                  <div>最严公差: {{ record.parameters.tolerance || 'GB/T 1804-2000 m级' }}</div>
                  <div>最小粗糙度: {{ record.parameters.roughness || 'Ra3.2' }}</div>
                </div>
                <el-icon class="edit-icon">
                  <Edit />
                </el-icon>
              </td>
              <td>
                <button @click="decreaseQuantity(index)">-</button>
                {{ quantity }}
                <button @click="increaseQuantity(index)">+</button>
              </td>
              <td>{{ record.parameters.pricePerUnit }}</td>
              <td>{{ record.parameters.totalPrice }}</td>
            </tr>
          </tbody>
        </table>
        <!-- 已勾选的蓝色勾选框、文件名、复制零件和删除零件按钮 -->
        <div class="file-actions" v-for="(record, index) in localRecords" :key="index">
          <input type="checkbox" checked disabled />
          {{ record.file_name }}
          <button @click="copyPart(index)">复制零件</button>
          <button @click="deletePart(index)">删除零件</button>
        </div>
        <!-- 文件上传框 -->
        <file-uploader 
          :process-info="currentProcess"
          @upload-success="handleUploadSuccess"
        />
      </div>
      <!-- 右部分：信息框 -->
      <div class="right-section">
        <div class="info-box">
          <p class="info-text">目前针对一些复杂或者小批量零件暂不支持自动报价，您可以提交询价，我们的工程师将人工审核提供合理报价、交期以及图纸审核细节</p>
          <hr />
          <p>零件数量：{{ totalQuantity }}件1款</p>
          <p class="red-text">系统自动报价仅做参考, 最终以人工审核报价为准</p>
          <button class="blue-button">
            <router-link class="inquiry-link" to="/price-inquiry">提交询价</router-link>
          </button>
          <button class="white-button">
            <el-icon><ShoppingCart /></el-icon>
            <span>加入购物车</span>
          </button>
          <!-- PayPal 支付按钮 -->
          <!-- <button class="white-button">
              <el-icon><Pointer /></el-icon>
              <span ref="paypalButtonContainer">支付</span>
          </button> -->
          <div ref="paypalButtonContainer"></div>
        </div>
      </div>
    </div>
    <!-- 引入 ParameterInfo 组件 -->
    <ParameterInfo 
      :visible="showParameterDialog"
      @update:visible="showParameterDialog = $event"
      @confirm="handleParameterConfirm"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import FileUploader from '@/components/quote/FileUploader.vue'
import { Pointer, ShoppingCart, Edit } from '@element-plus/icons-vue' // 引入 Edit 图标
import axios from 'axios'
import { 
  currentParameters, 
  quantity, 
  updateQuantity,
  modelInfo
} from './AutomationTool' 
import ParameterInfo from './ParameterInfo.vue' // 引入 ParameterInfo 组件
const props = defineProps({
  selectedRecords: {
    type: Array,
    default: () => []
  },
  currentProcess: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:selectedRecords'])

// 创建本地数据副本
const localRecords = ref([])

// 监听 props 变化更新本地数据

watch(() => props.selectedRecords, (newVal) => {
  localRecords.value = newVal.map(record => ({
    ...record,
    quantity: record.quantity || 1,
    parameters: {
      // 添加默认参数
      material: '铝合金-6061',
      surfaceTreatment: 'none',
      tolerance: 'GB/T 1804-2000 m级',
      roughness: 'Ra3.2',
      selectedTreatment: '',
      selectedColor: '',
      glossiness: '',
      uploadedFileName: '',
      selectedTreatment2: '',
      selectedColor2: '',
      glossiness2: '',
      uploadedFileName2: '',
      pricePerUnit: '91.98',
      totalPrice: '91.98',
      // 保留已有参数
      ...(record.parameters || {})
    }
  }))
}, { immediate: true, deep: true })
const totalQuantity = computed(() => {
  return localRecords.value.reduce((total, record) => total + record.quantity, 0)
})

const updateRecords = () => {
  emit('update:selectedRecords', localRecords.value)
}

const increaseQuantity = (index) => {
  updateQuantity(quantity.value + 1)
  updateRecords()
}

const decreaseQuantity = (index) => {
  if (quantity.value > 1) {
    updateQuantity(quantity.value - 1)
    updateRecords()
  }
}

const copyPart = (index) => {
  const newRecord = JSON.parse(JSON.stringify(localRecords.value[index]))
  localRecords.value.push(newRecord)
  updateRecords()
}

const deletePart = (index) => {
  localRecords.value.splice(index, 1)
  updateRecords()
}

const handleUploadSuccess = () => {
  // 处理上传成功逻辑
}

const showParameterDialog = ref(false) // 控制 ParameterInfo 对话框的显示与隐藏

const handleParameterConfirm = (newParameters) => {
  currentParameters.value = newParameters
  localRecords.value.forEach(record => {
    record.parameters = newParameters
  })
  updateRecords()
}
</script>

<style lang="scss" scoped>
.file-list {
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

  .section-title {
    font-size: 18px;
    font-weight: bold;
    color: #303133;
    margin-bottom: 20px;
    display: flex;
    align-items: center;

    &::before {
      content: '';
      width: 4px;
      height: 18px;
      background-color: #409eff;
      margin-right: 8px;
      border-radius: 2px;
    }
  }

  .file-list-container {
    display: flex;
    gap: 20px;

    .left-section {
      flex: 2;
    }

    .right-section {
      flex: 1;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;

      th, td {
        border: 1px solid #ebeef5;
        padding: 8px;
        text-align: center;
      }
    }

    .file-actions {
      margin-bottom: 10px;
    }

    .info-box {
      background: #f5f7fa;
      padding: 20px;
      border-radius: 8px;

      .info-text {
        margin-bottom: 10px;
      }

      .red-text {
        color: red;
        margin-bottom: 20px;
      }

      .blue-button {
        background: #409eff;
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
        width: 100%;
        margin-bottom: 10px;
        cursor: pointer;

        .inquiry-link {
          color: white;
          text-decoration: none;
          display: block;
          width: 100%;
        }
      }

      .white-button {
        background: white;
        color: #409eff;
        padding: 10px 20px;
        border: 1px solid #409eff;
        border-radius: 4px;
        width: 100%;
      }

      .blue-icon {
        display: inline-block;
        width: 16px;
        height: 16px;
        background: #409eff;
        margin-right: 5px;
      }
    }
  }

  .parameter-info-cell {
    position: relative;
    background-color: #e6f7ff; /* 浅蓝色背景 */
    border: 1px dashed #409eff; /* 浅蓝色虚线边框 */

    .parameter-details div {
      margin: 4px 0;
      line-height: 1.5;
      text-align: left;
    }

    .edit-icon {
      position: absolute;
      top: 2px;
      right: 2px;
      color: #409eff;
    }
  }
}
</style>