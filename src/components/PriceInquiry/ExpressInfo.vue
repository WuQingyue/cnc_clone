<template>
  <div class="express-info-box">
    <!-- 标题部分 -->
    <div class="header">
      <h3 class="title">快递信息</h3>
      <div class="divider"></div>
    </div>

    <!-- 输入区域 -->
    <div class="input-group">
      <!-- 目的地下拉框 -->
      <div class="input-item destination-item">
        <span class="required-label">目的地</span>
        <div class="destination-select" @click="toggleDestinationMenu">
          <input 
            v-model="selectedCountry"
            placeholder="请选择目的地"
            readonly
            class="select-input"
          />
          <el-icon class="arrow-icon"><ArrowDown /></el-icon>
          
          <!-- 导航弹出层 -->
          <div 
            v-show="showDestinationMenu"
            class="navigation-popup"
            @click.stop
          >
            <el-tabs v-model="activeTab" type="card" class="nav-tabs">
              <el-tab-pane 
                v-for="(tab, index) in navigationTabs"
                :key="index"
                :label="tab.label"
                :name="index.toString()"
              >
                <div class="country-columns">
                  <div 
                    v-for="(column, colIndex) in tab.countries"
                    :key="colIndex"
                    class="country-column"
                  >
                    <div 
                      v-for="country in column"
                      :key="country.Id"
                      class="country-item"
                      @click="selectCountry(country)"
                    >
                      {{ country.Name }}[{{ country.CountryTwoCode }}]
                    </div>
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </div>

      <!-- 重量输入 -->
      <div class="input-item weight-item">
        <span class="required-label">重量</span>
        <div class="weight-input">
          <el-input v-model.number="weight" placeholder="输入重量" />
          <el-select v-model="weightUnit" class="unit-select">
            <el-option label="KG" value="KG" />
            <el-option label="LBS" value="LBS" />
          </el-select>
        </div>
      </div>

      <!-- 查询按钮 -->
      <el-button type="primary" class="query-btn" @click="fetchPrice">查询运费</el-button>
    </div>
  </div>

  <div class="price-results" v-if="priceResult.length > 0">
    <div 
      v-for="(group, productCode) in groupedResults" 
      :key="productCode"
      class="price-card"
      @mouseenter="hoverCard = productCode"
      @mouseleave="hoverCard = null"
    >
      <!-- 新增的悬浮按钮 -->
      <div 
        class="hover-button"
        v-show="hoverCard === productCode"
        @click.stop="handleButtonClick(productCode)"
      >
        选择
      </div>

      <!-- 卡片标题 -->
      <div class="card-header">
        <span class="product-name">{{ group[0].product_name }}</span>
        <el-tag type="info" size="small">{{ productCode }}</el-tag>
      </div>

      <!-- 价格明细 -->
      <div class="card-content">
        <div 
          v-for="(item, index) in group"
          :key="index"
          class="price-item"
        >
        <span class="fee-name">
          <template v-if="item.fee_name === 'E1'">
            基础运费
          </template>
          <template v-else-if="item.fee_name === 'E2'">
            挂号费
          </template>
          <template v-else>
            {{ item.fee_name }} <!-- 如果不是 E1 或 E2，显示原始值 -->
          </template>
        </span>
        <span class="calculate-amount">{{ item.calculate_amount }} {{ item.currency }}</span>
        </div>
      </div>

      <!-- 底部汇总 -->
      <div class="card-footer">
        <span class="interval">{{ group[0].interval_day }}天</span>
        <span 
          class="total"
          title="你好"
        >合计：{{ calculateTotal(group) }}</span>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'
import { countryList } from './DeliveryInfo'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const showDestinationMenu = ref(false)
const selectedCountry = ref('')
const selectedCountryCode= ref('')
const weight = ref('')
const weightUnit = ref('KG')
const activeTab = ref('0')
const recentCountries = ref([])

// 按字母分组国家
const groupedCountries = computed(() => {
  const groups = {
    'A-E': [],
    'F-J': [],
    'K-O': [],
    'P-T': [],
    'U-Z': []
  }
  
  // 按首字母分组
  countryList.forEach(country => {
    const firstLetter = country.EnName.charAt(0).toUpperCase()
    
    if (['A','B','C','D','E'].includes(firstLetter)) {
      groups['A-E'].push(country)
    } else if (['F','G','H','I','J'].includes(firstLetter)) {
      groups['F-J'].push(country)
    } else if (['K','L','M','N','O'].includes(firstLetter)) {
      groups['K-O'].push(country)
    } else if (['P','Q','R','S','T'].includes(firstLetter)) {
      groups['P-T'].push(country)
    } else if (['U','V','W','X','Y','Z'].includes(firstLetter)) {
      groups['U-Z'].push(country)
    }
  })
  
  // 对每个组按字母排序
  Object.keys(groups).forEach(key => {
    groups[key].sort((a, b) => {
      const nameA = a.EnName.toUpperCase()
      const nameB = b.EnName.toUpperCase()
      return nameA.localeCompare(nameB)
    })
  })
  
  return groups
})

// 将国家列表分成4列
const splitIntoColumns = (countries) => {
  const columnCount = 4
  const perColumn = Math.ceil(countries.length / columnCount)
  const columns = []
  
  for (let i = 0; i < columnCount; i++) {
    columns.push(countries.slice(i * perColumn, (i + 1) * perColumn))
  }
  
  return columns
}

