<!-- views/CustomerGuidance.vue -->
<template>
  <el-dialog
    v-model="dialogVisible"
    title="客户指引"
    width="80%"
    :before-close="handleClose"
  >
    <div class="guidance-container">
      <!-- 左侧导航 -->
      <div class="guidance-nav">
        <div
          v-for="item in navItems"
          :key="item.name"
          :class="['nav-item', { active: currentNavItem === item.name }]"
          @click="switchComponent(item)"
        >
          {{ item.name }}
        </div>
      </div>
      
      <!-- 右侧内容 -->
      <div class="guidance-content">
        <component :is="currentComponent"></component>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue'
import CncGuidance from '@/components/CustomerGuidance/cnc.vue'
import SheetGuidance from '@/components/CustomerGuidance/sheet.vue'
import HandGuidance from '@/components/CustomerGuidance/hand.vue'
import FileGuidance from '@/components/CustomerGuidance/2D.vue'
import SecretGuidance from '@/components/CustomerGuidance/KeepSecret.vue'

const dialogVisible = ref(false)
const currentComponent = ref(CncGuidance)
const currentNavItem = ref('CNC下单必看')

const navItems = [
  { name: 'CNC下单必看', component: CncGuidance },
  { name: '钣金加工必看', component: SheetGuidance },
  { name: '手板复模下单必看', component: HandGuidance },
  { name: '2D文件转换须知', component: FileGuidance },
  { name: '保密协议', component: SecretGuidance }
]

const switchComponent = (item) => {
  currentComponent.value = item.component
  currentNavItem.value = item.name
}

const handleClose = (done) => {
  dialogVisible.value = false
  done()
}

// 暴露方法给父组件调用
defineExpose({
  openDialog: (componentName = 'CNC下单必看') => {
    dialogVisible.value = true
    const item = navItems.find(item => item.name === componentName)
    if (item) {
      switchComponent(item)
    }
  }
})
</script>

<style lang="scss" scoped>
.guidance-container {
  display: flex;
  min-height: 400px;

  .guidance-nav {
    width: 200px;
    border-right: 1px solid #dcdfe6;
    padding: 20px 0;

    .nav-item {
      padding: 12px 20px;
      cursor: pointer;
      transition: all 0.3s;
      color: #606266;
      position: relative;

      &:hover {
        color: #409eff;
        background-color: #ecf5ff;
      }

      &.active {
        color: #409eff;
        background-color: #ecf5ff;
        
        &::after {
          content: '';
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          width: 2px;
          background-color: #409eff;
        }
      }
    }
  }

  .guidance-content {
    flex: 1;
    padding: 20px;
  }
}

:deep(.el-dialog__body) {
  padding: 0;
}

:deep(.el-dialog__header) {
  margin-right: 0;
  padding: 20px;
  border-bottom: 1px solid #dcdfe6;
}

:deep(.el-dialog__headerbtn) {
  top: 20px;
}

:deep(.el-dialog) {
  margin: 0 auto;
  max-width: 1200px;
}
</style>