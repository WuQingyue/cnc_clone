<template>
  <div class="material-intro">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="container">
        <div class="breadcrumb">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>材料介绍</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="material-content">
      <div class="container">
        <h1 class="main-title">材料介绍</h1>
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
            <el-select v-model="category" placeholder="全部">
              <el-option label="全部" value="all" />
              <!-- 其他选项可以根据需要添加 -->
            </el-select>
          </div>
          <div class="filter-item">
            <span class="filter-label">材料细项</span>
            <el-select v-model="subCategory" placeholder="全部">
              <el-option label="全部" value="all" />
              <!-- 其他选项可以根据需要添加 -->
            </el-select>
          </div>
        </div>

        <!-- 材料列表 -->
        <div class="material-list">
          <el-empty v-if="!materials.length" description="暂无数据" />
          <el-table v-else :data="materials" style="width: 100%">
            <!-- 表格列可以根据需要自定义 -->
            <el-table-column prop="name" label="材料名称" />
            <el-table-column prop="category" label="分类" />
            <el-table-column prop="description" label="描述" />
          </el-table>
        </div>

        <!-- 分页 -->
        <div class="pagination-section">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 30, 40, 50]"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 状态变量
const selectedType = ref('cnc')
const category = ref('all')
const subCategory = ref('all')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const materials = ref([])

// 处理分页大小变化
const handleSizeChange = (val) => {
  pageSize.value = val
  fetchMaterials()
}

// 处理页码变化
const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchMaterials()
}

// 获取材料列表
const fetchMaterials = () => {
  // 这里添加获取材料数据的逻辑
  // 可以调用API获取实际数据
}
</script>

<style lang="scss" scoped>
.material-intro {
  background: #f5f7fa;
  min-height: calc(100vh - 60px);

  .page-header {
    background: #fff;
    padding: 20px 0;
    border-bottom: 1px solid var(--border-color);
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
      font-size: 24px;
      text-align: center;
      margin-bottom: 40px;
      color: var(--text-color-secondary);
    }

    .material-types {
      text-align: center;
      margin-bottom: 30px;
    }

    .filter-section {
      display: flex;
      gap: 20px;
      margin-bottom: 30px;
      background: #fff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

      .filter-item {
        display: flex;
        align-items: center;
        gap: 10px;

        .filter-label {
          font-size: 14px;
          color: var(--text-color);
          white-space: nowrap;
        }
      }
    }

    .material-list {
      background: #fff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      margin-bottom: 20px;
      min-height: 300px;
    }

    .pagination-section {
      display: flex;
      justify-content: center;
      margin-top: 20px;
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
