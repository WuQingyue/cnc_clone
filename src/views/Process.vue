<template>
    <div class="process">
      <!-- 页面标题 -->
      <div class="page-header">
        <div class="container">
          <h1 class="page-title">加工工艺</h1>
          <div class="breadcrumb">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item>加工工艺</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
        </div>
      </div>
  
      <!-- 工艺流程 -->
      <section class="process-flow">
        <div class="container">
          <h2 class="section-title">生产流程</h2>
          <p class="section-subtitle">专业的生产流程，保证产品品质</p>
          
          <el-timeline>
            <el-timeline-item
              v-for="(item, index) in processFlow"
              :key="index"
              :type="item.type"
              :color="item.color"
              :size="item.size"
              :icon="item.icon">
              <div class="timeline-content">
                <h3>{{ item.title }}</h3>
                <p>{{ item.description }}</p>
                <img v-if="item.image" :src="item.image" :alt="item.title">
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>
      </section>
  
      <!-- 加工能力 -->
      <section class="process-capability">
        <div class="container">
          <h2 class="section-title">加工能力</h2>
          <p class="section-subtitle">先进的设备，精湛的工艺</p>
  
          <div class="capability-grid">
            <div v-for="(item, index) in capabilities" 
                 :key="index" 
                 class="capability-item">
              <div class="capability-icon">
                <i :class="item.icon"></i>
              </div>
              <h3>{{ item.title }}</h3>
              <p>{{ item.description }}</p>
              <ul class="capability-details">
                <li v-for="(detail, dIndex) in item.details" 
                    :key="dIndex">
                  {{ detail }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
  
      <!-- 设备展示 -->
      <section class="equipment-showcase">
        <div class="container">
          <h2 class="section-title">设备展示</h2>
          <p class="section-subtitle">先进的加工设备</p>
  
          <el-carousel :interval="4000" type="card">
            <el-carousel-item v-for="(item, index) in equipment" :key="index">
              <div class="equipment-item">
                <img :src="item.image" :alt="item.name">
                <div class="equipment-info">
                  <h3>{{ item.name }}</h3>
                  <p>{{ item.description }}</p>
                </div>
              </div>
            </el-carousel-item>
          </el-carousel>
        </div>
      </section>
  
      <!-- 质量保证 -->
      <section class="quality-assurance">
        <div class="container">
          <h2 class="section-title">质量保证</h2>
          <p class="section-subtitle">严格的质量管理体系</p>
  
          <div class="quality-grid">
            <div v-for="(item, index) in qualityStandards" 
                 :key="index" 
                 class="quality-item">
              <el-card>
                <div class="quality-icon">
                  <i :class="item.icon"></i>
                </div>
                <h3>{{ item.title }}</h3>
                <p>{{ item.description }}</p>
              </el-card>
            </div>
          </div>
        </div>
      </section>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Process',
    data() {
      return {
        processFlow: [
          {
            title: '接收订单',
            description: '详细了解客户需求，确认产品规格和技术要求',
            type: 'primary',
            color: '#409EFF',
            size: 'large',
            icon: 'el-icon-document',
            image: 'E:\model\api\CNC\jlc-cnc-clone\src\assets\images\about-banner.png'
          },
          {
            title: '工艺设计',
            description: '专业工程师团队制定最优加工方案',
            type: 'success',
            color: '#67C23A',
            size: 'large',
            icon: 'el-icon-edit',
            image: 'E:\model\api\CNC\jlc-cnc-clone\src\assets\images\about-banner.png'
          },
          {
            title: 'CNC加工',
            description: '使用先进的CNC设备进行精密加工',
            type: 'warning',
            color: '#E6A23C',
            size: 'large',
            icon: 'el-icon-setting',
            image: 'E:\model\api\CNC\jlc-cnc-clone\src\assets\images\about-banner.png'
          },
          {
            title: '品质检验',
            description: '严格的质量控制和检测流程',
            type: 'info',
            color: '#909399',
            size: 'large',
            icon: 'el-icon-aim',
            image: 'E:\model\api\CNC\jlc-cnc-clone\src\assets\images\about-banner.png'
          }
        ],
        capabilities: [
          {
            icon: 'el-icon-cpu',
            title: 'CNC铣削',
            description: '高精度CNC铣削加工服务',
            details: [
              '最大加工尺寸: 800*600*500mm',
              '精度: ±0.01mm',
              '表面粗糙度: Ra0.8'
            ]
          },
          {
            icon: 'el-icon-refresh-right',
            title: 'CNC车削',
            description: '精密CNC车削加工服务',
            details: [
              '最大加工直径: Φ300mm',
              '最大加工长度: 1000mm',
              '精度: ±0.005mm'
            ]
          }
        ],
        equipment: [
          {
            name: '日本发那科CNC加工中心',
            description: '5轴联动，高精度加工',
            image: 'E:\model\api\CNC\jlc-cnc-clone\src\assets\images\about-banner.png'
          },
          {
            name: '德国DMG数控车床',
            description: '精密车削加工设备',
            image: 'E:\model\api\CNC\jlc-cnc-clone\src\assets\images\about-banner.png'
          },
          {
            name: '瑞士三坐标测量仪',
            description: '高精度检测设备',
            image: 'E:\model\api\CNC\jlc-cnc-clone\src\assets\images\about-banner.png'
          }
        ],
        qualityStandards: [
          {
            icon: 'el-icon-check',
            title: 'ISO9001认证',
            description: '国际质量管理体系认证'
          },
          {
            icon: 'el-icon-medal',
            title: '专业检测',
            description: '先进的检测设备和完善的检测流程'
          },
          {
            icon: 'el-icon-circle-check',
            title: '质量追溯',
            description: '完整的质量追溯体系'
          },
          {
            icon: 'el-icon-trophy',
            title: '品质保证',
            description: '严格的品质保证体系'
          }
        ]
      }
    }
  }
  </script>
  
  <style lang="scss" scoped>
  .process {
    .page-header {
      margin-top: 60px;
      background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), 
                  url('E:\model\api\CNC\jlc-cnc-clone\src\assets\images\about-banner.png') center/cover;
      padding: 60px 0;
      color: white;
    }
  
    section {
      padding: 80px 0;
  
      &:nth-child(even) {
        background: var(--bg-color-light);
      }
    }
  
    .section-title {
      text-align: center;
      font-size: 32px;
      margin-bottom: 15px;
      color: var(--text-color);
    }
  
    .section-subtitle {
      text-align: center;
      font-size: 16px;
      color: var(--text-color-secondary);
      margin-bottom: 40px;
    }
  
    .timeline-content {
      h3 {
        font-size: 20px;
        color: var(--text-color);
        margin-bottom: 10px;
      }
  
      p {
        color: var(--text-color-secondary);
        margin-bottom: 15px;
      }
  
      img {
        width: 100%;
        max-width: 400px;
        border-radius: 8px;
        box-shadow: 0 2px 12px rgba(0,0,0,0.1);
      }
    }
  
    .capability-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 30px;
      margin-top: 40px;
  
      .capability-item {
        text-align: center;
        padding: 30px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 12px rgba(0,0,0,0.1);
        transition: transform 0.3s ease;
  
        &:hover {
          transform: translateY(-5px);
        }
  
        .capability-icon {
          font-size: 48px;
          color: var(--primary-color);
          margin-bottom: 20px;
        }
  
        h3 {
          font-size: 20px;
          color: var(--text-color);
          margin-bottom: 15px;
        }
  
        p {
          color: var(--text-color-secondary);
          margin-bottom: 20px;
        }
  
        .capability-details {
          text-align: left;
          list-style: none;
          padding: 0;
  
          li {
            color: var(--text-color);
            margin-bottom: 10px;
            padding-left: 20px;
            position: relative;
  
            &::before {
              content: '';
              position: absolute;
              left: 0;
              top: 8px;
              width: 6px;
              height: 6px;
              border-radius: 50%;
              background: var(--primary-color);
            }
          }
        }
      }
    }
  
    .equipment-showcase {
      .equipment-item {
        position: relative;
        height: 400px;
        border-radius: 8px;
        overflow: hidden;
  
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
  
        .equipment-info {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 20px;
          background: rgba(0,0,0,0.7);
          color: white;
  
          h3 {
            font-size: 20px;
            margin-bottom: 10px;
          }
  
          p {
            font-size: 14px;
            opacity: 0.8;
          }
        }
      }
    }
  
    .quality-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 30px;
  
      .quality-item {
        text-align: center;
  
        .quality-icon {
          font-size: 48px;
          color: var(--primary-color);
          margin-bottom: 20px;
        }
  
        h3 {
          font-size: 20px;
          color: var(--text-color);
          margin-bottom: 15px;
        }
  
        p {
          color: var(--text-color-secondary);
        }
      }
    }
  }
  
  @media (max-width: 768px) {
    .process {
      section {
        padding: 40px 0;
      }
  
      .equipment-showcase {
        .equipment-item {
          height: 300px;
        }
      }
    }
  }
  </style>