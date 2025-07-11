<template>
  <el-dialog
    v-model="dialogVisible"
    width="400px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="dialog-header">模型信息详情</div>
    <el-divider />
    <!-- 添加 v-loading 指令，当 isLoading 为 true 时显示加载动画 -->
    <div class="dialog-content" v-loading="isLoading">
      <!-- 当 modelDetails 有数据时才显示详细信息 -->
      <template v-if="modelDetails">
        <p>材料: {{ modelDetails.material || 'N/A' }}</p>
        <p>加工数量: {{ modelDetails.quantity || 'N/A' }}</p>
        <p>最严公差: {{ modelDetails.tolerance || 'N/A' }}</p>
        <p>最小粗糙度: {{ modelDetails.roughness || 'N/A' }}</p>
        <p>是否有螺纹: {{ modelDetails.has_thread ? '是' : '否' }}</p>
        <p>是否有装配关系: {{ modelDetails.has_assembly ? '是' : '否' }}</p>
        
        <template v-if="modelDetails.surface_treatment">
          <el-divider>表面处理一</el-divider>
          <p>处理选项: {{ modelDetails.treatment1_option || 'N/A' }}</p>
          <p>颜色: {{ modelDetails.treatment1_color || 'N/A' }}</p>
          <p>光泽: {{ modelDetails.treatment1_gloss || 'N/A' }}</p>
          
          <el-divider>表面处理二</el-divider>
          <p>处理选项: {{ modelDetails.treatment2_option || 'N/A' }}</p>
          <p>颜色: {{ modelDetails.treatment2_color || 'N/A' }}</p>
          <p>光泽: {{ modelDetails.treatment2_gloss || 'N/A' }}</p>
        </template>
        <template v-else>
          <p>无表面处理信息</p>
        </template>
      </template>
      <!-- 当不在加载中且没有数据时，显示“暂无数据” -->
      <template v-else-if="!isLoading && !modelDetails">
        <p>暂无模型详情数据。</p>
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
  modelData: {
    type: Object,
    default: () => ({}) // 提供一个默认空对象，防止初始时为null导致错误
  },
  modelValue: Boolean
})

const emit = defineEmits(['update:modelValue'])
const modelDetails = ref(null) // 用于存储模型详情
const isLoading = ref(false) // 新增：用于控制加载状态

// 使用计算属性来处理对话框的显示状态
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const handleClose = () => {
  dialogVisible.value = false
}

// 获取模型详情
const fetchModelDetails = async (modelInfoId) => {
  if (!modelInfoId) {
    modelDetails.value = null; // 如果没有ID，清空数据
    isLoading.value = false;
    return;
  }
  isLoading.value = true; // 开始加载
  try {
    const response = await service.get(`/api/orders/model_info/${modelInfoId}`, { withCredentials: true })
    if (response.status !== 200) {
      throw new Error(`网络响应不是 OK: ${response.status}`);
    }
    // 假设 response.data 直接就是模型详情对象
    modelDetails.value = response.data
  } catch (error) {
    console.error('请求失败:', error)
    modelDetails.value = null // 请求失败时清空数据
  } finally {
    isLoading.value = false; // 结束加载
  }
}

// 监听对话框的显示状态
watch(dialogVisible, (isVisible) => {
  if (isVisible) {
    // 当对话框可见时，如果存在 model_info_id，则获取模型详情
    if (props.modelData && props.modelData.model_info_id) {
      console.log('对话框打开，获取模型详情 ID:', props.modelData.model_info_id);
      fetchModelDetails(props.modelData.model_info_id)
    }
  } else {
    // 当对话框关闭时，清除模型详情和加载状态
    modelDetails.value = null
    isLoading.value = false
  }
}, { immediate: true }); // immediate: true 确保在组件挂载时如果 dialogVisible 已经为 true 则立即执行一次

// 监听 modelData 中 model_info_id 的变化
// 只有当 dialogVisible 为 true 且 model_info_id 确实发生变化时才重新请求
watch(() => props.modelData?.model_info_id, (newId, oldId) => {
  if (dialogVisible.value && newId && newId !== oldId) {
    console.log('props.modelData.model_info_id 改变，获取新详情:', newId);
    fetchModelDetails(newId);
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
  min-height: 250px; /* 根据实际内容调整，确保加载动画有足够空间 */
  position: relative; /* 确保 v-loading 能够正确覆盖 */
}

.dialog-content p {
  margin: 8px 0;
  line-height: 1.5;
}

.el-divider {
  margin: 16px 0;
}
</style>