<template>
    <div class="not-found">
      <div class="container">
        <div class="error-content">
          <div class="error-image">
            <img src="E:\model\api\CNC\jlc-cnc-clone\src\assets\images\about-banner.png" alt="404">
          </div>
          <h1 class="error-code">404</h1>
          <h2 class="error-title">页面未找到</h2>
          <p class="error-desc">抱歉，您访问的页面不存在或已被移除</p>
          <div class="error-actions">
            <el-button type="primary" size="large" @click="goHome">
              <el-icon><House /></el-icon>
              返回首页
            </el-button>
            <el-button size="large" @click="goBack">
              <el-icon><Back /></el-icon>
              返回上一页
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router'
  import { House, Back } from '@element-plus/icons-vue'
  
  const router = useRouter()
  
  const goHome = () => {
    router.push('/')
  }
  
  const goBack = () => {
    router.back()
  }
  </script>
  
  <style lang="scss" scoped>
  .not-found {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-color-light);
    padding: 20px;
  
    .container {
      max-width: 600px;
      width: 100%;
    }
  
    .error-content {
      text-align: center;
      padding: 40px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  
      .error-image {
        max-width: 300px;
        margin: 0 auto 30px;
  
        img {
          width: 100%;
          height: auto;
        }
      }
  
      .error-code {
        font-size: 120px;
        color: var(--primary-color);
        margin: 0 0 20px;
        line-height: 1;
        font-weight: bold;
      }
  
      .error-title {
        font-size: 32px;
        color: var(--text-color);
        margin: 0 0 15px;
      }
  
      .error-desc {
        font-size: 16px;
        color: var(--text-color-secondary);
        margin: 0 0 30px;
      }
  
      .error-actions {
        display: flex;
        justify-content: center;
        gap: 20px;
  
        .el-button {
          min-width: 140px;
  
          .el-icon {
            margin-right: 8px;
          }
        }
  
        @media (max-width: 576px) {
          flex-direction: column;
          align-items: center;
  
          .el-button {
            width: 100%;
          }
        }
      }
    }
  }
  </style>