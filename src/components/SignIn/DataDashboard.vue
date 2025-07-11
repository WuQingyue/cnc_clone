<template>
  <div class="dashboard-container" v-loading="loading">
    <!-- 顶部页面标题 -->
    <h1 class="dashboard-title">数据看板</h1>

    <!-- 第一个主要数据面板 (包含日期选择器、今日统计、时段访客量、实付金额) -->
    <div class="main-data-panel">
      <!-- 面板内部的头部，包含日期选择器 -->
      <div class="dashboard-header">
        <div class="date-selector">
          <span class="date-label">日期</span>
          <input
            type="date"
            v-model="selectedDate"
            @change="handleDateChange"
            class="date-input"
          />
          <svg class="calendar-icon" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"
            />
          </svg>
        </div>
      </div>

      <!-- 上部分：三张今日统计卡片一排 -->
      <div class="dashboard-top">
        <div class="dashboard-card1">
          <span class="dashboard-icon">📊</span>
          <div class="dashboard-card-content">
            <div class="dashboard-card-line">{{ statsDateTitle }}访客量</div>
            <div class="dashboard-card-line">{{ todayStats.visitors }}</div>
          </div>
        </div>
        <div class="dashboard-card2">
          <span class="dashboard-icon">👤</span>
          <div class="dashboard-card-content">
            <div class="dashboard-card-line">{{ statsDateTitle }}订单数</div>
            <div class="dashboard-card-line">{{ todayStats.orders }}</div>
          </div>
        </div>
        <div class="dashboard-card3">
          <span class="dashboard-icon">🚚</span>
          <div class="dashboard-card-content">
            <div class="dashboard-card-line">{{ statsDateTitle }}总收入</div>
            <div class="dashboard-card-line">¥{{ todayStats.revenue }}</div>
          </div>
        </div>
      </div>

      <!-- 中部分：两张图表一排 -->
      <div class="dashboard-middle">
        <div class="dashboard-card4">
          <div class="card4-header">
            <div class="card4-title">时段访客量</div>
          </div>
          <div ref="visitorChart" class="visitor-chart chart-placeholder"></div>
        </div>
        <div class="dashboard-card5">
          <div class="card5-header">
            <div class="card5-title">实付金额</div>
          </div>
          <div ref="amountChart" class="amount-chart chart-placeholder"></div>
        </div>
      </div>
    </div>

    <!-- 第二个主要数据面板 (活跃用户图表和国家/地区分布) -->
    <div class="main-data-panel">
      <!-- 原 dashboard-card6 的内容，但其外层样式由 main-data-panel 统一提供 -->
      <div class="card6-header">
        <div class="card6-title">过去30分钟活跃用户数</div>
      </div>
      <div class="active-users-row">
        <!-- 折线图 -->
        <div
          class="active-users-chart chart-placeholder"
          ref="activeUsersChart"
        ></div>
        <!-- 国家/地区分布 -->
        <div class="active-users-country">
          <div class="country-title">国家/地区分布</div>
          <ul class="country-list">
            <li v-for="item in activeUsersCountryList" :key="item.country">
              <span class="country-name">{{ item.country }}</span>
              <span class="country-count">{{ item.activeUsers }}</span>
            </li>
            <li v-if="activeUsersCountryList.length === 0">
              <span class="country-name no-data">暂无数据</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import * as echarts from 'echarts'
import { AnalyticsService } from '@/utils/analytics' 

const loading = ref(false)
const visitorChart = ref(null)
const amountChart = ref(null)
let visitorChartInstance = null
let amountChartInstance = null

const todayString = new Date().toISOString().split('T')[0]
const selectedDate = ref(todayString)

const isTodaySelected = computed(() => selectedDate.value === todayString)
const statsDateTitle = computed(() => {
  if (isTodaySelected.value) {
    return '今日'
  }
  const date = new Date(selectedDate.value)
  return `${date.getMonth() + 1}月${date.getDate()}日`
})

const todayStats = ref({
  visitors: 0,
  orders: 0,
  revenue: 0
})

const handleError = (error) => {
  console.error('数据加载失败:', error)
}

const fetchTodayStats = async (date) => {
  try {
    loading.value = true
    const data = await AnalyticsService.getTodayStats(date)
    todayStats.value = {
      visitors: data.visitors || 0,
      orders: data.orders || 0,
      revenue: data.revenue || 0
    }
  } catch (error) {
    handleError(error)
  } finally {
    loading.value = false
  }
}

