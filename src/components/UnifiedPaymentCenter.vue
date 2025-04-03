<template>
    <div class="payment-center">
      <!-- 顶部导航栏 -->
      <div class="navbar">
        <img src="@/assets/images/logo.jpg" alt="Logo" class="logo" />
        <span class="title">统一支付中心</span>
      </div>
  
      <!-- 信息框 -->
      <div class="info-box">
        <div class="info-header">
          <div class="header-left">
            <strong>待支付订单</strong>
          </div>
          <div class="header-right">
            <span>订单总额</span>
          </div>
        </div>
        <el-table :data="orders" style="width: 100%">
          <el-table-column type="index" label="序号" width="100" />
          <el-table-column prop="type" label="类型" width="150" />
          <el-table-column prop="orderNo" label="订单编号" width="200" />
          <el-table-column prop="orderTime" label="下单时间" width="200" />
          <el-table-column label="详情" width="150">
            <template #default="scope">
              <el-button type="primary" @click="viewDetails(scope.row)">查看</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="amount" label="订单金额" width="150" />
        </el-table>
      </div>
  
      <div class="info-box">
        <div class="info-header">
          <strong>选择支付方式</strong>
        </div>
        <div class="payment-methods">
          <el-checkbox :checked="selectedPaymentMethod === 'paypal'" @change="handlePaymentMethodChange('paypal')">PayPal支付</el-checkbox>
          <!-- 可以添加更多支付方式 -->
           <button class="white-button">
              <span ref="paypalButtonContainer">支付</span>
          </button>
        </div>
      </div>
  
      <div class="info-box">
        <div class="info-header">
          <strong>应付金额</strong>
        </div>
        <div class="amount-info">
          <div>
            <span>订单总额: ¥{{ totalAmount }}</span><br />
            <span>余额支付: ¥{{ balancePayment }}</span><br />
            <span>手续费: ¥{{ fee }}</span>
          </div>
          <el-button type="primary" class="pay-button" @click="initiatePayment">立即支付</el-button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { ElMessage } from 'element-plus'
  import axios from 'axios'
  import { useRouter } from 'vue-router' // 导入 Vue Router
  import { useRoute } from 'vue-router' // 导入 Vue Router
  // 创建路由实例
  const router = useRouter()
  const route = useRoute()
  // 模拟订单数据
  const orders = ref([
    { type: '商品', orderNo: 'ORD001', orderTime: '2023-10-01 10:00', amount: '¥100.00' },
    { type: '服务', orderNo: 'ORD002', orderTime: '2023-10-02 11:00', amount: '¥200.00' },
    { type: '商品', orderNo: 'ORD003', orderTime: '2023-10-03 12:00', amount: '¥150.00' },
  ])
  
  const totalAmount = ref(450.00) // 总金额
  const balancePayment = ref(0.00) // 余额支付
  const fee = ref(10.00) // 手续费
  const selectedPaymentMethod = ref('') // 选择的支付方式
  
  // 查看订单详情
  const viewDetails = (order) => {
    ElMessage.info(`查看订单详情: ${order.orderNo}`)
  }

  const paypalButtonContainer = ref(null)
// PayPal 支付初始化
const initPayment = async () => {
  try {
    // 检查是否有选中的记录
    // if (localRecords.value.length === 0) {
    //   ElMessage.warning('请先选择需要支付的零件')
    //   return
    // }

    // 计算总金额（这里需要根据实际业务逻辑修改）
    const totalAmount = calculateTotalAmount()

    await loadPayPalScript()
    renderPayPalButton(totalAmount)
  } catch (error) {
    console.error('PayPal 初始化失败:', error)
    ElMessage.error('支付初始化失败，请重试')
  }
}
// 加载 PayPal SDK
const loadPayPalScript = () => {
  return new Promise((resolve, reject) => {
    if (document.getElementById('paypal-sdk')) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.id = 'paypal-sdk'
    script.src = `https://www.paypal.com/sdk/js?client-id=AeYOVmvt0ysW_Pu20_Q8nJKqHIICdN9eVwG-K4A9dR0VCVK5-xVAM-2ANTdVOEZza19rapQNYRE9mkCz&currency=USD`
    script.onload = resolve
    script.onerror = reject
    document.body.appendChild(script)
  })
}
// 计算总金额
const calculateTotalAmount = () => {
  // 这里需要根据实际业务逻辑计算总金额
  return 100
}
// 渲染 PayPal 按钮
const renderPayPalButton = (amount) => {
  if (!window.paypal) return

  window.paypal.Buttons({
    createOrder: (data, actions) => {
      return actions.order.create({
        purchase_units: [{
          id: record.order_no,
          amount: {
          currency_code: 'USD',
          value: '100.00'
        }
        }]
      })
    },
    onApprove: async (data, actions) => {
      try {
        const order = await actions.order.capture()
        await handlePaymentSuccess(order)
        ElMessage.success('支付成功！')
      } catch (error) {
        console.error('支付处理失败:', error)
        ElMessage.error('支付处理失败，请联系客服')
      }
    },
    onError: (err) => {
      console.error('PayPal 错误:', err)
      ElMessage.error('支付出错，请重试')
    }
  }).render(paypalButtonContainer.value)
}
// 处理支付成功
const handlePaymentSuccess = async (paypalOrder) => {
  try {
    // 调用后端 API 处理支付成功逻辑
    const response = await axios.post('http://localhost:8000/api/payment/success', {
      paypalOrder,
      records: 100
    }, {
      withCredentials: true
    })
    if(response.status === 200) {
      ElMessage.success('支付成功！')
      updataRecord()
      message.data = '支付成功！'
      router.push({ path: '/cnc_order' })
      
    } else {
      ElMessage.error('支付失败！')
    }

  } catch (error) {
    console.error('更新订单状态失败:', error)
    throw new Error('订单状态更新失败')
  }
}
import { EventBus,EventBus_message } from './SignIn/eventBus.js';
const record = EventBus.data
const message = EventBus_message.data
const initiatePayment = async () => {
  console.log('record', record)
  initPayment()
}
const updataRecord = async () => {
  try {
    const response = await fetch(`http://localhost:8000/api/orders/orders_info/${record.id}`, {
      method: 'PUT', // 设置请求方法为 PUT
      headers: {
        'Content-Type': 'application/json' // 设置请求头
      },
      body: JSON.stringify({ // 将对象转换为 JSON 字符串
        "id": record.id,
        "order_no": record.order_no,
        "user_email": record.user_email,
        "processing_fee_id": record.processing_fee_id,
        "status": record.status,
        "model_info_id": record.model_info_id,
        "operation": record.operation
      })
    });

    // 检查响应状态
    if (!response.ok) {
      console.log('record', record);
      throw new Error('网络响应不是 OK');
    }

    // 可选：如果需要处理响应数据，可以在这里获取
    const responseData = await response.json();
    console.log('更新成功:', responseData);
  } catch (error) {
    console.error('请求失败:', error);
  }
}

