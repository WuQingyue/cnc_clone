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
import { ref, watch } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { countryList,productList } from './DeliveryInfo'
import axios from 'axios'
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
    watch(() => props.selectedAddress, (newVal) => {
        console.log('收到selectedAddress变化:', newVal)
        if (newVal) {
          // 更宽松的比较方式
          const foundAddress = savedAddresses.value.find(addr => addr.address_id === newVal.address_id )
          
          
          if (foundAddress) {
            console.log('找到匹配地址:', foundAddress)
            useAddress(foundAddress)
          } else {
            console.log('未找到匹配地址')
          }
        }
      }, { immediate: true, deep: true })  // 添加deep:true深度监听

    const dialogVisible = ref(false)
    const showForm = ref(false)
    const savedAddresses = ref([])
    const addressFormRef = ref(null)

    const addressForm = ref({
      name: '',
      phone: '',
      region: {
        postway: '',
        country: '',
        province: '',
        city: '',
        postCode:''
      },
      detail: ''
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
      postway:'',
      countryName: '',
      countryCode: '',
      provinceName: '',
      cityName: '',
      detail: '',
      postCode:'',
      postName:''
    })
    const productGroupsList = ref(
      productList[0].Entity.map(productGroup =>({
        value:productGroup.ShippingMethodCode,
        label: productGroup.ShippingMethodName,
        children:[]
      })) 
    )
    const countryOptions = ref([])
  
    const handlePostwayChange = async (value) => {
      console.log('value[0]',value[0])
      const response = await service.get('/api/logistics/get_country', {
            params: { ProductCode: value[0] },
          },{ withCredentials: true })
      countryOptions.value = response.data.map(country =>({
        value:country.CountryCode,
        label: country.CountryCNname
      }))
      regionDetail.value.postway = value[0]
      const productGroup = productGroupsList.value.find(productGroup => productGroup.value === value[0])
      regionDetail.value.postName = productGroup.label
      console.log('value[0]',value[0])
      console.log('productGroupsList.value',productGroupsList.value)
      const country = productGroupsList.value.find(country => country.value === value[0])
      console.log('country',country)
      console.log('regionDetail',regionDetail.value)
    }
   
    const provinceOptions = ref([])
    const handleCountryChange = async (value) => {
      console.log('value[0]',value[0])
      const response = await service.get('/api/logistics/get_region1', {
            params: { country_code: value[0] },
          },{ withCredentials: true })
      console.log('response',response)
      provinceOptions.value = response.data.Data.map(country =>({
        value:country.RegionName,
        label: country.RegionName
      }))
      const province = countryOptions.value.find(province => province.value === value[0])
      console.log('province',province)
      regionDetail.value.countryCode = province.value
      regionDetail.value.countryName = province.label
      console.log('regionDetail',regionDetail.value)
    }

    const cityOptions = ref([])
    const handleProvinceChange = async (value) => {
      console.log('value[0]',value[0])
      regionDetail.value.provinceName = value[0]
      const response = await service.get('/api/logistics/get_region2', {
            params: { country: regionDetail.value.countryCode,region1:regionDetail.value.provinceName },
          },{ withCredentials: true })
      console.log('response',response)
      cityOptions.value = response.data.Data.map(country =>({
        value:country.RegionName,
        label: country.RegionName
      }))
      console.log('cityOptions',cityOptions.value)
      // const city = provinceOptions.value.find(city => city.value === value[0])
      // console.log('city',city)
      // regionDetail.value.cityName = city.value
      console.log('regionDetail',regionDetail.value)
    }
    const postCodeOptions = ref([])
    const handleCityChange = async (value) => {
      regionDetail.value.cityName = value[0]
      const response = await service.get('/api/logistics/get_postcode', {
            params: { country: regionDetail.value.countryCode,region1:regionDetail.value.provinceName,region2:regionDetail.value.cityName },
          },{ withCredentials: true })
      console.log('response',response)
      postCodeOptions.value = response.data.Data.map(postcode =>({
        value:postcode,
        label: postcode
      }))
      console.log('postCodeOptions',postCodeOptions.value)
      console.log('regionDetail',regionDetail.value)
      }
    const handlePostCodeChange = async (value) => {
    regionDetail.value.postCode = value[0]
    console.log('regionDetail',regionDetail.value)
    }
    
    watch(() => addressForm.value.detail, (val) => {
      regionDetail.value.detail = val
      console.log('regionDetail',regionDetail.value)
    })

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

    const setDefaultAddress = async (address) => {
      savedAddresses.value.forEach(item => {
        item.isDefault = item === address
      })
      const response = await service.post(
      '/api/address/set_default_address',
      {
        address_id: address.address_id
      },
      { withCredentials: true }
    )
    console.log('更新默认地址response',response)
    }

    const saveAddress = async () => {
      if (!addressFormRef.value) return

      await addressFormRef.value.validate(async (valid) => {
        if (valid) {
          // 1. 本地 address（用于本地表格展示）
          const address = { 
            ...addressForm.value,
            fullAddress: regionDetail.value.detail + ' ' + regionDetail.value.cityName + ',' + regionDetail.value.provinceName + ' ' + regionDetail.value.postCode + ' ' + regionDetail.value.countryCode,
            isDefault: savedAddresses.value.length === 0,
            isUsing: savedAddresses.value.length === 0,
            postName: regionDetail.value.postName,
            countryCode: regionDetail.value.countryCode
          }

          // 2. 后端需要的数据结构
          const addressPayload = {
            contact_name: addressForm.value.name,
            contact_phone: addressForm.value.phone,
            detail_address: addressForm.value.detail,
            is_active: false,
            is_default: false,
            shipping_method: regionDetail.value.postway || '',
            countryCode: regionDetail.value.countryCode || '',
            province: regionDetail.value.provinceName || '',
            city: regionDetail.value.cityName || '',
            postal_code: regionDetail.value.postCode || ''
          }

          try {
            // 3. 发送给后端
            const response = await service.post('/api/address/add_address', addressPayload, { withCredentials: true })
            if (response.status === 200) {
              ElMessage.success('地址保存成功')
              // 4. 本地保存（不影响后端）
              savedAddresses.value.push(address)
              showForm.value = false
              emit('save-address', address)
              if (address.isUsing) {
                emit('use-address', address)
              }
            } else {
              ElMessage.error('地址保存失败')
            }
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
      try {
        const response = await service.get('/api/address/get_user_addresses', { withCredentials: true })
        if (response.status === 200 && Array.isArray(response.data)) {
          savedAddresses.value = response.data.map(addr => ({
            address_id: addr.id,
            name: addr.contact_name,
            phone: addr.contact_phone,
            detail: addr.detail_address, 
            shippingMethod: addr.shipping_method,
            countryCode: addr.country,
            provinceName: addr.province,
            cityName: addr.city,
            postCode: addr.postal_code,
            isDefault: addr.is_default,
            isUsing: addr.is_active,
            fullAddress: addr.detail_address + ' ' + addr.city + ',' + addr.province + ' ' + addr.postal_code + ' ' + addr.country,
            
          }))
          console.log('savedAddresses',savedAddresses.value)
        } else if (response.status === 200 && Array.isArray(response.data.data)) {
          // 如果后端返回 { data: [...] }
          savedAddresses.value = response.data.data
        }
      } catch (error) {
        ElMessage.error('获取地址列表失败')
        console.error('获取地址失败:', error)
      }
    }

    onMounted(() => {
      fetchAddresses()
    })

    return {
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
import { onMounted } from 'vue'

</script>

<style scoped>
.cascader-container {
  display: flex;
  gap: 10px; /* 控制组件之间的间距 */
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