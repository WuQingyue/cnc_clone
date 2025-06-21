<template>
  <div class="dashboard-container"  v-loading="loading">
    <!-- 上部分：三张卡片一排 -->
    <div class="dashboard-top">
      <div class="dashboard-card1">
        <span class="dashboard-icon">📊</span>
        <div class="dashboard-card-content">
          <div class="dashboard-card-line">今日访客量</div>
          <div class="dashboard-card-line">{{ todayStats.visitors}}</div>
          <div class="dashboard-card-line">较昨日 {{ todayStats.visitorsChange > 0 ? '+' : '' }}{{ todayStats.visitorsChange }}%</div>
        </div>
      </div>
      <div class="dashboard-card2">
        <span class="dashboard-icon">👤</span>
        <div class="dashboard-card-content">
          <div class="dashboard-card-line">今日订单数</div>
          <div class="dashboard-card-line">{{ todayStats.orders}}</div>
          <div class="dashboard-card-line">较昨日 {{ todayStats.ordersChange > 0 ? '+' : '' }}{{ todayStats.ordersChange }}%</div>
        </div>
      </div>
      <div class="dashboard-card3">
        <span class="dashboard-icon">🚚</span>
        <div class="dashboard-card-content">
          <div class="dashboard-card-line">今日总收入</div>
          <div class="dashboard-card-line">¥{{ todayStats.revenue}}</div>
          <div class="dashboard-card-line">较昨日 {{ todayStats.revenueChange > 0 ? '+' : '' }}{{ todayStats.revenueChange }}%</div>
        </div>
      </div>
    </div>
    <!-- 中部分：两张卡片一排 -->
    <div class="dashboard-middle">
      <div class="dashboard-card4">
        <div class="card4-header">
          <div class="card4-title">时段访客量</div>
          <div class="time-selector">
            <button 
              v-for="period in timePeriods" 
              :key="period.value"
              :class="['time-btn', { active: currentPeriod === period.value }]"
              @click="handlePeriodChange(period.value)"
            >
              {{ period.label }}
            </button>
          </div>
        </div>
        <div ref="visitorChart" class="visitor-chart"></div>
      </div>
      <div class="dashboard-card5">
        <div class="card5-header">
          <div class="card5-title">实付金额</div>
          <div class="date-selector">
            <span class="date-label">日期</span>
            <input 
              type="date" 
              v-model="selectedDate" 
              @change="handleDateChange"
              class="date-input"
            />
          </div>
        </div>
        <div ref="amountChart" class="amount-chart"></div>
      </div>
    </div>
    <!-- 下部分：一张卡片 -->
    <div class="dashboard-card6">
    <div class="card6-header">
      <div class="card6-title">过去30分钟活跃用户数</div>
    </div>
    <div class="active-users-row">
      <!-- 折线图 -->
      <div class="active-users-chart" ref="activeUsersChart"></div>
      <!-- 国家/地区分布 -->
      <div class="active-users-country">
        <div class="country-title">国家/地区分布</div>
        <ul class="country-list">
          <li v-for="item in activeUsersCountryList" :key="item.country">
            <span class="country-name">{{ item.country }}</span>
            <span class="country-count">{{ item.activeUsers }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted,ElMessage } from 'vue'
import * as echarts from 'echarts'
import { AnalyticsService } from '@/utils/analytics'

const visitorChart = ref(null)
const amountChart = ref(null)
let visitorChartInstance = null
let amountChartInstance = null

const timePeriods = [
  { label: '日', value: 'day' },
  { label: '周', value: 'week' },
  { label: '月', value: 'month' }
]

const currentPeriod = ref('day')
const selectedDate = ref(new Date().toISOString().split('T')[0])

// 今日统计数据
const todayStats = ref({
  visitors: 0,
  visitorsChange: 0,
  orders: 0,
  ordersChange: 0,
  revenue: 0,
  revenueChange: 0
})

