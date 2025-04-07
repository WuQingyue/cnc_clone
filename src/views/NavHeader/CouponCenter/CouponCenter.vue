<template>
  <div class="coupon-center">
    <!-- Banner部分 -->
    <banner-section />

    <!-- 新用户优惠券部分 -->
    <new-user-coupons />

    <!-- 全场优惠券部分 -->
    <div class="general-coupons-section">
      <div class="section-title">
        <span>全场优惠券专区</span>
      </div>
      <div class="coupon-list">
        <div v-for="(coupon, index) in generalCoupons" :key="index" class="coupon-item">
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
          <el-button 
            class="get-btn" 
            :type="coupon.available ? 'primary' : 'info'"
            :disabled="!coupon.available"
          >
            {{ coupon.available ? '立即领取' : '已领取' }}
          </el-button>
        </div>
      </div>
    </div>

    <!-- 使用规则部分 -->
    <div class="rules-section">
      <div class="section-title">使用规则</div>
      <div class="rules-content">
        <p>1. 新用户优惠券仅限首次下单使用</p>
        <p>2. 每个订单限使用一张优惠券</p>
        <p>3. 优惠券不可叠加使用</p>
        <p>4. 优惠券不可转让，不可兑换现金</p>
        <p>5. 最终解释权归本公司所有</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BannerSection from '@/components/CouponCenter/BannerSection.vue'
import NewUserCoupons from '@/components/CouponCenter/NewUserCoupons.vue'

const generalCoupons = ref([
  {
    amount: 50,
    desc1: '满500可用',
    desc2: '适用于所有工艺',
    desc3: '有效期30天',
    available: true
  },
  {
    amount: 100,
    desc1: '满1000可用',
    desc2: '适用于CNC/钣金',
    desc3: '有效期30天',
    available: true
  },
  {
    amount: 200,
    desc1: '满2000可用',
    desc2: '仅限CNC项目',
    desc3: '有效期30天',
    available: false
  },
  {
    amount: 300,
    desc1: '满3000可用',
    desc2: '适用于所有工艺',
    desc3: '有效期30天',
    available: true
  }
])
</script>

<style lang="scss" scoped>
.coupon-center {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;

  .section-title {
    font-size: 20px;
    font-weight: bold;
    color: #303133;
    margin-bottom: 20px;
    padding-left: 10px;
    border-left: 4px solid #409EFF;
  }

  .general-coupons-section {
    background: #fff;
    margin: 20px;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

    .coupon-list {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
    }

    .coupon-item {
      border: 1px solid #dcdfe6;
      border-radius: 8px;
      padding: 15px;
      transition: all 0.3s;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      }

      .coupon-content {
        display: flex;
        align-items: center;
        margin: 20px 0;
      }

      .left-part {
        display: flex;
        align-items: baseline;
        color: #f56c6c;
        
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
        background: #dcdfe6;
        margin: 0 15px;
      }

      .right-part {
        .desc-line {
          font-size: 12px;
          color: #606266;
          line-height: 1.5;
        }
      }

      .get-btn {
        width: 100%;
      }
    }
  }

  .rules-section {
    background: #fff;
    margin: 20px;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

    .rules-content {
      color: #606266;
      line-height: 2;
      
      p {
        margin: 0;
      }
    }
  }
}
</style>