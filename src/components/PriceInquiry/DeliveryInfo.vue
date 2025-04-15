<template>
    <div class="delivery-info">
      <el-card class="info-card">
        <template #header>
          <div class="card-header">
            <span>发货信息</span>
          </div>
        </template>
        
        <el-form :model="deliveryForm" label-width="120px" label-position="left">
          <!-- 收货地址 -->
          <el-form-item label="收货地址" required>
            <div class="form-item-content">
              <div class="address-info" v-if="selectedAddress">
                <div class="info-row">
                  <span class="label">地址：</span>
                  <span class="value" :class="{ 'hidden': addressHidden }">{{ selectedAddress.fullAddress }}</span>
                  <el-icon class="hide-icon" @click="addressHidden = !addressHidden">
                    <Hide v-if="!addressHidden" />
                    <View v-else />
                  </el-icon>
                </div>
                <div class="info-row">
                  <span class="label">联系人：</span>
                  <span class="value" :class="{ 'hidden': contactHidden }">{{ selectedAddress.name }}</span>
                  <el-icon class="hide-icon" @click="contactHidden = !contactHidden">
                    <Hide v-if="!contactHidden" />
                    <View v-else />
                  </el-icon>
                </div>
                <div class="info-row">
                  <span class="label">联系电话：</span>
                  <span class="value" :class="{ 'hidden': phoneHidden }">{{ selectedAddress.phone }}</span>
                  <el-icon class="hide-icon" @click="phoneHidden = !phoneHidden">
                    <Hide v-if="!phoneHidden" />
                    <View v-else />
                  </el-icon>
                </div>
              </div>
              <span v-else class="content-text placeholder">请添加收货地址</span>
              <div class="edit-button" @click="showAddressDialog">
                <el-icon><Edit /></el-icon>
                <span>编辑</span>
              </div>
            </div>
          </el-form-item>
  
          <!-- 联系方式 -->
          <el-form-item label="联系方式" required>
            <div class="form-item-content">
              <div class="contact-info" v-if="selectedContact">
                <div class="info-row">
                  <span class="label">下单联系人：</span>
                  <span class="value" :class="{ 'hidden': orderContactHidden }">
                    {{ selectedContact.orderName }} {{ selectedContact.orderPhone }}
                 </span>
                  <el-icon class="hide-icon" @click="orderContactHidden = !orderContactHidden">
                    <Hide v-if="!orderContactHidden" />
                    <View v-else />
                  </el-icon>
                </div>
                <div class="info-row">
                  <span class="label">技术联系人：</span>
                  <span class="value" :class="{ 'hidden': techContactHidden }">
                    {{ selectedContact.techName }} {{ selectedContact.techPhone }}
                  </span>
                  <el-icon class="hide-icon" @click="techContactHidden = !techContactHidden">
                    <Hide v-if="!techContactHidden" />
                    <View v-else />
                  </el-icon>
                </div>
              </div>
              <span v-else class="content-text placeholder">请先填写联系人</span>
              <div class="edit-button" @click="showContactDialog">
                <el-icon><Edit /></el-icon>
                <span>编辑</span>
              </div>
            </div>
          </el-form-item>
  
          <!-- 包装要求 -->
          <el-form-item label="包装要求" required>
            <div class="form-item-content">
              <package-requirements v-model="deliveryForm.packageType" />
            </div>
          </el-form-item>
  
          <!-- 收据/送货单 -->
          <el-form-item label="收据/送货单" required>
            <div class="form-item-content">
              <receipt-delivery v-model="deliveryForm.receiptType" />
            </div>
          </el-form-item>
  
          <!-- 发货方式 -->
          <el-form-item label="发货方式" required>
            <div class="form-item-content">
              <delivery-method v-model="deliveryForm.deliveryMethod" />
            </div>
          </el-form-item>
        </el-form>
      </el-card>
  
      <!-- 地址编辑弹窗 -->
      <AddressEditDialog
        v-model:visible="addressDialogVisible"
        @use-address="handleAddressSelected"
      />
  
      <!-- 联系方式编辑弹窗 -->
      <ContactEditDialog
        v-model:visible="contactDialogVisible"
        @use-contact="handleContactSelected"
      />
    </div>
  </template>
  
  <script>
  import { ref, computed } from 'vue'
  import { Edit, Hide, View } from '@element-plus/icons-vue'
  import PackageRequirements from './PackageRequirements.vue'
  import ReceiptDelivery from './ReceiptDelivery.vue'
  import DeliveryMethod from './DeliveryMethod.vue'
  import AddressEditDialog from './AddressEditDialog.vue'
  import ContactEditDialog from './ContactEditDialog.vue'
  
  export default {
    name: 'DeliveryInfo',
    components: {
      Edit,
      Hide,
      View,
      PackageRequirements,
      ReceiptDelivery,
      DeliveryMethod,
      AddressEditDialog,
      ContactEditDialog
    },
    emits: ['address-selected'], // 添加emit
    setup(props, { emit }) {  // 添加emit参数
      const deliveryForm = ref({
        address: {
          region: [],
          detail: ''
        },
        contact: {
          name: '',
          phone: ''
        },
        packageType: 'jlc',
        receiptType: 'paper',
        deliveryMethod: 'together'
      })
  
      const addressDialogVisible = ref(false)
      const contactDialogVisible = ref(false)
      const selectedAddress = ref(null)
      const addressHidden = ref(false)
      const contactHidden = ref(false)
      const phoneHidden = ref(false)
      const selectedContact = ref(null)
      const orderContactHidden = ref(false)
      const techContactHidden = ref(false)
  
      const hasAddress = computed(() => {
        return deliveryForm.value.address.region.length > 0 && 
               deliveryForm.value.address.detail.trim() !== ''
      })
  
      const hasContact = computed(() => {
        return deliveryForm.value.contact.name.trim() !== '' && 
               deliveryForm.value.contact.phone.trim() !== ''
      })
  
      const formatAddress = computed(() => {
        const { region, detail } = deliveryForm.value.address
        return region.join(' ') + ' ' + detail
      })
  
      const formatContact = computed(() => {
        const { name, phone } = deliveryForm.value.contact
        return `${name} ${phone}`
      })
  
      const showAddressDialog = () => {
        addressDialogVisible.value = true
      }
  
      const showContactDialog = () => {
        contactDialogVisible.value = true
      }
  
      const updateAddress = (newAddress) => {
        deliveryForm.value.address = newAddress
      }
  
      const updateContact = (newContact) => {
        deliveryForm.value.contact = newContact
      }
  
      const handleAddressSelected = (address) => {
        selectedAddress.value = address
        console.log('收货地址：',selectedAddress.value)
        addressDialogVisible.value = false
        // 重置隐藏状态
        addressHidden.value = false
        contactHidden.value = false
        phoneHidden.value = false
        emit('address-selected', address)
      }
  
      const handleContactSelected = (contact) => {
        selectedContact.value = contact
        contactDialogVisible.value = false
        // 重置隐藏状态
        orderContactHidden.value = false
        techContactHidden.value = false
      }
  
      return {
        deliveryForm,
        addressDialogVisible,
        contactDialogVisible,
        selectedAddress,
        addressHidden,
        contactHidden,
        phoneHidden,
        selectedContact,
        orderContactHidden,
        techContactHidden,
        hasAddress,
        hasContact,
        formatAddress,
        formatContact,
        showAddressDialog,
        showContactDialog,
        updateAddress,
        updateContact,
        handleAddressSelected,
        handleContactSelected
      }
    }
  }
  </script>
  
  <style scoped>
  .delivery-info {
    margin-top: 40px;
  }
  
  .info-card {
    margin-bottom: 20px;
  }
  
  .card-header {
    display: flex;
    align-items: center;
    font-weight: bold;
  }
  
  .form-item-content {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    width: 100%;
  }
  
  .info-row {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
  }
  
  .label {
    color: #606266;
    margin-right: 8px;
    min-width: 70px;
  }
  
  .value {
    flex: 1;
    color: #303133;
  }
  
  .value.hidden {
    filter: blur(4px);
    user-select: none;
  }
  
  .hide-icon {
    cursor: pointer;
    margin-left: 8px;
    color: #909399;
    font-size: 16px;
  }
  
  .hide-icon:hover {
    color: #409EFF;
  }
  
  .content-text {
    flex: 1;
    text-align: left;
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
  }
  
  .edit-button:hover {
    opacity: 0.8;
  }
  
  :deep(.el-form-item__label) {
    text-align: left !important;
    padding-right: 20px;
  }
  
  :deep(.el-form-item) {
    margin-bottom: 24px;
  }
  
  :deep(.el-form-item__content) {
    flex: 1;
  }
  
  :deep(.el-form) {
    width: 100%;
  }
  </style>