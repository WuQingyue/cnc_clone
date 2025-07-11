<template>
  <!-- 1. 新增：页面主容器，控制整体布局和背景 -->
  <div class="cart-page-container">
    <!-- 2. 新增：白色内容卡片，包裹所有内容 -->
    <div class="cart-content-box">
      <!-- 3. 新增：页面标题，模仿图1样式 -->
      <h2 class="section-title">| 购物车</h2>

      <!-- 数据表格 -->
      <el-table
        :data="filteredCart"
        style="width: 100%"
        border
        stripe
        v-loading="loading"
        @selection-change="handleSelectionChange"
        :row-key="row => row.id"
        size="small"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column type="index" label="序号" width="80" align="center" />
        <!-- 预览图列 -->
        <el-table-column label="预览图" width="140" align="center">
          <template #default="scope">
            <a v-if="scope.row.preview_url" :href="scope.row.preview_url" target="_blank">
              <el-image
                :src="scope.row.preview_url"
                fit="cover"
                class="preview-image"
              >
                <template #error>
                  <div class="image-error">
                    <el-icon><document /></el-icon>
                  </div>
                </template>
              </el-image>
            </a>
            <div v-else class="no-preview">
              <el-icon><document /></el-icon>
            </div>
          </template>
        </el-table-column>
        <!-- 模型信息 -->
        <el-table-column prop="modelInfo" label="模型信息" width="180" align="center">
          <template #default="scope">
            <div class="model-info-details">
              文件名: {{ scope.row.file_name }}<br>
              尺寸: {{ scope.row.length }}*{{ scope.row.width }}*{{ scope.row.height }} mm<br>
              体积: {{ scope.row.volume }} mm<sup>3</sup><br>
              表面积: {{ scope.row.surface_area }} mm<sup>2</sup><br>
            </div>
          </template>
        </el-table-column>
        <!-- 加工参数列 -->
        <el-table-column label="加工参数" width="220" align="center">
          <template #default="scope">
            <div
              class="parameter-info-cell"
              @click="openParameterDialog(scope.row)"
            >
              <div class="parameter-details">
                <div>{{ scope.row.material || '铝合金-6061' }}</div>
                <div v-if="!scope.row.surface_treatment">
                  表面不做处理
                </div>
                <div v-else>
                  <template v-if="scope.row.treatment1_option">
                    表面处理一: {{ scope.row.treatment1_option }}
                    <span v-if="scope.row.treatment1_color">- {{ scope.row.treatment1_color }}</span>
                    <span v-if="scope.row.treatment1_gloss">- {{ scope.row.treatment1_gloss }}</span>
                    <span v-if="scope.row.treatment1_drawing">- {{ scope.row.treatment1_drawing }}</span>
                  </template>
                  <template v-if="scope.row.treatment2_option">
                    <br>表面处理二: {{ scope.row.treatment2_option }}
                    <span v-if="scope.row.treatment2_color">- {{ scope.row.treatment2_color }}</span>
                    <span v-if="scope.row.treatment2_gloss">- {{ scope.row.treatment2_gloss }}</span>
                    <span v-if="scope.row.treatment2_drawing">- {{ scope.row.treatment2_drawing }}</span>
                  </template>
                </div>
                <div>最严公差: {{ scope.row.tolerance || 'GB/T 1804-2000 m级' }}</div>
                <div>最小粗糙度: {{ scope.row.roughness || 'Ra3.2' }}</div>
              </div>
              <el-icon class="edit-icon">
                <Edit />
              </el-icon>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="deliveryTime" label="预计交期" width="140" align="center">
          <template #default="scope">
            {{ scope.row.expected_delivery_date }}
          </template>
        </el-table-column>
        <el-table-column prop="quantity" label="数量" width="100" align="center" />
        <el-table-column label="小计(元)" width="140" align="center">
          <template #default="scope">
            {{ scope.row.totalPrice.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" align="center">
          <template #default="scope">
            <el-button
              type="danger"
              size="small"
              @click="removeItem(scope.row)"
            >
              移除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 4. 新增：底部容器，用于对齐分页和结算区域 -->
      <div class="bottom-section">
        <!-- 分页区域 -->
        <div class="pagination-container">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50]"
            :total="cart.length"
            layout="total, sizes, prev, pager, next, jumper"
            background
          />
        </div>

        <!-- 结算区域 -->
        <div class="cart-summary">
          <span>总计：<b>{{ totalAmount.toFixed(2) }}</b> 元</span>
          <el-button
            type="primary"
            :disabled="selectedItems.length === 0"
            @click="submitInquiry"
          >提交询价</el-button>
        </div>
      </div>
    </div>

    <!-- 参数编辑对话框 -->
    <ParameterInfo
      :visible="showParameterDialog"
      @update:visible="showParameterDialog = $event"
      @confirm="handleParameterConfirm"
      :record="currentEditRecord"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Document, Edit } from '@element-plus/icons-vue'
