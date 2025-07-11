<template>
  <div class="total-info">
    <el-card class="info-card">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-container">
        <el-skeleton :rows="5" animated />
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="error-container">
        <el-empty description="数据加载失败">
          <el-button type="primary" @click="retryLoading">重试</el-button>
        </el-empty>
      </div>

      <!-- 正常状态 -->
      <template v-else>
        <!-- 第一部分：交期&快递 -->
        <div class="info-section">
          <div class="section-title">交期&快递</div>
          <div class="info-row">
            <span class="label">快递</span>
            <span class="value">{{ selectedAddress?.postName || '未选择' }}</span>
          </div>
          <div class="info-row">
            <span class="label">预计发货时间：</span>
            <span class="value">{{ deliveryDate }}（以实际支付时间为准）</span>
          </div>
          <div class="info-row">
            <span class="label">物流运输时间:</span>
            <span class="value"> {{ shippingTime }} 个工作日</span>
          </div>
        </div>

        <!-- 第二部分：订单费用 -->
        <div class="info-section">
          <div class="section-title">订单费用</div>
          <div class="info-row">
            <span class="label">零件数量</span>
            <!-- 零件数量显示：几款/几件 -->
            <span class="value">{{ totalPartsCount }}款/{{ totalPartsQuantity }}件</span>
          </div>
          <div class="info-row">
            <span class="label">运费</span>
            <span class="value">¥{{ totalShippingFee.toFixed(2) }}</span>
            <el-tooltip placement="top" effect="dark">
              <template #content>
                运费: {{ baseShippingFee.toFixed(2) }}元<br />
                挂号费: {{ registrationFee.toFixed(2) }}元
              </template>
              <el-icon class="question-icon"><QuestionFilled /></el-icon>
            </el-tooltip>
          </div>
          <div class="info-row">
            <span class="label">商品总额(含税)：</span>
            <span class="value">¥{{ totalGoodsPrice.toFixed(2) }}</span>
          </div>
        </div>

        <!-- 第三部分：优惠券 -->
        <div class="coupon-section">
          <span class="label">优惠券</span>
          <span class="value coupon-text">已选择"CNC15元运费抵扣券"></span>
        </div>

        <!-- 第四部分：应付款 -->
        <div class="total-section">
          <span class="label bold">应付款（含税）：</span>
          <span class="value price">¥{{ finalAmount.toFixed(2) }}</span>
        </div>

        <el-divider class="divider" />

        <!-- 按钮区域 -->
        <div class="button-group">
          <el-button type="primary" class="submit-btn" @click="submitOrder">
            提交询价
          </el-button>
          <el-button class="back-btn" @click="goBack">
            返回上一步
          </el-button>
        </div>
      </template>
    </el-card>
  </div>
</template>

