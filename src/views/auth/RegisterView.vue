<template>
  <div class="register-view">
    <!-- 头部 -->
    <header class="register-header">
      <div class="header-content">
        <router-link to="/" class="logo">
          <img src="@/assets/images/logo.png" alt="SmartCNC">
        </router-link>
        <h1 class="header-title">用户注册</h1>
      </div>
    </header>

    <!-- 主要内容区 -->
    <main class="register-main">
      <div class="register-content">
        <!-- 根据当前步骤显示不同组件 -->
        <component 
          :is="currentComponent" 
          @next-step="handleNextStep"
          @prev-step="handlePrevStep"
        />
      </div>
    </main>

    <!-- 页脚 -->
    <footer class="register-footer">
      <div class="footer-content">
        <p>Copyright © {{ currentYear }} 厦门修蓁慧进技术有限公司 版权所有</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Register from '@/components/auth/Register.vue'
import BindPhone from '@/components/auth/BindPhone.vue'
import RegisterSuccess from '@/components/auth/RegisterSuccess.vue'

const route = useRoute()
const router = useRouter()

// 获取当前年份
const currentYear = new Date().getFullYear()

// 注册步骤组件映射
const stepComponents = {
  'scan': Register,
  'bind': BindPhone,
  'success': RegisterSuccess
}

// 计算当前应该显示的组件
const currentComponent = computed(() => {
  const step = route.params.step || 'scan'
  return stepComponents[step] || Register
})

// 处理下一步
const handleNextStep = (nextStep) => {
  router.push(`/register/${nextStep}`)
}

// 处理上一步
const handlePrevStep = (prevStep) => {
  router.push(`/register/${prevStep}`)
}

// 组件挂载时检查当前步骤是否有效
onMounted(() => {
  const currentStep = route.params.step || 'scan'
  if (!stepComponents[currentStep]) {
    router.replace('/register/scan')
  }
})
</script>

<style lang="scss" scoped>
.register-view {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;

  .register-header {
    background: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    
    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 16px 20px;
      display: flex;
      align-items: center;
      
      .logo {
        margin-right: 40px;
        
        img {
          height: 100%;
          object-fit: contain;
        }
      }
      
      .header-title {
        font-size: 20px;
        color: #303133;
        font-weight: 500;
      }
    }
  }

  .register-main {
    flex: 1;
    padding: 40px 20px;
    
    .register-content {
      max-width: 1200px;
      margin: 0 auto;
    }
  }

  .register-footer {
    background: #fff;
    border-top: 1px solid #ebeef5;
    
    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px 20px;
      text-align: center;
      color: #909399;
      font-size: 14px;
    }
  }
}

// 响应式布局
@media (max-width: 768px) {
  .register-view {
    .register-header {
      .header-content {
        padding: 12px 16px;
        
        .logo {
          height: 32px;
          margin-right: 20px;
        }
        
        .header-title {
          font-size: 18px;
        }
      }
    }

    .register-main {
      padding: 20px 16px;
    }

    .register-footer {
      .footer-content {
        padding: 16px;
      }
    }
  }
}
</style>