import ParameterInfo from '../quote/ParameterInfo.vue'
import { parametersList } from '../quote/AutomationTool.js'
import service from '@/utils/request'
import { useRouter } from 'vue-router'

const router = useRouter()

const cart = ref([])
const loading = ref(false)
const showParameterDialog = ref(false)
const currentEditRecord = ref(null)

const currentPage = ref(1)
const pageSize = ref(10)

const fetchCart = async () => {
  loading.value = true
  try {
    const res = await service.get('/api/orders/get_cart', { withCredentials: true })
    console.log('获取购物车数据', res.data)
    if (res.data.success) {
      cart.value = (res.data.result || []).map(item => {
        const processing = item.model_processing_info || {}
        const size = item.model_size_info || {}
        const cartInfo = item.cart || {}
        return {
          id: cartInfo.id,
          totalPrice: cartInfo.price, // 这里的 price 应该是该商品的总价（单价*数量）
          quantity: cartInfo.quantity,
          expected_delivery_date: cartInfo.expected_delivery_date,
          file_name: size.file_name,
          length: size.length,
          width: size.width,
          height: size.height,
          volume: size.volume,
          surface_area: size.surface_area,
          // 处理工艺1相关信息
          craftAccessId1: size.craftAccessId1,
          craftAttributeColorAccessIds1: size.craftAttributeColorAccessIds1,
          craftAttributeGlossinessAccessIds1: size.craftAttributeGlossinessAccessIds1,
          craftAttributeFileAccessIds1: size.craftAttributeFileAccessIds1,
          // 处理工艺2相关信息
          craftAccessId2: size.craftAccessId2,
          craftAttributeColorAccessIds2: size.craftAttributeColorAccessIds2,
          craftAttributeGlossinessAccessIds2: size.craftAttributeGlossinessAccessIds2,
          craftAttributeFileAccessIds2: size.craftAttributeFileAccessIds2,
          getSurfaceTreatmentLabel: size.getSurfaceTreatmentLabel,

          material: processing.material,
          surface_treatment: processing.surface_treatment, // 布尔值
          treatment1_option: processing.treatment1_option,
          treatment1_color: processing.treatment1_color,
          treatment1_gloss: processing.treatment1_gloss,
          treatment1_drawing: processing.treatment1_drawing,
          treatment2_option: processing.treatment2_option,
          treatment2_color: processing.treatment2_color,
          treatment2_gloss: processing.treatment2_gloss,
          treatment2_drawing: processing.treatment2_drawing,
          tolerance: processing.tolerance,
          roughness: processing.roughness,
          hasThread: processing.has_thread,
          hasAssembly: processing.has_assembly,
          notes: processing.notes,
          materialAccessId: processing.materialAccessId,

          toleranceAccessId: item.toleranceAccessId || '',
          roughnessAccessId: item.roughnessAccessId || '',
          preview_url: item.preview_url || '',
          productModelAccessId: item.productModelAccessId || '',
          deliveryTypeCode: item.deliveryTypeCode || 'BD',
          fileInfoAccessId: item.fileInfoAccessId || '',
        }
      });
    } else {
      ElMessage.error('购物车数据获取失败')
    }
  } catch (err) {
    ElMessage.error('购物车数据获取失败')
    console.error(err)
  } finally {
    loading.value = false
  }
}
onMounted(fetchCart)

