<template>
  <section class="customer-reviews">
    <div class="container">
      <h2 class="section-title">客户评价</h2>
      
      <el-tabs v-model="activeTab" class="review-tabs">
        <el-tab-pane label="CNC加工" name="cnc">
          <div class="reviews-container">
            <div class="reviews-grid">
              <div v-for="review in cncreviews" :key="review.id" class="review-card">
                <!-- 工艺类型标志 -->
                <div class="process-type">
                  <span>{{ review.type }}</span>
                </div>
                
                <!-- 产品图片 -->
                <div class="product-image">
                  <img :src="review.image" :alt="review.userName + '的晒单图片'">
                </div>
                
                <div class="review-content">
                  <!-- 用户信息和评分 -->
                  <div class="review-header">
                    <div class="user-info">
                      <img src="@/assets/images/user.jpg" alt="用户头像" class="user-avatar">
                      <span class="user-name">{{ review.userName }}</span>
                    </div>
                    <div class="rating">
                      <el-rate v-model="review.rating" />
                    </div>
                  </div>
                  
                  <!-- 位置和日期 -->
                  <div class="meta-info">
                    <span class="location">{{ review.location }}</span>
                    <span class="date">{{ review.date }}</span>
                  </div>
                  
                  <!-- 评价内容 -->
                  <p class="review-text">{{ review.content }}</p>
                  
                  <!-- 统计信息 -->
                  <div class="review-stats">
                    <div class="stats-wrapper">
                      <div class="stat-item">
                        <el-icon><View /></el-icon>
                        <span>{{ review.views }}</span>
                      </div>
                      <div class="divider"></div>
                      <div class="stat-item">
                        <el-icon><Star /></el-icon>
                        <span>{{ review.likes }}</span>
                      </div>
                    </div>
                </div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="钣金加工" name="sheet">
          <div class="reviews-container">
            <div class="reviews-grid">
              <div v-for="review in sheetreviews" :key="review.id" class="review-card">
                <!-- 工艺类型标志 -->
                <div class="process-type">
                  <span>{{ review.type }}</span>
                </div>
                
                <!-- 产品图片 -->
                <div class="product-image">
                  <img :src="review.image" :alt="review.userName + '的晒单图片'">
                </div>
                
                <div class="review-content">
                  <!-- 用户信息和评分 -->
                  <div class="review-header">
                    <div class="user-info">
                      <img src="@/assets/images/user.jpg" alt="用户头像" class="user-avatar">
                      <span class="user-name">{{ review.userName }}</span>
                    </div>
                    <div class="rating">
                      <el-rate v-model="review.rating"  />
                    </div>
                  </div>
                  
                  <!-- 位置和日期 -->
                  <div class="meta-info">
                    <span class="location">{{ review.location }}</span>
                    <span class="date">{{ review.date }}</span>
                  </div>
                  
                  <!-- 评价内容 -->
                  <p class="review-text">{{ review.content }}</p>
                  
                  <!-- 统计信息 -->
                  <div class="review-stats">
                    <div class="stats-wrapper">
                      <div class="stat-item">
                        <el-icon><View /></el-icon>
                        <span>{{ review.views }}</span>
                      </div>
                      <div class="divider"></div>
                      <div class="stat-item">
                        <el-icon><Star /></el-icon>
                        <span>{{ review.likes }}</span>
                      </div>
                    </div>
                </div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="手板复模" name="hand">
          <div class="reviews-container">
            <div class="reviews-grid">
              <div v-for="review in handreviews" :key="review.id" class="review-card">
                <!-- 工艺类型标志 -->
                <div class="process-type">
                  <span>{{ review.type }}</span>
                </div>
                
                <!-- 产品图片 -->
                <div class="product-image">
                  <img :src="review.image" :alt="review.userName + '的晒单图片'">
                </div>
                
                <div class="review-content">
                  <!-- 用户信息和评分 -->
                  <div class="review-header">
                    <div class="user-info">
                      <img src="@/assets/images/user.jpg" alt="用户头像" class="user-avatar">
                      <span class="user-name">{{ review.userName }}</span>
                    </div>
                    <div class="rating">
                      <el-rate v-model="review.rating" />
                    </div>
                  </div>
                  
                  <!-- 位置和日期 -->
                  <div class="meta-info">
                    <span class="location">{{ review.location }}</span>
                    <span class="date">{{ review.date }}</span>
                  </div>
                  
                  <!-- 评价内容 -->
                  <p class="review-text">{{ review.content }}</p>
                  
                  <!-- 统计信息 -->
                  <div class="review-stats">
                    <div class="stats-wrapper">
                      <div class="stat-item">
                        <el-icon><View /></el-icon>
                        <span>{{ review.views }}</span>
                      </div>
                      <div class="divider"></div>
                      <div class="stat-item">
                        <el-icon><Star /></el-icon>
                        <span>{{ review.likes }}</span>
                      </div>
                    </div>
                </div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="3D打印" name="3d">
          <div class="reviews-container">
            <div class="reviews-grid">
              <div v-for="review in reviews_3d" :key="review.id" class="review-card">
                <!-- 工艺类型标志 -->
                <div class="process-type">
                  <span>{{ review.type }}</span>
                </div>
                <!-- 产品图片 -->
                <div class="product-image">
                  <img :src="review.image" :alt="review.userName + '的晒单图片'">
                </div>
                
                <div class="review-content">
                  <!-- 用户信息和评分 -->
                  <div class="review-header">
                    <div class="user-info">
                      <img src="@/assets/images/user.jpg" alt="用户头像" class="user-avatar">
                      <span class="user-name">{{ review.userName }}</span>
                    </div>
                    <div class="rating">
                      <el-rate v-model="review.rating" />
                    </div>
                  </div>
                  
                  <!-- 位置和日期 -->
                  <div class="meta-info">
                    <span class="location">{{ review.location }}</span>
                    <span class="date">{{ review.date }}</span>
                  </div>
                  
                  <!-- 评价内容 -->
                  <p class="review-text">{{ review.content }}</p>
                  
                  <!-- 统计信息 -->
                  <div class="review-stats">
                    <div class="stats-wrapper">
                      <div class="stat-item">
                        <el-icon><View /></el-icon>
                        <span>{{ review.views }}</span>
                      </div>
                      <div class="divider"></div>
                      <div class="stat-item">
                        <el-icon><Star /></el-icon>
                        <span>{{ review.likes }}</span>
                      </div>
                    </div>
                </div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
      <div class="view-more">
        <el-button>查看更多</el-button>
      </div>
      
      <!-- 修改公司简介部分的样式 -->
      <div class="company-intro">
        <div class="intro-content">
          <p>嘉立创CNC致力于打造高性价比的CNC机加、钣金加工和复模加工服务商！欢迎广大个人及公司洽谈合作！</p>
          <el-button type="primary" class="consult-btn" @click="handleConsult">
            <el-icon class="icon"><Message /></el-icon>
            在线咨询
          </el-button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { View, Star } from '@element-plus/icons-vue'

