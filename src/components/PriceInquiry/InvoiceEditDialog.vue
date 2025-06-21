<template>
  <el-dialog
    v-model="dialogVisible"
    width="800px"
    :close-on-click-modal="false"
    :lock-scroll="false"
    destroy-on-close
  >
    <!-- 显示发票信息 -->
    <template v-if="!showEditList && !showAddForm">
      <div class="dialog-header">开票资料</div>
      <el-divider />

      <el-form :model="invoiceForm" label-width="120px" :rules="rules" ref="invoiceFormRef">
        <el-form-item label="开票资料" required>
          <div class="selected-invoice" v-if="selectedInvoice">
            <div class="invoice-info">
              <el-tag type="primary" effect="plain">{{ selectedInvoice.type }}</el-tag>
              <!-- 新增：公司显示公司名称和税号，个人只显示名称 -->
              <template v-if="selectedInvoice.type === 'company'">
                <span class="company-row">
                  <span class="company-name">{{ selectedInvoice.name }}</span>
                  <span class="company-taxno"> {{ selectedInvoice.taxNo }}</span>
                </span>
              </template>
              <template v-else>
                <span class="company-name">{{ selectedInvoice.name }}</span>
              </template>
            </div>
            <div class="edit-button" @click="showInvoiceList">
              <el-icon><Edit /></el-icon>
              <span>编辑</span>
            </div>
          </div>
          <div class="edit-button" v-else @click="showInvoiceList">
            <el-icon><Edit /></el-icon>
            <span>编辑</span>
          </div>
        </el-form-item>

        <el-form-item label="发票类型" prop="type">
          <div class="invoice-type-options">
            <div class="type-option">
              <el-button
                :disabled="true"
                class="type-button disabled"
              >
                <div class="tag-wrapper">
                  <span class="tag deductible">可抵税</span>
                </div>
                <span class="button-text">增值税专用发票</span>
              </el-button>
            </div>
            <div class="type-option">
              <el-button
                class="type-button selected"
                :class="{ 'is-selected': invoiceForm.type === 'normal' }"
                @click="selectType('normal')"
              >
                <div class="tag-wrapper">
                  <span class="tag non-deductible">不可抵税</span>
                </div>
                <span class="button-text">增值税普通发票</span>
                <el-icon v-if="invoiceForm.type === 'normal'" class="check-icon"><Check /></el-icon>
              </el-button>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="发票种类" prop="category">
          <el-button
            class="category-button"
            :class="{ 'is-selected': true }"
          >
            电子发票
            <el-icon class="check-icon"><Check /></el-icon>
          </el-button>
        </el-form-item>
      </el-form>

      <el-divider />

      <div class="dialog-footer">
        <el-button
          class="cancel-button"
          @click="dialogVisible = false"
        >
          取消
        </el-button>
        <el-button
          type="primary"
          @click="handleConfirm"
        >
          确定
        </el-button>
      </div>
    </template>

    <!-- 编辑发票信息列表 -->
    <template v-else-if="showEditList && !showAddForm">
      <div class="dialog-header">编辑发票信息</div>
      <el-divider />

      <el-table
        :data="invoiceList"
        style="width: 100%"
      >
        <el-table-column label="选择" width="50">
          <template #default="scope">
            <el-radio v-model="selectedInvoiceId" :label="scope.row.id"></el-radio>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="开票主体" width="120">
          <template #default="scope">
            <el-tag type="primary">{{ scope.row.type === 'company' ? '公司' : '个人' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="开票公司名称/个人名称" min-width="200" />
        <el-table-column prop="taxNo" label="税号" width="180" />
        <el-table-column prop="isComplete" label="是否完善" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.isComplete ? 'success' : 'warning'">
              {{ scope.row.isComplete ? '已完善' : '未完善' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <div class="operation-buttons">
              <el-tag 
                v-if="scope.row.isDefault" 
                type="primary" 
                effect="plain"
              > 
                默认地址
              </el-tag>
              <el-button 
                v-else 
                type="text" 
                @click="setDefaultInvoice(scope.row)"
              >
                设为默认
              </el-button>
              <el-button 
                type="text" 
                @click="editInvoiceInfo(scope.row)"
              >
                修改
              </el-button>
            </div>
          </template>
        </el-table-column>
        <template #empty>
          <div class="empty-block">
            <span class="empty-text">暂无数据</span>
          </div>
        </template>
      </el-table>

      <div class="list-footer">
        <el-button type="primary" @click="confirmSelection">确认选择</el-button>
        <el-button type="primary" @click="addNewInvoice">新增资料</el-button>
      </div>
    </template>

    <!-- 添加或编辑发票信息 -->
    <template v-else>
      <div class="dialog-header">编辑发票信息</div>
      <el-divider />

      <!-- 公司发票信息 -->
      <div v-if="newInvoiceForm.type === 'company'">
        <div class="company-notice">
          <p class="yellow-tip">
            注：开专票以及随货发专票的时候，需要填写下面完整信息，请认真仔细填写以下信息，确保您所填写的开票信息与贵司税务登记证信息一致，避免因开票信息填写错误，导致发票不能使用，给贵司带来损失。
          </p>
        </div>
        <el-form 
          :model="newInvoiceForm" 
          label-width="120px" 
          :rules="newInvoiceRules" 
          ref="newInvoiceFormRef"
        >
          <el-form-item label="开票主体" prop="type" required>
            <el-radio-group v-model="newInvoiceForm.type">
              <el-radio label="company">公司</el-radio>
              <el-radio label="personal">个人</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="开票公司名称" prop="companyName" required>
            <el-input v-model="newInvoiceForm.companyName" placeholder="请输入开票公司名称" />
          </el-form-item>
          <div class="tip-text">注：当未找到开票公司名称，请勾选手动填写</div>
          <el-form-item label="税号" prop="taxNo" required>
            <el-input v-model="newInvoiceForm.taxNo" placeholder="请输入税号" />
          </el-form-item>
          <div class="tip-text">该税号是辅助选择的，请核对税号是否正确！</div>
          <el-form-item label="地址">
            <el-input v-model="newInvoiceForm.address" placeholder="请输入地址" />
          </el-form-item>
          <el-form-item label="电话">
            <el-input v-model="newInvoiceForm.phone" placeholder="请输入电话" />
          </el-form-item>
          <el-form-item label="开户行账号">
            <el-input v-model="newInvoiceForm.bankAccount" placeholder="请输入开户行账号" />
          </el-form-item>
          <el-form-item label="开户行名称">
            <el-input v-model="newInvoiceForm.bankName" placeholder="请输入开户行名称" />
          </el-form-item>
        </el-form>
      </div>

      <!-- 个人发票信息 -->
      <div v-else>
        <div class="personal-notice">
          <p class="red-tip">
            注：开票主体为个人的情况下，只能开普通电子发票
          </p>
        </div>
        <el-form 
          :model="newInvoiceForm" 
          label-width="120px" 
          :rules="newInvoiceRules" 
          ref="newInvoiceFormRef"
        >
          <el-form-item label="开票主体" prop="type" required>
            <el-radio-group v-model="newInvoiceForm.type">
              <el-radio label="company">公司</el-radio>
              <el-radio label="personal">个人</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="个人名称" prop="personalName" required>
            <el-input v-model="newInvoiceForm.personalName" placeholder="请输入个人名称" />
          </el-form-item>
        </el-form>
      </div>

      <el-divider />

      <div class="dialog-footer">
        <el-button type="primary" @click="saveNewInvoice">保存</el-button>
        <el-button class="cancel-button" @click="cancelAdd">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { ref, watch, computed,ElMessage,onMounted } from 'vue';
import { Edit, Check } from '@element-plus/icons-vue';
import axios from 'axios';
import service from '@/utils/request'

export default {
  name: 'InvoiceEditDialog',
  components: {
    Edit,
    Check
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:visible', 'save'],
  setup(props, { emit }) {
    const dialogVisible = ref(false);
    const showEditList = ref(false);
    const showAddForm = ref(false);
    const invoiceList = ref([]);
    const invoiceFormRef = ref(null);
    const newInvoiceFormRef = ref(null);

    const invoiceForm = ref({
      type: 'normal',
    });

    const newInvoiceForm = ref({
      type: 'company', // 默认为公司
      companyName: '',
      taxNo: '',
      address: '',
      phone: '',
      bankAccount: '',
      bankName: '',
      personalName: ''
    });

    const rules = {
      type: [{ required: true, message: '请选择发票类型' }]
    };

    const newInvoiceRules = {
      type: [{ required: true, message: '请选择开票主体', trigger: 'change' }],
      companyName: [
        { required: true, message: '请输入开票公司名称', trigger: 'blur' }
      ],
      taxNo: [
        { required: true, message: '请输入税号', trigger: 'blur' }
      ],
      personalName: [
        { required: true, message: '请输入个人名称', trigger: 'blur' }
      ]
    };

    const selectedInvoiceId = ref(null);

    const selectedInvoice = computed(() => {
      return invoiceList.value.find(item => item.id === selectedInvoiceId.value);
    });

    watch(() => props.visible, (val) => {
      dialogVisible.value = val;
    });

    watch(dialogVisible, (val) => {
      emit('update:visible', val);
    });

    const showInvoiceList = () => {
      showEditList.value = true;
    };

    const confirmSelection = () => {
      showEditList.value = false;
    };

    const addNewInvoice = () => {
      showAddForm.value = true;
      newInvoiceForm.value = {
        type: 'company',
        companyName: '',
        taxNo: '',
        address: '',
        phone: '',
        bankAccount: '',
        bankName: '',
        personalName: ''
      };
    };

    // 新增发票信息时，按后端要求提交
    const saveNewInvoice = async () => {
      if (!newInvoiceFormRef.value) return;

      await newInvoiceFormRef.value.validate(async (valid) => {
        if (valid) {
          let postData = {
            invoice_subject: newInvoiceForm.value.type, // 'company' or 'personal'
            company_name: newInvoiceForm.value.type === 'company' ? newInvoiceForm.value.companyName : '',
            company_tax_no: newInvoiceForm.value.type === 'company' ? newInvoiceForm.value.taxNo : '',
            personal_name: newInvoiceForm.value.type === 'personal' ? newInvoiceForm.value.personalName : '',
            is_default: invoiceList.value.length === 0
          };

          // 调用后端接口
          try {
            const resp = await axios.post('/api/invoiceInfo/add_invoice_info', postData);
            const newInvoice = resp.data;
            // 兼容本地展示
            invoiceList.value.push({
              id: newInvoice.id || Date.now(),
              type: newInvoice.invoice_subject,
              name: newInvoice.invoice_subject === 'company' ? newInvoice.company_name : newInvoice.personal_name,
              taxNo: newInvoice.company_tax_no || '',
              isComplete: true,
              isDefault: postData.is_default
            });
            if (postData.is_default) {
              selectedInvoiceId.value = newInvoice.id || Date.now();
            }
            showAddForm.value = false;
            showEditList.value = true;
          } catch (e) {
            // 你可以根据实际情况处理错误弹窗
            console.error('保存失败', e);
          }
        }
      });
    };

    const cancelAdd = () => {
      showAddForm.value = false;
    };

    const editInvoiceInfo = (row) => {
      // 处理编辑逻辑
    };

    const deleteInvoiceInfo = (row) => {
      const index = invoiceList.value.indexOf(row);
      if (index > -1) {
        invoiceList.value.splice(index, 1);
        if (selectedInvoiceId.value === row.id) {
          selectedInvoiceId.value = null;
        }
      }
    };

    const selectType = (type) => {
      invoiceForm.value.type = type;
    };

    const handleConfirm = () => {
      if (selectedInvoice.value) {
        emit('save', {
          type: selectedInvoice.value.type,
          name: selectedInvoice.value.name,
          taxNo: selectedInvoice.value.taxNo,
          invoiceType: 'normal' // 增值税普通发票
        });
      }
      dialogVisible.value = false;
    };
    const setDefaultInvoice = async (invoice) => {
          invoiceList.value.forEach(item => {
            item.isDefault = item === invoice
          })
          const response = await service.post(
          '/api/invoiceInfo/set_default_invoice_info',
          {
            invoice_info_id: invoice.id
          },
          { withCredentials: true }
        )
        console.log('更新默认发票信息response',response)
        }
    const fetchInvoiceInfos = async () => {
      try {
        const response = await service.get('/api/invoiceInfo/get_user_invoice_infos', { withCredentials: true })
        if (response.status === 200 && Array.isArray(response.data)) {
          invoiceList.value = response.data.map(invoice => ({
            id: invoice.id,
            type: invoice.invoice_subject,
            name: invoice.invoice_subject === 'company' ? invoice.company_name : invoice.personal_name,
            taxNo: invoice.company_tax_no || '',
          }))
          console.log('invoiceList',invoiceList.value)
        } else if (response.status === 200 && Array.isArray(response.data.data)) {
          // 如果后端返回 { data: [...] }
          invoiceList.value = response.data.data
        }
      } catch (error) {
        ElMessage.error('获取发票信息失败')
        console.error('获取发票信息失败:', error)
      }
    }   
    onMounted(() => {
      fetchInvoiceInfos()
    })
    return {
      dialogVisible,
      showEditList,
      showAddForm,
      invoiceList,
      invoiceForm,
      newInvoiceForm,
      invoiceFormRef,
      newInvoiceFormRef,
      rules,
      newInvoiceRules,
      showInvoiceList,
      confirmSelection,
      addNewInvoice,
      saveNewInvoice,
      cancelAdd,
      editInvoiceInfo,
      deleteInvoiceInfo,
      selectType,
      handleConfirm,
      selectedInvoice,
      selectedInvoiceId,
      setDefaultInvoice
    };
  }
};
</script>

<style scoped>
.dialog-header {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
}

.edit-button {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #409EFF;
  cursor: pointer;
}

.invoice-type-options {
  display: flex;
  gap: 20px;
}

.type-option {
  position: relative;
}

.type-button {
  position: relative;
  width: 160px;
  height: 40px;
  border: 1px solid #dcdfe6;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px 0;
}

.tag-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  transform: translate(5px, -50%);
}

.tag {
  font-size: 12px;
  padding: 1px 6px;
  border-radius: 2px;
  white-space: nowrap;
}

.button-text {
  font-size: 14px;
}

.deductible {
  background-color: #409EFF;
  color: #ffffff;
}

.non-deductible {
  background-color: #f5f7fa;
  color: #303133;
}

.type-button.disabled {
  background-color: #f5f7fa;
  color: #909399;
  cursor: not-allowed;
}

.type-button.disabled .button-text {
  color: #909399;
}

.type-button.selected {
  border-color: #409EFF;
}

.type-button.selected .button-text {
  color: #409EFF;
}

.check-icon {
  position: absolute;
  right: 5px;
  bottom: 5px;
  font-size: 14px;
}

.category-button {
  position: relative;
  width: 160px;
  height: 40px;
  border: 1px solid #409EFF;
  color: #409EFF;
}

:deep(.el-form-item__content) {
  width: 100%;
}

:deep(.el-dialog__body) {
  max-height: 80vh;
  overflow-y: auto;
}

:deep(.el-button.is-selected) {
  border-color: #409EFF;
  color: #409EFF;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
  padding: 0 20px;
}

.cancel-button {
  border: 1px solid #303133;
  color: #303133;
}

:deep(.el-button--primary) {
  background-color: #409EFF;
  border-color: #409EFF;
  color: #ffffff;
}

.list-footer {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
}

:deep(.el-button--text) {
  padding: 0;
  color: #303133;
}

:deep(.el-button--text:hover) {
  color: #409EFF;
}

:deep(.el-tag--primary) {
  background-color: #409EFF;
  border-color: #409EFF;
  color: #ffffff;
}

:deep(.el-tag--primary.el-tag--plain) {
  background-color: #ecf5ff;
  border-color: #409EFF;
  color: #409EFF;
}

.empty-block {
  min-height: 60px;
  text-align: center;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.empty-text {
  color: #909399;
  font-size: 14px;
}

:deep(.el-table__empty-block) {
  min-height: 60px;
}

:deep(.el-table__empty-text) {
  line-height: 60px;
}

.warning-text {
  color: #e6a23c;
  font-size: 14px;
  line-height: 1.5;
  text-align: center;
  margin: 20px 0;
  padding: 0 20px;
}

.notice-text {
  color: #909399;
  font-size: 12px;
  margin: -10px 0 10px 120px;
}

.tip-text {
  color: #909399;
  font-size: 12px;
  margin: -10px 0 10px 120px;
}

:deep(.el-form-item.is-required > .el-form-item__label::before) {
  content: '*';
  color: #f56c6c;
  margin-right: 4px;
}

.selected-invoice {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.invoice-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.company-name {
  font-size: 14px;
  color: #303133;
}

.operation-buttons {
  display: flex;
  gap: 20px;
}

.red-tip {
  color: red;
  text-align: center;
  margin-bottom: 20px;
}

.yellow-tip {
  color: #e6a23c;
  text-align: center;
  margin-bottom: 20px;
}
</style>