<script setup>
import { ref, defineProps, watch, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { QuestionFilled } from '@element-plus/icons-vue'
import service from '@/utils/request'

const props = defineProps({
  selectedDatas: {
    type: Array,
    required: true
  },
  selectedAddress: {
    type: Object,
    default: null
  }
})

const router = useRouter()

// --- 响应式状态定义 ---
const loading = ref(true)
const error = ref(false)

// 订单和物料信息
const orderItems = ref([]) // Holds the selected part data from props.selectedDatas
const orderAccessId = ref('')
const totalWeight = ref(0)

// 费用相关
const baseShippingFee = ref(0) // E1 运费
const registrationFee = ref(0) // E2 挂号费
const carriageFee = ref(0) // 附加运费
const shippingRate1 = ref(0) // JLC 运费比例
const shippingRate2 = ref(0) // YT 运费比例

// UI 显示相关
const shippingTime = ref(0)
const deliveryDate = ref('计算中...')

// --- 计算属性 (Computed Properties) ---
/**
 * 计算总零件款式数量 (e.g., 3款)
 * This represents the number of distinct part types selected.
 */
const totalPartsCount = computed(() => orderItems.value.length)

/**
 * 计算总零件件数 (e.g., 10件)
 * This represents the sum of quantities of all selected parts.
 */
const totalPartsQuantity = computed(() => orderItems.value.reduce((total, item) => total + item.quantity, 0))

const totalGoodsPrice = computed(() => orderItems.value.reduce((total, item) => total + item.totalPrice, 0))

// 总运费计算逻辑
const totalShippingFee = computed(() => {
  const mainFee = (baseShippingFee.value + registrationFee.value) * (1 + shippingRate1.value)
  const additionalFee = carriageFee.value * (1 + shippingRate2.value)
  return mainFee + additionalFee
})

// 最终应付款
const finalAmount = computed(() => totalGoodsPrice.value + totalShippingFee.value)

// --- 核心业务逻辑函数 ---
const buildOrderAccessPayload = (data) => {
  const buildAttribute = (id, customerCraft = "", resourceUrl = "") => (id ? { craftAttributeAccessId: id, customerCraft, resourceUrl } : null);

  const craft1 = data.craftAccessId1 ? {
    craftAccessId: data.craftAccessId1,
    attributes: [
      buildAttribute(data.craftAttributeGlossinessAccessIds1),
      buildAttribute(data.craftAttributeColorAccessIds1)
    ].filter(Boolean)
  } : null;

  const craft2 = data.craftAccessId2 ? {
    craftAccessId: data.craftAccessId2,
    attributes: [
      buildAttribute(data.craftAttributeGlossinessAccessIds2),
      buildAttribute(data.craftAttributeColorAccessIds2)
    ].filter(Boolean)
  } : null;

  return {
    activityGiveawayCode: null,
    urlType: "CNC_ORDER_SUCCESSFUL",
    goods: [{
      deliveryTypeCode: data.deliveryTypeCode,
      fileInfoAccessIds: [data.fileInfoAccessId],
      materialAccessId: data.materialAccessId,
      productModelAccessId: data.productModelAccessId,
      quantity: data.quantity,
      roughnessAccessId: data.roughnessAccessId,
      toleranceAccessId: data.toleranceAccessId,
      whorlFlag: 0,
      whorls: [],
      crafts: [craft1, craft2].filter(Boolean)
    }]
  };
};

const initializeOrder = async () => {
  loading.value = true
  error.value = false

  try {
    // 1. 获取已选择的报价数据 (This uses an API call, assuming it returns the same data as props.selectedDatas initially)
    // If props.selectedDatas already contains everything needed for initial display and payload, this step might be redundant or could be optimized.
    // For now, keeping it as is, assuming it fetches specific "selected" data from a backend state.
    const selectedDataRes = await service.get('/api/orders/get_selected_datas', { withCredentials: true })
    if (!selectedDataRes.data || selectedDataRes.data.length === 0) {
      throw new Error('无法获取已选择的报价数据')
    }
    const orderBaseData = selectedDataRes.data[0] // Assuming the API returns an array, and we need the first item for initial orderAccessId payload.

    // 2. 构建请求体并获取 orderAccessId
    const payload = buildOrderAccessPayload(orderBaseData)
    const orderIdRes = await service.post('/api/price/get_orderAccessIds', payload, { withCredentials: true })
    const receivedId = orderIdRes.data?.data?.orderAccessIds?.[0]
    if (!receivedId) {
      throw new Error('获取订单ID失败')
    }
    orderAccessId.value = receivedId

    // 3. 并行获取重量、附加运费和运费比例
    const [weightRes, carriageFeeRes, freightRateRes] = await Promise.all([
      service.post('/api/price/get_weight', { bizOrderAccessId: receivedId, businessLine: "cnc" }, { withCredentials: true }),
      service.post('/api/price/place_calculate_coupon_fee', { bizOrderAccessId: receivedId }, { withCredentials: true }),
      service.get('/api/logistics/getFreightRate', { withCredentials: true })
    ])

    totalWeight.value = weightRes.data?.data?.bizTotalWeight || 0
    carriageFee.value = carriageFeeRes.data?.carriageFee || 0
    shippingRate1.value = freightRateRes.data?.jlc_ratio || 0
    shippingRate2.value = freightRateRes.data?.yt_ratio || 0

    // 4. 所有基础数据准备就绪后，进行首次运费计算
    await calculateShippingCost()

    // 设置预计发货时间（示例逻辑，可根据实际业务调整）
    const today = new Date()
    today.setDate(today.getDate() + 2) // 假设2天后发货
    deliveryDate.value = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`

  } catch (error) {
    console.error('订单初始化失败:', error)
    error.value = true
    ElMessage.error(error.message || '订单初始化失败，请刷新页面重试')
  } finally {
    loading.value = false
  }
}

const calculateShippingCost = async () => {
  // Only proceed if address and weight are available
  if (!props.selectedAddress?.countryCode || totalWeight.value <= 0) {
    // ElMessage.info('地址或重量信息不完整，无法计算运费。'); // Optional: Add a message if calculation is skipped
    return
  }

  try {
    const res = await service.get('/api/logistics/price-trial', {
      params: {
        country_code: props.selectedAddress.countryCode,
        weight: totalWeight.value
      }
    }, { withCredentials: true })

    const priceResults = res.data.result || []
    const shippingMethod = props.selectedAddress.shippingMethod // Assuming shippingMethod is part of selectedAddress
    const priceE1 = priceResults.find(p => p.product_code === shippingMethod && p.fee_name === 'E1')
    const priceE2 = priceResults.find(p => p.product_code === shippingMethod && p.fee_name === 'E2')

    if (priceE1 && priceE2) {
      baseShippingFee.value = priceE1.convert_amount
      registrationFee.value = priceE2.convert_amount
      shippingTime.value = priceE2.interval_day
    } else {
      baseShippingFee.value = 0
      registrationFee.value = 0
      shippingTime.value = 0
      ElMessage.warning('当前地址无法获取到对应的运费信息')
    }
  } catch (error) {
    console.error('计算运费失败:', error)
    ElMessage.error('计算运费失败，请稍后重试')
  }
}

const buildFinalOrderPayload = () => {
  return props.selectedDatas.map(item => ({
    "order_no": orderAccessId.value,
    "material_cost": item.materialCost,
    "engineering_cost": item.engineeringCost,
    "clamping_cost": item.clampingCost,
    "processing_cost": item.processingCost,
    "expedited_price": item.expeditedPrice,
    "surface_cost": item.surfaceCost,
    "unit_price": item.pricePerUnit,
    "total_price": item.totalPrice,
    "material": item.material,
    "surface_treatment": item.surfaceTreatment === 0 ? "none" : true, // Adjust logic based on actual data
    "treatment1_option": item.selectedTreatment,
    "treatment1_color": item.selectedColor,
    "treatment1_gloss": item.glossiness,
    "treatment1_drawing": item.uploadedFileName,
    "treatment2_option": item.selectedTreatment2,
    "treatment2_color": item.selectedColor2,
    "treatment2_gloss": item.glossiness2,
    "treatment2_drawing": item.uploadedFileName2,
    "quantity": item.quantity,
    "tolerance": item.tolerance,
    "roughness": item.roughness,
    "has_thread": item.hasThread === "false" ? 0 : 1,
    "has_assembly": item.hasAssembly === "false" ? 0 : 1
  }));
};

const emit = defineEmits(['submitting'])
const submitOrder = async () => {
  emit('submitting', true) // Notify parent component submission started
  if (!orderAccessId.value) {
    ElMessage.error('订单信息不完整，无法提交！')
    emit('submitting', false) // Submission failed, notify parent
    return
  }

  try {
    loading.value = true
    // Step 1: Pre-submit the order to the backend with bizOrderAccessId
    const submitRes = await service.get('/api/orders/submit_cnc_order', {
      params: { bizOrderAccessId: orderAccessId.value }
    }, { withCredentials: true })

    if (submitRes.status !== 200) {
      throw new Error('订单预提交失败')
    }

    // Step 2: Submit detailed order items
    const payload = buildFinalOrderPayload()
    const finalRes = await service.post('/api/orders/orders', payload, {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true
    })

    if (finalRes.status === 200) {
      ElMessage.success('订单提交成功！')
      router.push({
        path: '/SubmitOrderSuccess',
        query: {
          orderNos: orderAccessId.value,
          totalFee: finalAmount.value
        }
      })
    } else {
      throw new Error('订单最终提交失败')
    }
  } catch (error) {
    console.error('提交订单时出错:', error)
    ElMessage.error(error.message || '提交订单失败，请稍后重试')
    emit('submitting', false) // Submission failed, notify parent
  } finally {
    loading.value = false
  }
}

// --- 事件处理与生命周期钩子 ---
const retryLoading = () => {
  initializeOrder()
}

const goBack = () => {
  router.go(-1)
}

// Watch for changes in props.selectedDatas and update orderItems
watch(() => props.selectedDatas, (newValue) => {
  orderItems.value = newValue
}, { immediate: true, deep: true })

// Watch for changes in selectedAddress to recalculate shipping cost
watch(() => props.selectedAddress, (newAddress) => {
  if (newAddress) {
    calculateShippingCost()
  }
}, { deep: true })

// Initialize order details when component is mounted
onMounted(() => {
  initializeOrder()
})
</script>

<style scoped>
.total-info {
  position: sticky;
  top: 60px;
}

.info-card {
  width: 500px;
  padding: 20px;
  margin-top: 40px;
  min-height: 400px; /* 确保卡片有足够高度 */
}

.info-section {
  margin-bottom: 20px;
}

.section-title {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  font-size: 14px;
  color: #303133;
  margin-bottom: 15px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-size: 14px;
}

.coupon-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  font-size: 14px;
}

.total-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  font-size: 14px;
}

.label {
  color: #606266;
}

.value {
  color: #303133;
}

.bold {
  font-weight: bold;
}

.price {
  color: #ff4d4f;
  font-size: 16px;
  font-weight: bold;
}

.coupon-text {
  color: #409EFF;
  cursor: pointer;
}

.divider {
  margin: 20px 0;
  border-style: dashed;
}

.button-group {
  display: flex;
  flex-direction: row;
  gap: 10px;
}

.submit-btn {
  flex: 1;
  height: 40px;
  background-color: #409EFF;
  border-color: #409EFF;
}

.back-btn {
  flex: 1;
  height: 40px;
  border: 1px solid #303133;
  color: #303133;
}

.question-icon {
  margin-left: 5px;
  color: #909399;
}

.question-icon:hover {
  color: #409EFF;
}

.loading-container,
.error-container {
  padding: 20px;
  text-align: center;
}

:deep(.el-card__body) {
  padding: 20px;
}
</style>