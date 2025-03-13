<template>
    <div class="material-detail">
      <div class="page-header">
        <div class="container">
          <h1 class="page-title">{{ '材料详情' }}</h1>
        </div>
      </div>
  
      <div class="container">
        <div class="breadcrumb">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/materials' }">材料介绍</el-breadcrumb-item>
            <el-breadcrumb-item>{{ materialInfo?.label }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>
  
      <div class="detail-content">
        <div class="container">
          <!-- 材料信息展示区域 -->
          <div class="material-info-card">
            <el-skeleton :loading="loading" animated>
              <template #default>
                <div class="info-content" v-if="materialInfo">
                  <div class="material-basic-info">
                    <div class="material-image">
                      <img :src="materialInfo.image" :alt="materialInfo.label">
                    </div>
                    <div class="material-details">
                      <h2>{{ materialInfo.label }}</h2>
                      <p class="info-item">
                        <span class="label">加工类型：</span>
                        <span>{{ materialInfo.type === 'cnc' ? 'CNC机加工' : '钣金加工' }}</span>
                      </p>
                      <p class="info-item">
                        <span class="label">材料细项：</span>
                        <span>{{ materialInfo.label }}</span>
                      </p>
                      <p class="info-item">
                        <span class="label">发货时间：</span>
                        <span>{{ materialInfo.delivery }}</span>
                      </p>
                      <p class="info-item">
                        <span class="label">材料详细：</span>
                        <span>{{ materialInfo.introduce || '暂无介绍' }}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </template>
            </el-skeleton>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import { ElMessage } from 'element-plus'
  import axios from 'axios'
  
  const route = useRoute()
  const loading = ref(true)
  const materialInfo = ref(null)
  
  // 获取材料详情
  const fetchMaterialDetail = async () => {
    try {
      loading.value = true
      const { materialId } = route.params
      const { type, subCategory, label, delivery, image } = route.query
  
      // 这里先用路由参数构建基础信息
      materialInfo.value = {
        value: materialId,
        label,
        type,
        subCategory,
        delivery,
        image
      }
  
      // 发送请求获取完整的材料详情
      const response = await axios.get(`/api/materials/${materialId}`, {
        params: {
          subCategory
        }
      })
  
      // 合并后端返回的详细信息，但保留原有的图片信息
      materialInfo.value = {
        ...materialInfo.value,
        ...response.data,
        image: image || response.data.image // 优先使用传递过来的图片，如果没有则使用后端返回的
      }
    } catch (error) {
      console.error('获取材料详情失败：', error)
      ElMessage.error('获取材料详情失败')
    } finally {
      loading.value = false
    }
  }
  
  // 组件挂载时获取数据
  onMounted(() => {
    fetchMaterialDetail()
  })
  </script>
  
  <style lang="scss" scoped>
  .material-detail {
    background: #f5f7fa;
    min-height: calc(100vh - 60px);
  
    .page-header {
      background: url('@/assets/images/contact2.jpg') center/cover;
      padding: 80px 0;
      color: rgb(36, 25, 25);
      margin-top: 80px;
  
      .page-title {
        font-size: 36px;
        margin-bottom: 20px;
        text-align: center;
      }
    }
  
    .breadcrumb {
      padding: 20px 0;
      background: #ffffff00;
      border-bottom: 1px solid #ebeef5;
      margin-bottom: 20px;
    }
  
    .detail-content {
      padding: 20px 0 40px;
  
      .material-info-card {
        background: #fff;
        padding: 30px;
        border-radius: 8px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  
        .material-basic-info {
          display: flex;
          gap: 30px;
  
          .material-image {
            width: 300px;
            height: 300px;
            overflow: hidden;
            border-radius: 8px;
            
            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }
  
          .material-details {
            flex: 1;
  
            h2 {
              margin: 0 0 20px 0;
              color: #333;
              font-size: 24px;
            }
  
            .info-item {
              margin: 15px 0;
              color: #666;
              line-height: 1.6;
              font-size: 16px;
  
              .label {
                color: #333;
                font-weight: 500;
                margin-right: 10px;
              }
            }
          }
        }
      }
    }
  }
  
  @media (max-width: 768px) {
    .material-detail {
      .detail-content {
        .material-info-card {
          .material-basic-info {
            flex-direction: column;
  
            .material-image {
              width: 100%;
              height: 200px;
            }
          }
        }
      }
    }
  }
  </style> 