<template>
    <div class="tech-forum">
      <!-- 页面标题 -->
      <div class="page-header">
        <div class="container">
          <div class="breadcrumb">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item>服务指引</el-breadcrumb-item>
              <el-breadcrumb-item>技术论坛</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
        </div>
      </div>
  
      <!-- 主要内容区域 -->
      <div class="forum-content">
        <div class="container">
          <!-- 左侧分类导航 -->
          <div class="forum-sidebar">
            <el-menu
              :default-active="activeCategory"
              class="category-menu"
            >
              <el-sub-menu index="tech">
                <template #title>
                  <span>技术交流</span>
                </template>
                <el-menu-item index="maker">硬创社</el-menu-item>
                <el-menu-item index="open-source">开源硬件平台</el-menu-item>
                <el-menu-item index="dev-board">立创开发板</el-menu-item>
              </el-sub-menu>
  
              <el-sub-menu index="electronic">
                <template #title>
                  <span>电子产业</span>
                </template>
                <el-menu-item index="pcb">SmartCNC PCB</el-menu-item>
                <el-menu-item index="fpc">SmartCNC FPC</el-menu-item>
                <el-menu-item index="smt">SmartCNC SMT</el-menu-item>
                <el-menu-item index="laser">激光钢网</el-menu-item>
              </el-sub-menu>
  
              <el-sub-menu index="mechanical">
                <template #title>
                  <span>机械产业</span>
                </template>
                <el-menu-item index="case">铝合金壳体</el-menu-item>
                <el-menu-item index="parts">机械电气零部件</el-menu-item>
                <el-menu-item index="3d-print">3D打印</el-menu-item>
                <el-menu-item index="cnc">CNC机械制造</el-menu-item>
              </el-sub-menu>
  
              <el-sub-menu index="software">
                <template #title>
                  <span>工业软件</span>
                </template>
                <el-menu-item index="eda">SmartCNC EDA</el-menu-item>
                <el-menu-item index="ecad">SmartCNC ECAD</el-menu-item>
                <el-menu-item index="cam">SmartCNC CAM</el-menu-item>
              </el-sub-menu>
            </el-menu>
          </div>
  
          <!-- 右侧内容区 -->
          <div class="forum-main">
            <!-- 发帖按钮 -->
            <div class="post-actions">
              <el-button type="primary" @click="createPost">
                <el-icon><Edit /></el-icon>发帖
              </el-button>
            </div>
  
            <!-- 帖子列表 -->
            <div class="post-list">
              <el-tabs v-model="activeTab">
                <el-tab-pane label="综合" name="all">
                  <div class="empty-content">
                    <el-empty description="暂无帖子" />
                  </div>
                </el-tab-pane>
                <el-tab-pane label="最新发布" name="newest">
                  <div class="empty-content">
                    <el-empty description="暂无帖子" />
                  </div>
                </el-tab-pane>
                <el-tab-pane label="最新回复" name="latest">
                  <div class="empty-content">
                    <el-empty description="暂无帖子" />
                  </div>
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { Edit } from '@element-plus/icons-vue'
  
  const activeCategory = ref('tech')
  const activeTab = ref('all')
  
  const createPost = () => {
    // 实现发帖功能
    console.log('创建新帖子')
  }
  </script>
  
  <style lang="scss" scoped>
  .tech-forum {
    padding-top: 60px;
    min-height: 100vh;
    background: #f5f7fa;
  
    .forum-content {
      padding: 20px 0;
      
      .container {
        display: flex;
        gap: 20px;
      }
    }
  
    .forum-sidebar {
      width: 240px;
      background: #fff;
      border-radius: 4px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  
      .category-menu {
        border-right: none;
      }
    }
  
    .forum-main {
      flex: 1;
      background: #fff;
      border-radius: 4px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      padding: 20px;
  
      .post-actions {
        margin-bottom: 20px;
        padding-bottom: 20px;
        border-bottom: 1px solid #eee;
      }
  
      .post-list {
        .empty-content {
          padding: 40px 0;
        }
      }
    }
  
    // 响应式布局
    @media (max-width: 992px) {
      .forum-content .container {
        flex-direction: column;
      }
  
      .forum-sidebar {
        width: 100%;
      }
    }
  }
  </style>