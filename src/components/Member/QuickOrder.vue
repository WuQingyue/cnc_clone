<template>
    <div class="quick-order">
      <h2>快捷下单</h2>
      <form @submit.prevent="submitOrder">
        <input type="text" v-model="orderDetails" placeholder="输入订单详情" />
        <button type="submit">提交订单</button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const orderDetails = ref('')
  
  const submitOrder = () => {
    console.log('Order submitted:', orderDetails.value)
    // 处理订单提交逻辑
  }
  </script>
  
  <style scoped>
  .quick-order {
    padding: 20px;
    background-color: #fff;
    border: 1px solid #ddd;
  }
  
  .quick-order h2 {
    margin-bottom: 10px;
  }
  
  .quick-order form {
    display: flex;
    flex-direction: column;
  }
  
  .quick-order input {
    margin-bottom: 10px;
    padding: 8px;
    border: 1px solid #ccc;
  }
  
  .quick-order button {
    padding: 8px;
    background-color: #409eff;
    color: white;
    border: none;
    cursor: pointer;
  }
  </style>