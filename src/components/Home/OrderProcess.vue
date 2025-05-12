<template>
  <section class="order-process">
    <div class="container">
      <h2 class="section-title">下单流程</h2>
      
      <div class="process-steps">
        <div class="step-item" 
             v-for="(step, index) in steps" 
             :key="index">
          <div class="step-icon">
            <img :src="step.icon">
          </div>
          <div class="step-content">
            <h3 class="step-title">{{ step.title }}</h3>
            <p class="step-desc">{{ step.description }}</p>
          </div>
          <!-- 虚线连接 -->
          <div class="step-line" v-if="index < steps.length - 1">
            <div class="dotted-line">
              <span v-for="n in 8" :key="n" class="dot"></span>
            </div>
          </div>
        </div>
      </div>

      <div class="action-button">
        <el-button type="primary" size="large" @click="handleQuote">立即报价</el-button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const currentStep = ref(0)
let timer

const steps = [
  {
    title: '上传您的设计文件',
    description: '第一步',
    icon: require('@/assets/images/order1.png')
  },
  {
    title: '选择工艺材料',
    description: '第二步',
    icon: require('@/assets/images/order2.png')
  },
  {
    title: '立刻获得报价和订单',
    description: '第三步',
    icon: require('@/assets/images/order3.png')
  },
  {
    title: '交给我们生产',
    description: '第四步',
    icon: require('@/assets/images/order4.png')
  },
  {
    title: '接收您的产品',
    description: '第五步',
    icon: require('@/assets/images/order5.png') 
  }
]

const handleQuote = () => {
  router.push('/quote')
}

const startAutoSwitch = () => {
  timer = setInterval(() => {
    currentStep.value = (currentStep.value + 1) % steps.length
  }, 3000)
}

onMounted(() => {
  startAutoSwitch()
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style lang="scss" scoped>
.order-process {
  padding: 80px 0;
  background:#f5f5f5;

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

  .process-steps {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 50px;
    position: relative;
  }

  .step-item {
    flex: 1;
    text-align: center;
    position: relative;

    .step-number {
      width: 24px;
      height: 24px;
      line-height: 24px;
      background: #409EFF;
      color: #fff;
      border-radius: 50%;
      font-size: 14px;
      position: absolute;
      top: -12px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 2;
    }

    .step-icon {
      width: 100px;
      height: 100px;
      margin: 0 auto 15px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      position: relative;
      z-index: 1;

      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }

    .step-content {
      padding: 0 15px;
    }

    .step-title {
      font-size: 16px;
      color: #333;
      margin-bottom: 8px;
      font-weight: 500;
    }

    .step-desc {
      font-size: 14px;
      color: #666;
      margin: 0;
    }

    .step-line {
      position: absolute;
      top: 30px;
      right: -50%;
      width: 100%;
      height: 2px;
      z-index: 0;

      .dotted-line {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .dot {
          width: 4px;
          height: 4px;
          background: #DCDFE6;
          border-radius: 50%;
        }
      }

      .active-line {
        position: absolute;
        top: 0;
        left: 0;
        width: 0;
        height: 2px;
        background: #409EFF;
        transition: width 0.3s ease;
      }
    }

    &.active {
      .step-icon {
        background: #409EFF;
        
        img {
          filter: brightness(0) invert(1);
        }
      }

      .step-line {
        .active-line {
          width: 100%;
        }
      }
    }
  }

  .action-button {
    text-align: center;

    .el-button {
      width: 180px;
      height: 48px;
      font-size: 1s6px;
    }
  }

  @media (max-width: 768px) {
    padding: 40px 0;

    .process-steps {
      flex-direction: column;
      gap: 30px;
    }

    .step-item {
      width: 100%;

      .step-line {
        display: none;
      }
    }
  }
}
</style>