<template>
  <div class="total-info">
    <el-card class="info-card">
      <!-- 第一部分：交期&快递 -->
      <div class="info-section">
        <div class="section-title">交期&快递</div>
        <div class="info-row">
          <span class="label">快递</span>
          <span class="value">{{ selectedAddress?.postName }}</span>
        </div>
        <div class="info-row">
          <span class="label">预计发货时间：</span>
          <span class="value">{{ deliveryDate }}（以实际支付时间为准）</span>
        </div>
        <div class="info-row">
          <span class="label">物流运输时间:</span>
          <span class="value"> {{ShippingTime}} 个工作日</span>
        </div>
      </div>

      <!-- 第二部分：订单费用 -->
      <div class="info-section">
        <div class="section-title">订单费用</div>
        <div class="info-row">
          <span class="label">零件数量</span>
          <span class="value">{{ orderItems.length }}款/{{ orderItems.reduce((total, item) => total + item.quantity, 0) }}件</span>
        </div>
        <div class="info-row">
          <span class="label">运费</span>
          <span class="value">¥{{ TotalShippingFee }}</span>
          <el-tooltip content="`运费: ${price_E1.value}元 挂号费: ${price_E2.value}元`" placement="top" effect="dark">
            <el-icon class="question-icon"><QuestionFilled /></el-icon>
          </el-tooltip>
        </div>
        <div class="info-row">
          <span class="label">商品总额(含税)：</span>
          <span class="value">¥{{ orderItems.reduce((total, item) => total + item.totalPrice, 0) }}</span>
        </div>
      </div>

      <!-- 第三部分：优惠券 -->
      <div class="coupon-section">
        <span class="label">优惠券</span>
        <span class="value coupon-text">已选择"CNC15元运费抵扣券"&gt;</span>
      </div>

      <!-- 第四部分：应付款 -->
      <div class="total-section">
        <span class="label bold">应付款（含税）：</span>
        <span class="value price">¥{{ shippingFee+orderItems.reduce((total, item) => total + item.totalPrice, 0) }}</span>
      </div>

      <el-divider class="divider" />

      <!-- 按钮区域 -->
      <div class="button-group">
        <el-button type="primary" class="submit-btn" @click="submitOrder">
          提交询价
        </el-button>
        <el-button class="back-btn" @click="goBack">
          返回上一步
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, defineProps, watch, onMounted,computed } from 'vue'
import { useRouter } from 'vue-router' // 引入 useRouter
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { QuestionFilled } from '@element-plus/icons-vue'
const shippingFee = ref(0)
const TotalShippingFee = ref(0)
const ShippingTime = ref(0)
const price_E1 = ref(0)
const price_E2 = ref(0)
const router = useRouter() // 获取 router 实例
const TotalWeight = ref(0)
const orderAccessId = ref('')
import { useSelectedDataStore } from '@/store/PriceInquiryDatas'
import service from '@/utils/request'
const props = defineProps({
  selectedDatas: {
    type: Array,
    required: true
  },
  selectedAddress: {
    type: Object,
    default: null
  }
})

// 监听地址变化
watch(() => props.selectedAddress, (newAddress) => {
  if (newAddress) {
    console.log('TotalInfo收到新的地址：', newAddress)
    // 这里可以添加地址变化后的处理逻辑
    fetchPrice()
  }
}, { immediate: true })

const orderItems = ref([])
watch(() => props.selectedDatas, (newValue) => {
  orderItems.value=newValue
}, { immediate: true })

