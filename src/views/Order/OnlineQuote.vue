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
        @upload-success="handleUploadSuccess"
      />
    </div>

    <!-- 历史记录组件 -->
    <history-list
      :history-data="historyData"
      @refresh="fetchHistory(currentProcess?.type)"
      @order="handleOrder"
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
const guidanceVisible = ref(false) // 初始化为 false
const activeIndex = ref(0) // 初始化为 0

const fetchHistory = async (processType) => {
  if (!processType) return
  
  try {
    const response = await axios.get(
      `http://localhost:8000/api/upload/history/${processType}`,
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

const handleProcessChange = async (process) => {
  currentProcess.value = process
  fetchHistory(process.type)
}
const fileInfoAccessId = ref('')
const productModelAccessId = ref('')
const sizeX = ref('')
const sizeY = ref('')
const sizeZ = ref('')
const modelVolume = ref('')
const modelSurfaceArea = ref('')
const handleOrder = (record) => {
  isOrdering.value = true // 设置为 true 以显示 FileList 组件
  record.selected = true
  record.remarks = '' // 备注
  record.quantity = 1 // 数量
  record.material = '铝合金-6061' // 材料
  record.surfaceTreatment = 'none' // 表面处理
  record.tolerance = tolerance.type
  record.toleranceAccessId = tolerance.toleranceAccessId
  record.roughness = roughness.type
  record.roughnessAccessId = roughness.roughnessAccessId
  record.selectedTreatment = ''
  record.selectedColor = ''
  record.glossiness = ''
  record.uploadedFileName = ''
  record.selectedTreatment2 = ''
  record.selectedColor2 = ''
  record.glossiness2 = ''
  record.uploadedFileName2 = ''
  record.quantity = 1
  record.hasThread = false
  record.hasAssembly = false
  record.materialAccessId = '0d8a7a799a574b02822e67c48b57bee0'
  record.craftAccessId1 = ''
  record.craftAttributeColorAccessIds1 = ''
  record.craftAttributeGlossinessAccessIds1 = ''
  record.craftAttributeFileAccessIds1 = ''
  record.craftAccessId2 = ''
  record.craftAttributeColorAccessIds2 = ''
  record.craftAttributeGlossinessAccessIds2 = ''
  record.craftAttributeFileAccessIds2 = ''
  record.materialCost = 0
  record.engineeringCost = 0
  record.clampingCost = 0
  record.processingCost = 0
  record.surfaceCost = 0
  record.expeditedPrice = 0
  record.pricePerUnit = 0
  record.totalPrice = 0
  record.deliveryTypeCode = 'BD'
  record.categoryName = '铝合金'
  record.getSurfaceTreatmentLabel = '表面不做处理'
  selectedRecords.value = record
  record.fileInfoAccessId = fileInfoAccessId.value
  record.productModelAccessId = productModelAccessId.value
  record.sizeX = sizeX.value
  record.sizeY = sizeY.value
  record.sizeZ = sizeZ.value
  record.modelVolume = modelVolume.value
  record.modelSurfaceArea = modelSurfaceArea.value
  console.log('selectedRecords.value', selectedRecords.value)
}

const handleDelete = async (id) => {
  console.log('删除:', id)
}

const handleUploadSuccess = (response) => {
  fileInfoAccessId.value = response.data.data[0].fileInfoAccessId
  console.log('fileInfoAccessId', fileInfoAccessId.value)
  axios.post(`http://localhost:8000/api/upload/get_analysis_result?data=${fileInfoAccessId.value}`)
  .then(response => {
      productModelAccessId.value = response.data.data.productModelAccessId
      sizeX.value = response.data.data.sizeX
      sizeY.value = response.data.data.sizeY
      sizeZ.value = response.data.data.sizeZ
      modelVolume.value = response.data.data.modelVolume
      modelSurfaceArea.value =response.data.data.modelSurfaceArea
    })
  if (currentProcess.value?.type) {
    fetchHistory(currentProcess.value.type)
  }
}

const showGuidance = (index = 0) => {
  activeIndex.value = index
  guidanceVisible.value = true // 设置为 true 以显示对话框
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