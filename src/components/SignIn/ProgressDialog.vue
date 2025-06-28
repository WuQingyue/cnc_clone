<template>
  <el-dialog
    v-model="dialogVisible"
    width="500px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="dialog-header">加工进度详情</div>
    <el-divider />
    <div class="dialog-content">
      <el-timeline>
        <el-timeline-item
          v-for="(item, idx) in processList"
          :key="item.produceProcessAccessId || idx"
          :color="item.processStatus === 1 ? '#409EFF' : '#C0C4CC'"
        >
          <div class="timeline-item-content">
            <span
              :class="['process-name', { active: item.processStatus === 1 }]"
            >
              {{ item.processName }}
            </span>
            <span
              v-if="item.processTime"
              class="process-time"
            >
              {{ formatDate(item.processTime) }}
            </span>
          </div>
        </el-timeline-item>
      </el-timeline>
    </div>
    <template #footer>
      <el-button @click="handleClose">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { defineProps, defineEmits, ref, computed, watch } from 'vue'
import service from '@/utils/request'

const props = defineProps({
  modelData: Object,
  modelValue: Boolean
})
const emit = defineEmits(['update:modelValue'])
const dialogVisible = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v)
})

const processList = ref([])

const handleClose = () => {
  dialogVisible.value = false
}

function formatDate(ts) {
  if (!ts) return ''
  const d = new Date(ts)
  return d.toLocaleString()
}

// 获取加工进度详情
const fetchProgressDetails = async (orderInfoAccessId) => {
  try {
    const response = await service.get(`/api/orders/query_order_progress/${orderInfoAccessId}`, { withCredentials: true })
    // 假设后端直接返回 [{processName, processStatus, processTime, ...}]
    if (response.status !== 200 || !Array.isArray(response.data)) throw new Error('网络响应不是 OK')
    processList.value = response.data
  } catch (e) {
    processList.value = []
  }
}

watch(() => props.modelData, () => {
  if (props.modelData && props.modelData.order_no) {
    fetchProgressDetails(props.modelData.order_no)
  } else {
    processList.value = []
  }
})
</script>

<style scoped>
.dialog-header {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 10px;
}
.dialog-content {
  margin-top: 10px;
}
.timeline-item-content {
  display: flex;
  align-items: center;
}
.process-name {
  font-size: 16px;
  color: #909399;
  font-weight: normal;
  transition: color 0.3s, font-weight 0.3s;
}
.process-name.active {
  color: #409EFF;
  font-weight: bold;
}
.process-time {
  margin-left: 16px;
  color: #606266;
  font-size: 14px;
}
</style>