<template>
  <el-dialog :visible="visible" title="运费详情" width="400px" @update:visible="closeDialog">
    <div>
      <p>运费信息:</p>
      <p>订单号: {{ orderNo }}</p>
      <p>运费: {{ shippingCost }}</p>
    </div>
    <template #footer>
      <el-button @click="closeDialog">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  visible: {
      type: Boolean,
      required: true
  },
  orderNo: {
      type: String,
      required: true
  },
  shippingCost: {
      type: Number,
      required: true
  }
});

const emit = defineEmits(['update:visible']);

const closeDialog = () => {
  emit('update:visible', false);
}
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>