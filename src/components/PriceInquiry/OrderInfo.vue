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
          <!-- 加载状态 -->
          <div v-if="loading" class="loading-container">
            <el-skeleton :rows="5" animated />
          </div>

          <!-- 数据加载完成 -->
          <el-table
            v-else
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
                  <div class="file-name">{{ scope.row.fileName }}</div>
                  <div class="file-name">
                    尺寸:{{ scope.row.sizeX }} * {{ scope.row.sizeY }} * {{ scope.row.sizeZ }}
                  </div>
                  <div class="file-name">体积:{{ scope.row.modelVolume }}</div>
                  <div class="file-name">表面积:{{ scope.row.modelSurfaceArea }}</div>
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
                <div>{{ scope.row.EstimatedDeliveryTime }}</div>
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
import { ref, onMounted } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'
import service from '@/utils/request'

const isCollapsed = ref(false)
const orderItems = ref([])
const loading = ref(true) // 控制加载状态

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}

const get_selected_datas = async () => {
  loading.value = true
  try {
    const response = await service.get('/api/orders/get_selected_datas', { withCredentials: true })
    orderItems.value = response.data
    console.log('后端返回的数据:', orderItems.value)
  } catch (error) {
    console.error('获取订单数据失败:', error)
    orderItems.value = [] // 清空数据以防显示旧数据
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  get_selected_datas()
})
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

.loading-container {
  padding: 20px;
}
</style>