// 获取今日统计数据
const fetchTodayStats = async () => {
  try {
    loading.value = true
    const data = await AnalyticsService.getTodayStats()
    todayStats.value = data
  } catch (error) {
    console.error('获取今日统计数据失败:', error)
    handleError(error)
  } finally {
    loading.value = false
  }
}

// 获取访客数据
const fetchVisitorData = async (period) => {
  try {
    loading.value = true
    const data = await AnalyticsService.getVisitorData(period)
    return data
  } catch (error) {
    console.error('获取访客数据失败:', error)
    handleError(error)
    return null
  } finally {
    loading.value = false
  }
}

// 获取金额数据
const fetchAmountData = async (date) => {
  try {
    loading.value = true
    const data = await AnalyticsService.getAmountData(date)
    return data
  } catch (error) {
    console.error('获取金额数据失败:', error)
    handleError(error)
    return null
  } finally {
    loading.value = false
  }
}

// 计算变化百分比
const calculateChange = (current, previous) => {
  if (!previous) return 0
  return Math.round(((current - previous) / previous) * 100)
}

const initVisitorChart = async () => {
  if (visitorChart.value) {
    visitorChartInstance = echarts.init(visitorChart.value)
    await updateVisitorChart()
  }
}

const initAmountChart = async () => {
  if (amountChart.value) {
    amountChartInstance = echarts.init(amountChart.value)
    await updateAmountChart()
  }
}

const updateVisitorChart = async () => {
  const data = await fetchVisitorData(currentPeriod.value)
  // 保证即使无数据也显示坐标轴
  let xData = data && data.dates && data.dates.length > 0 ? data.dates : ['无数据']
  let yData = data && data.visitors && data.visitors.length > 0 ? data.visitors : [0]

  const option = {
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '8%',
      top: '12%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xData,
      axisLabel: { color: '#666', fontSize: 12 },
      axisLine: { show: true },
      axisTick: { show: true },
      min: 0
    },
    yAxis: {
      type: 'value',
      min: 0,
      axisLabel: { color: '#666', fontSize: 12 },
      axisLine: { show: true },
      axisTick: { show: true },
      splitLine: { show: true }
    },
    series: [
      {
        name: '访客量',
        type: 'line',
        smooth: true,
        data: yData,
        showSymbol: false,
        lineStyle: { color: '#5470C6', width: 3 },
        areaStyle: { color: 'rgba(84,112,198,0.1)' }
      }
    ]
  }
  visitorChartInstance.setOption(option)
}

const updateAmountChart = async () => {
  const data = await fetchAmountData(selectedDate.value)
  // 保证即使无数据也显示坐标轴
  let xData = data && data.times && data.times.length > 0 ? data.times : ['无数据']
  let yData = data && data.amounts && data.amounts.length > 0 ? data.amounts : [0]

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '8%',
      top: '12%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: xData,
      axisLabel: { color: '#666', fontSize: 12 },
      axisLine: { show: true },
      axisTick: { show: true },
      min: 0
    },
    yAxis: {
      type: 'value',
      min: 0,
      axisLabel: { 
        color: '#666', 
        fontSize: 12,
        formatter: (value) => `¥${value}`
      },
      axisLine: { show: true },
      axisTick: { show: true },
      splitLine: { show: true }
    },
    series: [
      {
        name: '实付金额',
        type: 'bar',
        data: yData,
        itemStyle: {
          color: '#91CC75'
        },
        barWidth: '40%'
      }
    ]
  }
  amountChartInstance.setOption(option)
}

const handlePeriodChange = async (period) => {
  currentPeriod.value = period
  await updateVisitorChart()
}

const handleDateChange = async () => {
  await updateAmountChart()
}

let statsInterval = null

