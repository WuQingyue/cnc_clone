<template>
  <div class="delivery-info">
    <!-- ★★★ 修改点 1: 在卡片上添加 v-loading 指令 ★★★ -->
    <el-card class="info-card" v-loading="loading">
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
      </el-form>
    </el-card>

    <!-- 地址编辑弹窗 -->
    <AddressEditDialog
      v-model:visible="addressDialogVisible"
      :selected-address="selectedAddress" 
      @use-address="handleAddressSelected"
    />

    <!-- 联系方式编辑弹窗 -->
    <ContactEditDialog
      v-model:visible="contactDialogVisible"
      :selected-contact="selectedContact" 
      @use-contact="handleContactSelected"
    />
  </div>
</template>

<script>
import { ref, computed,onMounted } from 'vue'
import { Edit, Hide, View } from '@element-plus/icons-vue'
import PackageRequirements from './PackageRequirements.vue'
import ReceiptDelivery from './ReceiptDelivery.vue'
import DeliveryMethod from './DeliveryMethod.vue'
import AddressEditDialog from './AddressEditDialog.vue'
import ContactEditDialog from './ContactEditDialog.vue'
import service from '@/utils/request'
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
  emits: ['address-selected','contact-selected'],
  setup(props, { emit }) {
    // ★★★ 修改点 2: 添加 loading 状态 ★★★
    const loading = ref(false);

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

    const showAddressDialog = () => {
      addressDialogVisible.value = true
    }

    const showContactDialog = () => {
      contactDialogVisible.value = true
    }

    const handleAddressSelected = (address) => {
      selectedAddress.value = address
      emit('address-selected', selectedAddress.value)
      addressDialogVisible.value = false
      addressHidden.value = false
      contactHidden.value = false
      phoneHidden.value = false
    }

    const handleContactSelected = (contact) => {
      selectedContact.value = contact
      contactDialogVisible.value = false
      orderContactHidden.value = false
      techContactHidden.value = false
    }
    
    const getDefaultAddress = async () => {
      try {
        const response = await service.get('/api/address/get_default_addresses',{withCredentials:true});
        if (response.data.success === true)  {  
          selectedAddress.value = {
            address_id:response.data.data.id,
            fullAddress:response.data.data.detail_address + ' ' + response.data.data.city + ',' + response.data.data.province + ' ' + response.data.data.postal_code + ' ' + response.data.data.countryCode,
            postCode:response.data.data.postal_code,
            cityName: response.data.data.city,
            provinceName:response.data.data.province,
            countryCode: response.data.data.countryCode,
            detail: response.data.data.detail_address,
            name: response.data.data.contact_name,
            phone:response.data.data.contact_phone,
            shippingMethod: response.data.data.shipping_method,
            postName: response.data.data.post_name,
          }
          emit('address-selected', selectedAddress.value)
        }
      } catch (error) {
        console.log('获取默认地址失败:', error);
      }
    }
    const getDefaultContact = async () => {
      try {
        const response = await service.get('/api/contact/get_default_contact',{withCredentials:true});
        if (response.data.success === true)  {  
          selectedContact.value = {
            contact_id: response.data.data.id,
            orderName:response.data.data.order_contact,
            orderPhone: response.data.data.order_contact_phone,
            techName:response.data.data.tech_contact,
            techPhone: response.data.data.tech_contact_phone,
          }
          emit('contact-selected', selectedContact.value)
        }
      } catch (error) {
        console.error('获取默认地址失败:', error);
      }
    }

    // ★★★ 修改点 3: 创建一个统一的函数来获取初始数据并管理 loading 状态 ★★★
    const fetchInitialData = async () => {
        loading.value = true;
        try {
            await Promise.all([
                getDefaultAddress(),
                getDefaultContact()
            ]);
        } catch (error) {
            console.error("获取初始发货信息失败:", error);
        } finally {
            loading.value = false;
        }
    };

    onMounted(() => {
        // ★★★ 修改点 4: 调用新的数据获取函数 ★★★
        fetchInitialData();
    })

    return {
      // ★★★ 修改点 5: 返回 loading 状态给模板 ★★★
      loading,
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
      showAddressDialog,
      showContactDialog,
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