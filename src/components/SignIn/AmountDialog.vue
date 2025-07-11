<template>
  <el-dialog
    v-model="dialogVisible"
    width="400px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="dialog-header">加工金额详情</div>
    <el-divider />
    <!-- 添加 v-loading 指令，当 isLoading 为 true 时显示加载动画 -->
    <div class="dialog-content" v-loading="isLoading">
      <p>订单号: {{ amountData.orderCode || 'N/A' }}</p>
      <p>用户邮箱: {{ amountData.user_email || 'N/A' }}</p>
      <!-- 当 feeDetails 有数据时才显示详细信息 -->
      <template v-if="feeDetails">
        <p>材料费: ¥{{ feeDetails.material_cost.toFixed(2) }}</p>
        <p>工程费: ¥{{ feeDetails.engineering_cost.toFixed(2) }}</p>
        <p>装夹费: ¥{{ feeDetails.clamping_cost.toFixed(2) }}</p>
        <p>加工费: ¥{{ feeDetails.processing_cost.toFixed(2) }}</p>
        <p>加急费: ¥{{ feeDetails.expedited_price.toFixed(2) }}</p>
        <p>表面处理费: ¥{{ feeDetails.surface_cost.toFixed(2) }}</p>
        <p>总金额: ¥{{ feeDetails.total_price.toFixed(2) }}</p>
      </template>
      <!-- 当不在加载中且没有数据时，显示“暂无数据” -->
      <template v-else-if="!isLoading && !feeDetails">
        <p>暂无费用详情数据。</p>
      </template>
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
  amountData: {
    type: Object,
    default: () => ({}) // 提供一个默认空对象，防止初始时为null导致错误
  },
  modelValue: Boolean // 添加 modelValue 属性
})

const emit = defineEmits(['update:modelValue'])
const feeDetails = ref(null) // 用于存储费用详情
const isLoading = ref(false) // 新增：用于控制加载状态

// 使用计算属性来处理对话框的显示状态
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const handleClose = () => {
  dialogVisible.value = false
}

// 获取费用详情
const fetchFeeDetails = async (processingFeeId) => {
  if (!processingFeeId) {
    feeDetails.value = null; // 如果没有ID，清空数据
    isLoading.value = false;
    return;
  }
  isLoading.value = true; // 开始加载
  try {
    const response = await service.get(`/api/orders/processing_fees/${processingFeeId}`, { withCredentials: true })
    if (response.status !== 200) {
      throw new Error(`网络响应不是 OK: ${response.status}`);
    }
    // 假设 response.data 直接就是费用详情对象
    feeDetails.value = response.data
  } catch (error) {
    console.error('请求失败:', error)
    feeDetails.value = null // 请求失败时清空数据
  } finally {
    isLoading.value = false; // 结束加载
  }
}

// 监听对话框的显示状态
watch(dialogVisible, (isVisible) => {
  if (isVisible) {
    // 当对话框可见时，如果存在 processing_fee_id，则获取费用详情
    if (props.amountData && props.amountData.processing_fee_id) {
      fetchFeeDetails(props.amountData.processing_fee_id)
    }
  } else {
    // 当对话框关闭时，清除费用详情和加载状态
    feeDetails.value = null
    isLoading.value = false
  }
}, { immediate: true }); // immediate: true 确保在组件挂载时如果 dialogVisible 已经为 true 则立即执行一次

// 监听 amountData 中 processing_fee_id 的变化
// 只有当 dialogVisible 为 true 且 processing_fee_id 确实发生变化时才重新请求
watch(() => props.amountData?.processing_fee_id, (newId, oldId) => {
  if (dialogVisible.value && newId && newId !== oldId) {
    console.log('props.amountData.processing_fee_id changed, fetching new details:', newId);
    fetchFeeDetails(newId);
  }
});
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
  min-height: 180px; /* 根据实际内容调整 */
  position: relative; /* 确保 v-loading 能够正确覆盖 */
}
</style>