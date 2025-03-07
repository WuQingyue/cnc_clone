<template>
    <div class="user-evaluation">
      <!-- 页面标题 -->
      <div class="page-header">
        <div class="container">
          <div class="breadcrumb">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item>客户评价</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
        </div>
      </div>
  
      <!-- 评价类型选择 -->
      <div class="evaluation-tabs">
        <div class="container">
          <el-tabs v-model="activeTab">
            <el-tab-pane label="CNC加工" name="cnc">
              <div class="evaluation-list">
                <div v-for="item in evaluationList" :key="item.id" class="evaluation-item">
                  <div class="evaluation-header">
                    <div class="user-info">
                      <span class="user-name">{{ item.userName }}</span>
                      <span class="location">[{{ item.location }}]</span>
                      <span class="date">{{ item.date }}</span>
                    </div>
                    <div class="product-type">{{ item.type }}</div>
                  </div>
                  
                  <div class="evaluation-content">
                    <div class="image-area" v-if="item.images">
                      <el-image 
                        v-for="(img, index) in item.images" 
                        :key="index"
                        :src="img"
                        fit="cover"
                        :preview-src-list="item.images"
                      />
                    </div>
                    <div class="comment">{{ item.comment }}</div>
                  </div>
  
                  <div class="evaluation-footer">
                    <div class="likes">
                      <el-button type="text" @click="handleLike(item)">
                        <el-icon><ThumbsUp /></el-icon>
                        {{ item.likes }}
                      </el-button>
                    </div>
                    <div class="comments-count">
                      <el-button type="text" @click="handleComment(item)">
                        <el-icon><ChatLineRound /></el-icon>
                        {{ item.comments }}
                      </el-button>
                    </div>
                  </div>
                </div>
              </div>
  
              <!-- 分页 -->
              <div class="pagination">
                <el-pagination
                  v-model:current-page="currentPage"
                  :page-size="20"
                  :total="totalItems"
                  :pager-count="7"
                  layout="prev, pager, next, jumper"
                  @current-change="handlePageChange"
                />
              </div>
            </el-tab-pane>
            
            <el-tab-pane label="钣金加工" name="sheet">
              <!-- 相同的列表结构 -->
            </el-tab-pane>
            
            <el-tab-pane label="手板复模" name="mold">
              <!-- 相同的列表结构 -->
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { ThumbsUp, ChatLineRound } from '@element-plus/icons-vue'
  
  const activeTab = ref('cnc')
  const currentPage = ref(1)
  const totalItems = ref(383)
  
  // 模拟评价数据
  const evaluationList = ref([
    {
      id: 1,
      userName: '1****08A',
      location: '北京市-北京市',
      date: '2025-03-04',
      type: 'CNC加工',
      comment: '尺寸准确',
      likes: 7,
      comments: 0,
      images: ['path/to/image1.jpg']
    },
    // ... 更多评价数据
  ])
  
  const handleLike = (item) => {
    item.likes++
  }
  
  const handleComment = (item) => {
    // 实现评论功能
  }
  
  const handlePageChange = (page) => {
    currentPage.value = page
    // 加载对应页的数据
  }
  </script>
  
  <style lang="scss" scoped>
  .user-evaluation {
    padding-top: 60px;
    
    .evaluation-tabs {
      padding: 20px 0;
      background: #fff;
  
      .evaluation-list {
        .evaluation-item {
          padding: 20px;
          border-bottom: 1px solid #eee;
  
          .evaluation-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
  
            .user-info {
              .user-name {
                font-weight: bold;
                margin-right: 10px;
              }
  
              .location, .date {
                color: #999;
                margin-right: 10px;
              }
            }
  
            .product-type {
              color: #666;
            }
          }
  
          .evaluation-content {
            .image-area {
              display: flex;
              gap: 10px;
              margin-bottom: 15px;
  
              .el-image {
                width: 100px;
                height: 100px;
                border-radius: 4px;
                overflow: hidden;
              }
            }
  
            .comment {
              font-size: 14px;
              line-height: 1.6;
              color: #333;
            }
          }
  
          .evaluation-footer {
            display: flex;
            gap: 20px;
            margin-top: 15px;
  
            .el-button {
              display: flex;
              align-items: center;
              gap: 4px;
              color: #666;
  
              &:hover {
                color: var(--primary-color);
              }
            }
          }
        }
      }
  
      .pagination {
        margin-top: 20px;
        display: flex;
        justify-content: center;
      }
    }
  }
  
  // 响应式布局
  @media (max-width: 768px) {
    .user-evaluation {
      .evaluation-tabs {
        .evaluation-list {
          .evaluation-item {
            padding: 15px;
  
            .evaluation-content {
              .image-area {
                .el-image {
                  width: 80px;
                  height: 80px;
                }
              }
            }
          }
        }
      }
    }
  }
  </style>