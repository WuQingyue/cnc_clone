<template>
  <div class="file-list">
    <h2 class="section-title">文件列表</h2>
    <div class="file-list-container">
      <!-- 左部分：文件信息和文件上传框 -->
      <div class="left-section">
        <!-- 数据展示 -->
        <table class="data-table">
          <thead>
            <tr>
              <th>序号</th>
              <th>图纸</th>
              <th>模型信息</th>
              <th>参数信息</th>
              <th>数量（件）</th>
              <th>单价</th>
              <th>总价</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(record, index) in localRecords" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ record.file_name }}</td>
              <td>模型信息待完善</td>
              <td>参数信息待完善</td>
              <td>
                <button @click="decreaseQuantity(index)">-</button>
                {{ record.quantity }}
                <button @click="increaseQuantity(index)">+</button>
              </td>
              <td>待报价</td>
              <td>待报价</td>
            </tr>
          </tbody>
        </table>
        <!-- 已勾选的蓝色勾选框、文件名、复制零件和删除零件按钮 -->
        <div class="file-actions" v-for="(record, index) in localRecords" :key="index">
          <input type="checkbox" checked disabled />
          {{ record.file_name }}
          <button @click="copyPart(index)">复制零件</button>
          <button @click="deletePart(index)">删除零件</button>
        </div>
        <!-- 文件上传框 -->
        <file-uploader 
          :process-info="currentProcess"
          @upload-success="handleUploadSuccess"
        />
      </div>
      <!-- 右部分：信息框 -->
      <div class="right-section">
        <div class="info-box">
          <p class="info-text">目前针对一些复杂或者小批量零件暂不支持自动报价，您可以提交询价，我们的工程师将人工审核提供合理报价、交期以及图纸审核细节</p>
          <hr />
          <p>零件数量：{{ totalQuantity }}件1款</p>
          <p class="red-text">系统自动报价仅做参考, 最终以人工审核报价为准</p>
          <button class="blue-button">
            <router-link class="inquiry-link" to="/price-inquiry">提交询价</router-link>
          </button>
          <button class="white-button">
            <el-icon><ShoppingCart /></el-icon>
            <span>加入购物车</span>
          </button>
          <!-- PayPal 支付按钮 -->
          <!-- <button class="white-button">
              <el-icon><Pointer /></el-icon>
              <span ref="paypalButtonContainer">支付</span>
          </button> -->
          <div ref="paypalButtonContainer"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import FileUploader from '@/components/quote/FileUploader.vue'
import { Pointer, ShoppingCart } from '@element-plus/icons-vue'
import axios from 'axios'

const props = defineProps({
  selectedRecords: {
    type: Array,
    default: () => []
  },
  currentProcess: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:selectedRecords'])

// 创建本地数据副本
const localRecords = ref([])

// 监听 props 变化更新本地数据
watch(() => props.selectedRecords, (newVal) => {
  localRecords.value = newVal.map(record => ({
    ...record,
    quantity: record.quantity || 1
  }))
}, { immediate: true, deep: true })

const totalQuantity = computed(() => {
  return localRecords.value.reduce((total, record) => total + record.quantity, 0)
})

const updateRecords = () => {
  emit('update:selectedRecords', localRecords.value)
}

const increaseQuantity = (index) => {
  localRecords.value[index].quantity++
  updateRecords()
}

const decreaseQuantity = (index) => {
  if (localRecords.value[index].quantity > 1) {
    localRecords.value[index].quantity--
    updateRecords()
  }
}

const copyPart = (index) => {
  const newRecord = JSON.parse(JSON.stringify(localRecords.value[index]))
  localRecords.value.push(newRecord)
  updateRecords()
}

const deletePart = (index) => {
  localRecords.value.splice(index, 1)
  updateRecords()
}

const handleUploadSuccess = () => {
  // 处理上传成功逻辑
}


const paypalButtonContainer = ref(null)

// PayPal 支付初始化
const initPayment = async () => {
  try {
    // 检查是否有选中的记录
    if (localRecords.value.length === 0) {
      ElMessage.warning('请先选择需要支付的零件')
      return
    }

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
    script.src = `https://www.paypal.com/sdk/js?client-id=ATas7noQJF7_8E6TIb2VlM8oYn-bspUGzEoCPbKXN2xIepJbH1Fucsj5S4kFYoWi38kClcn-W5wowZIn&currency=USD`
    script.onload = resolve
    script.onerror = reject
    document.body.appendChild(script)
  })
}

// 计算总金额
const calculateTotalAmount = () => {
  // 这里需要根据实际业务逻辑计算总金额
  return localRecords.value.reduce((total, record) => {
    return total + (record.price || 0) * record.quantity
  }, 0)
}

// 渲染 PayPal 按钮
const renderPayPalButton = (amount) => {
  if (!window.paypal) return

  window.paypal.Buttons({
    createOrder: (data, actions) => {
      return actions.order.create({
        purchase_units: [{
          // amount: {
          //   value: amount.toFixed(2)
          // }
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
    await axios.post('http://localhost:8000/api/payment/success', {
      paypalOrder,
      records: localRecords.value
    }, {
      withCredentials: true
    })
  } catch (error) {
    console.error('更新订单状态失败:', error)
    throw new Error('订单状态更新失败')
  }
}

onMounted(() => {
  initPayment()
})

</script>

<style lang="scss" scoped>
.file-list {
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

  .section-title {
    font-size: 18px;
    font-weight: bold;
    color: #303133;
    margin-bottom: 20px;
    display: flex;
    align-items: center;

    &::before {
      content: '';
      width: 4px;
      height: 18px;
      background-color: #409eff;
      margin-right: 8px;
      border-radius: 2px;
    }
  }

  .file-list-container {
    display: flex;
    gap: 20px;

    .left-section {
      flex: 2;
    }

    .right-section {
      flex: 1;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;

      th, td {
        border: 1px solid #ebeef5;
        padding: 8px;
        text-align: center;
      }
    }

    .file-actions {
      margin-bottom: 10px;
    }

    .info-box {
      background: #f5f7fa;
      padding: 20px;
      border-radius: 8px;

      .info-text {
        margin-bottom: 10px;
      }

      .red-text {
        color: red;
        margin-bottom: 20px;
      }

      .blue-button {
        background: #409eff;
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
        width: 100%;
        margin-bottom: 10px;
        cursor: pointer;

        .inquiry-link {
          color: white;
          text-decoration: none;
          display: block;
          width: 100%;
        }
      }

      .white-button {
        background: white;
        color: #409eff;
        padding: 10px 20px;
        border: 1px solid #409eff;
        border-radius: 4px;
        width: 100%;
      }

      .blue-icon {
        display: inline-block;
        width: 16px;
        height: 16px;
        background: #409eff;
        margin-right: 5px;
      }
    }
  }
}
</style>