onMounted(async () => {
  // 初始化图表
  await initVisitorChart()
  await initAmountChart()
  
  // 获取初始数据
  await fetchTodayStats()
  
  // 设置定时更新
  statsInterval = setInterval(fetchTodayStats, 60000) // 每分钟更新一次统计数据
  
  // 监听窗口大小变化
  window.addEventListener('resize', () => {
    visitorChartInstance?.resize()
    amountChartInstance?.resize()
  })

  await initActiveUsersChart()
  // 定时刷新
  setInterval(updateActiveUsersChart, 60000)
  // 监听窗口resize
  window.addEventListener('resize', () => {
    activeUsersChartInstance?.resize()
  })

  await fetchActiveUsersLast30MinutesByCountry()
  setInterval(fetchActiveUsersLast30MinutesByCountry, 60000)
})

onUnmounted(() => {
  // 清理定时器
  clearInterval(statsInterval)
  
  // 清理图表实例
  visitorChartInstance?.dispose()
  amountChartInstance?.dispose()
  
  // 移除事件监听
  window.removeEventListener('resize', () => {
    visitorChartInstance?.resize()
    amountChartInstance?.resize()
  })

  activeUsersChartInstance?.dispose()
  window.removeEventListener('resize', () => {
    activeUsersChartInstance?.resize()
  })
})
// 在组件中添加
const handleError = (error) => {
  console.error(error)
  // 显示错误提示
  ElMessage.error('数据加载失败，请稍后重试')
}
// 在组件中添加
const loading = ref(false)

const fetchData = async () => {
  loading.value = true
  try {
    await fetchTodayStats()
  } finally {
    loading.value = false
  }
}

// 1. 新增ref和实例
const activeUsersChart = ref(null)
let activeUsersChartInstance = null

// 2. 获取活跃用户数据
const fetchActiveUsersLast30Minutes = async () => {
  try {
    loading.value = true
    const res = await AnalyticsService.getActiveUsersLast30Minutes()
    return res.activeUsersLast30Minutes || []
  } catch (error) {
    handleError(error)
    return Array(30).fill(0)
  } finally {
    loading.value = false
  }
}

// 3. 初始化和更新折线图
const initActiveUsersChart = async () => {
  if (activeUsersChart.value) {
    activeUsersChartInstance = echarts.init(activeUsersChart.value)
    await updateActiveUsersChart()
  }
}

const updateActiveUsersChart = async () => {
  let data = await fetchActiveUsersLast30Minutes()
  // 如果无数据，补齐30个0
  if (!data || data.length === 0) {
    data = Array(30).fill(0)
  }
  // 横轴为-30到-1
  const xData = Array.from({ length: 30 }, (_, i) => `-${30 - i}`)
  // 反转数组，使得 xData[0]（-30）对应 data[29]（30分钟前）
  const yData = [...data].reverse()

  const option = {
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '8%', top: '12%', containLabel: true },
    xAxis: {
      type: 'category',
      data: xData,
      axisLabel: { color: '#666', fontSize: 12 },
      axisLine: { show: true },
      axisTick: { show: true }
    },
    yAxis: {
      type: 'value',
      min: 0,
      axisLabel: { color: '#666', fontSize: 12 },
      axisLine: { show: true },
      axisTick: { show: true },
      splitLine: { show: true }
    },
    series: [
      {
        name: '活跃用户数',
        type: 'line',
        smooth: true,
        data: yData,
        showSymbol: false,
        lineStyle: { color: '#FF9800', width: 3 },
        areaStyle: { color: 'rgba(255,152,0,0.1)' }
      }
    ]
  }
  activeUsersChartInstance.setOption(option)
}

const activeUsersCountryList = ref([])

// 2. 获取国家/地区分布数据
const fetchActiveUsersLast30MinutesByCountry = async () => {
  try {
    loading.value = true
    const res = await AnalyticsService.getActiveUsersLast30MinutesByCountry()
    // 后端返回 { activeUsersLast30MinutesByCountry: [{country, activeUsers}, ...] }
    activeUsersCountryList.value = res.activeUsersLast30MinutesByCountry || []
  } catch (error) {
    handleError(error)
    activeUsersCountryList.value = []
  } finally {
    loading.value = false
  }
}

