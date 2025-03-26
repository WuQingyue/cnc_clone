<template>
    <div>
      <h3>{{ title }}</h3>
      <p>订单信息</p>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const title = ref('订单信息')
  </script>
  
  <style scoped>
  h3 {
    margin-bottom: 10px;
  }
  </style>