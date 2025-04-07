<template>
    <section class="process-display">
      <div class="container">
        <h2 class="section-title">工艺展示</h2>
        
        <!-- 工艺类型选项卡 -->
        <el-tabs v-model="activeTab" class="process-tabs">
          <el-tab-pane label="CNC加工" name="cnc">
            <div class="process-grid">
              <!-- 第一行 -->
              <div class="row first-row">
                <!-- 工艺介绍 -->
                <div class="intro-card">
                  <h3>车削</h3>
                  <p>即车床加工，车床加工主要用车刀对旋转的工件进行车削加工。在车床上还可用钻头、扩孔钻、铰刀、丝锥、板牙和滚花工具等进行相应的加工。车床主要用于加工轴、盘、套和其他具有回转表面的工件，是机械制造和修配工厂中使用最广的一类机床加工。</p>
                </div>
                <!-- 工艺图片 -->
                <div class="image-card">
                  <img src="@/assets/images/process1.png" alt="车削加工">
                </div>
              </div>
              
              <!-- 第二行 -->
              <div class="row second-row">
                <!-- 工艺图片 -->
                <div class="image-card large">
                  <img src="@/assets/images/process2.png" alt="铣削加工">
                </div>
                <!-- 工艺介绍 -->
                <div class="intro-card">
                  <h3>铣削</h3>
                  <p>铣削是以铣刀作为刀具加工物体表面的一种机械加工方法。铣床有卧式铣床，立式铣床，龙门铣床，仿形铣床，万能铣床，杠铣床。</p>
                </div>
              </div>
            </div>
          </el-tab-pane>
          
          <el-tab-pane label="钣金加工" name="sheet">
            <div class="process-grid">
              <!-- 第一行 -->
              <div class="row first-row">
                <!-- 工艺介绍 -->
                <div class="intro-card">
                  <h3>激光切割（Laser Cutting）</h3>
                  <p>是利用经聚焦的高功率密度激光束照射工件，使被照射的材料迅速熔化、汽化、烧蚀或达到燃点，同时借助与光束同轴的高速气流吹除熔融物质，从而实现将工件割开。激光切割属于热切割方法之一。</p>
                </div>
                <!-- 工艺图片 -->
                <div class="image-card">
                  <img src="@/assets/images/process3.png" alt="激光切割加工">
                </div>
              </div>
              
              <!-- 第二行 -->
              <div class="row second-row">
                <!-- 工艺图片 -->
                <div class="image-card large">
                  <img src="@/assets/images/process4.png" alt="折弯加工">
                </div>
                <!-- 工艺介绍 -->
                <div class="intro-card">
                  <h3>折弯（Bending）</h3>
                  <p>铣削是以铣刀作为刀具加工物体表面的一种机械加工方法。铣床有卧式铣床，立式铣床，龙门铣床，仿形铣床，万能铣床，杠铣床。</p>
                </div>
              </div>
            </div>
          </el-tab-pane>
          
          <el-tab-pane label="手板复模" name="prototype">
            <div class="process-grid">
              <!-- 第一行 -->
              <div class="row first-row">
                <!-- 工艺介绍 -->
                <div class="intro-card">
                  <h3>原型制作</h3>
                  <p>根据产品的设计图纸，一般通过3D打印或CNC加工等加工方式制作原型；而原型的表面效果决定了后面复制批量手板的表面效果，所以原型的尺寸要准确、结构要完整、表面要处理光滑。</p>
                </div>
                <!-- 工艺图片 -->
                <div class="image-card">
                  <img src="@/assets/images/process5.png" alt="原型制作加工">
                </div>
              </div>
              
              <!-- 第二行 -->
              <div class="row second-row">
                <!-- 工艺图片 -->
                <div class="image-card large">
                  <img src="@/assets/images/process6.png" alt="硅胶模具制作加工">
                </div>
                <!-- 工艺介绍 -->
                <div class="intro-card">
                  <h3>硅胶模具制作</h3>
                  <p>原型准备好后，开始制作硅胶模具。先固定好原型，然后在原型四周用模框围起来，倒注硅胶，凝固后形成硅胶模具，沿产品分模线割开模具，取出手板原型，剩下的空腔硅胶体就是模具。硅胶的硬度需根据产品结构、数量及精度要求做调整，一般来说产品的大小尺寸与所使用硅胶的硬度成正比。</p>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </section>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const activeTab = ref('cnc')
  </script>
  
  <style lang="scss" scoped>
  .process-display {
    padding: 60px 0;
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
      margin-bottom: 40px;
      font-weight: 500;
    }
  
    .process-tabs {
      :deep(.el-tabs__header) {
        margin-bottom: 30px;
        border-bottom: none;
      }
  
      :deep(.el-tabs__nav-wrap) {
        &::after {
          display: none;
        }
      }
  
      :deep(.el-tabs__nav) {
        border: none;
      }
  
      :deep(.el-tabs__item) {
        font-size: 16px;
        padding: 0 30px;
        height: 40px;
        line-height: 40px;
        border: none;
        color: #666;
  
        &.is-active {
          color: #409EFF;
          font-weight: 500;
        }
      }
    }
  
    .process-grid {
      .row {
        display: grid;
        gap: 20px;
        margin-bottom: 20px;
  
        &:last-child {
          margin-bottom: 0;
        }
  
        &.first-row {
          grid-template-columns: 2fr 3fr;
        }
  
        &.second-row {
          grid-template-columns: 3fr 2fr;
        }
      }
    }
  
    .intro-card {
      background: #f5f7fa;
      padding: 30px;
      border-radius: 8px;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
  
      h3 {
        font-size: 24px;
        color: #333;
        margin-bottom: 15px;
        font-weight: 500;
      }
  
      p {
        font-size: 14px;
        color: #666;
        line-height: 1.8;
        margin: 0;
      }
    }
  
    .image-card {
      border-radius: 8px;
      overflow: hidden;
      height: 100%;
  
      &.large {
        height: 300px;
      }
  
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
  
        // &:hover {
        //   transform: scale(1.05);
        // }
      }
    }
  
    @media (max-width: 768px) {
      padding: 40px 0;
  
      .process-grid {
        .row {
          grid-template-columns: 1fr !important;
        }
      }
  
      .image-card {
        height: 200px !important;
      }
    }
  }
  </style>