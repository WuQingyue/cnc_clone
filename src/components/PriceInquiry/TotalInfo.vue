<template>
  <div class="total-info">
    <el-card class="info-card">
      <!-- 第一部分：交期&快递 -->
      <div class="info-section">
        <div class="section-title">交期&快递</div>
        <div class="info-row">
          <span class="label">快递</span>
          <span class="value">{{ expressName }}</span>
        </div>
        <div class="info-row">
          <span class="label">预计发货时间：</span>
          <span class="value">{{ estimatedDeliveryTime }}（以实际支付时间为准）</span>
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
          <span class="label">运费(含税)</span>
          <span class="value">¥{{ shippingFee }}</span>
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
        <span class="value price">¥{{ finalPrice }}</span>
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
import { ref, defineProps, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router' // 引入 useRouter
import axios from 'axios'
import { ElMessage } from 'element-plus'

const router = useRouter() // 获取 router 实例

// 1. 定义 Props
const props = defineProps({
  selectedDatas: {
    type: Array,
    required: true,
    default: () => [] // 提供一个默认值，防止在数据未完全加载时出错
  }
})

const orderItems = ref([])
watch(() => props.selectedDatas, (newValue) => {
  orderItems.value=newValue
}, { immediate: true })

// 提交订单方法
const submitOrder = () => {
  router.push('/submitOrderSuccess') // 使用 router 实例进行跳转
}

// 返回上一步方法
const goBack = () => {
  router.go(-1) // 使用 router 实例进行跳转
}

const priceResult = ref([])
const fastestTime = ref({})
const fetchPrice = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/logistics/price-trial', {
      params: {
        country_code: 'US',
        weight: 1
      }
    })
    priceResult.value = response.data.result
    console.log('priceResult', priceResult.value)
    ElMessage.success('获取价格信息成功')
  } catch (error) {
    console.error('请求失败:', error)
    ElMessage.error('获取价格信息失败')
  }
}
onMounted(() => {
  fetchPrice()
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

:deep(.el-card__body) {
  padding: 20px;
}
</style>