<template>
  <div class="part-audit">
    <!-- 搜索和过滤区域 -->
    <div class="search-bar">
      <el-input
        v-model="searchQuery"
        placeholder="搜索订单号"
        class="search-input"
        clearable
        @clear="handleSearch"
        @input="handleSearch"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>

      <el-select v-model="timeRange" placeholder="时间范围" @change="handleSearch">
        <el-option label="最近一周" value="week" />
        <el-option label="最近一月" value="month" />
        <el-option label="最近三月" value="quarter" />
        <el-option label="全部" value="all" />
      </el-select>

      <el-select v-model="orderStatus" placeholder="订单状态" @change="handleSearch">
        <el-option label="全部状态" value="" />
        <el-option label="待审核" value="wait" />
        <el-option label="待付款" value="pending" />
        <el-option label="待加工" value="pending_processing" />
        <el-option label="加工中" value="processing" />
        <el-option label="加工完成-未揽货" value="completed_not_collected" />
        <el-option label="已揽货" value="collected" />
        <el-option label="运输中" value="in_transit" />
        <el-option label="待取件" value="waiting_for_pickup" />
        <el-option label="已签收" value="delivered" />
      </el-select>
    </div>

    <!-- 数据表格 -->
    <el-table
      :data="filteredRecords"
      style="width: 100%"
      border
      stripe
      v-loading="loading"
    >
      <el-table-column type="index" label="序号" width="100" align="center" />
      <el-table-column prop="orderCode" label="订单号" width="200" align="center"/>
      <el-table-column prop="create_time" label="创建时间" width="200" align="center">
        <template #default="scope">
          {{ formatDate(scope.row.create_time) }}
        </template>
      </el-table-column>
      <el-table-column label="加工金额" width="200" align="center">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openAmountDialog(scope.row)"
          >
            查看详情
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="200" align="center">
        <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
        </template>
    </el-table-column>
      <el-table-column prop="update_time" label="更新时间" width="200" align="center">
        <template #default="scope">
          {{ formatDate(scope.row.update_time) }}
        </template>
      </el-table-column>
      <el-table-column label="模型信息" width="200" align="center">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openModelInfoDialog(scope.row)"
          >
            查看详情
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="shipping_cost" label="物流信息" width="200" align="center">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openShippingProgressDialog(scope.row)"
          >
            查看详情
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="加工进度" width="200" align="center">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openProgressDialog(scope.row)"
          >
            查看详情
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="280" align="center">
        <template #default="scope">
          <div class="button-group">
            <template v-if="scope.row.status === '待审核'">
              <el-button
                disabled
                style="color: white; background-color: orange;"
              >
                待审核
              </el-button>
            </template>
            <template v-else-if ="scope.row.status === '待付款'">
              <el-button
                type="primary"
                style="color: white; background-color: blue;"
                @click="initiatePayment(scope.row)"
              >
                立即支付
              </el-button>
            </template>
            <template v-else-if="scope.row.status === '生产中' || scope.row.status === '已发货'">
              <el-button
                disabled
                style="color: white; background-color: green;"
              >
                支付成功
              </el-button>
            </template>
            <template v-else-if="scope.row.status === '支付中'">
              <el-button
                disabled
                style="color: white; background-color: red;"
              >
                正在支付
              </el-button>
            </template>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 模型信息对话框 -->
    <model-info-dialog
      v-model="modelInfoDialogVisible"
      :model-data="selectedModel"
    />

    <!-- 加工金额对话框 -->
    <amount-dialog
      v-model="amountDialogVisible"
      :amount-data="selectedAmount"
    />

    <!-- 加工进度对话框 -->
    <el-dialog
      v-model="progressDialogVisible"
      title="加工进度"
      width="50%"
    >
      <div class="progress-content">
        <div class="custom-timeline">
          <div
            v-for="(step, idx) in progressData"
            :key="idx"
            class="custom-timeline-item"
          >
            <el-icon
              :style="{
                color: step.processStatus === 1 ? '#409EFF' : '#C0C4CC',
                fontSize: '20px',
                verticalAlign: 'middle'
              }"
            >
              <circle-filled />
            </el-icon>
            <span class="timeline-label">{{ step.processName }}</span>
          </div>
        </div>
      </div>
    </el-dialog>
    <!-- 物流进度对话框 -->
    <el-dialog
      v-model="shippingProgressDialogVisible"
      title="物流进度"
      width="50%"
    >
      <div class="progress-content">
        <div class="custom-timeline">
          <div
            v-for="(step, idx) in shippingProgressData"
            :key="idx"
            class="custom-timeline-item"
          >
            <el-icon
              :style="{
                color: step.status === 1 ? '#409EFF' : '#C0C4CC',
                fontSize: '20px',
                verticalAlign: 'middle'
              }"
            >
              <circle-filled />
            </el-icon>
            <span class="timeline-label">{{ step.content }}</span>
            <span class="timeline-label" style="margin-left:20px;color:#888;">{{ step.time }}</span>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import ModelInfoDialog from '@/components/SignIn/ModelInfoDialog.vue'
