<template>
  <el-dialog
    v-model="dialogVisible"
    width="600px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="dialog-header">物流进度详情</div>
    <el-divider />
    <!-- 添加 v-loading 指令，当 isLoading 为 true 时显示加载动画 -->
    <div class="dialog-content" v-loading="isLoading">
      <!-- 当数据加载完成且 trackEvents 不为空时显示时间线 -->
      <template v-if="!isLoading && trackEvents && trackEvents.length > 0">
        <el-timeline>
          <el-timeline-item
            v-for="(item, idx) in trackEvents"
            :key="idx"
            color="#409EFF"
          >
            <div>
              <span style="font-weight: bold;">{{ item.process_content || '未知状态' }}</span>
              <span v-if="item.process_time" style="margin-left: 12px; color: #606266;">
                {{ formatDate(item.process_time) }}
              </span>
              <span v-if="item.process_country || item.process_city" style="margin-left: 8px; color: #909399;">
                {{ [item.process_country, item.process_city].filter(Boolean).join(' · ') }}
              </span>
            </div>
          </el-timeline-item>
        </el-timeline>
      </template>
      <!-- 当数据加载完成但 trackEvents 为空时显示“暂无数据” -->
      <template v-else-if="!isLoading && (!trackEvents || trackEvents.length === 0)">
        <p class="no-data-message">暂无物流进度数据。</p>
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

const trackEvents = ref([])
const isLoading = ref(false) // 新增：用于控制加载状态
  
const handleClose = () => {
  dialogVisible.value = false
  // 在对话框关闭时重置数据和加载状态
  trackEvents.value = []
  isLoading.value = false
}
  
function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  // 检查日期是否有效
  if (isNaN(d.getTime())) {
    return '无效日期'
  }
  return d.toLocaleString()
}
  
// 获取物流进度详情
const fetchShippingProgress = async (logistics_info_id) => {
  if (!logistics_info_id) {
    trackEvents.value = [] // 如果没有ID，清空数据
    isLoading.value = false // 停止加载
    return
  }

  isLoading.value = true // 开始加载
  try {
    const response = await service.get(`/api/logistics/track_shipment/${logistics_info_id}`, { withCredentials: true })
    
    // 检查响应状态码和数据路径是否存在
    if (response.status === 200 && response.data?.result?.[0]?.track_Info?.track_events) {
      trackEvents.value = response.data.result[0].track_Info.track_events
    } else {
      console.warn('API返回数据格式不正确或物流事件为空:', response.data)
      trackEvents.value = [] // 即使请求成功，但数据不符合预期，也置为空
    }
  } catch (e) {
    console.error('请求物流进度详情失败:', e)
    trackEvents.value = [] // 请求失败时清空数据
  } finally {
    isLoading.value = false // 结束加载
  }
}
  
// 监听对话框的显示状态
watch(dialogVisible, (isVisible) => {
  if (isVisible) {
    // 当对话框可见时，如果存在 logistics_info_id，则获取进度详情
    if (props.modelData && props.modelData.logistics_info_id) {
      console.log('对话框打开，获取物流信息 ID:', props.modelData.logistics_info_id)
      fetchShippingProgress(props.modelData.logistics_info_id)
    } else {
      // 对话框打开但没有有效的物流信息ID，直接显示无数据
      trackEvents.value = []
      isLoading.value = false
      console.log('暂无物流信息ID，不发起请求。')
    }
  } else {
    // 对话框关闭，通过 handleClose 已经处理了重置
  }
}, { immediate: true }) // immediate: true 确保在组件挂载时如果 dialogVisible 已经为 true 则立即执行一次

// 监听 modelData 中 logistics_info_id 的变化
// 只有当 dialogVisible 为 true 且 logistics_info_id 确实发生变化时才重新请求
watch(() => props.modelData?.logistics_info_id, (newId, oldId) => {
  if (dialogVisible.value && newId && newId !== oldId) {
    console.log('物流信息ID改变，重新获取进度:', newId)
    fetchShippingProgress(newId)
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

/* 暂无数据消息的样式 */
.no-data-message {
  text-align: center;
  color: #909399;
  padding: 50px 0; /* 提供一些内边距，使文本居中显示 */
}
</style>