//   // 处理支付方式改变
//   const handlePaymentMethodChange = (method) => {
//     if (selectedPaymentMethod.value === method) {
//       selectedPaymentMethod.value = ''
//     } else {
//       selectedPaymentMethod.value = method

//     }
//   }
  
//   const initiatePayment = async () => {
//     if (selectedPaymentMethod.value === 'paypal') {
//         initPayment()
//     } else {
//         ElMessage.warning('请先选择支付方式');
//     }
// }

//   // PayPal 支付初始化
//   const initPayment = async () => {
//     try {
//       await loadPayPalScript()
//       renderPayPalButton()
//     } catch (error) {
//       console.error('PayPal 初始化失败:', error)
//       ElMessage.error('支付初始化失败，请重试')
//     }
//   }
//   // 加载 PayPal SDK
//   const loadPayPalScript = () => {
//     return new Promise((resolve, reject) => {
//       if (document.getElementById('paypal-sdk')) {
//         resolve()
//         return
//       }
//       const script = document.createElement('script')
//       script.id = 'paypal-sdk'
//       script.src = `https://www.paypal.com/sdk/js?client-id=AeYOVmvt0ysW_Pu20_Q8nJKqHIICdN9eVwG-K4A9dR0VCVK5-xVAM-2ANTdVOEZza19rapQNYRE9mkCz&currency=USD`
//       script.onload = resolve
//       script.onerror = reject
//       document.body.appendChild(script)
//     })
//   }
//   // 创建订单的函数
//   const createOrder = async () => {
//     return {
//       id: Date.now().toString(), // 添加订单ID
//       purchase_units: [{
//         amount: {
//           currency_code: 'USD',
//           value: (totalAmount.value / 6.5).toFixed(2) // 动态金额，假设汇率6.5
//         }
//       }]
//     };
//   }

//   // 渲染 PayPal 按钮
//   const renderPayPalButton = async () => {
//     if (!window.paypal) return
//     try {
//         const order = await createOrder()
//         await handlePaymentSuccess(order)
//         ElMessage.success('支付成功！')
//         } catch (error) {
//         console.error('支付处理失败:', error)
//         ElMessage.error('支付处理失败，请联系客服')
//     }
//   }
//   // 处理支付成功
//   const handlePaymentSuccess = async (paypalOrder) => {
//     try {
//       // 调用后端 API 处理支付成功逻辑
//       await axios.post('http://localhost:8000/api/payment/success', {
//         paypalOrder,
//         records: 100
//       }, {
//         withCredentials: true
//       })
//     } catch (error) {
//       console.error('更新订单状态失败:', error)
//       throw new Error('订单状态更新失败')
//     }
//   }
  
  </script>
  <style scoped>
  .payment-center {
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .navbar {
    display: flex;
    align-items: center;
    padding: 10px;
    background-color: white;
    color: #007bff;
  }
  
  .logo {
    width: 50px;
    height: 50px;
    margin-right: 10px;
  }
  
  .title {
    font-size: 20px;
    font-weight: bold;
  }
  
  .info-box {
    margin-top: 20px;
    background-color: white;
    border-radius: 8px;
    padding: 15px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .info-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  
  .payment-methods {
    margin-top: 10px;
  }
  
  .amount-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .pay-button {
    color: white;
    background-color: blue;
  }
  </style>    

  