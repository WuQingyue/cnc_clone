<template>
    <div class="technical-column">
      <!-- 页面标题 -->
      <div class="page-header">
        <div class="container">
          <div class="breadcrumb">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item>技术专栏</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
        </div>
      </div>
  
      <!-- 主要内容区域 -->
      <div class="content-wrapper">
        <div class="container">
          <h1 class="page-title">技术专栏</h1>
          
          <!-- 分类标签 -->
          <div class="category-tabs">
            <el-tabs v-model="activeTab">
              <el-tab-pane label="技术文章" name="articles">
                <div class="sub-tabs">
                  <el-radio-group v-model="activeSubTab">
                    <el-radio-button label="cnc">CNC加工</el-radio-button>
                    <el-radio-button label="sheet">钣金加工</el-radio-button>
                    <el-radio-button label="mold">手板复模</el-radio-button>
                  </el-radio-group>
                </div>
              </el-tab-pane>
              <el-tab-pane label="技术讨论" name="discussions">
                <div class="sub-tabs">
                  <el-radio-group v-model="activeSubTab">
                    <el-radio-button label="cnc-discuss">CNC加工相关</el-radio-button>
                    <el-radio-button label="sheet-discuss">钣金加工相关</el-radio-button>
                    <el-radio-button label="mold-discuss">手板复模相关</el-radio-button>
                  </el-radio-group>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
  
          <!-- 操作按钮 -->
          <div class="action-bar">
            <el-button type="primary" @click="handleAskQuestion">
              <el-icon><Plus /></el-icon>我要提问
            </el-button>
            <el-button @click="handleMyQuestions">
              <el-icon><Document /></el-icon>我的提问
            </el-button>
          </div>
  
          <!-- 文章列表 -->
          <div class="article-list">
            <el-table :data="articles" style="width: 100%">
              <el-table-column prop="title" label="">
                <template #default="scope">
                  <div class="article-item">
                    <router-link :to="`/article/${scope.row.id}`" class="article-title">
                      {{ scope.row.title }}
                    </router-link>
                    <span class="article-date">{{ scope.row.date }}</span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
  
          <!-- 分页 -->
          <div class="pagination">
            <el-pagination
              v-model:current-page="currentPage"
              v-model:page-size="pageSize"
              :page-sizes="[10, 20, 30, 40, 50, 100]"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
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
  import { Plus, Document } from '@element-plus/icons-vue'
  
  // 状态变量
  const activeTab = ref('articles')
  const activeSubTab = ref('cnc')
  const currentPage = ref(1)
  const pageSize = ref(10)
  const total = ref(100)
  
  // 模拟文章数据
  const articles = ref([
    {
      id: 1,
      title: '腐蚀、生锈......究竟是谁打破了不锈钢的"不锈神话"？',
      date: '2024-08-02 18:14:32'
    },
    {
      id: 2,
      title: 'CNC各种螺纹型号分类与解析',
      date: '2025-01-08 10:19:57'
    },
    // ... 其他文章数据
  ])
  
  // 事件处理函数
  const handleAskQuestion = () => {
    // 处理提问
  }
  
  const handleMyQuestions = () => {
    // 处理我的提问
  }
  
  const handleSizeChange = (val) => {
    pageSize.value = val
    // 重新加载数据
  }
  
  const handleCurrentChange = (val) => {
    currentPage.value = val
    // 重新加载数据
  }
  </script>
  
  <style lang="scss" scoped>
  .technical-column {
    padding-top: 60px;
    background: #f5f7fa;
    min-height: calc(100vh - 60px);
  
    .page-header {
      background: #fff;
      padding: 20px 0;
      border-bottom: 1px solid var(--border-color);
    }
  
    .content-wrapper {
      padding: 30px 0;
  
      .page-title {
        font-size: 24px;
        margin-bottom: 30px;
        color: var(--text-color);
      }
  
      .category-tabs {
        margin-bottom: 20px;
  
        .sub-tabs {
          margin-top: 20px;
        }
      }
  
      .action-bar {
        display: flex;
        gap: 16px;
        margin-bottom: 20px;
      }
  
      .article-list {
        background: #fff;
        border-radius: 4px;
        padding: 20px;
        margin-bottom: 20px;
  
        .article-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
  
          .article-title {
            color: #333;
            text-decoration: none;
            transition: color 0.3s ease;
  
            &:hover {
              color: var(--primary-color);
            }
          }
  
          .article-date {
            color: #999;
            font-size: 14px;
          }
        }
      }
  
      .pagination {
        display: flex;
        justify-content: center;
        margin-top: 20px;
      }
    }
  }
  
  // 响应式布局
  @media (max-width: 768px) {
    .technical-column {
      .content-wrapper {
        padding: 20px 0;
  
        .page-title {
          font-size: 20px;
          margin-bottom: 20px;
        }
  
        .action-bar {
          flex-direction: column;
        }
  
        .article-item {
          flex-direction: column;
          align-items: flex-start;
          gap: 8px;
        }
      }
    }
  }
  </style>