const fetchVisitorData = async (date) => {
  try {
    loading.value = true
    const data = await AnalyticsService.getVisitorData(date)
    
    const hours = Array.from({ length: 24 }, (_, i) => i)
    const visitors = hours.map(hour => {
      const hourData = data?.visitorsByHour?.find(item => item.hour === hour)
      return hourData ? hourData.count : 0
    })
    
    return { hours, visitors }
  } catch (error) {
    handleError(error)
    return {
      hours: Array.from({ length: 24 }, (_, i) => i),
      visitors: Array(24).fill(0)
    }
  } finally {
    loading.value = false
  }
}

const fetchAmountData = async (date) => {
  try {
    loading.value = true
    const data = await AnalyticsService.getAmountData(date)
    
    const hours = Array.from({ length: 24 }, (_, i) => i)
    const amounts = hours.map(hour => {
      const hourData = data?.amountsByHour?.find(item => item.hour === hour)
      return hourData ? hourData.amount : 0
    })
    
    return { hours, amounts }
  } catch (error) {
    handleError(error)
    return {
      hours: Array.from({ length: 24 }, (_, i) => i),
      amounts: Array(24).fill(0)
    }
  } finally {
    loading.value = false
  }
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
  const data = await fetchVisitorData(selectedDate.value)
  const xData = data.hours.map(hour => `${hour}:00`)
  let yData = data.visitors || Array(24).fill(0)

  const option = {
    tooltip: { 
      trigger: 'axis',
      formatter: '{b}<br />{a}: {c}'
    },
    grid: { 
      left: '3%', 
      right: '4%', 
      bottom: '15%', 
      top: '18%', 
      containLabel: true 
    },
    xAxis: { 
      type: 'category', 
      data: xData, 
      axisLabel: { 
        color: '#666',
        interval: 1
      }, 
      axisLine: { 
        lineStyle: { color: '#ccc' } 
      } 
    },
    yAxis: { 
      type: 'value', 
      min: 0,
      // --- MODIFICATION: Ensure Y-axis interval is at least 1 to prevent decimals ---
      minInterval: 1, 
      name: '用户总数 (人)', 
      nameLocation: 'end',
      nameTextStyle: { 
        align: 'left',
        color: '#606266',
        fontSize: 12,
        padding: [0, 0, 10, 0]
      },
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#666' },
      splitLine: { 
        lineStyle: { 
          type: 'dashed',
          color: '#eee'
        } 
      }
    },
    series: [{ 
      name: '访客量', 
      type: 'bar',
      data: yData,
      barWidth: '40%',
      itemStyle: { color: '#5470C6' },
      // This logic already correctly hides the label for zero values
      label: {
        show: true,
        position: 'top',
        color: '#606266',
        fontSize: 10,
        formatter: (params) => params.value > 0 ? params.value : ''
      }
    }]
  }
  visitorChartInstance.setOption(option, true);
}

const updateAmountChart = async () => {
  const data = await fetchAmountData(selectedDate.value)
  const xData = data.hours.map(hour => `${hour}:00`)
  let yData = data.amounts || Array(24).fill(0)

  const option = {
    tooltip: { 
      trigger: 'axis',
      // --- MODIFICATION: Use $ for currency consistency ---
      formatter: (params) => {
        const param = params[0];
        const value = param.value ? param.value.toFixed(2) : '0.00';
        return `${param.axisValueLabel}<br />${param.seriesName}: $${value}`;
      }
    },
    grid: { 
      left: '3%', 
      right: '4%', 
      bottom: '15%', 
      top: '18%',
      containLabel: true 
    },
    xAxis: { 
      type: 'category', 
      data: xData, 
      axisLabel: { 
        color: '#666',
        interval: 1
      }, 
      axisLine: { 
        lineStyle: { color: '#ccc' } 
      } 
    },
    yAxis: { 
      type: 'value', 
      min: 0,
      // --- MODIFICATION: Ensure Y-axis interval is at least 1 to prevent decimals ---
      minInterval: 1,
      // --- MODIFICATION: Set currency to USD to match screenshot ---
      name: '美元 (USD)',
      nameLocation: 'end',
      nameTextStyle: {
        align: 'left',
        color: '#606266',
        fontSize: 12,
        padding: [0, 0, 10, 0]
      },
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#666' },
      splitLine: { 
        lineStyle: { 
          type: 'dashed',
          color: '#eee'
        } 
      }
    },
    series: [{ 
      name: '实付金额', 
      type: 'bar', 
      data: yData, 
      itemStyle: { color: '#91CC75' }, 
      barWidth: '40%',
      // This logic already correctly hides the label for zero values
      label: {
        show: true,
        position: 'top',
        color: '#606266',
        fontSize: 10,
        formatter: (params) => params.value > 0 ? params.value.toFixed(2) : ''
      }
    }]
  }
  amountChartInstance.setOption(option, true);
}

