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
    <el-table :data="savedAddresses" style="width: 100%" v-loading="loading">
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

          <!-- 删除按钮 -->
          <el-button type="text" @click="deleteAddress(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增/编辑地址表单 -->
    <div v-if="showForm" class="address-form">
      <el-form :model="addressForm" label-width="100px" :rules="rules" ref="addressFormRef">
        <!-- 表单内容... -->
        <el-form-item label="联系人" prop="name">
          <el-input v-model="addressForm.name" placeholder="请输入联系人姓名" />
        </el-form-item>
        
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="addressForm.phone" placeholder="请输入联系电话" />
        </el-form-item>
        
        <el-form-item label="收货地址" prop="region">
          <div class="cascader-container">
            <el-cascader
              v-model="addressForm.region.postway"
              :options="productGroupsList"
              placeholder="请选择运输方式"
              @change="handlePostwayChange"
            />
            <el-cascader
              v-model="addressForm.region.country"
              :options="countryOptions"
              placeholder="请选择国家"
              @change="handleCountryChange"
            />
            <el-cascader
              v-model="addressForm.region.province"
              :options="provinceOptions"
              placeholder="请选择省份"
              @change="handleProvinceChange"
            />
            <el-cascader
              v-model="addressForm.region.city"
              :options="cityOptions"
              placeholder="请选择城市"
              @change="handleCityChange"
            />
            <el-cascader
              v-model="addressForm.region.postCode"
              :options="postCodeOptions"
              placeholder="请选择邮编"
              @change="handlePostCodeChange"
            />
          </div>
        </el-form-item>
        
        <el-form-item label="详细地址" prop="detail">
          <el-input
            v-model="addressForm.detail"
            type="textarea"
            placeholder="请输入详细地址"
          />
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
import { ref, watch, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { countryList, productList } from './DeliveryInfo'
import service from '@/utils/request'

export default {
  name: 'AddressEditDialog',
  components: {
    Plus
  },
  props: {
    visible: Boolean,
    selectedAddress: {
      type: Object,
      default: null
    }
  },
  emits: ['update:visible', 'save-address', 'use-address'],
  setup(props, { emit }) {
    const loading = ref(false);
    
    // ★★★ 修改点 1: 移除存在竞态条件的 watch 侦听器 ★★★
    // watch(() => props.selectedAddress, (newVal) => {
    //     if (newVal) {
    //       const foundAddress = savedAddresses.value.find(addr => addr.address_id === newVal.address_id )
    //       if (foundAddress) {
    //         useAddress(foundAddress)
    //       }
    //     }
    //   }, { immediate: true, deep: true })

    const dialogVisible = ref(false)
    const showForm = ref(false)
    const savedAddresses = ref([])
    const addressFormRef = ref(null)

    const addressForm = ref({
      name: '', phone: '', region: { postway: '', country: '', province: '', city: '', postCode:'' }, detail: ''
    })

    const rules = {
      name: [{ required: true, message: '请输入联系人姓名', trigger: 'blur' }],
      phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
      'region.postway': [{ required: true, message: '请选择运输方式', trigger: 'change' }],
      'region.country': [{ required: true, message: '请选择收件国家', trigger: 'change' }],
      'region.province': [{ required: true, message: '请选择州/省', trigger: 'change' }],
      'region.city': [{ required: true, message: '请选择城市', trigger: 'change' }],
      'region.postCode': [{ required: true, message: '请选择邮编', trigger: 'change' }],
      detail: [{ required: true, message: '请输入详细地址', trigger: 'blur' }]
    }
    
    const regionDetail = ref({
      postway:'', countryName: '', countryCode: '', provinceName: '', cityName: '', detail: '', postCode:'', postName:''
    })
    const productGroupsList = ref(
      productList[0].Entity.map(productGroup =>({
        value:productGroup.ShippingMethodCode, label: productGroup.ShippingMethodName, children:[]
      })) 
    )
    const countryOptions = ref([])
  
    const handlePostwayChange = async (value) => {
      const response = await service.get('/api/logistics/get_country', { params: { ProductCode: value[0] } },{ withCredentials: true })
      countryOptions.value = response.data.map(country =>({ value:country.CountryCode, label: country.CountryCNname }))
      regionDetail.value.postway = value[0]
      const productGroup = productGroupsList.value.find(productGroup => productGroup.value === value[0])
      regionDetail.value.postName = productGroup.label
    }
   
    const provinceOptions = ref([])
    const handleCountryChange = async (value) => {
      const response = await service.get('/api/logistics/get_region1', { params: { country_code: value[0] } },{ withCredentials: true })
      provinceOptions.value = response.data.Data.map(country =>({ value:country.RegionName, label: country.RegionName }))
      const province = countryOptions.value.find(province => province.value === value[0])
      regionDetail.value.countryCode = province.value
      regionDetail.value.countryName = province.label
    }

    const cityOptions = ref([])
    const handleProvinceChange = async (value) => {
      regionDetail.value.provinceName = value[0]
      const response = await service.get('/api/logistics/get_region2', { params: { country: regionDetail.value.countryCode,region1:regionDetail.value.provinceName } },{ withCredentials: true })
      cityOptions.value = response.data.Data.map(country =>({ value:country.RegionName, label: country.RegionName }))
    }

    const postCodeOptions = ref([])
    const handleCityChange = async (value) => {
      regionDetail.value.cityName = value[0]
      const response = await service.get('/api/logistics/get_postcode', { params: { country: regionDetail.value.countryCode,region1:regionDetail.value.provinceName,region2:regionDetail.value.cityName } },{ withCredentials: true })
      postCodeOptions.value = response.data.Data.map(postcode =>({ value:postcode, label: postcode }))
    }

    const handlePostCodeChange = async (value) => {
      regionDetail.value.postCode = value[0]
    }
    
    watch(() => addressForm.value.detail, (val) => {
      regionDetail.value.detail = val
    })

    watch(() => props.visible, (val) => {
      dialogVisible.value = val
      if (val) {
        fetchAddresses();
      }
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
      addressForm.value = { name: '', phone: '', region: [], detail: '' }
    }

    const useAddress = (address) => {
      savedAddresses.value.forEach(item => { item.isUsing = item === address })
      emit('use-address', address)
    }

    const setDefaultAddress = async (address) => {
      savedAddresses.value.forEach(item => { item.isDefault = item === address })
      await service.post('/api/address/set_default_address', { address_id: address.address_id }, { withCredentials: true })
    }

    const saveAddress = async () => {
      if (!addressFormRef.value) return
      await addressFormRef.value.validate(async (valid) => {
        if (valid) {
          const address = { ...addressForm.value, fullAddress: regionDetail.value.detail + ' ' + regionDetail.value.cityName + ',' + regionDetail.value.provinceName + ' ' + regionDetail.value.postCode + ' ' + regionDetail.value.countryCode, isDefault: savedAddresses.value.length === 0, isUsing: savedAddresses.value.length === 0, postName: regionDetail.value.postName, countryCode: regionDetail.value.countryCode, shippingMethod: regionDetail.value.postway, }
          const addressPayload = { contact_name: addressForm.value.name, contact_phone: addressForm.value.phone, detail_address: addressForm.value.detail, is_active: false, is_default: false, shipping_method: regionDetail.value.postway || '', countryCode: regionDetail.value.countryCode || '', province: regionDetail.value.provinceName || '', city: regionDetail.value.cityName || '', post_name: regionDetail.value.postName || '', postal_code: regionDetail.value.postCode || '' }
          try {
            const response = await service.post('/api/address/add_address', addressPayload, { withCredentials: true })
            if (response.status === 200) {
              ElMessage.success('地址保存成功')
              await fetchAddresses();
              showForm.value = false
              emit('save-address', address)
              if (address.isUsing) {
                emit('use-address', address)
              }
            } else { ElMessage.error('地址保存失败') }
          } catch (error) {
            ElMessage.error('地址保存失败')
            console.error('地址保存出错:', error)
          }
        }
      })
    }

    const cancelEdit = () => {
      showForm.value = false
    }
  
    const fetchAddresses = async () => {
      loading.value = true;
      try {
        const response = await service.get('/api/address/get_user_addresses', { withCredentials: true })
        if (response.data.success === true) {
          // ★★★ 修改点 2: 映射地址列表，并将 isUsing 初始化为 false，以确保每次打开弹窗时状态是干净的 ★★★
          savedAddresses.value = response.data.data.map(addr => ({
            address_id: addr.id,
            name: addr.contact_name,
            phone: addr.contact_phone,
            detail: addr.detail_address,
            shippingMethod: addr.shipping_method,
            countryCode: addr.countryCode,
            provinceName: addr.province,
            cityName: addr.city,
            postCode: addr.postal_code,
            isDefault: addr.is_default,
            isUsing: false, // 替换 `addr.is_active`，确保初始状态为未使用
            postName: addr.post_name,
            fullAddress: addr.detail_address + ' ' + addr.city + ',' + addr.province + ' ' + addr.postal_code + ' ' + addr.countryCode,
          }));

          // ★★★ 修改点 3: 在数据加载后，根据父组件传入的 selectedAddress 设置“已用”状态 ★★★
          if (props.selectedAddress) {
            const currentlyUsedAddress = savedAddresses.value.find(
              addr => addr.address_id === props.selectedAddress.address_id
            );
            if (currentlyUsedAddress) {
              // 直接修改状态，不触发 useAddress 中的 emit 事件
              currentlyUsedAddress.isUsing = true;
            }
          }

        } else if (response.status === 200 && Array.isArray(response.data.data)) {
          savedAddresses.value = response.data.data
        }
      } catch (error) {
        ElMessage.error('获取地址列表失败')
        console.error('获取地址失败:', error)
      } finally {
        loading.value = false;
      }
    }

    const deleteAddress = async (addressToDelete) => {
      try {
        await ElMessageBox.confirm(
          '此操作将永久删除该地址, 是否继续?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
        )
        console.log(addressToDelete)
        // 用户确认后，执行删除
        const response = await service.delete(
          `/api/address/delete_address/${addressToDelete.address_id}`, 
          { withCredentials: true }
        );

        if (response.data.success) {
          ElMessage.success('删除成功');
          // 从本地数组中移除该地址，以更新UI
          savedAddresses.value = savedAddresses.value.filter(
            (addr) => addr.address_id !== addressToDelete.address_id
          );
        } else {
          ElMessage.error(response.data.detail || '删除失败');
        }
      } catch (error) {
        if (error === 'cancel') {
          ElMessage.info('已取消删除');
        } else {
          console.error('删除地址失败:', error);
          ElMessage.error('删除地址失败，请稍后重试');
        }
      }
    }

    return {
      deleteAddress,
      loading,
      dialogVisible,
      showForm,
      addressForm,
      addressFormRef,
      savedAddresses,
      productGroupsList,
      countryOptions,
      provinceOptions,
      cityOptions,
      postCodeOptions,
      rules,
      showAddForm,
      saveAddress,
      cancelEdit,
      useAddress,
      setDefaultAddress,
      handlePostwayChange,
      handleCountryChange,
      handleProvinceChange,
      handleCityChange,
      handlePostCodeChange,
      regionDetail
    }
  }
}
</script>

<style scoped>
/* 样式保持不变 */
.cascader-container {
  display: flex;
  gap: 10px;
}
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