const filteredCart = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return cart.value.slice(start, end)
})

const selectedItems = ref([])
const totalAmount = ref(0)

const updateTotal = () => {
  totalAmount.value = selectedItems.value.reduce(
    (sum, item) => sum + (item.totalPrice || 0), 0
  )
}

const handleSelectionChange = (val) => {
  selectedItems.value = val
  updateTotal()
}

watch(filteredCart, () => {
  selectedItems.value = selectedItems.value.filter(sel =>
    cart.value.some(item => item.id === sel.id)
  )
  updateTotal()
}, { deep: true })

const removeItem = async (rowToRemove) => {
  try {
    // 实际项目中这里可能需要调用后端接口删除购物车项
    // const res = await service.post('/api/orders/remove_cart_item', { id: rowToRemove.id }, { withCredentials: true });
    // if (!res.data.success) {
    //   ElMessage.error('移除商品失败');
    //   return;
    // }

    const index = cart.value.findIndex(item => item.id === rowToRemove.id)
    if (index !== -1) {
      cart.value.splice(index, 1)

      if (filteredCart.value.length === 0 && currentPage.value > 1) {
        currentPage.value--
      }
      updateTotal();
      ElMessage.success('已移除商品')
    }
  } catch (err) {
    ElMessage.error('移除商品失败，请稍后再试。')
    console.error(err)
  }
}

const submitInquiry = async () => {
  if (selectedItems.value.length === 0) {
    ElMessage.warning('请选择要询价的商品！')
    return
  }

  // 映射 selectedItems 为后端 `save_selected_datas` 接口所需的格式
  const payload = selectedItems.value.map(item => {
    let foundCategoryName = ''
    let materialAccessId = ''
    for (const category of parametersList) {
      const materialExists = category.children.some(material => material.materialName === item.material)
      if (materialExists) {
        materialAccessId = category.children.find(material => material.materialName === item.material).materialAccessId
        foundCategoryName = category.name
        break
      }
    }

    return {
      EstimatedDeliveryTime: item.expected_delivery_date,
      categoryName: foundCategoryName || '',
      clampingCost: 0.0,
      craftAccessId1: item.craftAccessId1,
      craftAccessId2: item.craftAccessId2,
      craftAttributeColorAccessIds1: item.craftAttributeColorAccessIds1,
      craftAttributeColorAccessIds2: item.craftAttributeColorAccessIds2,
      craftAttributeFileAccessIds1: item.craftAttributeFileAccessIds1,
      craftAttributeFileAccessIds2: item.craftAttributeFileAccessIds2,
      craftAttributeGlossinessAccessIds1: item.craftAttributeGlossinessAccessIds1,
      craftAttributeGlossinessAccessIds2: item.craftAttributeGlossinessAccessIds2,
      getSurfaceTreatmentLabel: item.getSurfaceTreatmentLabel,
      
      deliveryTypeCode: item.deliveryTypeCode,
      engineeringCost: 0.0,
      expeditedPrice: 0.0,
      fileInfoAccessId: item.fileInfoAccessId,
      fileName: item.file_name, // 修正：后端期望 fileName
      glossiness: item.treatment1_gloss, // 修正：后端期望 glossiness
      glossiness2: item.treatment2_gloss, // 修正：后端期望 glossiness2
      hasAssembly: item.hasAssembly,
      hasThread: item.hasThread,
      material: item.material,
      materialAccessId: materialAccessId || '',
      materialCost: 0.0,
      modelSurfaceArea: item.surface_area,
      modelVolume: item.volume,
      pricePerUnit: item.totalPrice / item.quantity,
      processingCost: 0.0,
      productModelAccessId: item.productModelAccessId,
      quantity: item.quantity,
      remarks: item.notes || '',
      roughness: item.roughness,
      roughnessAccessId: item.roughnessAccessId,
      selected: true,
      selectedColor: item.treatment1_color, // 修正：后端期望 selectedColor
      selectedColor2: item.treatment2_color, // 修正：后端期望 selectedColor2
      selectedTreatment: item.treatment1_option, // 修正：后端期望 selectedTreatment
      selectedTreatment2: item.treatment2_option, // 修正：后端期望 selectedTreatment2
      sizeX: item.length, // 修正：后端期望 sizeX
      sizeY: item.width, // 修正：后端期望 sizeY
      sizeZ: item.height, // 修正：后端期望 sizeZ
      surfaceCost: 0.0,
      surfaceTreatment: item.surface_treatment ? 'need' : 'none',
      tolerance: item.tolerance,
      toleranceAccessId: item.toleranceAccessId,
      totalPrice: item.totalPrice,
      uploadedFileName: item.treatment1_drawing, // 修正：后端期望 uploadedFileName
      uploadedFileName2: item.treatment2_drawing, // 修正：后端期望 uploadedFileName2
    }
  })

  try {
    loading.value = true
    // 确保请求路径正确，根据您的图片，应该是 /api/price/save_selected_datas
    // 但图片显示的是 /api/orders/save_selected_datas，请根据实际API路径调整
    const res = await service.post('/api/orders/save_selected_datas', payload, { withCredentials: true })
    if (res.data.success) {
      ElMessage.success('询价数据已提交，即将跳转到询价页面。')
      router.push('/price-inquiry')
    } else {
      ElMessage.error(res.data.msg || '提交询价失败。')
    }
  } catch (err) {
    ElMessage.error('提交询价失败，请稍后再试。')
    console.error(err)
  } finally {
    loading.value = false
  }
}

