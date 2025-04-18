<template>
  <el-dialog
    title="物流信息详情"
    v-model="dialogVisible"
    width="600px"
    destroy-on-close
  >
    <div class="shipping-info-container">
      <div v-if="loading" class="loading-state">
        <el-skeleton :rows="5" animated />
      </div>
      
      <div v-else-if="!hasShippingData" class="empty-state">
        <el-empty description="暂无物流信息" />
      </div>
      
      <div v-else class="shipping-info">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="订单号">{{ shipData.order_no }}</el-descriptions-item>
          <el-descriptions-item label="物流费用">¥{{ shipData.shipping_cost || '0.00' }}</el-descriptions-item>
          <el-descriptions-item label="运单号">{{ trackInfo?.waybill_number || '暂无数据' }}</el-descriptions-item>
          <el-descriptions-item label="物流渠道">云途物流</el-descriptions-item>
          <el-descriptions-item label="重量">{{ trackInfo?.actual_weight ? `${trackInfo.actual_weight} kg` : '暂无数据' }}</el-descriptions-item>
        </el-descriptions>

        <!-- 物流跟踪时间线 -->
        <div class="shipping-timeline" v-if="hasTrackEvents">
          <h3>物流跟踪</h3>
          <el-timeline>
            <el-timeline-item
              v-for="(event, index) in trackEvents"
              :key="index"
              :timestamp="formatTrackTime(event.process_time)"
              :type="getEventType(event.track_node_code)"
            >
              {{ event.process_content }}
              <div v-if="event.process_location" class="event-location">{{ event.process_location }}</div>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
    </div>
    
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

// 接收父组件传递的属性
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  shipData: {
    type: Object,
    default: () => ({})
  }
})

// 定义事件
const emit = defineEmits(['update:visible'])

// 对话框可见状态
const dialogVisible = ref(false)
const loading = ref(false)
const trackInfo = ref(null)
const trackEvents = ref([])

// 监听visible属性变化
watch(() => props.visible, (newValue) => {
  dialogVisible.value = newValue
  if (newValue && props.shipData && props.shipData.order_no) {
    fetchTrackingInfo()
  }
})

// 监听shipData属性变化
watch(() => props.shipData, (newValue) => {
  if (newValue && newValue.order_no && dialogVisible.value) {
    fetchTrackingInfo()
  }
})
import service from '@/utils/request'
// 获取物流追踪信息
const fetchTrackingInfo = async () => {
  // 修改这里，添加所有需要显示物流信息的状态
  const validStatuses = ['completed_not_collected', 'collected', 'in_transit', 'waiting_for_pickup', 'delivered'];
  
  if (!validStatuses.includes(props.shipData.status)) {
    trackInfo.value = null
    trackEvents.value = []
    return
  }
  
  loading.value = true
  try {
    console.log('正在获取物流信息:', props.shipData.order_no)
    // 使用POST方法
    const response = await service.post(`/api/logistics/track_get/${props.shipData.order_no}`, { withCredentials: true })
    console.log('物流追踪响应:', response.data)
    
    if (response.data && response.data.success === "true" && response.data.result && response.data.result.length > 0) {
      const result = response.data.result[0]
      trackInfo.value = result.track_Info
      trackEvents.value = result.track_Info.track_events || []
    } else {
      trackInfo.value = null
      trackEvents.value = []
    }
  } catch (error) {
    console.error('获取物流信息失败:', error)
    ElMessage.error('获取物流信息失败，请稍后再试')
    trackInfo.value = null
    trackEvents.value = []
  } finally {
    loading.value = false
  }
} 

// 监听对话框状态变化
watch(dialogVisible, (newValue) => {
  if (!newValue) {
    emit('update:visible', false)
  }
})

// 关闭对话框
const closeDialog = () => {
  dialogVisible.value = false
}

// 判断是否有物流数据可显示
const hasShippingData = computed(() => {
  return props.shipData && 
         (props.shipData.status === 'completed_not_collected' || props.shipData.status === 'collected' || props.shipData.status === 'in_transit' || props.shipData.status === 'waiting_for_pickup' || props.shipData.status === 'delivered') && 
         trackInfo.value !== null
})

// 判断是否有跟踪事件
const hasTrackEvents = computed(() => {
  return trackEvents.value && trackEvents.value.length > 0
})

// 格式化日期
const formatDate = (date) => {
  if (!date) return '暂无数据'
  return new Date(date).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 格式化物流事件时间
const formatTrackTime = (timeString) => {
  if (!timeString || timeString.includes('0001-01-01')) return '时间未知'
  return new Date(timeString).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 根据节点代码获取事件类型
const getEventType = (nodeCode) => {
  const types = {
    'ORDER_CREATION': 'info',
    'RECEIVED': 'info',
    'DEPARTED': 'warning',
    'IN_TRANSIT': 'warning',
    'ARRIVED': 'success',
    'EXCEPTION': 'danger',
    'DELIVERED': 'success'
  }
  return types[nodeCode] || 'info'
}
</script>

<style scoped>
.shipping-info-container {
  padding: 10px;
  min-height: 300px;
}

.shipping-info {
  margin-top: 15px;
}

.shipping-timeline {
  margin-top: 30px;
}

.empty-state, .loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

h3 {
  margin-bottom: 15px;
  font-size: 16px;
  color: #333;
  border-left: 3px solid #409eff;
  padding-left: 10px;
}

.event-location {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}
</style>