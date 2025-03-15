<template>
  <div class="express-info">
    <el-card class="info-card">
      <template #header>
        <div class="card-header" @click="toggleCollapse">
          <span>快递信息</span>
          <el-icon class="collapse-icon" :class="{ 'is-collapsed': isCollapsed }">
            <ArrowDown />
          </el-icon>
        </div>
      </template>
      
      <el-collapse-transition>
        <div v-show="!isCollapsed">
          <div class="express-header">
            <span class="required">选择快递</span>
            <span class="weight">估重：0.1kg</span>
          </div>

          <div class="express-options">
            <!-- 运费预付选项 -->
            <div class="option-section">
              <el-card class="express-card">
                <el-table 
                  :data="prepaidOptions" 
                  :show-header="true"
                  header-row-class-name="table-header"
                >
                  <el-table-column label="" width="50">
                    <template #default="scope">
                      <el-radio v-model="selectedExpress" :label="scope.row.value">
                        <template #default></template>
                      </el-radio>
                    </template>
                  </el-table-column>
                  <el-table-column prop="name" label="运费预付" align="center">
                    <template #header>
                      <span class="column-header">运费预付</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="fee" label="运费（估）" align="center">
                    <template #header>
                      <span class="column-header">运费（估）</span>
                    </template>
                    <template #default="scope">
                      <span class="fee">{{ scope.row.fee }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="time" label="时效" align="center">
                    <template #header>
                      <span class="column-header">时效</span>
                    </template>
                  </el-table-column>
                </el-table>
              </el-card>
            </div>

            <!-- 运费到付选项 -->
            <div class="option-section">
              <el-card class="express-card">
                <el-table 
                  :data="postpaidOptions" 
                  :show-header="true"
                  header-row-class-name="table-header"
                >
                  <el-table-column label="" width="50">
                    <template #default="scope">
                      <el-radio 
                        v-model="selectedExpress" 
                        :label="scope.row.value"
                        @change="handlePostpaidSelect(scope.row)"
                      >
                        <template #default></template>
                      </el-radio>
                    </template>
                  </el-table-column>
                  <el-table-column prop="name" label="运费到付" align="center">
                    <template #header>
                      <span class="column-header">运费到付</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="fee" label="运费（估）" align="center">
                    <template #header>
                      <span class="column-header">运费（估）</span>
                    </template>
                    <template #default="scope">
                      <span class="fee">{{ scope.row.fee }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="time" label="时效" align="center">
                    <template #header>
                      <span class="column-header">时效</span>
                    </template>
                  </el-table-column>
                </el-table>
              </el-card>
            </div>
          </div>
        </div>
      </el-collapse-transition>
    </el-card>

    <!-- 到付提示对话框 -->
    <el-dialog
      v-model="postpaidDialogVisible"
      title="提示"
      width="400px"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <div class="dialog-content">
        您当前选择的运输方式是到付，所以邮费较贵，运费将由快递公司直接上门收取，我司不参与邮费计价及代收！
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleCancelPostpaid">选择其他运输方式</el-button>
          <el-button type="primary" @click="handleConfirmPostpaid">同意，我已知悉</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'

export default {
  name: 'ExpressInfo',
  components: {
    ArrowDown
  },
  setup() {
    const isCollapsed = ref(false)
    const selectedExpress = ref('sf-prepaid')
    const postpaidDialogVisible = ref(false)
    const tempSelectedExpress = ref(null)
    
    const prepaidOptions = [
      { name: '顺丰标准速运', fee: '￥23', time: '1-2天', value: 'sf-prepaid' },
      { name: 'EMS', fee: '￥20', time: '2-3天', value: 'ems-prepaid' }
    ]

    const postpaidOptions = [
      { name: '顺丰速运', fee: '￥35', time: '1-2天', value: 'sf-postpaid' },
      { name: 'EMS', fee: '￥30', time: '2-3天', value: 'ems-postpaid' }
    ]

    const toggleCollapse = () => {
      isCollapsed.value = !isCollapsed.value
    }

    const handlePostpaidSelect = (option) => {
      tempSelectedExpress.value = option.value
      postpaidDialogVisible.value = true
    }

    const handleCancelPostpaid = () => {
      selectedExpress.value = 'sf-prepaid'
      postpaidDialogVisible.value = false
    }

    const handleConfirmPostpaid = () => {
      selectedExpress.value = tempSelectedExpress.value
      postpaidDialogVisible.value = false
    }

    return {
      isCollapsed,
      selectedExpress,
      prepaidOptions,
      postpaidOptions,
      postpaidDialogVisible,
      toggleCollapse,
      handlePostpaidSelect,
      handleCancelPostpaid,
      handleConfirmPostpaid
    }
  }
}
</script>

<style scoped>
.express-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.required::before {
  content: '*';
  color: #ff4d4f;
  margin-right: 4px;
}

.weight {
  color: #606266;
}

.express-options {
  display: flex;
  gap: 20px;
}

.option-section {
  flex: 1;
}

.express-card {
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1) !important;
}

.express-card :deep(.el-card__body) {
  padding: 0;
}

:deep(.table-header) {
  background-color: #f5f7fa !important;
}

:deep(.el-table) {
  margin: 0;
}

:deep(.el-table__row) {
  background-color: #ffffff;
}

:deep(.el-table td) {
  padding: 12px 0;
}

:deep(.el-table th) {
  padding: 8px 0;
  font-weight: normal;
  color: #606266;
}

.fee {
  color: #ff4d4f;
}

.dialog-content {
  text-align: center;
  color: #606266;
  line-height: 1.5;
  margin: 20px 0;
}

.dialog-footer {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.express-info {
  margin-bottom: 20px;
}

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
  font-size: 20px;
  color: #909399;
}

.collapse-icon.is-collapsed {
  transform: rotate(-180deg);
}

.express-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  font-weight: bold;
}

.weight {
  color: #606266;
}

.shipping-options {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.prepaid-options,
.collect-options {
  flex: 1;
}

.header {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  margin-bottom: 10px;
}

.option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 10px;
  transition: all 0.3s;
}

.option.active {
  border-color: #409eff;
  background-color: #ecf5ff;
}

.option .price {
  color: #ff4d4f;
}

.dialog-content {
  text-align: center;
}

.dialog-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.cancel-button {
  border: 1px solid #606266;
  color: #606266;
}

:deep(.el-radio) {
  margin-right: 0;
}

:deep(.el-radio__label) {
  display: none;
}

:deep(.el-table td:first-child) {
  padding-left: 20px;
}

.column-header {
  font-weight: bold;
  color: #303133;
}

:deep(.table-header) {
  background-color: #f5f7fa !important;
}

:deep(.el-table th) {
  background-color: #f5f7fa !important;
  padding: 12px 0;
}

:deep(.el-table__header) {
  border-bottom: 1px solid #EBEEF5;
}

:deep(.el-table__row) {
  background-color: #ffffff;
}
</style>