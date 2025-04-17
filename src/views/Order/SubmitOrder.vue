<template>
    <div class="submit-order">
      <div class="success-container">
        <!-- 成功提示区域 -->
        <div class="success-header">
          <el-icon class="success-icon"><CircleCheckFilled /></el-icon>
          <div class="success-text">
            <h2>订单下单成功，等待审核中</h2>
          </div>
        </div>
  
        <!-- 订单信息区域 -->
        <div class="order-info">
          <div class="info-row">
            <span class="label">订单编号：</span>
            <span class="value">{{ orderNo }}</span>
            <el-button type="text" class="copy-btn" @click="copyOrderNo">
              复制
            </el-button>
          </div>
          <div class="info-row">
            <span class="label">订单金额：</span>
            <span class="value price">¥{{ orderAmount }}</span>
          </div>
          <div class="info-row">
            <span class="label">支付方式：</span>
            <span class="value">{{ paymentMethod }}</span>
          </div>
        </div>
  
        <!-- 提示信息区域 -->
        <div class="notice-section">
          <div class="notice-title">
            <el-icon><InfoFilled /></el-icon>
            <span>温馨提示</span>
          </div>
          <div class="notice-content">
            <p>1. 您的订单预计将在1~3小时审核完成。您可前往 [CNC订单] 查看审核结果。为避免耽误您的交期，请第一时间确认订单并支付；</p>
            <p><strong class="title">2. 审单处理时间：</strong></p>
            <p>周一至周六： 上午9:00 - 12:00 下午:13:30 - 18:00</p>
            <p>法定节假日审单时间另行通告。</p>
            <p><strong class="title">3. 生产安排时间</strong></p>
            <p>19:00前支付，当天开始计算交期并安排排单</p>
            <p>19:00后支付，次日开始计算交期</p>
          </div>
        </div>
  
        <!-- 按钮区域 -->
        <div class="button-group">
          <el-button type="primary" @click="viewOrder">查看订单</el-button>
          <el-button @click="backToHome">返回首页</el-button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue'
  import { CircleCheckFilled, InfoFilled } from '@element-plus/icons-vue'
  import { ElMessage } from 'element-plus'
  import { useRouter } from 'vue-router'
  
  export default {
    name: 'SubmitOrder',
    components: {
      CircleCheckFilled,
      InfoFilled
    },
    setup() {
      const router = useRouter()
      const orderNo = ref('CNC20240315001')
      const orderAmount = ref('95.49')
      const paymentMethod = ref('在线支付')
  
      const copyOrderNo = () => {
        navigator.clipboard.writeText(orderNo.value)
        ElMessage.success('复制成功')
      }
  
      const viewOrder = () => {
        // 跳转到订单详情页
        router.push('/cnc_order')
      }
  
      const backToHome = () => {
        // 跳转到首页
        router.push('/')
      }
      
  
      return {
        orderNo,
        orderAmount,
        paymentMethod,
        copyOrderNo,
        viewOrder,
        backToHome
      }
    }
  }
  </script>
  
  <style scoped>
  .submit-order {
    min-height: 100vh;
    background-color: #f5f7fa;
    padding: 40px 0;
  }
  
  .success-container {
    max-width: 800px;
    margin: 0 auto;
    background-color: #fff;
    border-radius: 4px;
    padding: 40px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
  
  .success-header {
    display: flex;
    align-items: center;
    margin-bottom: 40px;
  }
  
  .success-icon {
    font-size: 48px;
    color: #67c23a;
    margin-right: 20px;
  }
  
  .success-text h2 {
    font-size: 24px;
    color: #303133;
    margin: 0 0 10px 0;
  }
  
  .success-text p {
    font-size: 14px;
    color: #606266;
    margin: 0;
  }
  
  .order-info {
    background-color: #f8f9fa;
    padding: 20px;
    border-radius: 4px;
    margin-bottom: 30px;
  }
  
  .info-row {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
  }
  
  .info-row:last-child {
    margin-bottom: 0;
  }
  
  .label {
    color: #606266;
    width: 100px;
  }
  
  .value {
    color: #303133;
    flex: 1;
  }
  
  .price {
    color: #ff4d4f;
    font-weight: bold;
  }
  
  .copy-btn {
    padding: 0;
    margin-left: 10px;
  }
  
  .notice-section {
    margin-bottom: 40px;
  }
  
  .notice-title {
    display: flex;
    align-items: center;
    color: #e6a23c;
    margin-bottom: 15px;
  }
  
  .notice-title .el-icon {
    margin-right: 8px;
  }
  
  .notice-content {
    .title {
    color: #000;  /* 设置为黑色 */
    font-weight: bold;  /* 设置为粗体 */
    font-size: 14px;  /* 可以根据需要调整字体大小 */
  }
  
  p {
    margin-bottom: 8px;  /* 添加段落间距 */
    line-height: 1.5;  /* 设置行高 */
  }
  }
  
  .notice-content p {
    margin: 0;
  }
  
  .button-group {
    display: flex;
    justify-content: center;
    gap: 20px;
  }
  
  :deep(.el-button--primary) {
    background-color: #409EFF;
    border-color: #409EFF;
  }
  
  :deep(.el-button) {
    padding: 12px 30px;
    font-size: 14px;
  }
  </style>