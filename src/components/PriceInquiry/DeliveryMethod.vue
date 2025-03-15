<template>
    <div class="delivery-method">
      <el-tooltip
        effect="dark"
        content="发货方式说明"
        placement="top"
        :show-after="200"
      >
        <div class="info-icon" :class="{ active: isHovered }" @mouseenter="isHovered = true" @mouseleave="isHovered = false">
          <span class="info-dot">?</span>
        </div>
      </el-tooltip>
      
      <div class="options">
        <div
          class="option-item"
          :class="{ active: modelValue === 'together' }"
          @click="$emit('update:modelValue', 'together')"
        >
          <div class="recommend-tag">推荐</div>
          <span class="option-text">不同交期一起发货</span>
          <el-icon v-if="modelValue === 'together'" class="check-icon"><Check /></el-icon>
        </div>
        <div
          class="option-item"
          :class="{ active: modelValue === 'separate' }"
          @click="$emit('update:modelValue', 'separate')"
        >
          <span class="option-text">不同交期分开发货</span>
          <el-icon v-if="modelValue === 'separate'" class="check-icon"><Check /></el-icon>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue'
  import { Check } from '@element-plus/icons-vue'
  
  export default {
    name: 'DeliveryMethod',
    components: {
      Check
    },
    props: {
      modelValue: {
        type: String,
        default: 'together'
      }
    },
    emits: ['update:modelValue'],
    setup() {
      const isHovered = ref(false)
      return { isHovered }
    }
  }
  </script>
  
  <style scoped>
  .delivery-method {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .options {
    display: flex;
    gap: 12px;
  }
  
  .option-item {
    padding: 12px 16px;
    border: 1px solid #DCDFE6;
    border-radius: 4px;
    cursor: pointer;
    position: relative;
    transition: all 0.3s;
    height: 40px;
    line-height: 40px;
    display: flex;
    align-items: center;
    background-color: white;
    color: #606266;
  }
  
  .option-item.active {
    border-color: #409EFF;
    color: #409EFF;
  }
  
  .check-icon {
    position: absolute;
    right: 4px;
    bottom: 4px;
    font-size: 12px;
    color: #409EFF;
  }
  
  .info-icon {
    display: flex;
    align-items: center;
    cursor: pointer;
    height: 20px;
  }
  
  .info-dot {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: #DCDFE6;
    transition: all 0.3s;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: bold;
  }
  
  .info-icon.active .info-dot {
    background-color: #409EFF;
  }
  
  .recommend-tag {
    display: inline-block;
    background: #FF9900;
    color: white;
    padding: 2px 6px;
    border-radius: 2px;
    font-size: 12px;
    line-height: 1;
    margin-right: 8px;
  }
  
  .option-text {
    margin-left: 8px;
  }
  </style>