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
    <!-- FIX: v-loading="loading" is already present, we just need to manage the 'loading' state in script -->
    <el-table
      :data="filteredRecords"
      style="width: 100%"
      border
      stripe
      v-loading="loading"
      @selection-change="handleSelectionChange"
      :row-key="row => row.id"
      size="small"
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
      <el-table-column label="物流信息" width="200" align="center">
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

    <!-- 分页区域 -->
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50]"
        :total="totalRecords"
        layout="total, sizes, prev, pager, next, jumper"
        background
        @size-change="handlePageSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

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
    <progress-dialog
      v-model="progressDialogVisible"
      :model-data="progressData"
    />

    <!-- 物流进度对话框 -->
    <shipping-progress-dialog
      v-model="shippingProgressDialogVisible"
      :model-data="shippingProgressData"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue' // Make sure Search icon is imported
import ModelInfoDialog from '@/components/SignIn/ModelInfoDialog.vue'
import AmountDialog from '@/components/SignIn/AmountDialog.vue'
import ProgressDialog from '@/components/SignIn/ProgressDialog.vue'
import ShippingProgressDialog from '@/components/SignIn/ShippingProgressDialog.vue'
import { EventBus } from '@/components/SignIn/eventBus.js'
import service from '@/utils/request'

// 数据状态
const searchQuery = ref('')
const timeRange = ref('week')
const orderStatus = ref('')
// FIX: loading state is initialized to false
const loading = ref(false) 
const allRecords = ref([]) // 存储所有记录
const totalRecords = ref(0) // 总记录数
const currentPage = ref(1) // 当前页码
const pageSize = ref(10) // 每页记录数
const filteredRecords = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return allRecords.value.slice(start, end)
})
const modelInfoDialogVisible = ref(false)
const amountDialogVisible = ref(false)
const progressDialogVisible = ref(false)
const selectedModel = ref(null)
const selectedAmount = ref(null)
const progressData = ref(null)
const shippingProgressDialogVisible = ref(false)
const shippingProgressData = ref(null)

// 使用 Vue Router
const router = useRouter()
const route = useRoute()

// 监听路由变化
watch(
  () => route.query,
  (newQuery) => {
    if (typeof newQuery.payUrl === 'string' && newQuery.payUrl.trim() !== '') {
      fetchPartAuditData()
    }
  },
  { immediate: true }
)

// 格式化日期
const formatDate = (date) => {
  if (!date) return '-';
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
    processing: 'danger',
    completed_not_collected: 'warning',
    collected: 'success',
    in_transit: 'danger',
    waiting_for_pickup: 'warning',
    delivered: 'success'
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
    processing: '加工中',
    completed_not_collected: '加工完成-未揽货',
    collected: '已揽货',
    in_transit: '运输中',
    waiting_for_pickup: '待取件',
    delivered: '已签收'
  }
  return texts[status] || status
}

// 处理搜索 (Note: This implementation filters local data and overwrites allRecords)
const handleSearch = () => {
  loading.value = true
  setTimeout(() => {
    // 筛选记录
    const filtered = allRecords.value.filter(record => {
      const matchQuery =
        !searchQuery.value ||
        record.order_no?.toLowerCase().includes(searchQuery.value.toLowerCase())

      const matchStatus = !orderStatus.value || record.status === orderStatus.value

      return matchQuery && matchStatus
    })
    
    // 更新总记录数和当前页数据
    // Warning: Overwriting allRecords here means original data is lost after filtering.
    // If filtering should be based on the initial full dataset, a separate source array is needed.
    allRecords.value = filtered
    totalRecords.value = filtered.length
    currentPage.value = 1 // 重置到第一页
    loading.value = false
  }, 300)
}

// 打开模型信息对话框
const openModelInfoDialog = (row) => {
  selectedModel.value = row
  modelInfoDialogVisible.value = true
}

// 打开加工金额对话框
const openAmountDialog = (row) => {
  selectedAmount.value = row
  amountDialogVisible.value = true
}

// 打开加工进度对话框
const openProgressDialog = (row) => {
  progressData.value = row
  progressDialogVisible.value = true
}

// 打开物流信息对话框
const openShippingProgressDialog = (row) => {
  shippingProgressData.value = row
  shippingProgressDialogVisible.value = true
}

const totalAmount = ref(0)
const getTotalAmount = async (processingFeeId) => {
  try {
    const response = await service.get(`/api/orders/processing_fees/${processingFeeId}`, { withCredentials: true })
    if (response.status != 200) {
      throw new Error('网络响应不是 OK')
    }
    totalAmount.value = await response.data.total_price
  } catch (error) {
    totalAmount.value = null
    console.error('获取总金额失败:', error)
  }
}

// 初始化支付
const initiatePayment = async (record) => {
  await getTotalAmount(record.processing_fee_id)
  console.log('totalAmount.value',totalAmount.value)
  EventBus.data = { 
    id: record.id,
    order_no: record.order_no,
    orderCode: record.orderCode,
    user_email: record.user_email,
    processing_fee_id: record.processing_fee_id,
    status: record.status,
    model_info_id: record.model_info_id,
    operation: record.operation,
    total_amount: totalAmount.value
  }
  router.push({ name: 'UnifiedPaymentCenter' })
}

// 处理页大小变化
const handlePageSizeChange = (size) => {
  pageSize.value = size
}

// 处理当前页变化
const handleCurrentChange = (page) => {
  currentPage.value = page
}

// 获取零件信息
// FIX: Modified fetchPartAuditData to manage the loading state, mimicking cart.vue
const fetchPartAuditData = async () => {
  loading.value = true // 1. Start loading
  try {
    const response_all = await service.get('/api/orders/get_orders_info', { withCredentials: true })
    
    // Check if the response itself and the inner data structure are valid
    if (response_all && response_all.data && response_all.data.success) {
      allRecords.value = response_all.data.data || []
      totalRecords.value = allRecords.value.length
    } else {
      // Handle cases where the API returns success: false or structure is unexpected
      console.error('获取订单数据失败或数据为空', response_all)
      ElMessage.error('获取订单数据失败')
      allRecords.value = []
      totalRecords.value = 0
    }
  } catch (error) {
    // Handle network errors or request failures
    console.error('请求订单数据失败:', error)
    ElMessage.error('加载订单数据时发生网络错误')
  } finally {
    loading.value = false // 2. Stop loading, whether success or failure
  }
}

// 监听记录变化，更新分页
watch(allRecords, () => {
  totalRecords.value = allRecords.value.length
  // Note: Depending on how handleSearch works, resetting currentPage here might be undesirable if done after a filter.
  // Assuming this watch primarily handles updates from fetchPartAuditData.
  // currentPage.value = 1 
}, { deep: true })

// 初始化
onMounted(() => {
  fetchPartAuditData()
})
</script>

<style scoped>
.part-audit {
  padding: 80px;
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
  margin-bottom: 20px;
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

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>