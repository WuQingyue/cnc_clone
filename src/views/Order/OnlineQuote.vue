<template>
  <div class="online-quote">

    <!-- 文件上传部分或文件列表部分 -->
    <div class="quote-section">
      <template v-if="isOrdering">
        <file-list 
          :selectedRecords="selectedRecords"
          :currentProcess="currentProcess"
        />
      </template>
      <div class="upload-header">
        <h2 class="section-title">上传图纸</h2>
        <div class="button-group">
          <button class="blue-button" @click="openGuidance">CNC下单必看</button>
          <button class="gray-button" @click="openGuidance2D">2D文件转换须知</button>
          <button class="gray-button" @click="openGuidanceSecret">保密协议</button>
        </div>
      </div>
      <file-uploader 
        :process-info="currentProcess"
        @update-history="handleUpdateHistory"
      />
    
    </div>

    <!-- 历史记录组件 -->
    <history-list
      :history-data="historyData"
      @refresh="fetchHistory(currentProcess?.type)"
      @fileInfo="handleOrder"
      @delete="handleDelete"
    />

    <!-- 添加客户指引组件 -->
    <CustomerGuidance ref="guidanceRef" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import FileUploader from '@/components/quote/FileUploader.vue'
import HistoryList from '@/components/quote/HistoryList.vue'
import FileList from '@/components/quote/FileList.vue'
import CustomerGuidance from '@/views/NavHeader/CustomerGuidance/CustomerGuidance.vue'
import { processList } from '@/components/quote/processList.js'
import { roughness, tolerance } from '@/components/quote/AutomationTool.js'

const currentProcess = ref(null)
const historyData = ref([])
const isOrdering = ref(false) // 控制是否显示 FileList 组件
const selectedRecords = ref({}) // 存储选中的记录

import service from '@/utils/request'
const fetchHistory = async (processType) => {
  if (!processType) return
  
  try {
    const response = await service.get(
      `/api/upload/history/${processType}`,
      { withCredentials: true }
    )
    console.log('获取历史记录', response.data)
    if (response.data.success) {
      historyData.value = response.data.data
    }
  } catch (error) {
    ElMessage.error('获取历史记录失败')
  }
}

const handleOrder = ({fileInfoAccessId, 
      productModelAccessId,
      sizeX,
      sizeY,
      sizeZ,
      modelVolume,
      modelSurfaceArea,
      file_name}) => {
  console.log('productModelAccessId', productModelAccessId)
  isOrdering.value = true // 设置为 true 以显示 FileList 组件
  // 设置记录的其他属性
  const record = {
    selected: true,
    fileName:file_name,
    remarks: '',
    quantity: 1,
    material: '铝合金-6061',
    surfaceTreatment: 'none',
    tolerance: tolerance.type,
    toleranceAccessId: tolerance.toleranceAccessId,
    roughness: roughness.type,
    roughnessAccessId: roughness.roughnessAccessId,
    selectedTreatment: '',
    selectedColor: '',
    glossiness: '',
    uploadedFileName: '',
    selectedTreatment2: '',
    selectedColor2: '',
    glossiness2: '',
    uploadedFileName2: '',
    hasThread: false,
    hasAssembly: false,
    materialAccessId: '0d8a7a799a574b02822e67c48b57bee0',
    craftAccessId1: '',
    craftAttributeColorAccessIds1: '',
    craftAttributeGlossinessAccessIds1: '',
    craftAttributeFileAccessIds1: '',
    craftAccessId2: '',
    craftAttributeColorAccessIds2: '',
    craftAttributeGlossinessAccessIds2: '',
    craftAttributeFileAccessIds2: '',
    materialCost: 0,
    engineeringCost: 0,
    clampingCost: 0,
    processingCost: 0,
    surfaceCost: 0,
    expeditedPrice: 0,
    pricePerUnit: 0,
    totalPrice: 0,
    deliveryTypeCode: 'BD',
    categoryName: '铝合金',
    getSurfaceTreatmentLabel: '表面不做处理',
    fileInfoAccessId: fileInfoAccessId,
    productModelAccessId: productModelAccessId,
    sizeX: sizeX,
    sizeY: sizeY,
    sizeZ: sizeZ,
    modelVolume:modelVolume,
    modelSurfaceArea: modelSurfaceArea,
    EstimatedDeliveryTime:'10个工作日'
  }
  selectedRecords.value = record
  console.log('OnlineQuote组件的selectedRecords.value', selectedRecords.value)
}

const handleDelete = async (id) => {
  console.log('删除:', id)
}

onMounted(() => {
  const threeDPrintProcess = processList.find(process => process.type === 'cnc');
  if (threeDPrintProcess) {
    currentProcess.value = threeDPrintProcess;
    fetchHistory('cnc');
  }
})

// 客户指引
const guidanceRef = ref(null)
const openGuidance = () => {
  guidanceRef.value?.openDialog()
}
const openGuidance2D = () => {
  guidanceRef.value?.openDialog()
  // 切换到2D文件转换须知
  guidanceRef.value?.switchComponent('FileGuidance')
}

const openGuidanceSecret = () => {
  guidanceRef.value?.openDialog()
  // 切换到保密协议
  guidanceRef.value?.switchComponent('SecretGuidance')
}

const handleUpdateHistory = () => {
    fetchHistory('cnc')
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

    .upload-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .section-title {
      font-size: 18px;
      font-weight: bold;
      color: #303133;
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

    .button-group {
      display: flex;
      gap: 10px;

      .blue-button {
        background-color: #409eff;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s;
      }

      .gray-button {
        background-color: transparent;
        color: #909399;
        border: 1px solid #909399;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.3s;
      }

      .gray-button:hover {
        color: #409eff;
        border-color: #409eff;
      }
    }
  }
}
</style>