const activeTab = ref('cnc')


const cncreviews = [
  {
    id: 1,
    type: 'CNC加工',
    image: require('@/assets/images/reviews1.jpg'),
    userName: '5***13A',
    location: '[山西省-大同市]',
    date: '2025-02-19',
    rating: 5,
    content: '不错，做了一个焊锡架',
    views: 123,
    likes: 1
  },
  {
    id: 2,
    type: 'CNC加工',
    image: require('@/assets/images/reviews2.jpg'),
    userName: '1****20A',
    location: '[广西壮族自治区-防城港市]',
    date: '2025-02-16',
    rating: 5,
    content: '太棒了，还做了氧化。又便宜。希望永远能免费下去。已经装上忘记拍收货的样子了。只能拍成品',
    views: 144,
    likes: 0
  },
  {
    id: 3,
    type: 'CNC加工',
    image: require('@/assets/images/reviews3.jpg'),
    userName: '3***85D',
    location: '[广东省-深圳市]',
    date: '2025-02-16',
    rating: 5,
    content: '做工不错，无明显夹痕，阳极工艺的很棒',
    views: 96,
    likes: 0
  },
  {
    id: 4,
    type: 'CNC加工',
    image: require('@/assets/images/reviews4.jpg'),
    userName: '7****08A',
    location: '[福建省-福州市]',
    date: '2025-02-14',
    rating: 5,
    content: '效果可以！感谢立创',
    views: 61,
    likes: 0
  }
]
const sheetreviews = [
  {
    id: 1,
    type: '钣金加工',
    image: require('@/assets/images/reviews5.jpg'),
    userName: '5***13A',
    location: '山西省-大同市',
    date: '2025-02-19',
    rating: 5,
    content: '不错，做了一个焊锡架',
    views: 123,
    likes: 1
  },
  {
    id: 2,
    type: '钣金加工',
    image: require('@/assets/images/reviews6.jpg'),
    userName: '1****20A',
    location: '广西壮族自治区-防城港市',
    date: '2025-02-16',
    rating: 5,
    content: '太棒了，还做了氧化。又便宜。希望永远能免费下去。已经装上忘记拍收货的样子了。只能拍成品',
    views: 144,
    likes: 0
  },
  {
    id: 3,
    type: '钣金加工',
    image: require('@/assets/images/reviews7.jpg'),
    userName: '3***85D',
    location: '广东省-深圳市',
    date: '2025-02-16',
    rating: 5,
    content: '做工不错，无明显夹痕，阳极工艺的很棒',
    views: 96,
    likes: 0
  },
  {
    id: 4,
    type: '钣金加工',
    image: require('@/assets/images/reviews8.jpg'),
    userName: '7****08A',
    location: '福建省-福州市',
    date: '2025-02-14',
    rating: 5,
    content: '效果可以！感谢立创',
    views: 61,
    likes: 0
  }
]
const handreviews = [
  {
    id: 1,
    type: '手板复模',
    image: require('@/assets/images/reviews9.jpg'),
    userName: '5***13A',
    location: '[山西省-大同市]',
    date: '2025-02-19',
    rating: 5,
    content: '不错，做了一个焊锡架',
    views: 123,
    likes: 1
  },
  {
    id: 2,
    type: '手板复模',
    image: require('@/assets/images/reviews10.jpg'),
    userName: '1****20A',
    location: '[广西壮族自治区-防城港市]',
    date: '2025-02-16',
    rating: 5,
    content: '太棒了，还做了氧化。又便宜。希望永远能免费下去。已经装上忘记拍收货的样子了。只能拍成品',
    views: 144,
    likes: 0
  },
  {
    id: 3,
    type: '手板复模',
    image: require('@/assets/images/reviews11.jpg'),
    userName: '3***85D',
    location: '[广东省-深圳市]',
    date: '2025-02-16',
    rating: 5,
    content: '做工不错，无明显夹痕，阳极工艺的很棒',
    views: 96,
    likes: 0
  },
  {
    id: 4,
    type: '手板复模',
    image: require('@/assets/images/reviews12.jpg'),
    userName: '7****08A',
    location: '[福建省-福州市]',
    date: '2025-02-14',
    rating: 5,
    content: '效果可以！感谢立创',
    views: 61,
    likes: 0
  }
]
const reviews_3d = [
  {
    id: 1,
    type: '3D打印',
    image: require('@/assets/images/reviews13.jpg'),
    userName: '5***13A',
    location: '[山西省-大同市]',
    date: '2025-02-19',
    rating: 5,
    content: '不错，做了一个焊锡架',
    views: 123,
    likes: 1
  },
  {
    id: 2,
    type: '3D打印',
    image: require('@/assets/images/reviews14.jpg'),
    userName: '1****20A',
    location: '[广西壮族自治区-防城港市]',
    date: '2025-02-16',
    rating: 5,
    content: '太棒了，还做了氧化。又便宜。希望永远能免费下去。已经装上忘记拍收货的样子了。只能拍成品',
    views: 144,
    likes: 0
  },
  {
    id: 3,
    type: '3D打印',
    image: require('@/assets/images/reviews15.jpg'),
    userName: '3***85D',
    location: '[广东省-深圳市]',
    date: '2025-02-16',
    rating: 5,
    content: '做工不错，无明显夹痕，阳极工艺的很棒',
    views: 96,
    likes: 0
  },
  {
    id: 4,
    type: '3D打印',
    image: require('@/assets/images/reviews16.jpg'),
    userName: '7****08A',
    location: '[福建省-福州市]',
    date: '2025-02-14',
    rating: 5,
    content: '效果可以！感谢立创',
    views: 61,
    likes: 0
  }
]
</script>