import AmountDialog from '@/components/SignIn/AmountDialog.vue'
import { EventBus } from '@/components/SignIn/eventBus.js'

// 数据状态
const searchQuery = ref('')
const timeRange = ref('week')
const orderStatus = ref('')
const loading = ref(false)
const filteredRecords = ref([])
const modelInfoDialogVisible = ref(false)
const amountDialogVisible = ref(false)
const progressDialogVisible = ref(false)
const selectedModel = ref(null)
const selectedAmount = ref(null)
const progressData = ref([])
const shippingProgressDialogVisible = ref(false)
const shippingProgressData = ref([])

import { CircleFilled } from '@element-plus/icons-vue'

// 使用 Vue Router
const router = useRouter()
const route = useRoute()
// 监听路由变化
watch(
  () => route.query,
  (newQuery) => {
    console.log('newQuery', newQuery)
    // 判断 payUrl 存在且为非空字符串
    if (typeof newQuery.payUrl === 'string' && newQuery.payUrl.trim() !== '') {
      fetchPartAuditData()
    }
  },
  { immediate: true }
)
// 格式化日期
const formatDate = (date) => {
  return new Date(date).toLocaleString()
}

// 获取状态类型
const getStatusType = (status) => {
  const types = {
    wait: 'warning',
    pass: 'success',
    reject: 'danger',
    pending: 'warning',
    pending_processing: 'warning',
    processing: 'danger', // 加工中
    completed_not_collected: 'warning', // 加工完成-未揽货
    collected: 'success', // 已揽货
    in_transit: 'danger', // 运输中
    waiting_for_pickup: 'warning', // 待取件
    delivered: 'success' // 已签收
  }
  return types[status] || 'info'
}

// 获取状态文本
const getStatusText = (status) => {
  const texts = {
    wait: '待审核',
    pass: '已通过',
    reject: '已拒绝',
    pending: '待付款',
    pending_processing: '待加工',
    processing: '加工中', // 加工中
    completed_not_collected: '加工完成-未揽货', // 加工完成-未揽货
    collected: '已揽货', // 已揽货
    in_transit: '运输中', // 运输中
    waiting_for_pickup: '待取件', // 待取件
    delivered: '已签收' // 已签收
  }
  return texts[status] || status
}

// 处理搜索
const handleSearch = () => {
  loading.value = true
  setTimeout(() => {
    filteredRecords.value = filteredRecords.value.filter(record => {
      const matchQuery =
        !searchQuery.value ||
        record.order_no?.toLowerCase().includes(searchQuery.value.toLowerCase())

      const matchStatus = !orderStatus.value || record.status === orderStatus.value

      return matchQuery && matchStatus
    })
    loading.value = false
  }, 300)
}

// 查看详情
const viewDetails = (record) => {
  ElMessage.info(`查看详情: ${record.order_no}`)
}

// 打开模型信息对话框
const openModelInfoDialog = (row) => {
  selectedModel.value = row
  modelInfoDialogVisible.value = true
}

