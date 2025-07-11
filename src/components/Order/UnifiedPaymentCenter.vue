<template>
  <div class="payment-center-wrapper">
    <div class="payment-card">
      <h2 class="page-title">统一支付中心</h2>

      <!-- 商品总额展示 -->
      <div class="amount-section">
        <div class="amount-value">
          ${{ totalAmount.toFixed(2) }}
        </div>
        <div class="amount-label">订单总额（美元）</div>
      </div>

      <!-- 支付方式选择 -->
      <div class="payment-methods-section">
        <div class="section-header">
          <strong>选择支付方式</strong>
        </div>
        <div class="payment-option">
          <el-radio-group v-model="selectedPaymentMethod">
            <el-radio label="paypal" size="large">PayPal 支付</el-radio>
          </el-radio-group>
        </div>
      </div>

      <!-- 支付操作 -->
      <div class="action-box">
        <el-button
          type="primary"
          class="pay-button"
          @click="onPayClick"
          :loading="loading"
        >
          立即支付
        </el-button>
      </div>

      <!-- PayPal 支付对话框 -->
      <el-dialog
        v-model="paypalDialogVisible"
        title="PayPal 支付"
        width="400px"
        :close-on-click-modal="false"
        @closed="cleanupPayPalButton"
      >
        <div class="paypal-container-wrapper">
          <p>请在下方 PayPal 窗口中完成支付。</p>
          <div ref="paypalButtonContainer" class="paypal-button-host"></div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script setup>
  import { ref, computed, nextTick } from 'vue'
  import { ElMessage } from 'element-plus'
  import { useRouter } from 'vue-router'
  import { EventBus } from '@/components/SignIn/eventBus.js'
  import service from '@/utils/request'
  
  const record = ref(EventBus.data || {})
  
  // 商品总额，严格保证为大于 0 的数字
  const totalAmount = computed(() => {
    console.log('record.value',record.value)
    let raw = Number(record.value.total_amount)
    if (isNaN(raw) || raw <= 0) return 0
    // 保留两位小数
    return Math.round(raw * 100) / 100
  })
  
  const selectedPaymentMethod = ref('')
  const loading = ref(false)
  const paypalDialogVisible = ref(false)
  const paypalButtonContainer = ref(null)
  const router = useRouter()
  
  // 支付按钮点击
  const onPayClick = async () => {
    if (totalAmount.value <= 0) {
      ElMessage.error('订单金额必须大于0，无法发起支付，请联系管理员。')
      return
    }
    if (selectedPaymentMethod.value !== 'paypal') {
      ElMessage.warning('请选择支付方式')
      return
    }
    loading.value = true
    paypalDialogVisible.value = true
    await nextTick()
    initializePayPal()
    loading.value = false
  }
  
  // 加载 PayPal SDK
  const loadPayPalScript = () => {
    return new Promise((resolve, reject) => {
      if (window.paypal) {
        resolve()
        return
      }
      const script = document.createElement('script')
      script.src = `https://www.paypal.com/sdk/js?client-id=Abj-j4UBoVj6YiNvA4vBRTH4vail8ATnV9uc4aSQTsquYwMf0Tt4JG-VYRt4l2Jv3pyk9-E3r-YrrKxA&currency=USD`
      script.onload = resolve
      script.onerror = reject
      document.body.appendChild(script)
    })
  }
  
  // 初始化 PayPal 支付
  const initializePayPal = async () => {
    await loadPayPalScript()
    renderPayPalButton(totalAmount.value)
  }
  
  // 渲染 PayPal 按钮
  const renderPayPalButton = (amount) => {
    if (!window.paypal || !paypalButtonContainer.value) return
    cleanupPayPalButton()
    // 金额必须为大于 0 的两位小数字符串
    const payAmount = (Number(amount) > 0 ? Number(amount).toFixed(2) : '0.01')
    window.paypal.Buttons({
      createOrder: (data, actions) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              currency_code: 'USD',
              value: payAmount
            }
          }]
        })
      },
      onApprove: async (data, actions) => {
        try {
          const order = await actions.order.capture()
          await handlePaymentSuccess(order)
        } catch (error) {
          console.error('支付处理失败:', error)
          ElMessage.error('支付处理失败，请联系客服')
        } finally {
          paypalDialogVisible.value = false
        }
      },
      onError: (err) => {
        console.error('PayPal 支付错误:', err)
        ElMessage.error('支付出错，请重试')
        paypalDialogVisible.value = false
      }
    }).render(paypalButtonContainer.value)
  }
  
  // 处理支付成功
  const handlePaymentSuccess = async (paypalOrder) => {
    ElMessage.success('支付成功！正在处理订单...')
    try {
      const response = await service.post('/api/payment/success', {
        paypalOrder,
        order_no: record.value.order_no
      }, { withCredentials: true })
      if (response.status === 200) {
        const payUrl = await get_payUuid(record.value.order_no)
        if (typeof payUrl === 'string' && payUrl.trim() !== '') {
          const jlcRes = await service.post('/api/orders/jlc_order', { payUrl: payUrl }, { withCredentials: true })
          if (jlcRes.status === 200) {
            await service.post('/api/logistics/order_create', { logistics_id: record.value.logistics_info_id }, { withCredentials: true })
          }
        }
        router.push({
          path: '/cnc_order',
          query: { payment_status: 'success', order: record.value.orderCode }
        })
      } else {
        ElMessage.error('支付状态更新失败！')
      }
    } catch (error) {
      console.error('支付成功后，更新订单状态失败:', error)
      ElMessage.error('订单后续处理失败，请联系客服。')
    }
  }
  
  // 获取 payUuid
  const get_payUuid = async (order_no) => {
    try {
      const res = await service.get('/api/orders/get_payUuid', { params: { orderAccessId: order_no } })
      return res.data.data.payUrl
    } catch (error) {
      console.error('获取 payUuid 失败:', error)
      return ''
    }
  }
  
  // 清理 PayPal 按钮
  const cleanupPayPalButton = () => {
    if (paypalButtonContainer.value) {
      paypalButtonContainer.value.innerHTML = ''
    }
  }
  </script>

