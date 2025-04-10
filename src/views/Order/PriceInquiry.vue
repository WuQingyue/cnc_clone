<template>
  <div class="price-inquiry">
    <div class="inquiry-container">
      <!-- 标题 -->
      <h2 class="order-title">提交订单</h2>

      <div class="main-content">
        <!-- 左侧表单区域 -->
        <div class="form-section">
          <DeliveryInfo />
          <!-- <ExpressInfo /> -->
          <OrderInfo :selectedDatas="selectedDatas"/>
          <InvoiceInfo />
          <OtherInfo />
        </div>
        
        <!-- 右侧统计信息 -->
        <div class="total-section">
          <TotalInfo :selectedDatas="selectedDatas" /> <!-- 传递选中的记录 -->
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
import { onMounted, onUnmounted, computed } from 'vue'
import { useSelectedDataStore } from '@/store/PriceInquiryDatas'

// 获取 store 实例
const selectedDataStore = useSelectedDataStore()

// 使用计算属性获取数据
const selectedDatas = computed(() => selectedDataStore.getSelectedData())

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
</style>