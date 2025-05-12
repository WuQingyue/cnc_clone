<template>
    <div class="contact">
      <!-- 页面标题 -->
      <div class="page-header">
        <div class="container">
          <!-- <h1 class="page-title">联系我们</h1> -->
          <div class="breadcrumb">
            <el-breadcrumb separator="/">
              <!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item>联系我们</el-breadcrumb-item> -->
            </el-breadcrumb>
          </div>
        </div>
      </div>
  
      <!-- 联系信息 -->
      <section class="contact-section">
        <div class="container">
          <!-- 业务联系方式 -->
          <div class="business-contact">
            <h2 class="section-title">业务联系方式</h2>
            
            <!-- 业务咨询部分 -->
            <div class="contact-row consultation">
              <div class="contact-card">
                <div class="card-content">
                  <div class="info-section">
                    <h3>CNC业务咨询</h3>
                    <p class="contact-person">
                      <el-icon><User /></el-icon>
                      彭小姐
                    </p>
                    <p class="contact-phone">
                      <el-icon><Phone /></el-icon>
                      16620918532
                    </p>
                  </div>
                  <div class="qr-section">
                    <div class="qr-wrapper">
                      <img src="@/assets/images/contact1.png" alt="CNC业务咨询二维码">
                      <p class="qr-text">一对一专属服务</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="contact-card">
                <div class="card-content">
                  <div class="info-section">
                    <h3>钣金业务咨询</h3>
                    <p class="contact-person">
                      <el-icon><User /></el-icon>
                      罗小姐
                    </p>
                    <p class="contact-phone">
                      <el-icon><Phone /></el-icon>
                      18576608583
                    </p>
                  </div>
                  <div class="qr-section">
                    <div class="qr-wrapper">
                      <img src="@/assets/images/contact1.png" alt="CNC业务咨询二维码">
                      <p class="qr-text">一对一专属服务</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="contact-card">
                <div class="card-content">
                  <div class="info-section">
                    <h3>手板复模业务咨询</h3>
                    <p class="contact-person">
                      <el-icon><User /></el-icon>
                      张先生
                    </p>
                    <p class="contact-phone">
                      <el-icon><Phone /></el-icon>
                      18529519029
                    </p>
                  </div>
                  <div class="qr-section">
                    <div class="qr-wrapper">
                      <img src="@/assets/images/contact1.png" alt="CNC业务咨询二维码">
                      <p class="qr-text">一对一专属服务</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 投诉部分 -->
            <div class="contact-row complaints">
              <div class="complaint-card">
                <h3>CNC投诉</h3>
                <p class="contact-info">
                  <span class="person">
                    <el-icon><User /></el-icon>
                    许先生
                  </span>
                  <span class="phone">
                    <el-icon><Phone /></el-icon>
                    13926536806
                  </span>
                </p>
              </div>

              <div class="complaint-card">
                <h3>钣金投诉</h3>
                <p class="contact-info">
                  <span class="person">
                    <el-icon><User /></el-icon>
                    罗先生
                  </span>
                  <span class="phone">
                    <el-icon><Phone /></el-icon>
                    18600023234
                  </span>
                </p>
              </div>

              <div class="complaint-card">
                <h3>手板复模投诉</h3>
                <p class="contact-info">
                  <span class="person">
                    <el-icon><User /></el-icon>
                    许先生
                  </span>
                  <span class="phone">
                    <el-icon><Phone /></el-icon>
                    13926536806
                  </span>
                </p>
              </div>
            </div>
          </div>
  
          <!-- 公司总部信息 -->
          <div class="company-headquarters">
            <h2 class="section-title">公司总部</h2>
            <el-tabs v-model="activeLocation" class="location-tabs">
              <el-tab-pane label="SmartCNC 总部" name="shenzhen">
                <div class="location-info">
                  <div class="map-container">
                    <img src="@/assets/images/map1.png" alt="地图背景" class="map-bg">
                    <div class="location-marker">
                      <img src="@/assets/images/map2.png" alt="位置标记" class="marker-icon">
                      <div class="company-info">
                        <h3>SmartCNC 总部</h3>
                        <p>深圳市福田区莲花街道景华社区商报路2号奥林匹克大厦27层</p>
                      </div>
                    </div>
                  </div>
                </div>
              </el-tab-pane>
              
              <el-tab-pane label="广东珠海基地" name="zhuhai">
                <div class="location-info">
                  <div class="map-container">
                    <img src="@/assets/images/map1.png" alt="地图背景" class="map-bg">
                    <div class="location-marker">
                      <img src="@/assets/images/map2.png" alt="位置标记" class="marker-icon">
                      <div class="company-info">
                        <h3>广东珠海基地</h3>
                        <p>广东省珠海市斗门区珠峰大道</p>
                      </div>
                    </div>
                  </div>
                </div>
              </el-tab-pane>
              
              <el-tab-pane label="广东韶关基地" name="shaoguan">
                <div class="location-info">
                  <div class="map-container">
                    <img src="@/assets/images/map1.png" alt="地图背景" class="map-bg">
                    <div class="location-marker">
                      <img src="@/assets/images/map2.png" alt="位置标记" class="marker-icon">
                      <div class="company-info">
                        <h3>福建厦门基地</h3>
                        <p>福建省厦门市集美区软件园三期f20三楼SmartCNC</p>
                      </div>
                    </div>
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
  
        </div>
      </section>
    </div>
  </template>
  
  <script>
  import { User, Phone } from '@element-plus/icons-vue'

  export default {
    name: 'Contact',
    data() {
      return {
        formData: {
          name: '',
          phone: '',
          email: '',
          subject: '',
          message: ''
        },
        formRules: {
          name: [
            { required: true, message: '请输入姓名', trigger: 'blur' },
            { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
          ],
          phone: [
            { required: true, message: '请输入联系电话', trigger: 'blur' },
            { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
          ],
          email: [
            { required: true, message: '请输入邮箱地址', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
          ],
          subject: [
            { required: true, message: '请输入咨询主题', trigger: 'blur' },
            { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
          ],
          message: [
            { required: true, message: '请输入咨询内容', trigger: 'blur' },
            { min: 10, max: 500, message: '长度在 10 到 500 个字符', trigger: 'blur' }
          ]
        },
        submitting: false,
        map: null,
        activeLocation: 'shenzhen'
      }
    },
    methods: {
      async submitForm() {
        try {
          await this.$refs.contactForm.validate()
          this.submitting = true
          
          // 这里应该是实际的API调用
          // const response = await this.$api.submitContact(this.formData)
          
          this.$message.success('提交成功，我们会尽快与您联系')
          this.$refs.contactForm.resetFields()
        } catch (error) {
          if (error === false) {
            this.$message.error('请完善表单信息')
          } else {
            console.error('提交表单失败:', error)
            this.$message.error('提交失败，请稍后重试')
          }
        } finally {
          this.submitting = false
        }
      },
      initMap() {
        // 这里应该是实际的地图初始化代码
        // 例如使用高德地图或百度地图的API
      }
    },
    mounted() {
      this.initMap()
    }
  }
  </script>
  
  <style lang="scss" scoped>
  // 添加变量定义
  $border-radius: 4px;
  $border-radius-lg: 8px;
  $text-color: #333;
  $text-color-secondary: #666;
  $primary-color: #409EFF;
  $box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  $bg-color-light: #f5f7fa;

  .contact {
    .page-header {
      background: url('@/assets/images/contact2.jpg') center/cover;
      padding: 80px 0;
      color: white;
      margin-top: 80px;
  
      .page-title {
        font-size: 36px;
        margin-bottom: 20px;
      }
    }
  
    .contact-section {
      padding: 60px 0;
      background: $bg-color-light;
  
      .business-contact {
        margin-bottom: 60px;
  
        .section-title {
          font-size: 24px;
          margin-bottom: 30px;
          text-align: center;
        }
  
        .contact-row {
          display: grid;
          gap: 20px;
          margin-bottom: 30px;
  
          &.consultation {
            grid-template-columns: repeat(3, 1fr);
            
            .contact-card {
              background: white;
              border-radius: 8px;
              box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
              padding: 20px;
  
              .card-content {
                display: flex;
                gap: 20px;
  
                .info-section {
                  flex: 1;
  
                  h3 {
                    font-size: 18px;
                    color: #333;
                    margin-bottom: 15px;
                  }
  
                  p {
                    display: flex;
                    align-items: center;
                    margin-bottom: 10px;
                    color: #666;
                    font-size: 14px;
  
                    i {
                      margin-right: 8px;
                      font-size: 16px;
                      color: #409EFF;
                    }
                  }
                }
  
                .qr-section {
                  text-align: center;
                  display: flex;
                  align-items: center;
  
                  .qr-wrapper {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
  
                    img {
                      width: 100px;
                      height: 100px;
                      margin-bottom: 8px;
                      padding: 5px;
                      background: #fff;
                      border-radius: 4px;
                      border: 1px solid #eee;
                    }
  
                    .qr-text {
                      font-size: 12px;
                      color: #999;
                      white-space: nowrap;
                    }
                  }
                }
              }
            }
          }
  
          &.complaints {
            grid-template-columns: repeat(3, 1fr);
            
            .complaint-card {
              background: white;
              border-radius: 8px;
              box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
              padding: 15px 20px;
  
              h3 {
                font-size: 16px;
                color: #333;
                margin-bottom: 10px;
              }
  
              .contact-info {
                display: flex;
                gap: 20px;
                color: #666;
                font-size: 14px;
  
                .person, .phone {
                  display: flex;
                  align-items: center;
  
                  i {
                    margin-right: 8px;
                    font-size: 16px;
                    color: #409EFF;
                  }
                }
              }
            }
          }
        }
      }
  
      .company-headquarters {
        margin-bottom: 60px;
  
        .section-title {
          font-size: 24px;
          margin-bottom: 30px;
          text-align: center;
          color: #333;
        }
  
        .location-tabs {
          background: white;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  
          .location-info {
            .map-container {
              position: relative;
              width: 100%;
              height: 400px;
              border-radius: 4px;
              overflow: hidden;
  
              .map-bg {
                width: 100%;
                height: 100%;
                object-fit: cover;
              }
  
              .location-marker {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -100%);
                display: flex;
                flex-direction: column;
                align-items: center;
  
                .marker-icon {
                  width: 32px;
                  height: 32px;
                  margin-bottom: 8px;
                }
  
                .company-info {
                  background: rgba(255, 255, 255, 0.9);
                  padding: 12px 16px;
                  border-radius: 4px;
                  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                  text-align: center;
                  min-width: 200px;
  
                  h3 {
                    font-size: 16px;
                    font-weight: 500;
                    color: #333;
                    margin-bottom: 8px;
                  }
  
                  p {
                    font-size: 14px;
                    color: #666;
                    line-height: 1.5;
                  }
                }
              }
            }
          }
        }
      }
  
      .contact-main {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 40px;
        margin-bottom: 60px;
        
        @include responsive(lg) {
          grid-template-columns: 1fr;
        }
  
        h2 {
          font-size: 24px;
          margin-bottom: 20px;
          color: $text-color;
        }
  
        .contact-form {
          background: white;
          padding: 30px;
          border-radius: $border-radius-lg;
          box-shadow: $box-shadow;
  
          .form-desc {
            font-size: 14px;
            color: $text-color-secondary;
            margin-bottom: 30px;
          }
        }
  
        .contact-map {
          .map-container {
            height: 400px;
            border-radius: $border-radius-lg;
            overflow: hidden;
            box-shadow: $box-shadow;
          }
        }
      }
  
      .qr-codes {
        display: flex;
        justify-content: center;
        gap: 60px;
        
        @include responsive(sm) {
          flex-direction: column;
          align-items: center;
          gap: 30px;
        }
  
        .qr-item {
          text-align: center;
  
          img {
            width: 160px;
            height: 160px;
            padding: 10px;
            background: white;
            border-radius: $border-radius-lg;
            box-shadow: $box-shadow;
            margin-bottom: 15px;
          }
  
          p {
            font-size: 14px;
            color: $text-color;
          }
        }
      }
    }
  }

  // 响应式布局
  @media (max-width: 992px) {
    .contact-section .business-contact .contact-row {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 768px) {
    .contact-section .business-contact .contact-row {
      grid-template-columns: 1fr;

      &.complaints .complaint-card .contact-info {
        flex-direction: column;
        gap: 10px;
      }
    }

    .location-tabs {
      padding: 15px;

      .location-info .map-container {
        height: 300px;

        .location-marker .company-info {
          min-width: 160px;
          
          h3 {
            font-size: 14px;
          }

          p {
            font-size: 12px;
          }
        }
      }
    }
  }
  </style>