const openParameterDialog = (record) => {
  let foundCategoryName = ''
  for (const category of parametersList) {
    const materialExists = category.children.some(material => material.materialName === record.material)
    if (materialExists) {
      foundCategoryName = category.name
      break
    }
  }

  if (!foundCategoryName) {
    console.warn(`在 "parametersList" 中没有找到材料 "${record.material}" 所属的分类。`)
  }

  const mappedRecord = {
    id: record.id,
    material: record.material,
    categoryName: foundCategoryName,
    surfaceTreatment: record.surface_treatment ? 'need' : 'none',
    quantity: record.quantity,
    tolerance: record.tolerance,
    roughness: record.roughness,
    hasThread: record.hasThread,
    hasAssembly: record.hasAssembly,
    notes: record.notes,
    selectedTreatment: record.treatment1_option,
    selectedColor: record.treatment1_color,
    glossiness: record.treatment1_gloss,
    uploadedFileName: record.treatment1_drawing,
    selectedTreatment2: record.treatment2_option,
    selectedColor2: record.treatment2_color,
    glossiness2: record.treatment2_gloss,
    uploadedFileName2: record.treatment2_drawing,
    pricePerUnit: record.price / record.quantity,
    totalPrice: record.price,
    materialAccessId: record.materialAccessId,
    craftAccessId1: record.craftAccessId1,
    craftAttributeColorAccessIds1: record.craftAttributeColorAccessIds1,
    craftAttributeGlossinessAccessIds1: record.craftAttributeGlossinessAccessIds1,
    craftAttributeFileAccessIds1: record.craftAttributeFileAccessIds1,
    craftAccessId2: record.craftAccessId2,
    craftAttributeColorAccessIds2: record.craftAttributeColorAccessIds2,
    craftAttributeGlossinessAccessIds2: record.craftAttributeGlossinessAccessIds2,
    craftAttributeFileAccessIds2: record.craftAttributeFileAccessIds2,
    getSurfaceTreatmentLabel: record.getSurfaceTreatmentLabel,
    deliveryTypeCode: record.deliveryTypeCode,
    productModelAccessId: record.productModelAccessId,
    fileInfoAccessId: record.fileInfoAccessId,
    roughnessAccessId: record.roughnessAccessId,
    toleranceAccessId: record.toleranceAccessId
  }

  currentEditRecord.value = mappedRecord
  showParameterDialog.value = true
}