<style lang="scss" scoped>
.customer-reviews {
  padding: 60px 0;
  background: #f5f7fa;

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 15px;
  }

  .reviews-container {
    margin-top: 30px;
  }

  .reviews-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    justify-content: center;
  }

  .review-card {
    background: #fff;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    position: relative;
    display: flex;          // 添加
    flex-direction: column; // 添加
    height: 100%;          // 添加

    .process-type {
      position: absolute;
      top: 10px;
      left: 10px;
      z-index: 1;
      display: flex;
      align-items: center;
      gap: 5px;
      background: rgba(0, 0, 0, 0.6);
      padding: 4px 8px;
      border-radius: 4px;
      
      span {
        color: #fff;
        font-size: 12px;
      }

      img {
        width: 16px;
        height: 16px;
      }
    }

    .product-image {
      height: 200px;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .review-content {
      padding: 15px;
      flex: 1;             // 添加
      display: flex;       // 添加
      flex-direction: column; // 添加

      .review-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;

        .user-info {
          display: flex;
          align-items: center;
          gap: 8px;

          .user-avatar {
            width: 24px;
            height: 24px;
            border-radius: 50%;
          }

          .user-name {
            font-size: 14px;
            color: #333;
            font-weight: 500;
          }
        }

        .rating {
          .el-rate {
            height: 20px;
            line-height: 20px;
          }
        }
      }

      .meta-info {
        display: flex;
        justify-content: space-between;
        margin-bottom: 12px;
        font-size: 12px;
        color: #999;

        .location {
          margin-left: 5px; // 对齐用户图标
        }
      }

      .review-text {
        font-size: 14px;
        color: #666;
        line-height: 1.6;
        margin-bottom: 15px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        margin-bottom: auto;  // 修改，使用 auto 来推动统计信息到底部
      }

      .review-stats {
        display: flex;
        padding: 15px;
        border-top: 1px solid #ebeef5;
        margin-top: auto;
        
        .stats-wrapper {
          display: flex;
          align-items: center;
          width: 100%;
          justify-content: center;
          padding: 0 20px;

          .stat-item {
            display: flex;
            align-items: center;
            gap: 5px;
            color: #999;
            font-size: 12px;
            flex: 1;
            justify-content: center;

            .el-icon {
            font-size: 14px;
          }
          .iconfont {
          font-size: 14px;
        }
        }

        .divider {
          width: 1px;
          height: 12px;
          background: #ebeef5;
          margin: 0;
          }
        }
      }
    }
  }

  .view-more {
    text-align: center;
    margin-top: 30px;
  }

  .company-intro {
    position: relative;
    left: 50%;
    right: 50%;
    margin-left: -50vw;
    margin-right: -50vw;
    width: 100vw;
    text-align: center;
    margin-top: 50px;
    padding: 40px 0;
    background-color: #097df1;
    border-radius: 0;

    .intro-content {
      max-width: 800px;
      margin: 0 auto;
      padding: 0 15px;
    }
     p {
      font-size: 32px;
      color: #ffffff;
      margin-bottom: 25px;
      line-height: 1.6;
      // font-family: "楷体", "楷体_GB2312", KaiTi, "KaiTi_GB2312", serif; // 添加楷体字体
      font-weight: bold; // 或者使用具体数值如 700
    }

    .consult-btn {
      width: auto;
      height: 40px;
      padding: 0 25px;
      font-size: 16px;
      border-radius: 20px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: all 0.3s ease;
      background: #fff;
      color: #097df1;

      .icon {
        font-size: 18px;
        color: #097df1;
      }

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
      }
  }
  }

  @media (max-width: 1200px) {
    .reviews-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  @media (max-width: 992px) {
    .reviews-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 576px) {
    .reviews-grid {
      grid-template-columns: 1fr;
    }
  }
}
</style>