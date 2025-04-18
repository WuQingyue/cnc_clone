<template>
  <div class="total-info">
    <el-card class="info-card">
      <!-- 第一部分：交期&快递 -->
      <div class="info-section">
        <div class="section-title">交期&快递</div>
        <div class="info-row">
          <span class="label">快递</span>
          <span class="value">{{ selectedAddress?.postName }}</span>
        </div>
        <div class="info-row">
          <span class="label">预计发货时间：</span>
          <span class="value">{{ deliveryDate }}（以实际支付时间为准）</span>
        </div>
        <div class="info-row">
          <span class="label">物流运输时间:</span>
          <span class="value"> {{ShippingTime}} 个工作日</span>
        </div>
      </div>

      <!-- 第二部分：订单费用 -->
      <div class="info-section">
        <div class="section-title">订单费用</div>
        <div class="info-row">
          <span class="label">零件数量</span>
          <span class="value">{{ orderItems.length }}款/{{ orderItems.reduce((total, item) => total + item.quantity, 0) }}件</span>
        </div>
        <div class="info-row">
          <span class="label">运费</span>
          <span class="value">¥{{ shippingFee }}</span>
          <el-tooltip content="`运费: ${price_E1.value}元 挂号费: ${price_E2.value}元`" placement="top" effect="dark">
            <el-icon class="question-icon"><QuestionFilled /></el-icon>
          </el-tooltip>
        </div>
        <div class="info-row">
          <span class="label">商品总额(含税)：</span>
          <span class="value">¥{{ orderItems.reduce((total, item) => total + item.totalPrice, 0) }}</span>
        </div>
      </div>

      <!-- 第三部分：优惠券 -->
      <div class="coupon-section">
        <span class="label">优惠券</span>
        <span class="value coupon-text">已选择"CNC15元运费抵扣券"&gt;</span>
      </div>

      <!-- 第四部分：应付款 -->
      <div class="total-section">
        <span class="label bold">应付款（含税）：</span>
        <span class="value price">¥{{ shippingFee+orderItems.reduce((total, item) => total + item.totalPrice, 0) }}</span>
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
    </el-card>
  </div>
</template>

<script setup>
import { ref, defineProps, watch, onMounted,computed } from 'vue'
import { useRouter } from 'vue-router' // 引入 useRouter
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { QuestionFilled } from '@element-plus/icons-vue'
const shippingFee = ref(0)
const ShippingTime = ref(0)
const price_E1 = ref(0)
const price_E2 = ref(0)
const router = useRouter() // 获取 router 实例
import { useSelectedDataStore } from '@/store/PriceInquiryDatas'
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

// 监听地址变化
watch(() => props.selectedAddress, (newAddress) => {
  if (newAddress) {
    console.log('TotalInfo收到新的地址：', newAddress)
    // 这里可以添加地址变化后的处理逻辑
    fetchPrice()
  }
}, { immediate: true })

const orderItems = ref([])
watch(() => props.selectedDatas, (newValue) => {
  orderItems.value=newValue
}, { immediate: true })

//生成订单编号
// 生成8位随机数
const generateRandomNumber = () => {
  return Math.floor(10000000 + Math.random() * 90000000)
}

// 获取当前日期
const getCurrentDate = () => {
  const now = new Date()
  const day = now.getDate().toString().padStart(2, '0')
  const month = (now.getMonth() + 1).toString().padStart(2, '0')
  const year = now.getFullYear().toString().slice(-2)
  return `${day}${month}${year}`
}

