<template>
  <div class="home">
    <!-- 首页轮播图 -->
    <home-banner />
     <!-- 我们的生产工艺 -->
    <our-process-display />

    <!-- 材料支持 -->
    <material-support />

    <!-- 下单流程 -->
    <order-process />

    <!-- 加工工艺展示 -->
    <process-display />

    <!-- 客户评价 -->
    <customer-reviews />

    <!-- 企业动态 -->
    <company-news />
  </div>
</template>

<script>
import HomeBanner from '@/components/HomeBanner.vue'
import OurProcessDisplay from '@/components/OurProcessDisplay.vue'
import MaterialSupport from '@/components/MaterialSupport.vue'
import OrderProcess from '@/components/OrderProcess.vue'
import ProcessDisplay from '@/components/ProcessDisplay.vue'
import CustomerReviews from '@/components/CustomerReviews.vue'
import CompanyNews from '@/components/CompanyNews.vue'
export default {
  name: 'Home',
  components: {
    HomeBanner,
    OurProcessDisplay,
    MaterialSupport,
    OrderProcess,
    ProcessDisplay,
    CustomerReviews,
    CompanyNews
  }
}
</script>