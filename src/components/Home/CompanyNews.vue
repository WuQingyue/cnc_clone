<template>
  <section class="company-news">
    <div class="container">
      <h2 class="section-title">企业动态及技术专栏</h2>
      <div class="news-container">
        <!-- 公司动态 -->
        <div class="news-section">
          <div class="section-header">
            <h3>公司动态</h3>
            <router-link to="/news" class="more-link">更多 ></router-link>
          </div>
          <div class="news-list">
            <div class="news-item" @click="handleNewsClick(companyNews[0])">
              <div class="news-image">
                <img :src="companyNews[0].image" :alt="companyNews[0].title">
              </div>
              <div class="news-content">
                <h4 class="news-title">{{ companyNews[0].title }}</h4>
                <p class="news-desc">{{ companyNews[0].description }}</p>
                <span class="news-date">{{ companyNews[0].date }}</span>
              </div>
            </div>
          </div>
        </div>
        <!-- 技术文章 -->
        <div class="news-section">
          <div class="section-header">
            <h3>技术文章</h3>
            <router-link to="/articles" class="more-link">更多 ></router-link>
          </div>
          <ul class="article-list">
            <li v-for="article in techArticles"
                :key="article.id"
                @click="handleArticleClick(article)">
              <span class="article-title">{{ article.title }}</span>
              <span class="article-date">{{ article.date }}</span>
            </li>
          </ul>
        </div>
        <!-- 技术讨论 -->
        <div class="news-section">
          <div class="section-header">
            <h3>技术讨论</h3>
            <router-link to="/discussions" class="more-link">更多 ></router-link>
          </div>
          <ul class="discussion-list">
            <li v-for="discussion in techDiscussions"
                :key="discussion.id"
                @click="handleDiscussionClick(discussion)">
              <span class="discussion-title">{{ discussion.title }}</span>
              <span class="discussion-date">{{ discussion.date }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 模拟数据
const companyNews = ref([
  {
    id: 1,
    title: '嘉立创CNC祝您蛇年大吉，新春佳节期间正常生产！',
    description: '春节期间，嘉立创CNC生产基地正常生产，欢迎下单！',
    image: require('@/assets/images/news1.png'),
    date: '2024-02-10'
  }
])

const techArticles = ref([
  {
    id: 1,
    title: '腐蚀、生锈......究竟是谁打破了不锈钢的"不锈神话"？',
    date: '2024-08-02'
  },
  {
    id: 2,
    title: 'CNC各种螺纹型号分类与解析',
    date: '2025-01-08'
  },
  {
    id: 3,
    title: 'CNC图纸问题原因分析',
    date: '2025-01-07'
  },
  {
    id: 4,
    title: '揭秘阳极氧化工艺：为铝合金披上科技感的外衣！',
    date: '2024-07-03'
  },
  {
    id: 5,
    title: 'CNC加工的低成本设计技巧',
    date: '2024-03-18'
  },
  {
    id: 6,
    title: '螺纹的常见问题及说明',
    date: '2024-03-18'
  },
  {
    id: 7,
    title: '小批量样件，选什么加工方式？',
    date: '2024-03-12'
  }
])

const techDiscussions = ref([
  {
    id: 1,
    title: 'CNC图纸问题原因分析',
    date: '2025-01-07'
  },
  {
    id: 2,
    title: '部分去氧化层',
    date: '2024-12-16'
  },
  {
    id: 3,
    title: '一元打样订单如何提高通过率？',
    date: '2024-12-13'
  },
  {
    id: 4,
    title: '订单需返修，如何申请？',
    date: '2024-12-13'
  }
])

const handleNewsClick = (news) => {
  router.push(`/news/${news.id}`)
}

const handleArticleClick = (article) => {
  router.push(`/article/${article.id}`)
}

const handleDiscussionClick = (discussion) => {
  router.push(`/discussion/${discussion.id}`)
}
</script>

<style lang="scss" scoped>
.company-news {
  width: 100%;
  max-width: 100vw;
  margin-top: 80px;
  background: #fff;
  overflow: hidden;
  /* 保持和 HomeBanner.vue 一致 */
  @media (max-width: 1200px) {
    margin-top: 60px;
  }
  @media (max-width: 992px) {
    margin-top: 50px;
  }
  @media (max-width: 768px) {
    margin-top: 40px;
  }
  @media (max-width: 480px) {
    margin-top: 32px;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 15px;
    width: 100%;
    /* 保持和 HomeBanner.vue 一致 */
    @media (max-width: 1200px) {
      max-width: 100vw;
      padding: 0 8px;
    }
    @media (max-width: 768px) {
      padding: 0 4px;
    }
    @media (max-width: 480px) {
      padding: 0 2px;
    }
  }

  .section-title {
    font-size: 32px;
    color: #333;
    text-align: center;
    margin-bottom: 40px;
    font-weight: 500;
    @media (max-width: 768px) {
      font-size: 24px;
      margin-bottom: 30px;
    }
    @media (max-width: 480px) {
      font-size: 18px;
      margin-bottom: 18px;
    }
  }

  .news-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    @media (max-width: 1200px) {
      grid-template-columns: 1fr;
      gap: 20px;
    }
    @media (max-width: 768px) {
      gap: 10px;
    }
  }

  .news-section {
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
    padding: 20px;
    @media (max-width: 768px) {
      padding: 12px;
    }
    @media (max-width: 480px) {
      padding: 6px;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 1px solid #EBEEF5;

      h3 {
        font-size: 18px;
        color: #333;
        font-weight: 500;
        position: relative;
        padding-left: 12px;

        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 16px;
          background: #409EFF;
          border-radius: 2px;
        }
      }

      .more-link {
        font-size: 14px;
        color: #999;
        text-decoration: none;

        &:hover {
          color: #409EFF;
        }
      }
    }
  }

  .news-list {
    .news-item {
      cursor: pointer;

      &:hover {
        .news-title {
          color: #409EFF;
        }
      }

      .news-image {
        width: 100%;
        height: 160px;
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 12px;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;

          &:hover {
            transform: scale(1.05);
          }
        }
      }

      .news-content {
        .news-title {
          font-size: 15px;
          color: #333;
          line-height: 1.5;
          margin-bottom: 8px;
          transition: color 0.3s;
        }

        .news-desc {
          font-size: 14px;
          color: #666;
          line-height: 1.6;
          margin-bottom: 8px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .news-date {
          font-size: 12px;
          color: #999;
        }
      }
    }
    @media (max-width: 768px) {
      .news-item {
        .news-image {
          height: 140px;
        }
      }
    }
    @media (max-width: 480px) {
      .news-item {
        .news-image {
          height: 80px;
        }
      }
    }
  }

  .article-list,
  .discussion-list {
    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
      cursor: pointer;
      border-bottom: 1px dashed #EBEEF5;

      &:last-child {
        border-bottom: none;
      }

      &:hover {
        .article-title,
        .discussion-title {
          color: #409EFF;
        }
      }

      .article-title,
      .discussion-title {
        flex: 1;
        font-size: 14px;
        color: #333;
        margin-right: 15px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        transition: color 0.3s;
      }

      .article-date,
      .discussion-date {
        font-size: 12px;
        color: #999;
        white-space: nowrap;
      }
    }
  }
}
</style>