// 生成订单编号
const generateOrderNumber = () => {
  const date = getCurrentDate()
  const randomNumber = generateRandomNumber()
  return `SC-${date}-${randomNumber}`
}
// 提交订单方法
const submitOrder = async () => {
  console.log('props.selectedDatas:',props.selectedDatas)
  const formData = props.selectedDatas.map(selectedData =>{
    const orderNo = generateOrderNumber()
    console.log('订单编号:',orderNo)
    return {
      "order_no": orderNo,
      "user_email": "3@q.com",
      "material_cost": selectedData.materialCost,
      "engineering_cost": selectedData.engineeringCost,
      "clamping_cost": selectedData.clampingCost,
      "processing_cost": selectedData.processingCost,
      "expedited_price": selectedData.expeditedPrice,
      "surface_cost": selectedData.surfaceCost,
      "unit_price": selectedData.pricePerUnit,
      "total_price": selectedData.totalPrice,
      "material": selectedData.material,
      "surface_treatment": selectedData.surfaceTreatment === 0 ? "none" : true,
      "treatment1_option": selectedData.selectedTreatment,
      "treatment1_color": selectedData.selectedColor,
      "treatment1_gloss": selectedData.glossiness,
      "treatment1_drawing": selectedData.uploadedFileName,
      "treatment2_option": selectedData.selectedTreatment2,
      "treatment2_color": selectedData.selectedColor2,
      "treatment2_gloss": selectedData.glossiness2,
      "treatment2_drawing": selectedData.uploadedFileName2,
      "quantity": selectedData.quantity,
      "tolerance": selectedData.tolerance,
      "roughness": selectedData.roughness,
      "has_thread": selectedData.hasThread === "false" ? 0 : 1,
      "has_assembly": selectedData.hasAssembly === "false" ? 0 : 1
    }
  })
  console.log('formData',formData)

  try {
    const response = await fetch('http://localhost:8000/api/orders/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(formData),
      withCredentials: true
    });
    
    console.log('response:', response)
    
    if (response.ok) {
      const orderNos = formData.map(item => item.order_no)
      console.log('orderNos', orderNos)
      
      // 使用 path 而不是 name 进行路由跳转
      router.push({
        path: '/SubmitOrderSuccess',
        query: {
          orderNos: orderNos.join(','),
          totalFee: shippingFee.value+orderItems.value.reduce((total, item) => total + item.totalPrice, 0)
        }
      })
    } else {
      console.error('提交订单失败:', response.statusText)
      ElMessage.error('提交订单失败，请稍后重试')
    }
  } catch (error) {
    console.error('提交订单出错:', error)
    ElMessage.error('提交订单出错，请稍后重试')
  }
}

// 返回上一步方法
const goBack = () => {
  router.go(-1) // 使用 router 实例进行跳转
}

const priceResult = ref([])
const fetchPrice = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/logistics/price-trial', {
      params: {
        country_code: props.selectedAddress?.countryCode,
        weight: 1
      }
    }, { withCredentials: true })
    priceResult.value = response.data.result
    console.log('priceResult', priceResult.value)
    const priceE1 = priceResult.value.find(price => price.product_name === props.selectedAddress?.postName && price.fee_name === 'E1')
    console.log('E1的priceE1', priceE1)
    const priceE2 = priceResult.value.find(price => price.product_name === props.selectedAddress?.postName && price.fee_name === 'E2')
    console.log('E1的priceE2', priceE2)
    shippingFee.value = priceE1.convert_amount + priceE2.convert_amount
    ShippingTime.value = priceE2.interval_day
    price_E1.value = priceE1.convert_amount 
    price_E2.value = priceE2.convert_amount 
    ElMessage.success('获取价格信息成功')
  } catch (error) {
    console.error('请求失败:', error)
    ElMessage.error('获取价格信息失败')
  }
}

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
  flex-direction: row; /* 改为水平排列 */
  gap: 10px; /* 按钮之间的间距 */
}

.submit-btn {
  flex: 1; /* 让按钮平分宽度 */
  height: 40px;
  background-color: #409EFF;
  border-color: #409EFF;
}

.back-btn {
  flex: 1; /* 让按钮平分宽度 */
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

:deep(.el-card__body) {
  padding: 20px;
}
</style>