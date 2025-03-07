<template>
    <div class="coupon-center">
      <!-- 页面标题 -->
      <div class="page-header">
        <div class="container">
          <h1 class="title">领券中心</h1>
          <div class="breadcrumb">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item>领券中心</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
        </div>
      </div>
  
      <!-- 优惠券列表 -->
      <div class="coupon-list">
        <div class="container">
          <el-row :gutter="20">
            <!-- 新用户优惠券 -->
            <el-col :xs="24" :sm="12" :md="8" :lg="6">
              <div class="coupon-item new-user">
                <div class="coupon-content">
                  <div class="amount">
                    <span class="symbol">¥</span>
                    <span class="number">50</span>
                  </div>
                  <div class="desc">新用户专享券</div>
                  <div class="limit">满500可用</div>
                </div>
                <div class="coupon-footer">
                  <el-button type="primary" @click="getCoupon('new')">立即领取</el-button>
                </div>
              </div>
            </el-col>
  
            <!-- 普通优惠券 -->
            <el-col :xs="24" :sm="12" :md="8" :lg="6">
              <div class="coupon-item">
                <div class="coupon-content">
                  <div class="amount">
                    <span class="symbol">¥</span>
                    <span class="number">100</span>
                  </div>
                  <div class="desc">通用优惠券</div>
                  <div class="limit">满1000可用</div>
                </div>
                <div class="coupon-footer">
                  <el-button type="primary" @click="getCoupon('normal')">立即领取</el-button>
                </div>
              </div>
            </el-col>
  
            <!-- 会员优惠券 -->
            <el-col :xs="24" :sm="12" :md="8" :lg="6">
              <div class="coupon-item vip">
                <div class="coupon-content">
                  <div class="amount">
                    <span class="symbol">¥</span>
                    <span class="number">200</span>
                  </div>
                  <div class="desc">会员专享券</div>
                  <div class="limit">满2000可用</div>
                </div>
                <div class="coupon-footer">
                  <el-button type="primary" @click="getCoupon('vip')">立即领取</el-button>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ElMessage } from 'element-plus'
  
  const getCoupon = (type) => {
    // 这里添加领取优惠券的逻辑
    ElMessage.success('领取成功！')
  }
  
  </script>
  
  <style lang="scss" scoped>
  .coupon-center {
    padding: 40px 0;
    background: #f5f7fa;
    min-height: calc(100vh - 60px);
  
    .page-header {
      margin-bottom: 40px;
      background: #fff;
      padding: 30px 0;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  
      .title {
        font-size: 28px;
        color: #333;
        text-align: center;
        margin-bottom: 15px;
      }
  
      .breadcrumb {
        display: flex;
        justify-content: center;
      }
    }
  
    .coupon-list {
      .coupon-item {
        background: #fff;
        border-radius: 8px;
        overflow: hidden;
        margin-bottom: 20px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
  
        &:hover {
          transform: translateY(-5px);
        }
  
        &.new-user {
          border-top: 4px solid #f56c6c;
        }
  
        &.vip {
          border-top: 4px solid #67c23a;
        }
  
        .coupon-content {
          padding: 20px;
          text-align: center;
          border-bottom: 1px dashed #dcdfe6;
          position: relative;
  
          &::before,
          &::after {
            content: '';
            position: absolute;
            bottom: -6px;
            width: 12px;
            height: 12px;
            background: #f5f7fa;
            border-radius: 50%;
          }
  
          &::before {
            left: -6px;
          }
  
          &::after {
            right: -6px;
          }
  
          .amount {
            color: #f56c6c;
            margin-bottom: 10px;
  
            .symbol {
              font-size: 20px;
              margin-right: 2px;
            }
  
            .number {
              font-size: 36px;
              font-weight: bold;
            }
          }
  
          .desc {
            font-size: 16px;
            color: #333;
            margin-bottom: 8px;
          }
  
          .limit {
            font-size: 14px;
            color: #909399;
          }
        }
  
        .coupon-footer {
          padding: 15px;
          text-align: center;
          background: #fff;
  
          .el-button {
            width: 120px;
          }
        }
      }
    }
  }
  
  // 响应式布局
  @media (max-width: 768px) {
    .coupon-center {
      padding: 20px 0;
  
      .page-header {
        padding: 20px 0;
        margin-bottom: 20px;
  
        .title {
          font-size: 24px;
        }
      }
    }
  }
  </style>