// 导航标签
const navigationTabs = computed(() => [
  { 
    label: '最近使用', 
    countries: splitIntoColumns(recentCountries.value) 
  },
  { 
    label: 'ABCDE', 
    countries: splitIntoColumns(groupedCountries.value['A-E']) 
  },
  { 
    label: 'FGHIJ', 
    countries: splitIntoColumns(groupedCountries.value['F-J']) 
  },
  { 
    label: 'KLMNO', 
    countries: splitIntoColumns(groupedCountries.value['K-O']) 
  },
  { 
    label: 'PQRST', 
    countries: splitIntoColumns(groupedCountries.value['P-T']) 
  },
  { 
    label: 'UVWXWZ', 
    countries: splitIntoColumns(groupedCountries.value['U-Z']) 
  }
])

const toggleDestinationMenu = () => {
  showDestinationMenu.value = !showDestinationMenu.value
}

const selectCountry = (country) => {
  selectedCountry.value = country.Name
  selectedCountryCode.value = country.CountryTwoCode
  showDestinationMenu.value = false
  
  // 添加到最近使用
  addToRecent(country)
}

const addToRecent = (country) => {
  // 避免重复
  recentCountries.value = recentCountries.value.filter(c => c.Id !== country.Id)
  recentCountries.value.unshift(country)
  
  // 最多保留8个最近使用
  if (recentCountries.value.length > 8) {
    recentCountries.value = recentCountries.value.slice(0, 8)
  }
}

// ResizeObserver处理
onMounted(() => {
  const observer = new ResizeObserver(entries => {
    window.requestAnimationFrame(() => {
      if (!Array.isArray(entries) || !entries.length) return
    })
  })
  
  const popup = document.querySelector('.navigation-popup')
  if (popup) {
    observer.observe(popup)
  }
  
  onBeforeUnmount(() => {
    observer.disconnect()
  })
})

// 新增响应式数据
const priceResult = ref([])

// 计算分组结果
const groupedResults = computed(() => {
  return priceResult.value.reduce((acc, curr) => {
    const key = curr.product_code
    if (!acc[key]) acc[key] = []
    acc[key].push(curr)
    return acc
  }, {})
})

// 计算合计金额
const calculateTotal = (group) => {
  return group.reduce((sum, item) => sum + item.calculate_amount, 0)
}

// 修改后的 fetchPrice 方法
const fetchPrice = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/logistics/price-trial', {
      params: {
        country_code: selectedCountryCode.value,
        weight: weight.value
      }
    })
    priceResult.value = response.data.result
    ElMessage.success('获取价格信息成功')
  } catch (error) {
    console.error('请求失败:', error)
    ElMessage.error('获取价格信息失败')
  }
}
// 新增 hoverCard 响应式变量
const hoverCard = ref(null)

// 新增按钮点击处理方法
const handleButtonClick = (productCode) => {
  console.log('点击了产品:', productCode)
  // 这里可以添加你的按钮点击逻辑
  ElMessage.info(`点击了 ${productCode} 的按钮`)
}
</script>

<style scoped>
.express-info-box {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 20px;
  background: #fff;
}

.header {
  margin-bottom: 20px;
}

.title {
  font-weight: 700;
  font-size: 16px;
  color: #303133;
  margin: 0 0 10px 0;
}

.divider {
  border-bottom: 1px solid #dcdfe6;
}

.input-group {
  display: flex;
  gap: 20px;
  align-items: center;
}

.input-item {
  position: relative;
}

.destination-item {
  flex: 2; /* 目的地输入框占较大宽度 */
}

.weight-item {
  flex: 1; /* 重量输入框占较小宽度 */
}

.required-label::before {
  content: "*";
  color: #f56c6c;
  margin-right: 4px;
}

.destination-select {
  position: relative;
  cursor: pointer;
}

.select-input {
  width: 100%;
  height: 40px;
  padding: 0 15px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  box-sizing: border-box;
}

.arrow-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #c0c4cc;
}

.navigation-popup {
  position: absolute;
  top: 45px;
  left: 0;
  width: 100%;
  max-height: 400px;
  overflow-y: auto;
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  z-index: 999;
}

.nav-tabs {
  border: none;
}

.nav-tabs .el-tabs__item {
  font-size: 14px;
  color: #606266;
  padding: 12px 20px;
  border-radius: 4px 4px 0 0;
}

.nav-tabs .el-tabs__item.is-active {
  color: #409eff;
  background: #fff;
  border-bottom: 2px solid #409eff;
}

.country-columns {
  display: flex;
  padding: 16px 10px;
  gap: 10px;
}

.country-column {
  flex: 1;
  min-width: 0;
}

.country-item {
  padding: 8px 10px;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 10px; /* 设置字体大小为12px */
  
  &:hover {
    color: #409eff;
    background: #ecf5ff;
    border-radius: 4px;
  }
}

.weight-input {
  display: flex;
  gap: 10px;
  
  :deep(.el-input) {
    flex: 1;
  }
  
  .unit-select {
    width: 80px;
  }
}

.query-btn {
  height: 40px;
  margin-top: 24px;
}

.price-results {
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.price-card {
  border: 1px solid #ebeef5;
  border-radius: 8px;
  padding: 16px;
  position: relative;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}
.price-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.product-name {
  font-weight: 500;
  font-size: 14px;
  color: #303133;
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.price-item {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
}

.fee-name {
  color: #606266;
}

.calculate-amount {
  color: #409eff;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px dashed #ebeef5;
  padding-top: 12px;
}

.interval {
  font-size: 12px;
  color: #909399;
}

.total {
  color: #ffd700;
  font-weight: 600;
  cursor: pointer;
}
.total:hover {
  text-decoration: underline;
}
.hover-button {
  position: absolute;
  top: 8px;
  right: 8px;
  background-color: #f56c6c;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 1;
}
.hover-button:hover {
  background-color: #e74c3c;
  transform: scale(1.05);
}
</style>