<template>
    <div class="news">
      <!-- 页面标题 -->
      <div class="page-header">
        <div class="container">
          <h1 class="page-title">新闻资讯</h1>
          <div class="breadcrumb">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item>新闻资讯</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
        </div>
      </div>
  
      <!-- 新闻内容区 -->
      <section class="news-section">
        <div class="container">
          <div class="news-container">
            <!-- 左侧新闻列表 -->
            <div class="news-main">
              <!-- 新闻分类标签 -->
              <div class="news-tags">
                <el-radio-group v-model="currentTag" @change="handleTagChange">
                  <el-radio-button 
                    v-for="tag in newsTags" 
                    :key="tag.id" 
                    :label="tag.id">
                    {{ tag.name }}
                  </el-radio-button>
                </el-radio-group>
              </div>
  
              <!-- 新闻列表 -->
              <div class="news-list">
                <div v-for="news in newsList" 
                     :key="news.id" 
                     class="news-item"
                     @click="handleNewsClick(news)">
                  <div class="news-image">
                    <img :src="news.image" :alt="news.title">
                    <div class="news-tag">{{ news.tagName }}</div>
                  </div>
                  <div class="news-content">
                    <h3 class="news-title">{{ news.title }}</h3>
                    <p class="news-desc">{{ news.description }}</p>
                    <div class="news-meta">
                      <span class="news-date">
                        <i class="el-icon-time"></i>
                        {{ news.date }}
                      </span>
                      <span class="news-views">
                        <i class="el-icon-view"></i>
                        {{ news.views }} 阅读
                      </span>
                    </div>
                  </div>
                </div>
              </div>
  
              <!-- 分页 -->
              <div class="pagination">
                <el-pagination
                  background
                  layout="prev, pager, next"
                  :total="total"
                  :page-size="pageSize"
                  :current-page="currentPage"
                  @current-change="handlePageChange"
                />
              </div>
            </div>
  
            <!-- 右侧边栏 -->
            <div class="news-sidebar">
              <!-- 搜索框 -->
              <div class="sidebar-section search-box">
                <el-input
                  v-model="searchKeyword"
                  placeholder="搜索新闻"
                  prefix-icon="el-icon-search"
                  clearable
                  @input="handleSearch"
                />
              </div>
  
              <!-- 热门新闻 -->
              <div class="sidebar-section hot-news">
                <h3 class="section-title">热门新闻</h3>
                <ul class="hot-news-list">
                  <li v-for="item in hotNews" 
                      :key="item.id"
                      @click="handleNewsClick(item)">
                    <div class="hot-news-image">
                      <img :src="item.image" :alt="item.title">
                    </div>
                    <div class="hot-news-info">
                      <h4>{{ item.title }}</h4>
                      <span class="news-date">{{ item.date }}</span>
                    </div>
                  </li>
                </ul>
              </div>
  
              <!-- 新闻标签云 -->
              <div class="sidebar-section news-tags-cloud">
                <h3 class="section-title">标签云</h3>
                <div class="tags-cloud">
                  <el-tag
                    v-for="tag in newsTagsCloud"
                    :key="tag.id"
                    :type="tag.type"
                    effect="plain"
                    @click="handleTagClick(tag)">
                    {{ tag.name }}
                  </el-tag>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </template>
  
  <script>
  export default {
    name: 'News',
    data() {
      return {
        currentTag: 0,
        searchKeyword: '',
        currentPage: 1,
        pageSize: 10,
        total: 100,
        newsTags: [
          { id: 0, name: '全部' },
          { id: 1, name: '公司新闻' },
          { id: 2, name: '行业动态' },
          { id: 3, name: '技术分享' },
          { id: 4, name: '展会信息' }
        ],
        newsList: [
          {
            id: 1,
            title: 'SmartCNC成功入选国家级专精特新"小巨人"企业',
            description: '近日，工信部公布了第四批专精特新"小巨人"企业名单，我司凭借在精密加工领域的技术创新和市场表现成功入选...',
            image: require('@/assets/images/news1.png'),
            tagName: '公司新闻',
            date: '2024-01-15',
            views: 2358
          },
          {
            id: 2,
            title: '2024年数控加工行业发展趋势分析',
            description: '随着工业4.0的深入推进，数控加工行业正在经历深刻的技术变革，本文将详细分析2024年行业发展的主要趋势...',
            image: require('@/assets/images/news2.png'),
            tagName: '行业动态',
            date: '2024-01-10',
            views: 1526
          }
          // 更多新闻数据...
        ],
        hotNews: [
          {
            id: 3,
            title: '我司参加2024深圳国际机械展览会',
            image: require('@/assets/images/news3.png'),
            date: '2024-01-05'
          }
          // 更多热门新闻...
        ],
        newsTagsCloud: [
          { id: 1, name: '技术创新', type: '' },
          { id: 2, name: '行业资讯', type: 'success' },
          { id: 3, name: '企业文化', type: 'info' },
          { id: 4, name: '展会动态', type: 'warning' },
          { id: 5, name: '产品更新', type: 'danger' }
        ]
      }
    },
    methods: {
      handleTagChange(tagId) {
        this.currentPage = 1
        // 根据标签筛选新闻
        this.fetchNewsList()
      },
      handleSearch() {
        this.currentPage = 1
        // 搜索新闻
        this.fetchNewsList()
      },
      handlePageChange(page) {
        this.currentPage = page
        // 获取对应页码的新闻
        this.fetchNewsList()
      },
      handleNewsClick(news) {
        this.$router.push({
          path: '/news/detail',
          query: { id: news.id }
        })
      },
      handleTagClick(tag) {
        this.currentTag = tag.id
        this.handleTagChange(tag.id)
      },
      async fetchNewsList() {
        try {
          // 调用API获取新闻列表
          const params = {
            page: this.currentPage,
            pageSize: this.pageSize,
            tag: this.currentTag,
            keyword: this.searchKeyword
          }
          // const response = await this.$api.getNewsList(params)
          // this.newsList = response.data.list
          // this.total = response.data.total
        } catch (error) {
          console.error('获取新闻列表失败:', error)
          this.$message.error('获取新闻列表失败')
        }
      }
    },
    created() {
      this.fetchNewsList()
    }
  }
  </script>
  
  <style lang="scss" scoped>
  .news {
    .page-header {
      background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), 
                  url('@/assets/images/news-featured.png') center/cover;
      padding: 80px 0;
      color: white;
      margin-top: 80px;
  
      .page-title {
        font-size: 36px;
        margin-bottom: 20px;
      }
    }
  
    .news-section {
      padding: 60px 0;
      background: $bg-color-light;
  
      .news-container {
        display: grid;
        grid-template-columns: 1fr 350px;
        gap: 40px;
        
        @include responsive(lg) {
          grid-template-columns: 1fr;
        }
      }
    }
  
    .news-main {
      .news-tags {
        margin-bottom: 30px;
        
        :deep(.el-radio-button__inner) {
          padding: 12px 24px;
        }
      }
  
      .news-list {
        .news-item {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 30px;
          background: white;
          border-radius: $border-radius-lg;
          overflow: hidden;
          margin-bottom: 30px;
          box-shadow: $box-shadow;
          cursor: pointer;
          transition: all 0.3s ease;
          
          @include responsive(md) {
            grid-template-columns: 1fr;
          }
  
          &:hover {
            transform: translateY(-5px);
            box-shadow: $box-shadow-lg;
  
            .news-image img {
              transform: scale(1.1);
            }
          }
  
          .news-image {
            position: relative;
            height: 200px;
            overflow: hidden;
  
            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
              transition: transform 0.3s ease;
            }
  
            .news-tag {
              position: absolute;
              top: 15px;
              left: 15px;
              padding: 4px 12px;
              background: $primary-color;
              color: white;
              border-radius: $border-radius-sm;
              font-size: 14px;
            }
          }
  
          .news-content {
            padding: 20px;
            display: flex;
            flex-direction: column;
  
            .news-title {
              font-size: 20px;
              color: $text-color;
              margin-bottom: 15px;
              line-height: 1.4;
            }
  
            .news-desc {
              font-size: 14px;
              color: $text-color-secondary;
              line-height: 1.6;
              margin-bottom: 20px;
              flex-grow: 1;
            }
  
            .news-meta {
              display: flex;
              align-items: center;
              font-size: 14px;
              color: $text-color-light;
  
              span {
                display: flex;
                align-items: center;
                margin-right: 20px;
  
                i {
                  margin-right: 5px;
                }
              }
            }
          }
        }
      }
  
      .pagination {
        margin-top: 40px;
        text-align: center;
      }
    }
  
    .news-sidebar {
      .sidebar-section {
        background: white;
        border-radius: $border-radius-lg;
        padding: 20px;
        margin-bottom: 30px;
        box-shadow: $box-shadow;
  
        .section-title {
          font-size: 18px;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid $border-color;
        }
      }
  
      .hot-news-list {
        list-style: none;
        padding: 0;
        margin: 0;
  
        li {
          display: flex;
          gap: 15px;
          margin-bottom: 15px;
          cursor: pointer;
          transition: transform 0.3s ease;
  
          &:hover {
            transform: translateX(5px);
  
            h4 {
              color: $primary-color;
            }
          }
  
          .hot-news-image {
            width: 80px;
            height: 60px;
            border-radius: $border-radius-sm;
            overflow: hidden;
  
            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }
  
          .hot-news-info {
            flex: 1;
  
            h4 {
              font-size: 14px;
              color: $text-color;
              margin-bottom: 5px;
              transition: color 0.3s ease;
              @include text-ellipsis;
            }
  
            .news-date {
              font-size: 12px;
              color: $text-color-light;
            }
          }
        }
      }
  
      .tags-cloud {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
  
        .el-tag {
          cursor: pointer;
          margin-right: 10px;
          margin-bottom: 10px;
        }
      }
    }
  }
  </style>