<template>
  <el-dialog
    v-model="dialogVisible"
    width="400px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="dialog-header">加工金额详情</div>
    <el-divider />
    <div class="dialog-content">
      <p>订单号: {{ amountData.order_no }}</p>
      <p>用户邮箱: {{ amountData.user_email }}</p>
      <p v-if="feeDetails">材料费: ¥{{ feeDetails.material_cost.toFixed(2) }}</p>
      <p v-if="feeDetails">工程费: ¥{{ feeDetails.engineering_cost.toFixed(2) }}</p>
      <p v-if="feeDetails">装夹费: ¥{{ feeDetails.clamping_cost.toFixed(2) }}</p>
      <p v-if="feeDetails">加工费: ¥{{ feeDetails.processing_cost.toFixed(2) }}</p>
      <p v-if="feeDetails">加急费: ¥{{ feeDetails.expedited_price.toFixed(2) }}</p>
      <p v-if="feeDetails">表面处理费: ¥{{ feeDetails.surface_cost.toFixed(2) }}</p>
      <p v-if="feeDetails">总金额: ¥{{ feeDetails.total_price.toFixed(2) }}</p>
    </div>
    <template #footer>
      <el-button @click="handleClose">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { defineProps, defineEmits, ref, computed, watch } from 'vue'

const props = defineProps({
  amountData: Object,
  modelValue: Boolean // 添加 modelValue 属性
})

const emit = defineEmits(['update:modelValue'])
const feeDetails = ref(null) // 用于存储费用详情

// 使用计算属性来处理对话框的显示状态
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const handleClose = () => {
  dialogVisible.value = false
}
import service from '@/utils/request'
// 获取费用详情
const fetchFeeDetails = async (processingFeeId) => {
  try {
    const response = await service.get(`/api/orders/processing_fees/${processingFeeId}`, { withCredentials: true })
    if (response.status != 200) {
      throw new Error('网络响应不是 OK')
    }
    feeDetails.value = await response.data
  } catch (error) {
    console.error('请求失败:', error)
    feeDetails.value = null
  }
}

// 在弹出框打开时获取费用详情
watch(() => props.amountData, () => {
  if (props.amountData && props.amountData.processing_fee_id) {
    console.log('props.amountData',props.amountData)
    fetchFeeDetails(props.amountData.processing_fee_id)
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