const handleParameterConfirm = (newParameters) => {
  const index = cart.value.findIndex(item => item.id === currentEditRecord.value.id)
  if (index !== -1) {
    const originalRecord = cart.value[index]
    const updatedRecord = {
      ...originalRecord,
      material: newParameters.material,
      surface_treatment: newParameters.surfaceTreatment === 'need',
      quantity: newParameters.quantity,
      tolerance: newParameters.tolerance,
      roughness: newParameters.roughness,
      hasThread: newParameters.hasThread,
      hasAssembly: newParameters.hasAssembly,
      notes: newParameters.notes,
      treatment1_option: newParameters.selectedTreatment,
      treatment1_color: newParameters.selectedColor,
      treatment1_gloss: newParameters.glossiness,
      treatment1_drawing: newParameters.uploadedFileName,
      treatment2_option: newParameters.selectedTreatment2,
      treatment2_color: newParameters.selectedColor2,
      treatment2_gloss: newParameters.glossiness2,
      treatment2_drawing: newParameters.uploadedFileName2,
      totalPrice: newParameters.totalPrice, // 确保这里是 total price
      materialAccessId: newParameters.materialAccessId,
      craftAccessId1: newParameters.craftAccessId1,
      craftAttributeColorAccessIds1: newParameters.craftAttributeColorAccessIds1,
      craftAttributeGlossinessAccessIds1: newParameters.craftAttributeGlossinessAccessIds1,
      craftAttributeFileAccessIds1: newParameters.craftAttributeFileAccessIds1,
      craftAccessId2: newParameters.craftAccessId2,
      craftAttributeColorAccessIds2: newParameters.craftAttributeColorAccessIds2,
      craftAttributeGlossinessAccessIds2: newParameters.craftAttributeGlossinessAccessIds2,
      craftAttributeFileAccessIds2: newParameters.craftAttributeFileAccessIds2,
      getSurfaceTreatmentLabel: newParameters.getSurfaceTreatmentLabel,
      deliveryTypeCode: newParameters.deliveryTypeCode,
      productModelAccessId: newParameters.productModelAccessId,
      roughnessAccessId: newParameters.roughnessAccessId,
      toleranceAccessId: newParameters.toleranceAccessId
    }
    cart.value[index] = updatedRecord;
    updateTotal();
    ElMessage.success('参数已更新');
  }
}
</script>

<style scoped>
/* Styles remain unchanged */
.cart-page-container {
  padding: 80px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 80px);
}
.cart-content-box {
  max-width: 1700px;
  margin: 0 auto;
  background-color: #fff;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}
.section-title {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 20px;
  padding-left: 10px;
  border-left: 3px solid #409eff;
  text-align: left;
}
.el-table {
  border-radius: 8px;
  overflow: hidden;
}
.el-table th, .el-table td {
  text-align: center;
}
.bottom-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}
.pagination-container {

}
.cart-summary {
  display: flex;
  align-items: center;
  gap: 20px;
  font-size: 18px;
}
.cart-summary b {
  color: #ff4d4f;
}
.preview-image {
  width: 40px !important;
  height: 40px !important;
  border-radius: 4px;
  border: 1px solid #ebeef5;
  transition: all 0.3s;
  vertical-align: middle;
}
.preview-image:hover {
  transform: scale(1.1);
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}
.image-error,
.no-preview {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  background: #f5f7fa;
  border-radius: 4px;
  color: #909399;
  margin: 0 auto;
}
.parameter-info-cell {
  position: relative;
  background-color: #e6f7ff;
  border: 1px dashed #409eff;
  padding: 4px;
  text-align: left;
  cursor: pointer;
}
.parameter-info-cell:hover {
  background-color: #d6ecff;
}
.parameter-details {
  font-size: 12px;
}
.parameter-details div {
  margin: 2px 0;
  line-height: 1.3;
}
.model-info-details {
  line-height: 1.4;
  font-size: 12px;
}
.edit-icon {
  position: absolute;
  top: 4px;
  right: 4px;
  color: #409eff;
  font-size: 14px;
}
</style>