const handleDateChange = async () => {
  await fetchTodayStats(selectedDate.value)
  await updateVisitorChart()
  await updateAmountChart()
}

let statsInterval = null
watch(isTodaySelected, (isToday) => {
  clearInterval(statsInterval)
  if (isToday) {
    statsInterval = setInterval(() => fetchTodayStats(selectedDate.value), 60000)
  }
}, { immediate: true })

onMounted(async () => {
  await Promise.all([
    fetchTodayStats(selectedDate.value),
    initVisitorChart(),
    initAmountChart(),
    initActiveUsersChart(),
    fetchActiveUsersLast30MinutesByCountry()
  ]);

  const resizeCharts = () => {
    visitorChartInstance?.resize()
    amountChartInstance?.resize()
    activeUsersChartInstance?.resize()
  }
  window.addEventListener('resize', resizeCharts)

  const activeUsersInterval = setInterval(updateActiveUsersChart, 60000)
  const countryInterval = setInterval(fetchActiveUsersLast30MinutesByCountry, 60000)

  onUnmounted(() => {
    clearInterval(statsInterval)
    clearInterval(activeUsersInterval)
    clearInterval(countryInterval)

    visitorChartInstance?.dispose()
    amountChartInstance?.dispose()
    activeUsersChartInstance?.dispose()

    window.removeEventListener('resize', resizeCharts)
  })
})

const activeUsersChart = ref(null)
let activeUsersChartInstance = null

const fetchActiveUsersLast30Minutes = async () => {
  try {
    loading.value = true
    const res = await AnalyticsService.getActiveUsersLast30Minutes()
    return res.activeUsersLast30Minutes || Array(30).fill(0)
  } catch (error) {
    handleError(error)
    return Array(30).fill(0)
  } finally {
    loading.value = false
  }
}

const initActiveUsersChart = async () => {
  if (activeUsersChart.value) {
    activeUsersChartInstance = echarts.init(activeUsersChart.value)
    await updateActiveUsersChart()
  }
}

const updateActiveUsersChart = async () => {
  let data = await fetchActiveUsersLast30Minutes()
  const xData = Array.from({ length: 30 }, (_, i) => `-${30 - i}`)
  const yData = [...data].reverse()

  const option = {
    tooltip: { trigger: 'axis', formatter: (params) => `过去 ${Math.abs(params[0].name)} 分钟<br/>活跃用户数: ${params[0].value}` },
    grid: { left: '3%', right: '4%', bottom: '8%', top: '12%', containLabel: true },
    xAxis: { type: 'category', data: xData, axisLabel: { color: '#666' }, axisLine: { lineStyle: { color: '#ccc' } } },
    yAxis: { type: 'value', min: 0, axisLabel: { color: '#666' }, splitLine: { lineStyle: { type: 'dashed' } } },
    series: [{ name: '活跃用户数', type: 'line', smooth: true, data: yData, showSymbol: false, lineStyle: { color: '#FF9800' }, areaStyle: { color: 'rgba(255,152,0,0.1)' } }]
  }
  activeUsersChartInstance.setOption(option)
}

const activeUsersCountryList = ref([])

