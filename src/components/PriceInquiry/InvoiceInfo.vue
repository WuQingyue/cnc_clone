<template>
  <div class="invoice-info">
    <el-card class="info-card">
      <template #header>
        <div class="card-header" @click="toggleCollapse">
          <span>开票信息</span>
          <el-icon class="collapse-icon" :class="{ 'is-collapsed': isCollapsed }">
            <ArrowDown />
          </el-icon>
        </div>
      </template>
      
      <el-collapse-transition>
        <div v-show="!isCollapsed">
          <el-form :model="invoiceForm" label-width="120px">
            <el-form-item label="开票资料" required>
              <div class="form-item-content">
                <!-- 显示选中的发票信息 -->
                <div v-if="invoiceForm.selectedInvoice" class="invoice-details">
                  <div class="info-row">
                    <span class="value">增值税普通发票</span>
                    <span class="invoice-subject">{{ invoiceForm.selectedInvoice.type }}</span>
                    <span class="value">{{ invoiceForm.selectedInvoice.name }}</span>
                  </div>
                </div>
                <span v-else class="content-text placeholder">请选择开票资料</span>
                <div class="edit-button" @click="showInvoiceDialog">
                  <el-icon><Edit /></el-icon>
                  <span>编辑</span>
                </div>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-transition>
    </el-card>

    <!-- 开票资料编辑弹窗 -->
    <InvoiceEditDialog
      v-model:visible="invoiceDialogVisible"
      @save="handleInvoiceSaved"
    />
  </div>
</template>

<script>
import { ref } from 'vue'
import { ArrowDown, Edit } from '@element-plus/icons-vue'
import InvoiceEditDialog from './InvoiceEditDialog.vue'

export default {
  name: 'InvoiceInfo',
  components: {
    ArrowDown,
    Edit,
    InvoiceEditDialog
  },
  setup() {
    const isCollapsed = ref(false)
    const invoiceDialogVisible = ref(false)
    const invoiceForm = ref({
      selectedInvoice: null
    })

    const toggleCollapse = () => {
      isCollapsed.value = !isCollapsed.value
    }

    const showInvoiceDialog = () => {
      invoiceDialogVisible.value = true
    }

    const handleInvoiceSaved = (data) => {
      invoiceForm.value.selectedInvoice = data
      invoiceDialogVisible.value = false
    }

    return {
      isCollapsed,
      invoiceDialogVisible,
      invoiceForm,
      toggleCollapse,
      showInvoiceDialog,
      handleInvoiceSaved
    }
  }
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

.form-item-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.invoice-details {
  flex: 1;
  display: flex;
  align-items: center;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 16px; /* 调整间距 */
}

.value {
  color: #303133;
  font-size: 14px;
}

.invoice-subject {
  background-color: #e6f7ff; /* 浅蓝色背景 */
  color: #409EFF; /* 蓝色文字 */
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
  border: 1px solid #91d5ff; /* 浅蓝色边框 */
}

.content-text.placeholder {
  color: #909399;
}

.edit-button {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #409EFF;
  cursor: pointer;
  margin-left: 20px;
}

.edit-button:hover {
  opacity: 0.8;
}

.el-form {
  margin-top: 20px;
}

.el-form-item {
  margin-bottom: 20px;
}

/* 添加过渡动画效果 */
.el-collapse-transition {
  transition: all 0.3s ease-in-out;
}
</style>