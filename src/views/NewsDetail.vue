<template>
    <div class="news-detail">
      <!-- 页面标题 -->
      <div class="page-header">
        <div class="container">
          <h1 class="page-title">新闻详情</h1>
          <div class="breadcrumb">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item :to="{ path: '/news' }">新闻资讯</el-breadcrumb-item>
              <el-breadcrumb-item>新闻详情</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
        </div>
      </div>
  
      <!-- 新闻内容 -->
      <section class="news-content">
        <div class="container">
          <div class="content-wrapper">
            <!-- 文章主体 -->
            <article class="article">
              <h1 class="article-title">{{ newsData.title }}</h1>
              <div class="article-meta">
                <span class="meta-item">
                  <i class="el-icon-date"></i>
                  {{ newsData.date }}
                </span>
                <span class="meta-item">
                  <i class="el-icon-view"></i>
                  {{ newsData.views }} 阅读
                </span>
                <span class="meta-item">
                  <i class="el-icon-collection-tag"></i>
                  {{ newsData.category }}
                </span>
              </div>
              <!-- 文章封面图 -->
              <div class="article-cover" v-if="newsData.cover">
                <img :src="newsData.cover" :alt="newsData.title">
              </div>
              <!-- 文章内容 -->
              <div class="article-content" v-html="newsData.content"></div>
              
              <!-- 文章标签 -->
              <div class="article-tags" v-if="newsData.tags && newsData.tags.length">
                <i class="el-icon-collection-tag"></i>
                <el-tag
                  v-for="tag in newsData.tags"
                  :key="tag"
                  size="small"
                  effect="plain">
                  {{ tag }}
                </el-tag>
              </div>
            </article>
  
            <!-- 相关新闻 -->
            <div class="related-news">
              <h3 class="section-title">相关新闻</h3>
              <ul class="news-list">
                <li v-for="item in relatedNews" 
                    :key="item.id"
                    @click="goToNews(item.id)">
                  <div class="news-image">
                    <img :src="item.image" :alt="item.title">
                  </div>
                  <div class="news-info">
                    <h4>{{ item.title }}</h4>
                    <p>{{ item.date }}</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useStore } from 'vuex'
  import { ElMessage } from 'element-plus'
  
  export default {
    name: 'NewsDetail',
    setup() {
      const route = useRoute()
      const router = useRouter()
      const store = useStore()
      
      const newsData = ref({})
      const relatedNews = ref([])
  
      // 获取新闻详情
      const getNewsDetail = async () => {
        try {
          const id = route.params.id
          if (!id) {
            router.push('/news')
            return
          }
          // 这里应该是实际的API调用
          // const response = await store.dispatch('getNewsDetail', id)
          // newsData.value = response.data
          
          // 模拟数据
          newsData.value = {
            id,
            title: '嘉立诚数控参加2024年工业展览会',
            date: '2024-01-15',
            views: 1234,
            category: '公司新闻',
            cover: '/images/news/detail.png',
            content: `
              <p>这里是新闻详情内容...</p>
              <p>可以包含HTML格式的富文本内容</p>
            `,
            tags: ['展会资讯', '行业动态', '企业新闻']
          }
          
          // 获取相关新闻
          getRelatedNews()
        } catch (error) {
          console.error('获取新闻详情失败:', error)
          ElMessage.error('获取新闻详情失败')
        }
      }
  
      // 获取相关新闻
      const getRelatedNews = () => {
        // 模拟数据
        relatedNews.value = [
          {
            id: 1,
            title: '公司获得高新技术企业认证',
            date: '2024-01-10',
            image: '@/assets/images/avatar1.png'
          },
          {
            id: 2,
            title: '新一代数控机床投入使用',
            date: '2024-01-08',
            image: '@/assets/images/avatar1.png'
          },
          {
            id: 3,
            title: '公司举办技术交流会',
            date: '2024-01-05',
            image: '@/assets/images/avatar1.png'
          }
        ]
      }
  
      // 跳转到其他新闻
      const goToNews = (id) => {
        router.push({
          path: `/news/${id}`
        })
      }
  
      onMounted(() => {
        getNewsDetail()
      })
  
      return {
        newsData,
        relatedNews,
        goToNews
      }
    }
  }
  </script>
  
  <style lang="scss" scoped>
  .news-detail {
    .page-header {
      margin-top: 60px;
      background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), 
                  url('@/assets/images/logo.png') center/cover;
      padding: 60px 0;
      color: white;
    }
  
    .news-content {
      padding: 60px 0;
      background: var(--bg-color-light);
  
      .content-wrapper {
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 12px rgba(0,0,0,0.1);
        overflow: hidden;
      }
  
      .article {
        padding: 40px;
  
        .article-title {
          font-size: 32px;
          color: var(--text-color);
          margin-bottom: 20px;
          line-height: 1.4;
        }
  
        .article-meta {
          display: flex;
          gap: 20px;
          margin-bottom: 30px;
          color: var(--text-color-secondary);
          font-size: 14px;
  
          .meta-item {
            display: flex;
            align-items: center;
            gap: 5px;
          }
        }
  
        .article-cover {
          margin-bottom: 30px;
          border-radius: 8px;
          overflow: hidden;
  
          img {
            width: 100%;
            height: auto;
          }
        }
  
        .article-content {
          font-size: 16px;
          line-height: 1.8;
          color: var(--text-color);
          margin-bottom: 30px;
  
          :deep(img) {
            max-width: 100%;
            height: auto;
            margin: 20px 0;
          }
  
          :deep(p) {
            margin-bottom: 15px;
          }
        }
  
        .article-tags {
          display: flex;
          align-items: center;
          gap: 10px;
          padding-top: 20px;
          border-top: 1px solid var(--border-color);
  
          i {
            color: var(--text-color-secondary);
          }
        }
      }
  
      .related-news {
        padding: 40px;
        border-top: 1px solid var(--border-color);
  
        .section-title {
          font-size: 24px;
          margin-bottom: 20px;
          color: var(--text-color);
        }
  
        .news-list {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
  
          @media (max-width: 768px) {
            grid-template-columns: 1fr;
          }
  
          li {
            cursor: pointer;
            transition: transform 0.3s ease;
  
            &:hover {
              transform: translateY(-5px);
  
              h4 {
                color: var(--primary-color);
              }
            }
  
            .news-image {
              border-radius: 4px;
              overflow: hidden;
              margin-bottom: 10px;
  
              img {
                width: 100%;
                height: 160px;
                object-fit: cover;
              }
            }
  
            .news-info {
              h4 {
                font-size: 16px;
                color: var(--text-color);
                margin-bottom: 5px;
                transition: color 0.3s ease;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
  
              p {
                font-size: 14px;
                color: var(--text-color-secondary);
              }
            }
          }
        }
      }
    }
  }
  </style>