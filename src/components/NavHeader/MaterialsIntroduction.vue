<template>
  <div class="material-intro">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="container">
        <h1 class="page-title">材料介绍</h1>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="material-content">
      <div class="container">
        <h2 class="sub-title">我们使用的材料</h2>

        <!-- 材料类型选择 -->
        <div class="material-types">
          <el-radio-group v-model="selectedType">
            <el-radio-button label="cnc">CNC机加工</el-radio-button>
            <el-radio-button label="sheet">钣金加工</el-radio-button>
          </el-radio-group>
        </div>

        <!-- 筛选区域 -->
        <div class="filter-section">
          <div class="filter-item">
            <span class="filter-label">材料分类</span>
            <div class="material-categories">
              <a 
                v-for="item in currentMaterials.categories" 
                :key="item.value"
                href="#" 
                :class="{ active: category === item.value }" 
                @click.prevent="category = item.value"
              >{{ item.label }}</a>
            </div>
          </div>
          
          <hr class="filter-divider"/>

          <div class="filter-item">
            <span class="filter-label">材料细项</span>
            <div class="material-categories">
              <a 
                v-for="item in currentSubCategories" 
                :key="item.value"
                href="#" 
                :class="{ active: subCategory === item.value }" 
                @click.prevent="subCategory = item.value"
              >{{ item.label }}</a>
            </div>
          </div>
        </div>

        <!-- 材料列表 -->
        <div class="material-list">
          <el-empty v-if="!currentMaterialsList.length" description="暂无数据" />
          <div v-else>
            <div class="materials-grid">
              <div 
                v-for="material in paginatedMaterials" 
                :key="material.value"
                class="material-card"
                @click="goToMaterialDetail(material)"
              >
                <div class="material-image">
                  <img :src="material.image" :alt="material.label">
                </div>
                <div class="material-info">
                  <h3>{{ material.label }}</h3>
                  <p class="delivery-time">最快发货时间：{{ material.delivery }}</p>
                </div>
              </div>
            </div>

            <!-- 分页 -->
            <div class="pagination-section">
              <el-pagination
                v-model:current-page="currentPage"
                v-model:page-size="pageSize"
                :page-sizes="[10, 20, 30, 40]"
                :total="currentMaterialsList.length"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'

// 导入图片
import material1 from '@/assets/images/material1.jpg'
import material2 from '@/assets/images/material2.png'
import material3 from '@/assets/images/material3.png'
import material4 from '@/assets/images/material4.png'
import material5 from '@/assets/images/material5.png'
import material6 from '@/assets/images/material6.jpg'
import material7 from '@/assets/images/material7.jpg'
import material8 from '@/assets/images/material8.png'
import material9 from '@/assets/images/material9.jpg'
import material10 from '@/assets/images/material10.jpg'

const router = useRouter()

// 状态变量
const selectedType = ref('cnc')
const category = ref('all')
const subCategory = ref('all')
const currentPage = ref(1)
const pageSize = ref(10)  // 默认每页显示8个
const total = ref(0)
const materials = ref([])

// CNC加工材料选项
const cncMaterials = {
  categories: [
    { label: '全部', value: 'all' },
    { label: '铝合金', value: 'aluminum' },
    { label: '铜合金', value: 'copper' },
    { label: '塑料', value: 'plastic' }
  ],
  // 所有可用的子类别选项
  allSubCategories: {
    aluminum: [
      { label: '6061铝合金', value: '6061', image: material1, delivery: '72小时' },
      { label: '7075铝合金', value: '7075', image: material2, delivery: '72小时' }
    ],
    copper: [
      { label: 'H59黄铜', value: 'h59', image: material3, delivery: '96小时' },
      { label: 'T2紫铜', value: 't2', image: material4, delivery: '96小时' }
    ],
    plastic: [
      { label: 'ABS工程塑料', value: 'abs', image: material5, delivery: '72小时' },
      { label: '赛钢-POM', value: 'pom', image: material6, delivery: '72小时' },
      { label: '电木', value: 'wood', image: material7, delivery: '72小时' },
      { label: '环氧板-FR4', value: 'fr4', image: material8, delivery: '72小时' }
    ]
  }
}

// 钣金加工材料选项
const sheetMaterials = {
  categories: [
    { label: '全部', value: 'all'},
    { label: '碳钢', value: 'carbon'},
    { label: '不锈钢', value: 'stainless'},
    { label: '铝板', value: 'aluminum'}
  ],
  // 所有可用的子类别选项
  allSubCategories: {
    carbon: [
      { label: 'Q235', value: 'q235', image: material5, delivery: '72小时' },
      { label: '45#钢', value: '45steel', image: material6, delivery: '72小时' }
    ],
    stainless: [
      { label: '304', value: '304', image: material7, delivery: '72小时' },
      { label: '316', value: '316', image: material8, delivery: '72小时' }
    ],
    aluminum: [
      { label: '1060', value: '1060', image: material9, delivery: '72小时' },
      { label: '5052', value: '5052', image: material10, delivery: '72小时' }
    ]
  }
}

// 计算当前显示的材料选项
const currentMaterials = computed(() => {
  return selectedType.value === 'cnc' ? cncMaterials : sheetMaterials
})

