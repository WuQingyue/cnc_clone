<template>
  <el-dialog
    :visible="visible"
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
      <p v-if="feeDetails">表面处理费: ¥{{ feeDetails.surface_cost.toFixed(2) }}</p>
    </div>
    <template v-slot:footer>
      <el-button @click="handleClose">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { defineProps, defineEmits, ref, onMounted, watch } from 'vue'

const props = defineProps({
  amountData: Object
})

const emit = defineEmits(['update:visible'])
const feeDetails = ref(null) // 用于存储费用详情

const handleClose = () => {
  emit('update:visible', false)
}

// 获取费用详情
const fetchFeeDetails = async (processingFeeId) => {
  try {
    const response = await fetch(`http://localhost:8000/api/orders/processing_fees/${processingFeeId}`) // 替换为实际的后端 API
    if (!response.ok) {
      throw new Error('网络响应不是 OK')
    }
    feeDetails.value = await response.json() // 获取费用数据并存储
  } catch (error) {
    console.error('请求失败:', error)
    feeDetails.value = null // 请求失败时清空费用详情
  }
}

// 在弹出框打开时获取费用详情
watch(() => props.amountData, () => {
  if (props.amountData && props.amountData.processing_fee_id) {
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