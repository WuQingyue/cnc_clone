<template>
    <el-dialog :visible="visible" title="确认支付" width="400px">
      <div>
        <p>您确定要进行支付吗？</p>
        <!-- <p>订单号: {{ orderNo }}</p>
        <p>总金额: {{ totalAmount }}</p> -->
      </div>
      <template v-slot:footer>
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="confirmPayment">确认支付</el-button>
      </template>
    </el-dialog>
  </template>
  
  <script setup>
//   import { defineProps } from 'vue'
  
//   const props = defineProps({
//     visible: {
//       type: Boolean,
//       required: true
//     },
//     orderNo: {
//       type: String,
//       required: true
//     },
//     totalAmount: {
//       type: Number,
//       required: true
//     }
//   })
  
  const emit = defineEmits(['update:visible', 'paymentConfirmed'])
  
  const closeDialog = () => {
    emit('update:visible', false)
  }
  
  const confirmPayment = () => {
    emit('paymentConfirmed')
    closeDialog()
  }
  </script>
  
  <style scoped>
  .dialog-footer {
    display: flex;
    justify-content: flex-end;
  }
  </style>