<template>
    <el-dialog
      v-model="dialogVisible"
      width="600px"
      :close-on-click-modal="false"
      @close="handleClose"
    >
      <div class="dialog-header">物流进度详情</div>
      <el-divider />
      <div class="dialog-content">
        <el-timeline>
          <el-timeline-item
            v-for="(item, idx) in trackEvents"
            :key="idx"
            color="#409EFF"
          >
            <div>
              <span style="font-weight: bold;">{{ item.process_content }}</span>
              <span v-if="item.process_time" style="margin-left: 12px; color: #606266;">
                {{ formatDate(item.process_time) }}
              </span>
              <span v-if="item.process_country || item.process_city" style="margin-left: 8px; color: #909399;">
                {{ [item.process_country, item.process_city].filter(Boolean).join(' · ') }}
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
  
  const trackEvents = ref([])
  
  const handleClose = () => {
    dialogVisible.value = false
  }
  
  function formatDate(dateStr) {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return d.toLocaleString()
  }
  
  // 获取物流进度详情
  const fetchShippingProgress = async (logistics_info_id) => {
    try {
      const response = await service.get(`/api/logistics/track_shipment/${logistics_info_id}`, { withCredentials: true })
      if (response.status !== 200 || !response.data?.result?.[0]?.track_Info?.track_events) throw new Error('网络响应不是 OK')
      trackEvents.value = response.data.result[0].track_Info.track_events || []
    } catch (e) {
      trackEvents.value = []
    }
  }
  
  watch(() => props.modelData, () => {
    console.log('物流信息props.modelData',props.modelData)
    if (props.modelData && props.modelData.logistics_info_id) {
      fetchShippingProgress(props.modelData.logistics_info_id)
    }
    else{
      console.log('暂无物流信息')
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
  </style>