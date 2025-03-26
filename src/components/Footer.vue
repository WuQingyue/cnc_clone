<template>
    <footer class="footer">
      <!-- 主要内容区 -->
      <div class="footer-main">
        <div class="container">
          <div class="footer-content">
            <!-- 公司信息 -->
            <div class="footer-section company-info">
              <!-- <img src="@/assets/images/logo_bottom.png" alt="嘉立诚数控" class="footer-logo"> -->
              <p class="company-desc">
                嘉立诚数控科技有限公司专注于精密零件加工制造，提供CNC加工、3D打印、钣金加工等一站式服务。
              </p>
              <div class="contact-info">
                <p><i class="el-icon-phone"></i> 服务热线：400-0755-519</p>
                <p><i class="el-icon-message"></i> 邮箱：info@jlc-cnc.com</p>
                <p><i class="el-icon-location"></i> 地址：深圳市宝安区福永街道凤凰工业园</p>
              </div>
            </div>
  
            <!-- 快速链接 -->
            <div class="footer-section quick-links">
              <h3>快速链接</h3>
              <ul>
                <li v-for="link in quickLinks" :key="link.path">
                  <router-link :to="link.path">{{ link.name }}</router-link>
                </li>
              </ul>
            </div>
  
            <!-- 产品服务 -->
            <div class="footer-section products">
              <h3>产品服务</h3>
              <ul>
                <li v-for="product in products" :key="product.path">
                  <router-link :to="product.path">{{ product.name }}</router-link>
                </li>
              </ul>
            </div>
  
            <!-- 联系我们 -->
            <div class="footer-section contact-us">
              <h3>联系我们</h3>
              <div class="qr-codes">
                <div class="qr-item">
                  <img src="@/assets/images/contact1.png" alt="微信公众号">
                  <span>微信公众号</span>
                </div>
                <div class="qr-item">
                  <img src="@/assets/images/contact1.png" alt="联系我们">
                  <span>联系我们</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- 底部版权信息 -->
      <div class="footer-bottom">
        <div class="container">
          <div class="copyright">
            <p>© {{ currentYear }} 嘉立诚数控科技有限公司 版权所有</p>
            <p>
              <a href="https://beian.miit.gov.cn/" target="_blank">粤ICP备XXXXXXXX号-1</a>
            </p>
          </div>
        </div>
      </div>
  
      <!-- 返回顶部按钮 -->
      <el-backtop :right="20" :bottom="20"></el-backtop>
    </footer>
  </template>
  
  <script>
  export default {
    name: 'Footer',
    data() {
      return {
        quickLinks: [
          { name: '首页', path: '/' },
          { name: '关于我们', path: '/about' },
          { name: '新闻资讯', path: '/news' },
          { name: '联系我们', path: '/contact' }
        ],
        products: [
          { name: 'CNC加工', path: '/products/cnc' },
          { name: '3D打印', path: '/products/3d-printing' },
          { name: '钣金加工', path: '/products/sheet-metal' },
          { name: '表面处理', path: '/products/surface-treatment' }
        ]
      }
    },
    computed: {
      currentYear() {
        return new Date().getFullYear()
      }
    }
  }
  </script>
  
  <style lang="scss" scoped>
  .footer {
    background-color: #1f2937;
    color: #fff;
  
    .footer-main {
      padding: 60px 0;
  
      .footer-content {
        display: grid;
        grid-template-columns: 2fr 1fr 1fr 1.5fr;
        gap: 40px;
        
        @include responsive(lg) {
          grid-template-columns: 1fr 1fr;
        }
        
        @include responsive(sm) {
          grid-template-columns: 1fr;
        }
      }
  
      .footer-section {
        h3 {
          font-size: 18px;
          margin-bottom: 20px;
          color: #fff;
          font-weight: 500;
        }
      }
  
      .company-info {
        .footer-logo {
          height: 40px;
          margin-bottom: 20px;
        }
  
        .company-desc {
          font-size: 14px;
          line-height: 1.6;
          color: #a8b2bc;
          margin-bottom: 20px;
        }
  
        .contact-info {
          p {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            font-size: 14px;
            color: #a8b2bc;
  
            i {
              margin-right: 10px;
              font-size: 16px;
            }
          }
        }
      }
  
      .quick-links,
      .products {
        ul {
          list-style: none;
          padding: 0;
          margin: 0;
  
          li {
            margin-bottom: 12px;
  
            a {
              color: #a8b2bc;
              text-decoration: none;
              font-size: 14px;
              transition: color 0.3s ease;
  
              &:hover {
                color: $primary-color;
              }
            }
          }
        }
      }
  
      .contact-us {
        .qr-codes {
          display: flex;
          gap: 20px;
          
          @include responsive(sm) {
            justify-content: center;
          }
  
          .qr-item {
            text-align: center;
            display: flex;          // 修改：使用flex布局
            flex-direction: column; // 修改：设置垂直方向排列
            
            img {
              width: 120px;
              height: 120px;
              margin-bottom: 8px;
              background: #fff;
              padding: 5px;
              border-radius: 4px;
            }
  
            span {
              font-size: 14px;
              color: #a8b2bc;
            }
          }
        }
      }
    }
  
    .footer-bottom {
      background-color: #243342;
      padding: 20px 0;
  
      .copyright {
        text-align: center;
        color: #a8b2bc;
        font-size: 14px;
  
        p {
          margin: 5px 0;
        }
  
        a {
          color: #a8b2bc;
          text-decoration: none;
          transition: color 0.3s ease;
  
          &:hover {
            color: $primary-color;
          }
        }
      }
    }
  }
  </style>