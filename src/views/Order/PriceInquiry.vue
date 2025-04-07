<template>
    <div class="price-inquiry">
      <div class="inquiry-container">
        <!-- 标题 -->
        <h2 class="order-title">提交订单</h2>
  
        <div class="main-content">
          <!-- 左侧表单区域 -->
          <div class="form-section">
            <DeliveryInfo />
            <ExpressInfo />
            <OrderInfo />
            <InvoiceInfo />
            <OtherInfo />
            
            <!-- 底部按钮区 -->
            <div class="action-buttons">
              <el-button type="primary" @click="submitInquiry">提交询价</el-button>
              <el-button @click="cancelInquiry">取消</el-button>
            </div>
          </div>
          
          <!-- 右侧统计信息 -->
          <div class="total-section">
            <TotalInfo @submit-order="submitInquiry" />
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import DeliveryInfo from '@/components/PriceInquiry/DeliveryInfo.vue'
  import ExpressInfo from '@/components/PriceInquiry/ExpressInfo.vue'
  import OrderInfo from '@/components/PriceInquiry/OrderInfo.vue'
  import InvoiceInfo from '@/components/PriceInquiry/InvoiceInfo.vue'
  import OtherInfo from '@/components/PriceInquiry/OtherInfo.vue'
  import TotalInfo from '@/components/PriceInquiry/TotalInfo.vue'
  
  export default {
    name: 'PriceInquiry',
    components: {
      DeliveryInfo,
      ExpressInfo,
      OrderInfo,
      InvoiceInfo,
      OtherInfo,
      TotalInfo
    },
    methods: {
      submitInquiry() {
        // 提交询价逻辑
      },
      cancelInquiry() {
        // 取消询价逻辑
      }
    }
  }
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