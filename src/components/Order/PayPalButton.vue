<template>
    <div class="paypal-container">
      <!-- PayPal 按钮将渲染到这个唯一的 div 中 -->
      <div :ref="setPaypalRef" class="paypal-button-wrapper"></div>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, defineProps, defineEmits, nextTick } from 'vue';
  import axios from 'axios';
  
  // 接收整个订单对象，这样可以获取金额、订单ID等所有信息
  const props = defineProps({
    order: {
      type: Object,
      required: true,
    }
  });
  
  // 定义一个事件，用于在支付成功后通知父组件
  const emit = defineEmits(['payment-successful']);
  
  let paypalRef = null;
  const setPaypalRef = (el) => {
    paypalRef = el;
  };
  
  const errorMessage = ref('');
  
  // 后端 API 的基础 URL
  const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
  
  const renderPayPalButton = () => {
    // 清除可能已存在的旧按钮和错误信息
    if (paypalRef) {
      paypalRef.innerHTML = '';
    }
    errorMessage.value = '';
  
    // 确保 PayPal SDK 已加载
    if (!window.paypal) {
      errorMessage.value = "PayPal SDK未能加载。";
      console.error("PayPal SDK not loaded.");
      return;
    }
    
    // 确保 ref 对应的 DOM 元素存在
    if (!paypalRef) {
      console.error("PayPal button container not found.");
      errorMessage.value = "无法渲染支付按钮。";
      return;
    }
  
    window.paypal.Buttons({
      // --- 1. 创建订单 ---
      createOrder: async () => {
        try {
          // 使用从 props 传入的订单金额
          // 注意：你需要确保 props.order 中有金额字段，这里我假设是 'totalAmount'
          // 请根据你的后端数据结构修改 'props.order.totalAmount'
          const amount = props.order.processing_fee?.total_fee || '0.00'; 
          if (parseFloat(amount) <= 0) {
              errorMessage.value = '支付金额无效。';
              return;
          }
  
          const response = await axios.post(`${VITE_API_BASE_URL}/api/orders`, {
            // 你可以传递更多和订单相关的信息
            currency_code: 'USD', // 或从 props.order.currency 获取
            value: amount.toString(),
          });
          console.log('PayPal Order created:', response.data);
          return response.data.id; // 返回 PayPal 订单ID
        } catch (error) {
          console.error('Error creating order:', error);
          errorMessage.value = '创建支付订单失败，请重试。';
        }
      },
  
      // --- 2. 用户批准后捕获支付 ---
      onApprove: async (data) => {
        try {
          // 调用后端 API 捕获支付
          const response = await axios.post(`${VITE_API_BASE_URL}/api/orders/${data.orderID}/capture`);
          console.log('Payment captured:', response.data);
  
          // 支付成功！触发事件通知父组件
          emit('payment-successful', { 
              paypalData: response.data, 
              orderId: props.order.id // 传入你的系统订单ID
          });
  
        } catch (error) {
          console.error('Error capturing payment:', error);
          errorMessage.value = `支付失败: ${error.response?.data?.detail || error.message}`;
        }
      },
  
      // --- 3. 处理错误 ---
      onError: (err) => {
        console.error('PayPal button error:', err);
        errorMessage.value = '支付过程中发生错误。';
      },
  
    }).render(paypalRef); // 渲染到动态引用的 DOM 元素
  };
  
  onMounted(() => {
    // 使用 nextTick 确保 DOM 已经更新完毕
    nextTick(() => {
      renderPayPalButton();
    });
  });
  
  </script>
  
  <style scoped>
  .paypal-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 40px; /* 给按钮一个最小高度，防止表格跳动 */
  }
  .paypal-button-wrapper {
    /* 调整按钮大小和位置以适应表格单元格 */
    transform: scale(0.9);
    transform-origin: center;
  }
  .error-message {
    color: red;
    font-size: 12px;
    margin-top: 5px;
  }
  </style>