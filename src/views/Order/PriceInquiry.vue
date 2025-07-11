<template>
  <div class="price-inquiry">
    <!-- 全局加载遮罩 -->
    <div v-if="isSubmitting" class="loading-overlay">
      <div class="loading-spinner"></div>
      <p>正在提交订单，请稍候...</p>
    </div>

    <div class="inquiry-container">
      <!-- 标题 -->
      <h2 class="order-title">提交订单</h2>

      <div class="main-content">
        <!-- 左侧表单区域 -->
        <div class="form-section">
          <DeliveryInfo @address-selected="handleAddressSelected" />
          <!-- <ExpressInfo /> -->
          <OrderInfo />
          <!-- <InvoiceInfo /> -->
          <!-- <OtherInfo /> -->
        </div>
        
        <!-- 右侧统计信息 -->
        <div class="total-section">
          <TotalInfo 
            :selectedDatas="selectedDatas"
            :selectedAddress="selectedAddress"
            @submitting="handleSubmitting"
          /> <!-- 传递选中的记录并监听提交事件 -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import DeliveryInfo from '@/components/PriceInquiry/DeliveryInfo.vue'
import ExpressInfo from '@/components/PriceInquiry/ExpressInfo.vue'
import OrderInfo from '@/components/PriceInquiry/OrderInfo.vue'
import InvoiceInfo from '@/components/PriceInquiry/InvoiceInfo.vue'
import OtherInfo from '@/components/PriceInquiry/OtherInfo.vue'
import TotalInfo from '@/components/PriceInquiry/TotalInfo.vue'
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useSelectedDataStore } from '@/store/PriceInquiryDatas'

// 获取 store 实例
const selectedDataStore = useSelectedDataStore()

// 使用计算属性获取数据
const selectedDatas = computed(() => selectedDataStore.getSelectedData())

// 添加选中地址的响应式引用
const selectedAddress = ref(null)

// 新增：用于控制全局加载状态的响应式引用
const isSubmitting = ref(false)

// 处理地址选择
const handleAddressSelected = (address) => {
  selectedAddress.value = address
  console.log('选中的地址：', address)
}

// 新增：处理子组件触发的提交状态变更事件
const handleSubmitting = (status) => {
  isSubmitting.value = status
}

onUnmounted(() => {
  // 如果需要，可以在组件卸载时清除数据
  // selectedDataStore.clearSelectedData()
})
</script>

<style scoped>
.price-inquiry {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
  margin-top: 40px;
  position: relative; /* 为遮罩层定位提供基础 */
}

.inquiry-container {
  max-width: 1200px;
  margin: 0 auto;
}

.main-content {
  display: flex;
  gap: 20px;
}

.form-section {
  flex: 1;
  min-width: 0;
}

.total-section {
  width: 300px;
}

.action-buttons {
  margin-top: 20px;
  text-align: center;
}

.order-title {
  color: #303133;
  padding-left: 0; /* 确保标题与卡片左边界对齐 */
  margin-top: 20px;
}

/* 新增：加载遮罩样式 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  color: #409eff;
}

.loading-spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #409eff;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>