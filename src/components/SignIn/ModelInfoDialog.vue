<template>
  <el-dialog
    v-model="dialogVisible"
    width="400px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="dialog-header">模型信息详情</div>
    <el-divider />
    <div class="dialog-content">
      <p>材料: {{ modelDetails.material }}</p>
      <p>加工数量: {{ modelDetails.quantity }}</p>
      <p>最严公差: {{ modelDetails.tolerance }}</p>
      <p>最小粗糙度: {{ modelDetails.roughness }}</p>
      <p>是否有螺纹: {{ modelDetails.has_thread ? '是' : '否' }}</p>
      <p>是否有装配关系: {{ modelDetails.has_assembly ? '是' : '否' }}</p>
      
      <template v-if="modelDetails.surface_treatment">
        <el-divider>表面处理一</el-divider>
        <p>处理选项: {{ modelDetails.treatment1_option }}</p>
        <p>颜色: {{ modelDetails.treatment1_color }}</p>
        <p>光泽: {{ modelDetails.treatment1_gloss }}</p>
        
        <el-divider>表面处理二</el-divider>
        <p>处理选项: {{ modelDetails.treatment2_option }}</p>
        <p>颜色: {{ modelDetails.treatment2_color }}</p>
        <p>光泽: {{ modelDetails.treatment2_gloss }}</p>
      </template>
    </div>
    <template #footer>
      <el-button @click="handleClose">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { defineProps, defineEmits, ref, computed, watch } from 'vue'

const props = defineProps({
  modelData: Object,
  modelValue: Boolean
})

const emit = defineEmits(['update:modelValue'])
const modelDetails = ref(null) // 用于存储模型详情

// 使用计算属性来处理对话框的显示状态
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const handleClose = () => {
  dialogVisible.value = false
}
import service from '@/utils/request'
// 获取模型详情
const fetchModelDetails = async (modelInfoId) => {
  try {
    const response = await service.get(`/api/orders/model_info/${modelInfoId}`, { withCredentials: true })
    if (response.status != 200) {
      throw new Error('网络响应不是 OK')
    }
    modelDetails.value = await response.data
  } catch (error) {
    console.error('请求失败:', error)
    modelDetails.value = null
  }
}

// 在弹出框打开时获取模型详情
watch(() => props.modelData, () => {
  console.log('模型信息props.modelData',props.modelData)
  if (props.modelData && props.modelData.model_info_id) {
    console.log('props.modelData',props.modelData)
    fetchModelDetails(props.modelData.model_info_id)
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

.dialog-content p {
  margin: 8px 0;
  line-height: 1.5;
}

.el-divider {
  margin: 16px 0;
}
</style>