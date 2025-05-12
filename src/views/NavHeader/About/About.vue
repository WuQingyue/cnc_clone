<template>
    <div class="about">
      <!-- 页面标题 -->
      <div class="page-header">
        <div class="container">
          <h1 class="page-title">关于我们</h1>
          <div class="breadcrumb">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item>关于我们</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
        </div>
      </div>
  
      <!-- 公司简介 -->
      <section class="company-intro">
        <div class="container">
          <div class="intro-content">
            <div class="intro-text">
              <h2>SmartCNC简介</h2>
              <p>SmartCNC 致力于为客户提供高质量的加工服务。</p>
              <p>经过多年发展，公司已形成完整的加工产业链，可提供CNC加工、3D打印、钣金加工等全方位服务。我们的产品广泛应用于航空航天、医疗器械、汽车配件等多个领域。</p>
              <div class="company-data">
                <div class="data-item">
                  <h3>14年</h3>
                  <p>行业经验</p>
                </div>
                <div class="data-item">
                  <h3>200+</h3>
                  <p>专业设备</p>
                </div>
                <div class="data-item">
                  <h3>1000+</h3>
                  <p>合作客户</p>
                </div>
                <div class="data-item">
                  <h3>50000+</h3>
                  <p>成功案例</p>
                </div>
              </div>
            </div>
            <div class="intro-image">
              <img src="@/assets/images/map1.png" alt="公司简介">
            </div>
          </div>
        </div>
      </section>
  
      <!-- 发展历程 -->
      <section class="company-history">
        <div class="container">
          <h2 class="section-title">发展历程</h2>
          <el-timeline>
            <el-timeline-item
              v-for="(history, index) in historyList"
              :key="index"
              :timestamp="history.year"
              placement="top"
              :color="history.color"
            >
              <h3>{{ history.title }}</h3>
              <p>{{ history.content }}</p>
            </el-timeline-item>
          </el-timeline>
        </div>
      </section>
  
      <!-- 企业文化 -->
      <section class="company-culture">
        <div class="container">
          <h2 class="section-title">企业文化</h2>
          <div class="culture-grid">
            <div class="culture-item" v-for="item in cultureList" :key="item.title">
              <div class="culture-icon">
                <i :class="item.icon"></i>
              </div>
              <h3>{{ item.title }}</h3>
              <p>{{ item.content }}</p>
            </div>
          </div>
        </div>
      </section>
  
      <!-- 资质认证 -->
      <section class="certifications">
        <div class="container">
          <h2 class="section-title">资质认证</h2>
          <div class="cert-grid">
            <div class="cert-item" v-for="cert in certList" :key="cert.id">
              <img :src="cert.image" :alt="cert.name">
              <h4>{{ cert.name }}</h4>
            </div>
          </div>
        </div>
      </section>
    </div>
  </template>
  
  <script>
  export default {
    name: 'About',
    data() {
      return {
        historyList: [
          {
            year: '2010',
            title: '公司成立',
            content: 'SmartCNC 正式成立',
            color: '#0bbd87'
          },
          {
            year: '2015',
            title: '获得高新技术企业认证',
            content: '公司技术创新能力得到认可',
            color: '#1890ff'
          },
          {
            year: '2018',
            title: '建立新厂区',
            content: '新建现代化厂房，引进先进设备',
            color: '#ff4949'
          },
          {
            year: '2024',
            title: '数字化转型',
            content: '实现智能制造升级，提高生产效率',
            color: '#e6a23c'
          }
        ],
        cultureList: [
          {
            icon: 'el-icon-aim',
            title: '企业愿景',
            content: '成为行业领先的精密制造服务商'
          },
          {
            icon: 'el-icon-trophy',
            title: '企业使命',
            content: '为客户创造价值，推动行业进步'
          },
          {
            icon: 'el-icon-medal',
            title: '核心价值观',
            content: '诚信、创新、专业、共赢'
          },
          {
            icon: 'el-icon-success',
            title: '质量方针',
            content: '精益求精，追求卓越'
          }
        ],
        certList: [
          {
            id: 1,
            name: 'ISO9001质量管理体系认证',
            image: require('@/assets/images/cert1.png')
          },
          {
            id: 2,
            name: 'ISO14001环境管理体系认证',
            image: require('@/assets/images/cert2.png')
          },
          {
            id: 3,
            name: 'AS9100航空航天质量体系认证',
            image: require('@/assets/images/cert3.png')
          },
          {
            id: 4,
            name: '高新技术企业证书',
            image: require('@/assets/images/cert4.png')
          }
        ]
      }
    }
  }
  </script>
  
  <style lang="scss" scoped>
  .about {
    .page-header {
      background: #097df1;
      padding: 80px 0;
      color: white;
      margin-top: 80px;
  
      .page-title {
        font-size: 36px;
        margin-bottom: 20px;
      }
    }
  
    .section-title {
      text-align: center;
      font-size: 32px;
      margin-bottom: 40px;
      color: $text-color;
    }
  
    .company-intro {
      padding: 80px 0;
      background: white;
  
      .intro-content {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 60px;
        align-items: center;
        
        @include responsive(lg) {
          grid-template-columns: 1fr;
        }
  
        .intro-text {
          h2 {
            font-size: 32px;
            margin-bottom: 30px;
            color: $text-color;
          }
  
          p {
            font-size: 16px;
            line-height: 1.8;
            color: $text-color-secondary;
            margin-bottom: 20px;
          }
  
          .company-data {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
            margin-top: 40px;
            
            @include responsive(sm) {
              grid-template-columns: repeat(2, 1fr);
            }
  
            .data-item {
              text-align: center;
  
              h3 {
                font-size: 36px;
                color: $primary-color;
                margin-bottom: 10px;
              }
  
              p {
                font-size: 14px;
                color: $text-color-secondary;
                margin: 0;
              }
            }
          }
        }
  
        .intro-image {
          img {
            width: 100%;
            border-radius: $border-radius-lg;
            box-shadow: $box-shadow-lg;
          }
        }
      }
    }
  
    .company-history {
      padding: 80px 0;
      background: $bg-color-light;
  
      :deep(.el-timeline) {
        padding: 0;
        max-width: 800px;
        margin: 0 auto;
      }
    }
  
    .company-culture {
      padding: 80px 0;
      background: white;
  
      .culture-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 30px;
        
        @include responsive(lg) {
          grid-template-columns: repeat(2, 1fr);
        }
        
        @include responsive(sm) {
          grid-template-columns: 1fr;
        }
  
        .culture-item {
          text-align: center;
          padding: 40px 20px;
          background: $bg-color-light;
          border-radius: $border-radius-lg;
          transition: all 0.3s ease;
  
          &:hover {
            transform: translateY(-10px);
            box-shadow: $box-shadow;
          }
  
          .culture-icon {
            font-size: 48px;
            color: $primary-color;
            margin-bottom: 20px;
          }
  
          h3 {
            font-size: 20px;
            color: $text-color;
            margin-bottom: 15px;
          }
  
          p {
            font-size: 14px;
            color: $text-color-secondary;
            line-height: 1.6;
          }
        }
      }
    }
  
    .certifications {
      padding: 80px 0;
      background: $bg-color-light;
  
      .cert-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 30px;
        
        @include responsive(lg) {
          grid-template-columns: repeat(2, 1fr);
        }
        
        @include responsive(sm) {
          grid-template-columns: 1fr;
        }
  
        .cert-item {
          text-align: center;
          background: white;
          padding: 20px;
          border-radius: $border-radius-lg;
          box-shadow: $box-shadow;
          transition: all 0.3s ease;
  
          &:hover {
            transform: translateY(-5px);
            box-shadow: $box-shadow-lg;
          }
  
          img {
            width: 100%;
            max-width: 200px;
            margin-bottom: 15px;
          }
  
          h4 {
            font-size: 16px;
            color: $text-color;
          }
        }
      }
    }
  }
  </style>