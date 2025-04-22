<template>
  <div class="home">
    <!-- 首页轮播图 -->
    <home-banner />

    <!-- logo展示 -->
    <logo-display />

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
import HomeBanner from '@/components/Home/HomeBanner.vue'
import LogoDisplay from '@/components/Home/LogoDisplay.vue'
import OurProcessDisplay from '@/components/Home/OurProcessDisplay.vue'
import MaterialSupport from '@/components/Home/MaterialSupport.vue'
import OrderProcess from '@/components/Home/OrderProcess.vue'
import ProcessDisplay from '@/components/Home/ProcessDisplay.vue'
import CustomerReviews from '@/components/Home/CustomerReviews.vue'
import CompanyNews from '@/components/Home/CompanyNews.vue'
export default {
  name: 'Home',
  components: {
    HomeBanner,
    LogoDisplay,
    OurProcessDisplay,
    MaterialSupport,
    OrderProcess,
    ProcessDisplay,
    CustomerReviews,
    CompanyNews
  }
}
</script>