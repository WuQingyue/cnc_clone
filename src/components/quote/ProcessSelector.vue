<template>
  <div class="process-selector">
    <div class="process-list">
      <div 
        v-for="process in processList" 
        :key="process.type"
        class="process-item"
        :class="{ 
          'is-selected': selectedProcess === process.type,
          'is-link': process.route 
        }"
        @click="handleProcessClick(process)"
      >
        <h3 class="process-name">{{ process.name }}</h3>
        <p class="process-desc">{{ process.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { processList } from '@/components/quote/processList.js'
const router = useRouter()
const props = defineProps({
  selectedProcess: String
})
const emit = defineEmits(['process-change'])

const handleProcessClick = (process) => {
  if (process.route) {
    router.push(process.route)
  } else {
    emit('process-change', process)
  }
}
</script>

<style lang="scss" scoped>
.process-selector {
  .process-list {
    display: flex;
    gap: 20px;
    flex-wrap: nowrap;
    
    .process-item {
      flex: 1;
      min-width: 160px;
      padding: 16px;
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s;
      
      &:hover {
        border-color: #409eff;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      }
      
      &.is-selected {
        border-color: #409eff;
        background-color: #ecf5ff;
      }
      
      .process-name {
        font-size: 16px;
        font-weight: bold;
        color: #303133;
        margin-bottom: 8px;
      }
      
      .process-desc {
        font-size: 12px;
        color: #909399;
        line-height: 1.4;
      }
    }
  }
}
</style>