</script>
<style scoped>
.dashboard-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
  background: #f7f8fa;
  height: 100%;
}

.dashboard-top {
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
}

.dashboard-card1 {
  flex: 1;
  background: #e6f7ec;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  padding: 24px 32px;
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  transition: box-shadow 0.2s;
}

.dashboard-card1:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,0.10);
}

.dashboard-card2 {
  flex: 1;
  background: #f1ddef;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(245, 222, 236, 1);
  padding: 24px 32px;
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  transition: box-shadow 0.2s;
}

.dashboard-card2:hover {
  box-shadow: 0 4px 16px rgba(245, 222, 236, 1.05);
}

.dashboard-card3 {
  flex: 1;
  background: #f1e0af;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(248, 204, 109, 0.05);
  padding: 24px 32px;
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  transition: box-shadow 0.2s;
}

.dashboard-card3:hover {
  box-shadow: 0 4px 16px rgba(248, 204, 109, 0.10);
}

.dashboard-icon {
  font-size: 40px;
  margin-right: 24px;
  flex-shrink: 0;
}

.dashboard-card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.dashboard-card-line {
  font-size: 16px;
  color: #222;
  margin-bottom: 6px;
  text-align: right;
  width: 100%;
}

.dashboard-card-line:last-child {
  margin-bottom: 0;
  color: #888;
  font-size: 14px;
}

.dashboard-middle {
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
}

.dashboard-card4 {
  flex: 1;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  padding: 24px;
  min-height: 320px;
}

.card4-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.card4-title {
  font-size: 18px;
  font-weight: 500;
  color: #333;
}

.time-selector {
  display: flex;
  gap: 8px;
}

.time-btn {
  padding: 6px 16px;
  border: 1px solid #4CAF50;
  border-radius: 4px;
  background: #fff;
  color: #333;
  cursor: pointer;
  transition: all 0.3s;
}

.time-btn.active {
  background: #4CAF50;
  color: #fff;
}

.visitor-chart {
  width: 100%;
  height: 240px;
}

.dashboard-card5 {
  flex: 1;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  padding: 24px;
  min-height: 320px;
}

.card5-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.card5-title {
  font-size: 18px;
  font-weight: 500;
  color: #333;
}

.date-selector {
  display: flex;
  align-items: center;
  gap: 8px;
}

.date-label {
  color: #333;
  font-size: 14px;
}

.date-input {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
}

.date-input:focus {
  outline: none;
  border-color: #4CAF50;
}

.amount-chart {
  width: 100%;
  height: 240px;
}

.dashboard-bottom {
  display: flex;
  gap: 24px;
}

.dashboard-card6 {
  flex: 1;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  padding: 24px;
  min-height: 320px;
}

.card6-header {
  margin-bottom: 20px;
}

.card6-title {
  font-size: 18px;
  font-weight: 500;
  color: #333;
}

.user-list-container {
  height: 240px;
  overflow: hidden;
  position: relative;
}

.user-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.user-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  transition: all 0.3s;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.user-info {
  flex: 1;
}

.user-nickname {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.user-details {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #666;
}

.user-list-enter-active,
.user-list-leave-active {
  transition: all 0.5s ease;
}

.user-list-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.user-list-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

.user-list-move {
  transition: transform 0.5s ease;
}

.active-users-chart {
  width: 100%;
  height: 240px;
}

.active-users-row {
  display: flex;
  gap: 32px;
  align-items: flex-start;
}

.active-users-chart {
  width: 65%;
  height: 240px;
  min-width: 320px;
}

.active-users-country {
  width: 35%;
  min-width: 180px;
  padding-left: 12px;
  border-left: 1px solid #eee;
}

.country-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 12px;
  color: #333;
}

.country-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.country-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px dashed #f0f0f0;
  font-size: 14px;
}

.country-name {
  color: #666;
}

.country-count {
  color: #FF9800;
  font-weight: 500;
}

</style>