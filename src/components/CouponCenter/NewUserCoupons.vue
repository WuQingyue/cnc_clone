<template>
    <div class="new-user-section">
      <div class="section-title">
        <span>新用户优惠券专区</span>
      </div>
      <div class="coupon-list">
        <div v-for="(coupon, index) in newUserCoupons" :key="index" class="coupon-item">
          <div class="new-user-tag">新用户专享</div>
          <div class="coupon-content">
            <div class="left-part">
              <span class="rmb-icon">¥</span>
              <span class="amount">{{ coupon.amount }}</span>
            </div>
            <div class="divider"></div>
            <div class="right-part">
              <div class="desc-line">{{ coupon.desc1 }}</div>
              <div class="desc-line">{{ coupon.desc2 }}</div>
              <div class="desc-line">{{ coupon.desc3 }}</div>
            </div>
          </div>
          <el-button class="get-btn" type="danger">立即领取</el-button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  const newUserCoupons = [
    {
      amount: 100,
      desc1: '满1000可用',
      desc2: '仅限CNC项目使用',
      desc3: '有效期7天'
    },
    // ... 其他优惠券数据
  ]
  </script>
  
  <style lang="scss" scoped>
  .new-user-section {
    background: #fff;
    margin: 20px;
    padding: 20px;
    border-radius: 8px;
  
    .section-title {
      font-size: 20px;
      font-weight: bold;
      color: #ff6b00;
      margin-bottom: 20px;
    }
  
    .coupon-list {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
    }
  
    .coupon-item {
      background: linear-gradient(135deg, #ff4e50, #f9d423);
      border-radius: 8px;
      padding: 15px;
      position: relative;
  
      .new-user-tag {
        position: absolute;
        top: 10px;
        left: 10px;
        background: rgba(255, 255, 255, 0.9);
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 12px;
      }
  
      .coupon-content {
        display: flex;
        align-items: center;
        color: #fff;
        margin: 30px 0;
      }
  
      .left-part {
        display: flex;
        align-items: baseline;
        
        .rmb-icon {
          font-size: 16px;
        }
        
        .amount {
          font-size: 32px;
          font-weight: bold;
          margin-left: 4px;
        }
      }
  
      .divider {
        width: 1px;
        height: 40px;
        background: rgba(255, 255, 255, 0.5);
        margin: 0 15px;
      }
  
      .right-part {
        .desc-line {
          font-size: 12px;
          line-height: 1.5;
        }
      }
  
      .get-btn {
        width: 100%;
        border: none;
        background: #fff;
        color: #ff4e50;
        &:hover {
          background: #f5f5f5;
        }
      }
    }
  }
  </style>