<style scoped>
/* Main wrapper for the payment component */
.payment-center-wrapper {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: calc(100vh - 60px);
  padding: 80px 20px 30px 20px;
  background-color: #f0f2f5;
}

/* The central payment card */
.payment-card {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  padding: 35px 40px;
  max-width: 480px;
  width: 100%;
  box-sizing: border-box;
}

.page-title {
  font-size: 26px;
  font-weight: 700;
  color: #333;
  text-align: center;
  margin-bottom: 30px;
}

.amount-section {
  margin: 25px 0 35px 0;
  text-align: center;
}

.amount-value {
  font-size: 56px;
  font-weight: bold;
  color: #1a1a1a;
  letter-spacing: 1.5px;
}

.amount-label {
  font-size: 17px;
  color: #666;
  margin-top: 10px;
}

.payment-methods-section {
  margin-top: 30px;
  padding: 20px 0;
  border-top: 1px solid #eee;
}

.section-header {
  margin-bottom: 18px;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.payment-option .el-radio-group {
  width: 100%;
}

.payment-option .el-radio {
  width: 100%;
  margin: 0;
  padding: 15px 20px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  transition: all 0.2s ease-in-out;
}

.payment-option .el-radio.is-checked {
  border-color: #007bff;
  background-color: #e6f7ff;
}

.payment-option .el-radio:hover {
  border-color: #007bff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.payment-option .el-radio__input {
    vertical-align: middle;
}

.payment-option .el-radio__label {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-left: 10px;
}

.action-box {
  margin-top: 40px;
  text-align: center;
}

.pay-button {
  width: 100%;
  max-width: 280px;
  font-size: 18px;
  padding: 14px 0;
  border-radius: 8px;
  --el-button-bg-color: #007bff;
  --el-button-border-color: #007bff;
  --el-button-hover-bg-color: #0056b3;
  --el-button-hover-border-color: #0056b3;
}

.paypal-container-wrapper {
  text-align: center;
}

.paypal-container-wrapper p {
  margin-bottom: 25px;
  color: #555;
  font-size: 15px;
}

.paypal-button-host {
  min-height: 50px;
}
</style>