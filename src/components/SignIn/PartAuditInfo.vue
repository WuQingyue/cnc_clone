<template>
  <div class="part-audit">
    <!-- 搜索和过滤区域 -->
    <div class="search-bar">
      <el-input
        v-model="searchQuery"
        placeholder="搜索订单号/用户邮箱"
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
        <el-option label="已通过" value="pass" />
        <el-option label="已拒绝" value="reject" />
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
      <el-table-column prop="order_no" label="订单号" width="200" align="center"/>
      <el-table-column prop="user_email" label="用户邮箱" width="200" align="center" />
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
      <el-table-column label="操作" fixed="right" width="280" align="center">
        <template #default="scope">
          <div class="button-group">
            <el-button
              link
              type="primary"
              @click="viewDetails(scope.row)"
            >
              查看详情
            </el-button>
            <el-button
              link
              type="success"
              @click="pass(scope.row)"
            >
              审核通过
            </el-button>
            <el-button
              link
              type="danger"
              @click="reject(scope.row)"
            >
              审核拒绝
            </el-button>
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
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import ModelInfoDialog from '@/components/SignIn/ModelInfoDialog.vue'
import AmountDialog from '@/components/SignIn/AmountDialog.vue'
import { quantity } from '../quote/AutomationTool'

// 数据状态
const searchQuery = ref('')
const timeRange = ref('week')
const orderStatus = ref('')
const loading = ref(false)
const filteredRecords = ref([])
const modelInfoDialogVisible = ref(false)
const amountDialogVisible = ref(false)
const selectedModel = ref(null)
const selectedAmount = ref(null)

// 格式化日期
const formatDate = (date) => {
  return new Date(date).toLocaleString()
}

// 获取状态类型
const getStatusType = (status) => {
  const types = {
    wait: 'warning',
    pass: 'success',
    reject: 'danger'
  }
  return types[status] || 'info'
}

// 获取状态文本
const getStatusText = (status) => {
  const texts = {
    wait: '待审核',
    pass: '已通过',
    reject: '已拒绝'
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
        record.order_no?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        record.user_email?.toLowerCase().includes(searchQuery.value.toLowerCase())

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

// 审核通过
const pass = (record) => {
  record.status = 'pass'
  record.operation = 'pass'
  record.update_time = new Date().toLocaleString() // 更新操作时间
  updataRecord(record)
  console.log('record',record)
  ElMessage.success(`订单 ${record.order_no} 审核通过`)
}

// 审核拒绝
const reject = (record) => {
  record.status = 'reject'
  record.operation = 'reject'
  record.update_time = new Date().toLocaleString() // 更新操作时间
  updataRecord(record)
  ElMessage.error(`订单 ${record.order_no} 审核拒绝`)
}

const updataRecord = async (record) => {
  try {
    const response = await fetch(`http://localhost:8000/api/orders/orders_info/${record.id}`, {
      method: 'PUT', // 设置请求方法为 PUT
      headers: {
        'Content-Type': 'application/json' // 设置请求头
      },
      body: JSON.stringify({ // 将对象转换为 JSON 字符串
        "order_no": record.order_no,
        "user_email": record.user_email,
        "processing_fee_id": record.processing_fee_id,
        "status": record.status,
        "model_info_id": record.model_info_id,
        "operation": record.operation
      })
    }, { withCredentials: true });

    // 检查响应状态
    if (!response.ok) {
      console.log('record', record);
      throw new Error('网络响应不是 OK');
    }

    // 可选：如果需要处理响应数据，可以在这里获取
    const responseData = await response.json();
    console.log('更新成功:', responseData);

    // 更新数据
    fetchPartAuditData(); // 重新获取数据
  } catch (error) {
    console.error('请求失败:', error);
  }
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

// 初始化
onMounted(() => {
  fetchPartAuditData(); // 直接调用获取数据的方法
  handleSearch()
  
})
// 获取零件审核信息
const fetchPartAuditData = async () => {
  try {
    const response = await fetch('http://localhost:8000/api/orders/get_orders_info', { withCredentials: true }) // 替换为实际的后端 API
    if (!response.ok) {
      throw new Error('网络响应不是 OK')
    }
   filteredRecords.value = await response.json() // 获取数据并存储
   console.log('filteredRecords.value',filteredRecords.value)
  } catch (error) {
    console.error('请求失败:', error)
    ElMessage.error('获取零件审核信息失败')
  }
}
</script>

<style scoped>
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
</style>