// 提交订单方法
const submitOrder = async () => {
  console.log('props.selectedDatas:',props.selectedDatas)
  if(orderAccessId.value){
    const formData = props.selectedDatas.map(selectedData =>{
      const orderNo = orderAccessId.value
      console.log('订单编号:',orderNo)
      return {
        "order_no": orderNo,
        "user_email": "1@q.com",
        "material_cost": selectedData.materialCost,
        "engineering_cost": selectedData.engineeringCost,
        "clamping_cost": selectedData.clampingCost,
        "processing_cost": selectedData.processingCost,
        "expedited_price": selectedData.expeditedPrice,
        "surface_cost": selectedData.surfaceCost,
        "unit_price": selectedData.pricePerUnit,
        "total_price": selectedData.totalPrice,
        "material": selectedData.material,
        "surface_treatment": selectedData.surfaceTreatment === 0 ? "none" : true,
        "treatment1_option": selectedData.selectedTreatment,
        "treatment1_color": selectedData.selectedColor,
        "treatment1_gloss": selectedData.glossiness,
        "treatment1_drawing": selectedData.uploadedFileName,
        "treatment2_option": selectedData.selectedTreatment2,
        "treatment2_color": selectedData.selectedColor2,
        "treatment2_gloss": selectedData.glossiness2,
        "treatment2_drawing": selectedData.uploadedFileName2,
        "quantity": selectedData.quantity,
        "tolerance": selectedData.tolerance,
        "roughness": selectedData.roughness,
        "has_thread": selectedData.hasThread === "false" ? 0 : 1,
        "has_assembly": selectedData.hasAssembly === "false" ? 0 : 1
      }
    })
    console.log('formData',formData)
    const submitOrderresponse = await service.get('/api/orders/submit_cnc_order',{
    params: {bizOrderAccessId:orderAccessId.value},},
     {withCredentials: true})
    console.log('submitOrderresponse:', submitOrderresponse)
    if (submitOrderresponse.status === 200) {
      const response = await service.post('/api/orders/orders', JSON.stringify(formData), {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });
    console.log('response:', response)
    console.log('response.status:', response.status)
    if (response.status === 200) {
      const orderNos = formData.map(item => item.order_no)
      // 使用 path 而不是 name 进行路由跳转
      router.push({
        path: '/SubmitOrderSuccess',
        query: {
          orderNos: orderNos.join(','),
          totalFee: shippingFee.value+orderItems.value.reduce((total, item) => total + item.totalPrice, 0)
        }
      })
    } else {
      ElMessage.error('提交订单失败，请稍后重试')
    }
    } else {
      ElMessage.error('提交订单失败，请稍后重试')
    }
  }
  else{
    console.log('订单编号为空，无法提交订单')
  }
}

// 返回上一步方法
const goBack = () => {
  router.go(-1) // 使用 router 实例进行跳转
}

const priceResult = ref([])
const fetchPrice = async () => {
  try {
    const response = await service.get('/api/logistics/price-trial', {
      params: {
        country_code: props.selectedAddress?.countryCode,
        weight: TotalWeight.value
      }
    }, { withCredentials: true })
    priceResult.value = response.data.result
    console.log('priceResult', priceResult.value)
    const priceE1 = priceResult.value.find(price => price.product_name === props.selectedAddress?.postName && price.fee_name === 'E1')
    console.log('E1的priceE1', priceE1)
    const priceE2 = priceResult.value.find(price => price.product_name === props.selectedAddress?.postName && price.fee_name === 'E2')
    console.log('E1的priceE2', priceE2)
    shippingFee.value = priceE1.convert_amount + priceE2.convert_amount
    ShippingTime.value = priceE2.interval_day
    price_E1.value = priceE1.convert_amount 
    price_E2.value = priceE2.convert_amount
    TotalShippingFee.value = shippingFee.value + carriageFee.value
    ElMessage.success('获取价格信息成功')
  } catch (error) {
    console.error('请求失败:', error)
    ElMessage.error('获取价格信息失败')
  }
}
const getDatas = ref([])
const carriageFee = ref(0)

