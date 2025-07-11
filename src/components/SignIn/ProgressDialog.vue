<template>
  <el-dialog
    v-model="dialogVisible"
    width="500px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="dialog-header">加工进度详情</div>
    <el-divider />
    <!-- 添加 v-loading 指令，当 isLoading 为 true 时显示加载动画 -->
    <div class="dialog-content" v-loading="isLoading">
      <!-- 当数据加载完成且 processList 不为空时显示时间线 -->
      <template v-if="!isLoading && processList && processList.length > 0">
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
                {{ item.processName || '未知工序' }}
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
      </template>
      <!-- 当数据加载完成但 processList 为空时显示“暂无数据” -->
      <template v-else-if="!isLoading && (!processList || processList.length === 0)">
        <p class="no-data-message">暂无加工进度数据。</p>
      </template>
      <!-- 当 isLoading 为 true 时，v-loading 会覆盖内容区域 -->
    </div>
    <template #footer>
      <el-button @click="handleClose">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { defineProps, defineEmits, ref, computed, watch } from 'vue'
import service from '@/utils/request' // 确保你的 service 路径正确

const props = defineProps({
  modelData: {
    type: Object,
    default: () => ({}) // 提供一个默认空对象，防止初始时为null导致错误
  },
  modelValue: Boolean
})
const emit = defineEmits(['update:modelValue'])

const dialogVisible = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v)
})

const processList = ref([])
const isLoading = ref(false) // 新增：用于控制加载状态

const handleClose = () => {
  dialogVisible.value = false
  // 在对话框关闭时重置数据和加载状态
  processList.value = []
  isLoading.value = false
}

function formatDate(ts) {
  if (!ts) return ''
  const date = new Date(ts)
  // 检查日期是否有效
  if (isNaN(date.getTime())) {
    return '无效日期'
  }
  return date.toLocaleString()
}

// 获取加工进度详情
const fetchProgressDetails = async (orderInfoAccessId) => {
  if (!orderInfoAccessId) {
    processList.value = [] // 没有ID则清空数据
    isLoading.value = false // 停止加载
    return
  }

  isLoading.value = true // 开始加载
  try {
    const response = await service.get(`/api/orders/query_order_progress/${orderInfoAccessId}`, { withCredentials: true })
    
    // 检查响应状态码和数据结构
    if (response.status === 200 && response.data && Array.isArray(response.data.data)) {
      processList.value = response.data.data
    } else {
      console.warn('API返回数据格式不正确或为空:', response.data)
      processList.value = [] // 即使请求成功，但数据不符合预期，也置为空
    }
  } catch (e) {
    console.error('请求加工进度详情失败:', e)
    processList.value = [] // 请求失败时清空数据
  } finally {
    isLoading.value = false // 结束加载
  }
}

// 监听对话框的显示状态
watch(dialogVisible, (isVisible) => {
  if (isVisible) {
    // 当对话框可见时，如果存在 order_no，则获取进度详情
    if (props.modelData && props.modelData.order_no) {
      console.log('对话框打开，获取订单进度 ID:', props.modelData.order_no)
      fetchProgressDetails(props.modelData.order_no)
    } else {
      // 对话框打开但没有有效的订单号，直接显示无数据
      processList.value = []
      isLoading.value = false
    }
  } else {
    // 对话框关闭，通过 handleClose 已经处理了重置
  }
}, { immediate: true }) // immediate: true 确保在组件挂载时如果 dialogVisible 已经为 true 则立即执行一次

// 监听 modelData 中 order_no 的变化
// 只有当 dialogVisible 为 true 且 order_no 确实发生变化时才重新请求
watch(() => props.modelData?.order_no, (newOrderNo, oldOrderNo) => {
  if (dialogVisible.value && newOrderNo && newOrderNo !== oldOrderNo) {
    console.log('订单号改变，重新获取进度:', newOrderNo)
    fetchProgressDetails(newOrderNo)
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
  /* 为加载动画提供最小高度，防止内容塌陷 */
  min-height: 200px; /* 根据实际内容调整，确保加载动画有足够空间 */
  position: relative; /* 确保 v-loading 能够正确覆盖 */
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
.no-data-message {
  text-align: center;
  color: #909399;
  padding: 50px 0; /* 提供一些内边距，使文本居中显示 */
}
</style>