// 打开加工金额对话框
const openAmountDialog = (row) => {
  selectedAmount.value = row
  console.log('打开加工金额对话框，数据:', row)
  amountDialogVisible.value = true
}

// 打开物流信息对话框
const openShippingProgressDialog = async (row) => {
  shippingProgressDialogVisible.value = true
  shippingProgressData.value = []
  try {
    // 假设用 order_no 作为参数，如需调整请改为对应字段
    const res = await service.post('/api/logistics/track_get', { order_no: row.order_no }, { withCredentials: true })
    // 假设返回格式为 { data: { result: [{track_Info: {track_events: [...]}}] } }
    let events = []
    if (res.data && res.data.result && res.data.result[0] && res.data.result[0].track_Info && Array.isArray(res.data.result[0].track_Info.track_events)) {
      events = res.data.result[0].track_Info.track_events
    }
    // 格式化为进度条需要的数据
    shippingProgressData.value = events.map(item => ({
      content: item.process_content,
      time: item.process_time ? formatTrackTime(item.process_time) : '',
      status: item.track_node_code === 'DELIVERED' || item.track_node_code === 'ARRIVED' ? 1 : 0 // 你可以根据实际业务判断已完成节点
    }))
  } catch (err) {
    ElMessage.error('获取物流进度失败')
    shippingProgressData.value = []
  }
}

// 格式化物流事件时间
const formatTrackTime = (timeString) => {
  if (!timeString || timeString.includes('0001-01-01')) return '时间未知'
  return new Date(timeString).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 打开加工进度对话框
const openProgressDialog = async (row) => {
  console.log('打开加工进度对话框时的row', row)
  progressDialogVisible.value = true
  progressData.value = []
  try {
    const res = await service.get('/api/orders/query_order_progress', {
      params: { orderInfoAccessId: row.order_no }
    })
    // 假设res.data是数组
    if (Array.isArray(res.data)) {
      // 格式化为进度条需要的数据
      progressData.value = res.data.map(item => ({
        processName: item.processName,
        processStatus: item.processStatus
      }))
    } else {
      progressData.value = []
    }
  } catch (err) {
    console.log('暂无加工结果')
    progressData.value = []
  }
}

// 初始化支付
const initiatePayment = (record) => {
  EventBus.data = { 
    id: record.id,
    order_no: record.order_no,
    orderCode: record.orderCode,
    user_email: record.user_email,
    processing_fee_id: record.processing_fee_id,
    status: record.status,
    model_info_id: record.model_info_id,
    operation: record.operation 
  }
  router.push({ name: 'UnifiedPaymentCenter' })
}
import service from '@/utils/request'

// 获取零件信息
const fetchPartAuditData = async () => {
  try {
    // 获取所有订单信息
    const response_all = await service.get('/api/orders/get_orders_info', { withCredentials: true })
    console.log('获取所有订单信息', response_all)
    if (response_all.status != 200) {
      throw new Error('网络响应不是 OK')
    }
      // 更新 filteredRecords
      filteredRecords.value = response_all.data
      console.log('cnc订单数据:', filteredRecords.value)

  } catch (error) {
    console.error('请求失败:', error)
    ElMessage.error('获取信息失败')
  }
}

// 初始化
onMounted(() => {
  fetchPartAuditData(); // 直接调用获取数据的方法
})
</script>

<style scoped>
.custom-timeline {
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-top: 20px;
}
.custom-timeline-item {
  display: flex;
  align-items: center;
  gap: 12px;
}
.timeline-label {
  font-size: 16px;
}

.part-audit {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.search-bar {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
  align-items: center;
}

.search-input {
  width: 300px;
}

.el-table {
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
}

.el-table th, .el-table td {
  text-align: center;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 5px;
}

.el-button {
  margin: 0;
}

.el-tag {
  font-size: 14px;
  padding: 5px 10px;
}

.progress-content {
  padding: 20px;
}

.el-timeline {
  margin-top: 20px;
}
</style>