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
                {{ record.parameters.quantity }}
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
            <router-link class="inquiry-link" to="/price-inquiry"  @click="handleConfirm">提交询价</router-link>
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
const materialCost = ref(0)
const engineeringCost = ref(0)
const clampingCost = ref(0)
const processingCost = ref(0)
const surfaceCost = ref(0)
const pricePerUnit = ref(0)
import { 
  // currentParameters, 
  // quantity, 
  // updateQuantity,
  modelInfo
} from './AutomationTool' 
import ParameterInfo from './ParameterInfo.vue' // 引入 ParameterInfo 组件
const quantity = ref(1)
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
      pricePerUnit: '',
      totalPrice: '',
      quantity: 0,
      hasThread: false,
      hasAssembly: false,
      materialCost: '',
      engineeringCost: '',
      clampingCost: '',
      processingCost: '',
      surfaceCost: '',
      materialAccessId: '',
      craftAccessId1: '',
      craftAttributeColorAccessIds1: '',
      craftAttributeGlossinessAccessIds1: '',
      craftAttributeFileAccessIds1: '',
      craftAccessId2: '',
      craftAttributeColorAccessIds2: '',
      craftAttributeGlossinessAccessIds2: '',
      craftAttributeFileAccessIds2: '',
      // 保留已有参数
      ...(record.parameters || {})
    }
  }))
}, { immediate: true, deep: true })
const totalQuantity = computed(() => {
  return localRecords.value.reduce((total, record) => total + record.quantity, 0)
})

const copyPart = (index) => {
  const newRecord = JSON.parse(JSON.stringify(localRecords.value[index]))
  localRecords.value.push(newRecord)
  // updateRecords()
}

const deletePart = (index) => {
  localRecords.value.splice(index, 1)
  // updateRecords()
}

const handleUploadSuccess = () => {
  // 处理上传成功逻辑
}

const showParameterDialog = ref(false) // 控制 ParameterInfo 对话框的显示与隐藏

const handleParameterConfirm = (newParameters) => {
  // currentParameters.value = newParameters
  localRecords.value.forEach(record => {
    record.parameters = newParameters
  })
  // updateRecords()
}

const handleConfirm = async () => {
  try {
    // 确保数据存在且类型正确
    if (!localRecords.value || !localRecords.value[0]) {
      ElMessage.error('没有可提交的记录')
      return
    }

    const params = localRecords.value[0].parameters
    const orderData = {
      order_no: generateOrderNo(),
      user_email: '3@q.com',
      // 确保数值类型为数字
      material_cost: Number(params.materialCost || 0),
      engineering_cost: Number(params.engineeringCost || 0),
      clamping_cost: Number(params.clampingCost || 0),
      processing_cost: Number(params.processingCost || 0),
      surface_cost: Number(params.surfaceCost || 0),
      unit_price: Number(params.pricePerUnit || 0),
      total_price: Number(params.totalPrice || 0),
      // 字符串类型
      material: String(params.material || ''),
      // 布尔类型
      surface_treatment: params.surfaceTreatment === 'need',
      // 可选字符串
      treatment1_option: params.selectedTreatment || null,
      treatment1_color: params.selectedColor || null,
      treatment1_gloss: params.glossiness || null,
      treatment1_drawing: params.uploadedFileName || null,
      treatment2_option: params.selectedTreatment2 || null,
      treatment2_color: params.selectedColor2 || null,
      treatment2_gloss: params.glossiness2 || null,
      treatment2_drawing: params.uploadedFileName2 || null,
      // 数值类型
      quantity: Number(params.quantity || 1),
      // 字符串类型
      tolerance: String(params.tolerance || 'GB/T 1804-2000 m级'),
      roughness: String(params.roughness || 'Ra3.2'),
      // 布尔类型
      has_thread: Boolean(params.hasThread),
      has_assembly: Boolean(params.hasAssembly)
    }

    console.log('提交的订单数据:', orderData) // 调试用

    const response = await axios.post('http://localhost:8000/api/orders/orders', orderData)
    if(response.data.message === "订单创建成功") {
      ElMessage.success('订单提交成功')
    }
  } catch (error) {
    console.error('订单提交失败:', error.response?.data || error)
    ElMessage.error(`订单提交失败: ${error.response?.data?.detail || '请重试'}`)
  }
}
// 生成订单号
const generateOrderNo = () => {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `ORDER${year}${month}${day}${random}`
}
onMounted(() => {
  fetchPrices()
})
const fetchPrices = async () => {
      try {
 
        const response = await axios.post('http://localhost:8000/api/price/price', {
          materialAccessId: localRecords.value[0].parameters.materialAccessId,
          crafts: [
            {
              craftAccessId: localRecords.value[0].parameters.craftAccessId1,
              craftAttributeAccessIds: [
                localRecords.value[0].parameters.craftAttributeColorAccessIds1,
                localRecords.value[0].parameters.craftAttributeGlossinessAccessIds1,
                localRecords.value[0].parameters.craftAttributeFileAccessIds1
              ].filter(Boolean) // 过滤空值
            },
            {
              craftAccessId: localRecords.value[0].parameters.craftAccessId2,
              craftAttributeAccessIds: [
                localRecords.value[0].parameters.craftAttributeColorAccessIds2,
                localRecords.value[0].parameters.craftAttributeGlossinessAccessIds2,
                localRecords.value[0].parameters.craftAttributeFileAccessIds2
              ].filter(Boolean)
            }
          ], 
          goodsQuantity: localRecords.value[0].parameters.quantity,
          toleranceAccessId: "4c5b4f8543b34dd2b4c861a270f36ea7",
          roughnessAccessId: "4e6158ff486640ab9c82196c64196fe9",
          deliveryTypeCode: "BD"
        })
        console.log('response', response)
        // 正确解析响应数据
        const priceData = response.data
        console.log('priceData', priceData)
        materialCost.value = priceData.materialPrice
        engineeringCost.value = priceData.programPrice
        clampingCost.value = priceData.clampPrice
        processingCost.value = priceData.processPrice
        surfaceCost.value = priceData.craftPrice
        pricePerUnit.value = priceData.price
      } catch (error) {
        console.error('请求失败:', error.response?.data || error.message)
        ElMessage.error('获取价格信息失败，请检查网络连接')
      }
}
// 添加计算属性
const totalPrice = computed(() => {
  return pricePerUnit.value * localRecords.value[0].parameters.quantity
})
</script>

<style lang="scss" scoped>
.custom-number-input {
  display: inline-flex;
  align-items: center;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
  transition: border-color 0.2s;

  &:hover {
    border-color: #409eff;
  }

  .number-btn {
    width: 32px;
    height: 32px;
    padding: 0;
    border: none;
    border-radius: 0;
    background: #f5f7fa;

    &:hover {
      background: #ecf5ff;
      color: #409eff;
    }

    &:active {
      background: #d9ecff;
    }

    &:disabled {
      background: #f5f7fa;
      color: #c0c4cc;
      cursor: not-allowed;
    }
  }

  .number-value {
    width: 40px;
    text-align: center;
    font-size: 14px;
    color: #606266;
    border-left: 1px solid #ebeef5;
    border-right: 1px solid #ebeef5;
  }
}
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