// 计算当前显示的子类别选项
const currentSubCategories = computed(() => {
  const materials = selectedType.value === 'cnc' ? cncMaterials : sheetMaterials
  
  // 如果选择了"全部"，显示所有子类别
  if (category.value === 'all') {
    const allSubCategories = []
    // 添加"全部"选项
    allSubCategories.push({ label: '全部', value: 'all' })
    // 添加所有子类别
    Object.values(materials.allSubCategories).forEach(subCats => {
      allSubCategories.push(...subCats)
    })
    return allSubCategories
  }
  
  // 如果选择了具体分类，显示该分类下的子类别
  const subCategories = materials.allSubCategories[category.value] || []
  return [
    { label: '全部', value: 'all' },
    ...subCategories
  ]
})

// 计算当前显示的材料列表
const currentMaterialsList = computed(() => {
  const materials = selectedType.value === 'cnc' ? cncMaterials : sheetMaterials
  let result = []

  if (category.value === 'all') {
    // 如果分类是"全部"，获取所有材料
    result = Object.values(materials.allSubCategories).flat()
  } else {
    // 获取选中分类的材料
    result = materials.allSubCategories[category.value] || []
  }

  // 根据材料细项进行筛选
  if (subCategory.value !== 'all') {
    result = result.filter(item => item.value === subCategory.value)
  }

  return result
})

// 计算分页后的材料列表
const paginatedMaterials = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return currentMaterialsList.value.slice(start, end)
})

// 监听材料分类变化
watch(category, (newValue) => {
  // 重置子类别选择
  subCategory.value = 'all'
})

// 监听加工类型变化
watch(selectedType, (newValue) => {
  // 重置分类和子类别选择
  category.value = 'all'
  subCategory.value = 'all'
})

// 监听筛选条件变化，重置分页
watch([category, subCategory, selectedType], () => {
  currentPage.value = 1
})

// 处理分页大小变化
const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1  // 重置到第一页
}

// 处理页码变化
const handleCurrentChange = (val) => {
  currentPage.value = val
}

// 获取材料列表
const fetchMaterials = () => {
  // 这里添加获取材料数据的逻辑
  // 可以调用API获取实际数据
}

// 跳转到材料详情页
const goToMaterialDetail = (material) => {
  router.push({
    name: 'MaterialDetail',
    params: { 
      materialId: material.value
    },
    query: {
      type: selectedType.value,
      category: category.value,
      subCategory: subCategory.value,
      label: material.label,
      delivery: material.delivery,
      image: material.image
    }
  })
}
</script>

<style lang="scss" scoped>
.material-intro {
  background: #f5f7fa;
  min-height: calc(100vh - 60px);

  .page-header {
      background: url('@/assets/images/contact2.jpg') center/cover;
      padding: 80px 0;
      color: rgb(36, 25, 25);
      margin-top: 80px;
  
      .page-title {
        font-size: 36px;
        margin-bottom: 20px;
        text-align: center;
      }
    }

  .material-content {
    padding: 40px 0;

    .main-title {
      font-size: 32px;
      text-align: center;
      margin-bottom: 20px;
      color: var(--text-color);
    }

    .sub-title {
      font-size: 32px;
      text-align: center;
      margin-top: 40px;
      margin-bottom: 40px;
      color: #000000;
    }

    .material-types {
      text-align: center;
      margin-bottom: 30px;
    }

    .filter-section {
      display: flex;
      flex-direction: column;
      gap: 20px;
      margin-bottom: 30px;
      background: #fff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

      .filter-divider {
        margin: 0;
        border: none;
        border-top: 1px solid #e5e7eb;
      }

      .filter-item {
        display: flex;
        align-items: center;
        gap: 20px;
        

        .filter-label {
          font-size: 14px;
          color: var(--text-color);
          white-space: nowrap;
          width: 70px;
          line-height: 32px;
        }

        .material-categories {
          display: flex;
          flex-wrap: wrap;
          gap: 30px;
          padding: 10px 0px;
          
          a {
            text-decoration: none;
            color: #333;
            padding: 5px 0;
            transition: all 0.3s ease;
            position: relative;
            line-height: 22px;
            padding: 0px 10px;

            &:hover {
              color: #409EFF;
            }

            &.active {
              color: #409EFF;
              font-weight: bold;

              &::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 50%;
                transform: translateX(-50%);
                width: 20px;
                height: 2px;
                background-color: #409EFF;
              }
            }
          }
        }
      }
    }

    .material-list {
      background: #fff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      margin-bottom: 20px;

      .materials-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 20px;
        padding: 20px;
      }

      .material-card {
        border: 1px solid #ebeef5;
        border-radius: 8px;
        overflow: hidden;
        transition: all 0.3s ease;
        cursor: pointer;

        &:hover {
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }

        .material-image {
          width: 100%;
          height: 200px;
          overflow: hidden;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }

        .material-info {
          padding: 15px;

          h3 {
            margin: 0;
            font-size: 16px;
            color: #333;
            margin-bottom: 8px;
          }

          .delivery-time {
            font-size: 14px;
            color: #666;
            margin: 0;
          }
        }
      }
    }

    .pagination-section {
      display: flex;
      justify-content: center;
      margin-top: 30px;
      padding-bottom: 20px;
    }
  }
}

// 响应式布局
@media (max-width: 768px) {
  .material-intro {
    .material-content {
      padding: 20px 0;

      .filter-section {
        flex-direction: column;
        gap: 10px;
      }
    }
  }
}
</style>
