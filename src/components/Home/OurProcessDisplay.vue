<template>
  <section class="process-display">
    <div class="container">
      <h2 class="section-title">我们的生产工艺</h2>
      
      <div class="process-grid">
        <!-- CNC加工 -->
        <div class="process-card">
          <div class="process-image">
            <img src="@/assets/images/process1.png" alt="CNC加工">
          </div>
          <div class="process-info">
            <h3>CNC加工</h3>
            <p>铣削(3轴、4轴、5轴)、车削(数车、车铣复合)及表面处理</p>
            <el-button type="primary" @click="handleQuote">立即报价</el-button>
          </div>
        </div>

        <!-- 钣金加工 -->
        <div class="process-card">
          <div class="process-image">
            <img src="@/assets/images/process2.jpg" alt="钣金加工">
          </div>
          <div class="process-info">
            <h3>钣金加工</h3>
            <p>支持激光切割、钣金折弯、压铆焊接</p>
            <el-button type="primary" @click="handleQuote">立即报价</el-button>
          </div>
        </div>

        <!-- 手板复模 -->
        <div class="process-card">
          <div class="process-image">
            <img src="@/assets/images/process3.png" alt="手板复模">
          </div>
          <div class="process-info">
            <h3>手板复模</h3>
            <p>手板快速打样，支持喷漆、丝印等表面处理</p>
            <el-button type="primary" @click="handleQuote">立即报价</el-button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const handleQuote = () => {
  router.push('/quote')
}
</script>

<style lang="scss" scoped>
.process-display {
  padding: 80px 0;
  background: #fff;

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 15px;
  }

  .section-title {
    font-size: 32px;
    color: #333;
    text-align: center;
    margin-bottom: 60px;
    font-weight: 500;
  }

  .process-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 30px;
  }

  .process-card {
    background: #fff;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;

    &:hover {
      transform: translateY(-5px);
    }

    .process-image {
      height: 240px;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
      }

      &:hover img {
        transform: scale(1.05);
      }
    }

    .process-info {
      padding: 24px;
      text-align: center;

      .process-logo {
        margin-bottom: 16px;

        img {
          height: 24px;
        }
      }

      h3 {
        font-size: 24px;
        color: #333;
        margin-bottom: 12px;
        font-weight: 500;
      }

      p {
        font-size: 14px;
        color: #666;
        line-height: 1.6;
        margin-bottom: 20px;
        min-height: 44px;
      }

      .el-button {
        width: 140px;
        height: 40px;
        font-size: 16px;
      }
    }
  }

  @media (max-width: 1200px) {
    .process-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 768px) {
    padding: 40px 0;

    .process-grid {
      grid-template-columns: 1fr;
    }

    .process-card {
      .process-image {
        height: 200px;
      }
    }
  }
}
</style>