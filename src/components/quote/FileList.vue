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
              <th>选择</th>
              <th>序号</th>
              <th>图纸</th>
              <th>模型信息</th>
              <th>参数信息</th>
              <th>数量（件）</th>
              <th>单价</th>
              <th>总价</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(record, index) in localRecords" :key="index">
              <td>
                <input type="checkbox" v-model="record.selected" />
              </td>
              <td>{{ index + 1 }}</td> 
              <td>{{ record.file_name }}</td>
              <td>
                尺寸: {{ modelInfo.size }}<br>
                体积: {{ modelInfo.volume }}<br>
                表面积: {{ modelInfo.surfaceArea }}<br>
                备注: {{ modelInfo.remarks }}
              </td>
              <td class="parameter-info-cell" @click="openParameterDialog(record)">
                <div class="parameter-details">
                  <div>{{ record.material || '铝合金-6061' }}</div>
                  <div v-if="record.surfaceTreatment === 'none'">
                    表面不做处理
                  </div>
                  <div v-else>
                    <template v-if="record.selectedTreatment">
                      表面处理一: {{ record.selectedTreatment }} 
                      <span v-if="record.selectedColor">- {{ record.selectedColor }}</span>
                      <span v-if="record.glossiness">- {{ record.glossiness }}</span>
                      <span v-if="record.uploadedFileName">- {{ record.uploadedFileName }}</span>
                    </template>
                    <template v-if="record.selectedTreatment2">
                      <br>表面处理二: {{ record.selectedTreatment2 }}
                      <span v-if="record.selectedColor2">- {{ record.selectedColor2 }}</span>
                      <span v-if="record.glossiness2">- {{ record.glossiness2 }}</span>
                      <span v-if="record.uploadedFileName2">- {{ record.uploadedFileName2 }}</span>
                    </template>
                  </div>
                  <div>最严公差: {{ record.tolerance || 'GB/T 1804-2000 m级' }}</div>
                  <div>最小粗糙度: {{ record.roughness || 'Ra3.2' }}</div>
                </div>
                <el-icon class="edit-icon">
                  <Edit />
                </el-icon>
              </td>
              <td>
                {{ record.quantity }}
              </td>
              <td>{{ record.pricePerUnit }}</td>
              <td>{{ record.totalPrice }}</td>
              <td>
                <button @click="copyPart(index)">复制零件</button>
                <button @click="deletePart(index)">删除零件</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- 右部分：信息框 -->
      <div class="right-section">
        <div class="info-box">
          <!-- 单选按钮组 -->
          <div class="delivery-options">
            <label v-for="option in deliveryOptions" :key="option.code">
              <input
                type="radio"
                :value="option.code"
                v-model="selectedDeliveryType"  
              />
              {{ option.type }}  <!-- 显示选项类型 -->
            </label>
          </div>
          <button class="blue-button">
            <router-link class="inquiry-link" to="/price-inquiry"  @click="handleConfirm">提交询价</router-link>
          </button>
          <button class="white-button">
            <el-icon><ShoppingCart /></el-icon>
            <span>加入购物车</span>
          </button>
          <div ref="paypalButtonContainer"></div>
        </div>
      </div>
    </div>
    <!-- 引入 ParameterInfo 组件 -->
    <ParameterInfo 
      :visible="showParameterDialog"
      @update:visible="showParameterDialog = $event"
      @confirm="handleParameterConfirm"
      :record="selectedRecord"  
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { ShoppingCart, Edit } from '@element-plus/icons-vue' // 引入 Edit 图标
import axios from 'axios'
const selectedDeliveryType = ref('')  // 用于存储选中的交期类型

import { 
  modelInfo,
  deliveryOptions
} from './AutomationTool' 
import ParameterInfo from './ParameterInfo.vue' // 引入 ParameterInfo 组件
const props = defineProps({
  selectedRecords: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:selectedRecords'])

// 创建本地数据副本
const localRecords = ref([])

// 监听 props 变化更新本地数据
watch(() => props.selectedRecords, (record) => {
  record = JSON.parse(JSON.stringify(record))
  console.log('record', record)
  // 将 record 对象加入到 localRecords.value 中
  localRecords.value.push(record);
  console.log('下单localRecords.value', localRecords.value)
}, { immediate: true, deep: true })

const copyPart = (index) => {
  const newRecord = JSON.parse(JSON.stringify(localRecords.value[index]))
  console.log('newRecord', newRecord)
  localRecords.value.push(newRecord)
  console.log('复制localRecords.value', localRecords.value)
}

const deletePart = (index) => {
  localRecords.value.splice(index, 1)
  console.log('localRecords.value', localRecords.value)
}

const showParameterDialog = ref(false) // 控制 ParameterInfo 对话框的显示与隐藏
const selectedRecord = ref(null) // 用于存储当前选中的记录

const openParameterDialog = (record) => {
  selectedRecord.value = record; // 设置当前选中的记录
  showParameterDialog.value = true; // 显示对话框
}

const handleParameterConfirm = (newParameters) => {
  // 更新当前选中的记录的参数
  Object.assign(selectedRecord.value, newParameters);
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
  // fetchPrices()
})
</script>

<style lang="scss" scoped>
.delivery-options {
  margin-bottom: 20px;  /* 添加底部间距 */
}
.delivery-options label {
  display: block;  /* 每个单选按钮占一行 */
  margin: 5px 0;  /* 添加上下间距 */
}
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