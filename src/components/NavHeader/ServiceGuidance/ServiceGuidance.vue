<template>
  <div class="service-guidance">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="container">
        <div class="breadcrumb">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>服务指引</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="guidance-content">
      <div class="container">
        <el-tabs v-model="activeTab" class="guidance-tabs">
          <!-- CNC加工常见问题 -->
          <el-tab-pane label="CNC加工常见问题" name="cnc">
            <div class="tab-content">
              <div class="no-data">
                <el-empty description="暂无数据"></el-empty>
              </div>
            </div>
          </el-tab-pane>

          <!-- 钣金加工常见问题 -->
          <el-tab-pane label="钣金加工常见问题" name="sheet">
            <div class="tab-content">
              <div class="no-data">
                <el-empty description="暂无数据"></el-empty>
              </div>
            </div>
          </el-tab-pane>

          <!-- 手板复模常见问题 -->
          <el-tab-pane label="手板复模常见问题" name="mold">
            <div class="tab-content">
              <div class="no-data">
                <el-empty description="暂无数据"></el-empty>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const activeTab = ref('cnc')
</script>

<style lang="scss" scoped>
.service-guidance {
  background: #f5f7fa;
  min-height: calc(100vh - 60px); // 减去头部导航的高度

  .page-header {
    background: #fff;
    padding: 20px 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 15px;
    }

    .breadcrumb {
      font-size: 14px;
    }
  }

  .guidance-content {
    padding: 40px 0;

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 15px;
    }

    .guidance-tabs {
      background: #fff;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

      :deep(.el-tabs__header) {
        margin-bottom: 30px;
      }

      :deep(.el-tabs__nav-wrap::after) {
        height: 1px;
      }

      :deep(.el-tabs__item) {
        font-size: 16px;
        padding: 0 20px 20px;
        height: auto;
        line-height: 1;

        &.is-active {
          color: #409EFF;
        }
      }

      .tab-content {
        min-height: 300px;

        .no-data {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 300px;
        }
      }
    }
  }
}

// 响应式布局
@media (max-width: 768px) {
  .service-guidance {
    .guidance-content {
      padding: 20px 0;

      .guidance-tabs {
        padding: 15px;

        :deep(.el-tabs__item) {
          font-size: 14px;
          padding: 0 10px 15px;
        }
      }
    }
  }
}
</style> 