const get_selected_datas = async () => {
  const get_selected_datas_response =  await service.get('/api/orders/get_selected_datas', { withCredentials: true })
  getDatas.value = get_selected_datas_response.data[0]
  console.log('get_selected_datas:', getDatas.value)
  console.log('getDatas.value:', getDatas.value)
  console.log('getDatas.value.fileInfoAccessId:', getDatas.value.fileInfoAccessId)
  const orderData = {
    activityGiveawayCode: null,
    urlType: "CNC_ORDER_SUCCESSFUL",
    goods: [{
      assembleFileUuid: null,
      assembleModelAccessIds: [],
      crafts: [
          {
            "craftAccessId": getDatas.value.craftAccessId1,
            "attributes": [
              {
                "craftAttributeAccessId": getDatas.value.craftAttributeGlossinessAccessIds1,
                "customerCraft": "",
                "resourceUrl": ""
              },
              {
                "craftAttributeAccessId": getDatas.value.craftAttributeColorAccessIds1,
                "customerCraft": "",
                "resourceUrl": ""
              }
            ].filter(attr => attr.craftAttributeAccessId) // 过滤掉craftAttributeAccessId为空的元素
          },
          {
            "craftAccessId": getDatas.value.craftAccessId2,
            "attributes": [
              {
                "craftAttributeAccessId": getDatas.value.craftAttributeGlossinessAccessIds2,
                "customerCraft": "",
                "resourceUrl": ""
              },
              {
                "craftAttributeAccessId": getDatas.value.craftAttributeColorAccessIds2,
                "customerCraft": "",
                "resourceUrl": ""
              }
            ].filter(attr => attr.craftAttributeAccessId) // 过滤掉craftAttributeAccessId为空的元素
          }
        ]
        .filter(craft => craft.craftAccessId) // 过滤掉craftAccessId为空的元素
        .map(craft => ({
          ...craft,
          attributes: craft.attributes && craft.attributes.length > 0 ? craft.attributes : [] // 如果attributes为空则设为空数组
        }))
        .filter(craft => Object.keys(craft).some(key => key !== 'craftAccessId' && craft[key] && craft[key].length > 0)), // 过滤掉所有字段都为空的craft
      
      deliveryTypeCode: getDatas.value.deliveryTypeCode,
      fileInfoAccessIds: [getDatas.value.fileInfoAccessId], 
      materialAccessId: getDatas.value.materialAccessId,
      productModelAccessId: getDatas.value.productModelAccessId,
      quantity: getDatas.value.quantity,
      roughnessAccessId: getDatas.value.roughnessAccessId,
      roughnessFileUuid: '',
      toleranceAccessId: getDatas.value.toleranceAccessId,
      toleranceFileUuid: '',
      whorlFlag: 0,
      whorls: []
    }]
  };
  console.log('get_orderAccessIds前端传送的数据',orderData)
  const orderResponse = await service.post('/api/price/get_orderAccessIds',  JSON.stringify(orderData), {
  withCredentials: true
  });
  orderAccessId.value = orderResponse.data.data.orderAccessIds[0];
  if(orderAccessId.value){
    console.log('获取到的orderAccessId:', orderAccessId.value);
    const get_orderAccessIds = {
    bizOrderAccessId:orderAccessId.value
  }
    const carriageFeeResponse = await service.post('/api/price/place_calculate_coupon_fee',  JSON.stringify(get_orderAccessIds), {
        withCredentials: true
      });
    console.log('获取到的carriageFeeResponse:', carriageFeeResponse);
    carriageFee.value = carriageFeeResponse.data.carriageFee;
    console.log('carriageFee', carriageFee.value)
    
    const get_weight_OrderAccessIds = {
      bizOrderAccessId:orderAccessId.value,
      businessLine: "cnc",
    }
    const response = await service.post('/api/price/get_weight', JSON.stringify(get_weight_OrderAccessIds), { withCredentials: true })
    TotalWeight.value = response.data.data.bizTotalWeight
    console.log('估重', TotalWeight.value)
  }
  else{
    console.log('获取失败，请检查问题!');
  }
}

onMounted(() => {
  get_selected_datas()
})

</script>

<style scoped>
.total-info {
  position: sticky;
  top: 60px;
}

.info-card {
  width: 500px;
  padding: 20px;
  margin-top: 40px;
}

.info-section {
  margin-bottom: 20px;
}

.section-title {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  font-size: 14px;
  color: #303133;
  margin-bottom: 15px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-size: 14px;
}

.coupon-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  font-size: 14px;
}

.total-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  font-size: 14px;
}

.label {
  color: #606266;
}

.value {
  color: #303133;
}

.bold {
  font-weight: bold;
}

.price {
  color: #ff4d4f;
  font-size: 16px;
  font-weight: bold;
}

.coupon-text {
  color: #409EFF;
  cursor: pointer;
}

.divider {
  margin: 20px 0;
  border-style: dashed;
}

.button-group {
  display: flex;
  flex-direction: row; /* 改为水平排列 */
  gap: 10px; /* 按钮之间的间距 */
}

.submit-btn {
  flex: 1; /* 让按钮平分宽度 */
  height: 40px;
  background-color: #409EFF;
  border-color: #409EFF;
}

.back-btn {
  flex: 1; /* 让按钮平分宽度 */
  height: 40px;
  border: 1px solid #303133;
  color: #303133;
}

.question-icon {
  margin-left: 5px;
  color: #909399;
}

.question-icon:hover {
  color: #409EFF;
}

:deep(.el-card__body) {
  padding: 20px;
}
</style>