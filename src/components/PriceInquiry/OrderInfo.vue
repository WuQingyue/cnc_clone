
<template>
  <div class="order-info">
    <el-card class="info-card">
      <template #header>
        <div class="card-header" @click="toggleCollapse">
          <span>订单信息</span>
          <el-icon class="collapse-icon" :class="{ 'is-collapsed': isCollapsed }">
            <ArrowDown />
          </el-icon>
        </div>
      </template>
      
      <el-collapse-transition>
        <div v-show="!isCollapsed">
          <el-table 
            :data="orderItems" 
            :show-header="true"
            header-row-class-name="table-header"
          >
            <el-table-column label="序号" width="50" align="center">
              <template #default="scope">
                {{ scope.$index + 1 }}
              </template>
            </el-table-column>

            <el-table-column label="文件预览" width="100" align="center">
              <template #default="scope">
                <el-image 
                  :src="scope.row.preview" 
                  fit="contain"
                  style="width: 60px; height: 60px"
                />
              </template>
            </el-table-column>

            <el-table-column label="文件信息" width="180">
              <template #default="scope">
                <div class="file-info">
                  <div class="file-name">{{ scope.row.file_name }}</div>
                </div>
              </template>
            </el-table-column>

            <el-table-column label="加工参数" width="180">
              <template #default="scope">
                <div class="process-params">{{ scope.row.material }}</div>
                <div class="process-params">{{ scope.row.getSurfaceTreatmentLabel }}</div>
                <div class="process-params">最严公差：{{ scope.row.tolerance }}</div>
                <div class="process-params">最小粗糙度：{{ scope.row.roughness }}</div>
              </template>
            </el-table-column>

            <el-table-column label="预计交期" width="80" align="center">
              <template #default="scope">
                <div>{{ scope.row.deliveryTime }}</div>
              </template>
            </el-table-column>

            <el-table-column label="数量" width="100" align="center">
              <template #default="scope">
                <div>{{ scope.row.quantity }}</div>
              </template>
            </el-table-column>

            <el-table-column label="单价" width="80" align="center">
              <template #default="scope">
                <span class="price">¥{{ scope.row.pricePerUnit }}</span>
              </template>
            </el-table-column>

            <el-table-column label="总价" width="80" align="center">
              <template #default="scope">
                <span class="price">¥{{ scope.row.totalPrice }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-collapse-transition>
    </el-card>
  </div>
</template>
  
<script setup>
import { ref, watch } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'

const props = defineProps({
  selectedDatas: {
    type: Array,
    required: true
  }
})

const isCollapsed = ref(false)
const orderItems = ref([])

// 监听 selectedDatas 的变化
watch(() => props.selectedDatas, (newVal) => {
  orderItems.value=newVal
  console.log('orderItems', orderItems.value)
}, { immediate: true })

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}
</script>
  
  <style scoped>
  .info-card {
    margin-bottom: 20px;
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: bold;
    cursor: pointer;
    user-select: none;
    padding: 10px 0;
  }
  
  .collapse-icon {
    transition: transform 0.3s;
  }
  
  .collapse-icon.is-collapsed {
    transform: rotate(-180deg);
  }
  
  :deep(.table-header) {
    background-color: #f5f7fa !important;
  }
  
  :deep(.el-table th) {
    background-color: #f5f7fa !important;
    font-weight: bold;
    color: #303133;
    padding: 12px 0;
  }
  
  :deep(.el-table__row) {
    background-color: #ffffff;
  }
  
  .file-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  
  .file-name {
    word-break: break-all;
    line-height: 1.4;
  }
  
  .file-details {
    color: #909399;
    font-size: 12px;
    line-height: 1.4;
  }
  
  .process-params {
    word-break: break-all;
    line-height: 1.4;
  }
  
  .price {
    color: #ff4d4f;
    font-weight: bold;
  }
  
  :deep(.el-input-number) {
    width: 80px;
  }
  
  :deep(.el-table) {
    width: 100% !important;
  }
  
  :deep(.el-table__cell) {
    padding: 8px 0 !important;
    color: #000000; /* 修改表格单元格文字颜色为黑色 */
  }
  </style>