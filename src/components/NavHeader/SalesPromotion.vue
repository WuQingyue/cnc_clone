<template>
  <div class="sales-promotion">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="container">
        <div class="breadcrumb">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>CNC1元打样</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="promotion-content">
      <div class="container">
        <!-- 活动标题 -->
        <div class="promotion-header">
          <h1>CNC 1元打样</h1>
          <p class="subtitle">新用户专享优惠</p>
        </div>

        <!-- 活动卡片 -->
        <div class="promotion-cards">
          <div class="promo-card">
            <div class="card-header">
              <h3>新用户专享</h3>
              <span class="price">¥1</span>
            </div>
            <div class="card-content">
              <ul class="benefits">
                <li>
                  <el-icon><Check /></el-icon>
                  最多3个零件
                </li>
                <li>
                  <el-icon><Check /></el-icon>
                  单个零件尺寸≤100*100*100mm
                </li>
                <li>
                  <el-icon><Check /></el-icon>
                  铝合金材料
                </li>
                <li>
                  <el-icon><Check /></el-icon>
                  标准公差
                </li>
              </ul>
              <el-button type="primary" class="action-btn" @click="handleOrder">
                立即下单
              </el-button>
            </div>
          </div>
        </div>

        <!-- 活动规则 -->
        <div class="promotion-rules">
          <h2>活动规则</h2>
          <ul>
            <li>1. 仅限新注册用户参与</li>
            <li>2. 每个账号仅可使用一次</li>
            <li>3. 活动期间每天限量100份</li>
            <li>4. 最终解释权归SmartCNC所有</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Check } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const handleOrder = () => {
  router.push('/order')
}
</script>

<style lang="scss" scoped>
.sales-promotion {
  background: #f5f7fa;
  min-height: calc(100vh - 60px);

  .page-header {
    background: #fff;
    padding: 20px 0;
    border-bottom: 1px solid #eee;
  }

  .promotion-content {
    padding: 40px 0;

    .promotion-header {
      text-align: center;
      margin-bottom: 40px;

      h1 {
        font-size: 36px;
        color: var(--primary-color);
        margin-bottom: 10px;
      }

      .subtitle {
        font-size: 18px;
        color: #666;
      }
    }

    .promotion-cards {
      display: flex;
      justify-content: center;
      margin-bottom: 40px;

      .promo-card {
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
        width: 100%;
        max-width: 400px;
        overflow: hidden;

        .card-header {
          background: var(--primary-color);
          color: #fff;
          padding: 20px;
          text-align: center;

          h3 {
            font-size: 24px;
            margin-bottom: 10px;
          }

          .price {
            font-size: 48px;
            font-weight: bold;
          }
        }

        .card-content {
          padding: 30px;

          .benefits {
            list-style: none;
            margin-bottom: 30px;

            li {
              display: flex;
              align-items: center;
              gap: 10px;
              margin-bottom: 15px;
              color: #666;

              .el-icon {
                color: var(--success-color);
              }
            }
          }

          .action-btn {
            width: 100%;
            height: 44px;
            font-size: 16px;
          }
        }
      }
    }

    .promotion-rules {
      max-width: 600px;
      margin: 0 auto;
      background: #fff;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

      h2 {
        font-size: 20px;
        color: #333;
        margin-bottom: 20px;
      }

      ul {
        list-style: none;

        li {
          margin-bottom: 10px;
          color: #666;
        }
      }
    }
  }
}

// 响应式布局
@media (max-width: 768px) {
  .sales-promotion {
    .promotion-content {
      padding: 20px 0;

      .promotion-header {
        h1 {
          font-size: 28px;
        }

        .subtitle {
          font-size: 16px;
        }
      }

      .promotion-cards {
        padding: 0 15px;
      }

      .promotion-rules {
        margin: 0 15px;
      }
    }
  }
}
</style> 