const fetchActiveUsersLast30MinutesByCountry = async () => {
  try {
    loading.value = true
    const res = await AnalyticsService.getActiveUsersLast30MinutesByCountry()
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
/* CSS is unchanged */
.dashboard-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding: 24px;
  background-color: #f0f2f5;
  min-height: calc(100vh - 60px);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  position: relative;
}
.dashboard-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 0;
}
.main-data-panel {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  transition: all 0.3s ease;
}
.main-data-panel:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}
.dashboard-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 0;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f2f5;
}
.date-selector {
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
}
.date-label {
  color: #606266;
  font-size: 14px;
}
.date-input {
  padding: 8px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  color: #303133;
  cursor: pointer;
  appearance: none;
  background: #fff;
  padding-right: 35px;
}
.date-input:focus {
  outline: none;
  border-color: #409eff;
}
.calendar-icon {
  position: absolute;
  right: 10px;
  color: #909399;
  width: 20px;
  height: 20px;
  pointer-events: none;
}
.dashboard-card1,
.dashboard-card2,
.dashboard-card3,
.dashboard-card4,
.dashboard-card5 {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  padding: 20px 24px;
  transition: all 0.3s ease;
  min-height: 120px;
  position: relative;
}
.dashboard-card1:hover,
.dashboard-card2:hover,
.dashboard-card3:hover,
.dashboard-card4:hover,
.dashboard-card5:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}
.dashboard-top {
  display: flex;
  gap: 20px;
}
.dashboard-card1 { background-color: #eaf5ff; }
.dashboard-card2 { background-color: #fef0f0; }
.dashboard-card3 { background-color: #fdf5e6; }
.dashboard-icon {
  width: 56px; height: 56px; border-radius: 50%;
  display: flex; justify-content: center; align-items: center;
  margin-right: 20px; flex-shrink: 0;
  background-color: rgba(0, 0, 0, 0.05); font-size: 28px;
}
.dashboard-card1 .dashboard-icon { color: #409eff; background-color: rgba(64, 158, 255, 0.1); }
.dashboard-card2 .dashboard-icon { color: #f56c6c; background-color: rgba(245, 108, 108, 0.1); }
.dashboard-card3 .dashboard-icon { color: #e6a23c; background-color: rgba(230, 162, 60, 0.1); }
.dashboard-card-content {
  flex: 1; display: flex; flex-direction: column; align-items: flex-end;
}
.dashboard-card-line:first-child { font-size: 15px; color: #606266; margin-bottom: 6px; font-weight: 500; }
.dashboard-card-line:nth-child(2) { font-size: 28px; font-weight: bold; color: #303133; margin-bottom: 8px; }
.dashboard-card-line:last-child { font-size: 14px; color: #909399; font-weight: 400; margin-bottom: 0; }
.dashboard-middle {
  display: flex;
  gap: 20px;
}
.dashboard-card4,
.dashboard-card5 {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  min-height: 360px;
}
.card4-header,
.card5-header,
.card6-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #f0f2f5;
  padding-bottom: 15px;
}
.card4-title,
.card5-title,
.card6-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}
.chart-placeholder {
  display: flex; justify-content: center; align-items: center;
  color: #909399; font-size: 14px; min-height: 200px;
}
.visitor-chart,
.amount-chart,
.active-users-chart {
  width: 100%;
  height: 280px;
}
.active-users-row {
  display: flex;
  gap: 30px;
  align-items: flex-start;
  flex-wrap: wrap;
}
.active-users-chart {
  flex: 3;
  min-width: 350px;
  max-width: 70%;
  height: 280px;
}
.active-users-country {
  flex: 2;
  min-width: 200px;
  border-left: 1px solid #ebeef5;
  padding-left: 20px;
}
.country-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 15px;
  color: #303133;
}
.country-list { list-style: none; padding: 0; margin: 0; }
.country-list li {
  display: flex; justify-content: space-between; align-items: center;
  padding: 8px 0; border-bottom: 1px solid #f0f2f5; font-size: 14px;
}
.country-list li:last-child { border-bottom: none; }
.country-name { color: #606266; }
.country-count { color: #e6a23c; font-weight: 500; }
.country-name.no-data { width: 100%; text-align: center; color: #909399; padding: 20px 0; }
@media (max-width: 1024px) {
  .main-data-panel {
    padding: 16px;
  }
  .dashboard-header {
    justify-content: space-between;
  }
  .dashboard-top,
  .dashboard-middle,
  .active-users-row {
    flex-direction: column;
    gap: 16px;
  }
  .dashboard-card1, .dashboard-card2, .dashboard-card3,
  .dashboard-card4, .dashboard-card5,
  .active-users-chart, .active-users-country {
    flex: none;
    width: 100%;
    max-width: none;
  }
  .active-users-country {
    border-left: none;
    border-top: 1px solid #ebeef5;
    padding-left: 0;
    padding-top: 20px;
  }
}
</style>