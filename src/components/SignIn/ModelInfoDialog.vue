<template>
    <el-dialog v-model="dialogVisible" title="模型信息" width="30%">
      <div class="model-info-content">
        <p>模型名称: {{ modelData.processing_fee_id }}</p>
        <p>模型版本: {{ modelData.processing_fee_id }}</p>
        <p>模型描述: {{ modelData.processing_fee_id }}</p>
      </div>
    </el-dialog>
  </template>
  
  <script setup>
  import { defineProps, defineEmits, computed } from 'vue'
  
  const props = defineProps({
    modelData: {
      type: Object,
      default: () => ({})
    },
    modelValue: {
      type: Boolean,
      default: false
    }
  })
  
  const emit = defineEmits(['update:modelValue'])
  
  const dialogVisible = computed({
    get() {
      return props.modelValue
    },
    set(value) {
      emit('update:modelValue', value)
    }
  })
  </script>
  
  <style scoped>
  
  .model-info-content {
    margin-top: 10px;
  }
  
  .model-info-content p {
    margin: 5px 0;
  }
  </style>