<template>
    <div class="products">
      <!-- 页面标题 -->
      <div class="page-header">
        <div class="container">
          <h1 class="page-title">产品中心</h1>
          <div class="breadcrumb">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item>产品中心</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
        </div>
      </div>
  
      <!-- 产品分类和列表 -->
      <section class="products-section">
        <div class="container">
          <div class="products-container">
            <!-- 左侧分类菜单 -->
            <div class="category-menu">
              <h3 class="menu-title">产品分类</h3>
              <ul class="category-list">
                <li v-for="category in categories" 
                    :key="category.id"
                    :class="{ active: currentCategory === category.id }"
                    @click="handleCategoryChange(category.id)">
                  <i :class="category.icon"></i>
                  {{ category.name }}
                  <span class="count">({{ category.count }})</span>
                </li>
              </ul>
  
              <!-- 联系信息 -->
              <div class="contact-card">
                <h3>需要帮助？</h3>
                <p>我们的客服团队随时为您服务</p>
                <div class="contact-info">
                  <p><i class="el-icon-phone"></i> 400-0755-519</p>
                  <p><i class="el-icon-message"></i> info@jlc-cnc.com</p>
                </div>
                <el-button type="primary" @click="handleContact">
                  立即咨询
                </el-button>
              </div>
            </div>
  
            <!-- 右侧产品列表 -->
            <div class="products-content">
              <!-- 筛选工具栏 -->
              <div class="filter-toolbar">
                <div class="search-box">
                  <el-input
                    v-model="searchKeyword"
                    placeholder="搜索产品"
                    prefix-icon="el-icon-search"
                    clearable
                    @input="handleSearch"
                  />
                </div>
                <div class="sort-options">
                  <el-select v-model="sortOption" placeholder="排序方式">
                    <el-option
                      v-for="item in sortOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </div>
              </div>
  
              <!-- 产品列表 -->
              <div class="products-grid">
                <div v-for="product in filteredProducts" 
                     :key="product.id" 
                     class="product-card"
                     @click="handleProductClick(product)">
                  <div class="product-image">
                    <img :src="product.image" :alt="product.name">
                    <div class="hover-overlay">
                      <el-button type="primary" size="small">
                        查看详情
                      </el-button>
                    </div>
                  </div>
                  <div class="product-info">
                    <h3 class="product-name">{{ product.name }}</h3>
                    <p class="product-desc">{{ product.description }}</p>
                    <div class="product-meta">
                      <span class="category-tag">{{ product.categoryName }}</span>
                      <span class="material-tag">{{ product.material }}</span>
                    </div>
                  </div>
                </div>
              </div>
  
              <!-- 分页 -->
              <div class="pagination">
                <el-pagination
                  background
                  layout="prev, pager, next"
                  :total="total"
                  :page-size="pageSize"
                  :current-page="currentPage"
                  @current-change="handlePageChange"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Products',
    data() {
      return {
        // 分类列表
        categories: [
          { id: 0, name: '全部产品', icon: 'el-icon-menu', count: 120 },
          { id: 1, name: '精密零件', icon: 'el-icon-cpu', count: 45 },
          { id: 2, name: '模具配件', icon: 'el-icon-set-up', count: 32 },
          { id: 3, name: '医疗器械', icon: 'el-icon-first-aid-kit', count: 18 },
          { id: 4, name: '汽车配件', icon: 'el-icon-truck', count: 25 }
        ],
        currentCategory: 0,
        searchKeyword: '',
        sortOption: 'newest',
        sortOptions: [
          { value: 'newest', label: '最新上架' },
          { value: 'popular', label: '最受欢迎' },
          { value: 'price-asc', label: '价格从低到高' },
          { value: 'price-desc', label: '价格从高到低' }
        ],
        products: [
          {
            id: 1,
            name: '精密轴承座',
            description: '高精度CNC加工，公差控制±0.01mm',
            image: require('@/assets/images/product1.png'),
            categoryId: 1,
            categoryName: '精密零件',
            material: '铝合金'
          },
          {
            id: 2,
            name: '注塑模具镶件',
            description: '耐磨损，使用寿命长',
            image: require('@/assets/images/product2.png'),
            categoryId: 2,
            categoryName: '模具配件',
            material: '模具钢'
          }
          // 更多产品数据...
        ],
        pageSize: 12,
        currentPage: 1,
        total: 120
      }
    },
    computed: {
      filteredProducts() {
        let result = [...this.products]
        
        // 分类筛选
        if (this.currentCategory !== 0) {
          result = result.filter(item => item.categoryId === this.currentCategory)
        }
        
        // 关键词搜索
        if (this.searchKeyword) {
          const keyword = this.searchKeyword.toLowerCase()
          result = result.filter(item => 
            item.name.toLowerCase().includes(keyword) ||
            item.description.toLowerCase().includes(keyword)
          )
        }
        
        // 排序
        switch (this.sortOption) {
          case 'popular':
            // 按热度排序的逻辑
            break
          case 'price-asc':
            // 按价格升序排序的逻辑
            break
          case 'price-desc':
            // 按价格降序排序的逻辑
            break
          default:
            // 默认按最新排序
            result.sort((a, b) => b.id - a.id)
        }
        
        return result
      }
    },
    methods: {
      handleCategoryChange(categoryId) {
        this.currentCategory = categoryId
        this.currentPage = 1
      },
      handleSearch() {
        this.currentPage = 1
      },
      handlePageChange(page) {
        this.currentPage = page
        // 这里应该调用API获取对应页码的数据
      },
      handleProductClick(product) {
        // 跳转到产品详情页
        this.$router.push({
          path: `/products/${product.id}`,
          query: { category: product.categoryId }
        })
      },
      handleContact() {
        this.$router.push('/contact')
      }
    }
  }
  </script>
  
  <style lang="scss" scoped>
  .products {
    .page-header {
      background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), 
                  url('@/assets/images/products-banner.png') center/cover;
      padding: 80px 0;
      color: white;
      margin-top: 80px;
  
      .page-title {
        font-size: 36px;
        margin-bottom: 20px;
      }
    }
  
    .products-section {
      padding: 60px 0;
      background: $bg-color-light;
  
      .products-container {
        display: grid;
        grid-template-columns: 280px 1fr;
        gap: 40px;
        
        @include responsive(lg) {
          grid-template-columns: 1fr;
        }
      }
    }
  
    .category-menu {
      .menu-title {
        font-size: 20px;
        margin-bottom: 20px;
        padding-bottom: 15px;
        border-bottom: 1px solid $border-color;
      }
  
      .category-list {
        list-style: none;
        padding: 0;
        margin: 0;
  
        li {
          padding: 15px;
          cursor: pointer;
          display: flex;
          align-items: center;
          color: $text-color;
          border-radius: $border-radius-sm;
          transition: all 0.3s ease;
  
          i {
            margin-right: 10px;
            font-size: 18px;
          }
  
          .count {
            margin-left: auto;
            color: $text-color-light;
          }
  
          &:hover, &.active {
            background: $primary-color;
            color: white;
  
            .count {
              color: rgba(255,255,255,0.8);
            }
          }
        }
      }
  
      .contact-card {
        margin-top: 40px;
        padding: 30px;
        background: white;
        border-radius: $border-radius-lg;
        box-shadow: $box-shadow;
  
        h3 {
          font-size: 18px;
          margin-bottom: 10px;
        }
  
        p {
          color: $text-color-secondary;
          margin-bottom: 20px;
        }
  
        .contact-info {
          margin-bottom: 20px;
  
          p {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
  
            i {
              margin-right: 10px;
              color: $primary-color;
            }
          }
        }
      }
    }
  
    .products-content {
      .filter-toolbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
        
        @include responsive(sm) {
          flex-direction: column;
          gap: 15px;
        }
  
        .search-box {
          width: 300px;
          
          @include responsive(sm) {
            width: 100%;
          }
        }
      }
  
      .products-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 30px;
        
        @include responsive(lg) {
          grid-template-columns: repeat(2, 1fr);
        }
        
        @include responsive(sm) {
          grid-template-columns: 1fr;
        }
      }
  
      .product-card {
        background: white;
        border-radius: $border-radius-lg;
        overflow: hidden;
        box-shadow: $box-shadow;
        transition: all 0.3s ease;
        cursor: pointer;
  
        &:hover {
          transform: translateY(-5px);
          box-shadow: $box-shadow-lg;
  
          .hover-overlay {
            opacity: 1;
          }
  
          .product-image img {
            transform: scale(1.1);
          }
        }
  
        .product-image {
          position: relative;
          height: 200px;
          overflow: hidden;
  
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s ease;
          }
  
          .hover-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            transition: opacity 0.3s ease;
          }
        }
  
        .product-info {
          padding: 20px;
  
          .product-name {
            font-size: 18px;
            margin-bottom: 10px;
            color: $text-color;
          }
  
          .product-desc {
            font-size: 14px;
            color: $text-color-secondary;
            margin-bottom: 15px;
            line-height: 1.6;
          }
  
          .product-meta {
            display: flex;
            gap: 10px;
  
            .category-tag,
            .material-tag {
              padding: 4px 8px;
              border-radius: $border-radius-sm;
              font-size: 12px;
            }
  
            .category-tag {
              background: rgba($primary-color, 0.1);
              color: $primary-color;
            }
  
            .material-tag {
              background: rgba($success-color, 0.1);
              color: $success-color;
            }
          }
        }
      }
  
      .pagination {
        margin-top: 40px;
        text-align: center;
      }
    }
  }
  </style>