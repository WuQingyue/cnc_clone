<template>
    <el-dialog
      v-model="dialogVisible"
      width="800px"
      :close-on-click-modal="false"
      :lock-scroll="false"
      destroy-on-close
    >
      <div class="dialog-header">选择收货信息</div>
      <el-divider />
      
      <div class="address-list-header">
        <div class="saved-address-info">
          已保存的有效地址 (最多保存 {{ savedAddresses.length }}/50 个有效地址)
        </div>
        <el-button type="primary" @click="showAddForm">
          <el-icon><Plus /></el-icon>
          新增收货地址
        </el-button>
      </div>
  
      <!-- 地址列表 -->
      <el-table :data="savedAddresses" style="width: 100%">
        <el-table-column prop="name" label="联系人" />
        <el-table-column prop="phone" label="联系电话" />
        <el-table-column prop="fullAddress" label="详细地址" />
        <el-table-column label="操作" width="320">
          <template #default="scope">
            <!-- 使用/已用按钮 -->
            <el-button
              :type="scope.row.isUsing ? 'danger' : 'primary'"
              :disabled="scope.row.isUsing"
              @click="useAddress(scope.row)"
            >
              {{ scope.row.isUsing ? '已用' : '使用' }}
            </el-button>

            <!-- 默认地址 -->
            <template v-if="scope.row.isDefault">
              <span class="default-tag">默认地址</span>
            </template>
            <template v-else>
              <el-button
                type="text"
                @click="setDefaultAddress(scope.row)"
              >
                设为默认
              </el-button>
            </template>

            <!-- 修改和删除按钮 -->
            <el-button type="text" @click="editAddress(scope.row)">修改</el-button>
            <el-button type="text" @click="deleteAddress(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
  
      <!-- 新增/编辑地址表单 -->
      <div v-if="showForm" class="address-form">
        <el-form :model="addressForm" label-width="100px" :rules="rules" ref="addressFormRef">
          <el-form-item label="联系人" prop="name">
            <el-input v-model="addressForm.name" placeholder="请输入联系人姓名" />
          </el-form-item>
          
          <el-form-item label="联系电话" prop="phone">
            <el-input v-model="addressForm.phone" placeholder="请输入联系电话" />
          </el-form-item>
          
          <el-form-item label="收货地址" prop="region">
            <el-cascader
              v-model="addressForm.region"
              :options="regionOptions"
              placeholder="请选择省/市/区"
            />
          </el-form-item>
          
          <el-form-item label="详细地址" prop="detail">
            <el-input
              v-model="addressForm.detail"
              type="textarea"
              placeholder="请输入详细地址"
            />
          </el-form-item>
  
          <!-- 智能识别输入框 -->
          <el-form-item label="">
            <div class="smart-input-container">
              <el-input
                type="textarea"
                v-model="smartInput"
                :rows="3"
                placeholder="粘贴收件人姓名、手机号、收货地址并确认填写，可自动识别您的收货信息"
              />
              <div class="smart-input-buttons">
                <el-button @click="clearSmartInput">清除</el-button>
                <el-button type="primary" @click="parseSmartInput">提交</el-button>
              </div>
            </div>
          </el-form-item>
        </el-form>
  
        <div class="form-buttons">
          <el-button type="primary" @click="saveAddress">保存</el-button>
          <el-button @click="cancelEdit">取消</el-button>
        </div>
      </div>
    </el-dialog>
  </template>
  
  <script>
  import { ref, watch } from 'vue'
  import { Plus } from '@element-plus/icons-vue'
  import { ElMessage } from 'element-plus'
  export default {
    name: 'AddressEditDialog',
    components: {
      Plus
    },
    props: {
      visible: Boolean
    },
    emits: ['update:visible', 'save-address', 'use-address'],
    setup(props, { emit }) {
      const dialogVisible = ref(false)
      const showForm = ref(false)
      const savedAddresses = ref([])
      const smartInput = ref('')
      const addressFormRef = ref(null)
  
      const addressForm = ref({
        name: '',
        phone: '',
        region: [],
        detail: ''
      })
  
      const rules = {
        name: [{ required: true, message: '请输入联系人姓名', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
        region: [{ required: true, message: '请选择收货地址', trigger: 'change' }],
        detail: [{ required: true, message: '请输入详细地址', trigger: 'blur' }]
      }
  
      const regionOptions = ref([
        {
          value: '福建省',
          label: '福建省',
          children: [
            {
              value: '厦门市',
              label: '厦门市',
              children: [
                {
                  value: '集美区',
                  label: '集美区'
                },
                {
                  value: '思明区',
                  label: '思明区'
                }
              ]
            }
          ]
        }
      ])
  
      watch(() => props.visible, (val) => {
        dialogVisible.value = val
      })
  
      watch(() => dialogVisible.value, (val) => {
        emit('update:visible', val)
      })
  
      const showAddForm = () => {
        if (savedAddresses.value.length >= 50) {
          ElMessage.warning('最多只能保存50个有效地址')
          return
        }
        showForm.value = true
        addressForm.value = {
          name: '',
          phone: '',
          region: [],
          detail: ''
        }
      }
  
      const useAddress = (address) => {
        savedAddresses.value.forEach(item => {
          item.isUsing = item === address
        })
        emit('use-address', address)
      }
  
      const setDefaultAddress = (address) => {
        savedAddresses.value.forEach(item => {
          item.isDefault = item === address
        })
      }
  
      const saveAddress = async () => {
        if (!addressFormRef.value) return
        
        await addressFormRef.value.validate((valid) => {
          if (valid) {
            const address = { 
              ...addressForm.value,
              fullAddress: addressForm.value.region.join(' ') + ' ' + addressForm.value.detail,
              isDefault: savedAddresses.value.length === 0,
              isUsing: savedAddresses.value.length === 0
            }
            savedAddresses.value.push(address)
            showForm.value = false
            emit('save-address', address)
            if (address.isUsing) {
              emit('use-address', address)
            }
          }
        })
      }
  
      const cancelEdit = () => {
        showForm.value = false
      }
  
      const clearSmartInput = () => {
        smartInput.value = ''
      }
  
      const parseSmartInput = () => {
        // 实现智能识别逻辑
        // 这里需要根据具体需求实现文本解析
      }
  
      return {
        dialogVisible,
        showForm,
        addressForm,
        addressFormRef,
        savedAddresses,
        regionOptions,
        smartInput,
        rules,
        showAddForm,
        saveAddress,
        cancelEdit,
        clearSmartInput,
        parseSmartInput,
        useAddress,
        setDefaultAddress
      }
    }
  }
  </script>
  
  <style scoped>
  .dialog-header {
    font-size: 18px;
    font-weight: bold;
    color: #303133;
    margin-bottom: 20px;
  }
  
  .address-list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 20px 0;
  }
  
  .saved-address-info {
    color: #606266;
  }
  
  .address-form {
    margin-top: 20px;
  }
  
  .smart-input-container {
    position: relative;
    width: 100%;
  }
  
  .smart-input-container :deep(.el-textarea__inner) {
    padding-bottom: 40px; /* 为按钮留出空间 */
  }
  
  .smart-input-buttons {
    position: absolute;
    bottom: 8px;
    right: 8px;
    display: flex;
    gap: 8px;
    z-index: 1;
  }
  
  .smart-input-buttons .el-button {
    padding: 5px 12px;
    height: 28px;
    font-size: 12px;
  }
  
  .form-buttons {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 30px;
  }
  
  :deep(.el-cascader) {
    width: 100%;
  }
  
  :deep(.el-textarea) {
    width: 100%;
  }
  
  :deep(.el-form-item__content) {
    width: 100%;
  }
  
  :deep(.el-dialog__body) {
    max-height: 80vh;
    overflow-y: auto;
  }
  
  .default-tag {
    display: inline-block;
    padding: 4px 8px;
    background-color: #ecf5ff;
    color: #409EFF;
    border-radius: 4px;
    font-size: 12px;
    margin: 0 8px;
  }
  
  :deep(.el-button--text) {
    color: #303133;
  }
  
  :deep(.el-button--text:hover) {
    color: #409EFF;
  }
  
  :deep(.el-table .cell) {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  </style>