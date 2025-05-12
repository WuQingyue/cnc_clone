<template>
  <div class="home-banner">
    <swiper
      :modules="modules"
      :slides-per-view="1"
      :loop="true"
      :autoplay="{
        delay: 5000,
        disableOnInteraction: false
      }"
      :pagination="{
        clickable: true
      }"
      :navigation="true"
      class="banner-swiper"
    >
      <swiper-slide v-for="(slide, index) in bannerList" :key="index">
        <div class="banner-slide">
          <img :src="slide.image" :alt="slide.title" @click="handleLearnMore">
          <div class="banner-text-block">
            <div class="banner-title">{{ slide.title }}</div>
            <div class="banner-subtitle">{{ slide.subtitle }}</div>
          </div>
        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Pagination, Navigation } from 'swiper'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

export default {
  name: 'HomeBanner',
  components: {
    Swiper,
    SwiperSlide
  },
  data() {
    return {
      modules: [Autoplay, Pagination, Navigation],
      bannerList: [
        {
          image: require('@/assets/images/banner2.png'),
          title: 'SmartCNC机械智造',
          subtitle: '交期迅速 | 无忧品质 | 高性价比 |  贴心服务'
        },
        {
          image: require('@/assets/images/banner3.png'),
          title: '专业团队，品质保障',
          subtitle: '经验丰富的工程师团队为您服务'
        },
        {
          image: require('@/assets/images/banner4.png'),
          title: '支持定制化服务',
          subtitle: '满足不同行业的个性化需求'
        },
        {
          image: require('@/assets/images/banner5.png'),
          title: '智能制造，未来已来',
          subtitle: '引领智能制造新潮流'
        },
        {
          image: require('@/assets/images/banner6.png'),
          title: 'SmartCNC欢迎您',
          subtitle: '携手共创美好未来'
        }
      ]
    }
  },
  methods: {
    handleLearnMore() {
      this.$router.push('/about')
    }
  }
}
</script>

<style scoped>
.home-banner {
  height: 600px;
  position: relative;
  margin-top: 80px;
  width: 100%;
  max-width: 100vw;
  overflow: hidden;
}

.banner-swiper {
  height: 100%;
}

.banner-slide {
  position: relative;
  height: 100%;
  width: 100%;
}

.banner-slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* 文字块，垂直居中，靠左 */
.banner-text-block {
  position: absolute;
  left: 40px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  z-index: 2;
}

/* 标题样式 */
.banner-title {
  color: #fff;
  font-size: clamp(0.45rem, 1.8vw, 1.6rem);
  font-weight: bold;
  line-height: 1.15;
  letter-spacing: 2px;
  text-shadow: 0 2px 16px rgba(0,0,0,0.4);
  margin-bottom: 12px;
}

/* 副标题样式 */

.banner-subtitle {
  color: #fff;
  font-size: clamp(0.32rem, 1vw, 0.8rem);
  font-weight: normal;
  line-height: 1.4;
  letter-spacing: 1px;
  text-shadow: 0 2px 8px rgba(0,0,0,0.3);
}

/* Swiper pagination bullets */
:deep(.swiper-pagination-bullet) {
  width: 12px;
  height: 12px;
  background: rgba(255, 255, 255, 0.6);
  opacity: 1;
  margin: 0 4px !important;
}

:deep(.swiper-pagination-bullet-active) {
  background: #007BFF;
}

/* Swiper navigation buttons */
:deep(.swiper-button-prev),
:deep(.swiper-button-next) {
  color: white;
  width: 40px;
  height: 40px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  transition: all 0.3s ease;
  top: 50%;
  transform: translateY(-50%);
}

:deep(.swiper-button-prev):hover,
:deep(.swiper-button-next):hover {
  background: rgba(0, 123, 255, 0.8);
}

:deep(.swiper-button-prev)::after,
:deep(.swiper-button-next)::after {
  font-size: 20px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .home-banner {
    height: 420px;
    margin-top: 60px;
  }
  .banner-text-block {
    left: 20px;
  }
}

@media (max-width: 992px) {
  .home-banner {
    height: 320px;
    margin-top: 50px;
  }
  :deep(.swiper-button-prev),
  :deep(.swiper-button-next) {
    width: 32px;
    height: 32px;
  }
  .banner-text-block {
    left: 20px;
  }
}

@media (max-width: 768px) {
  .home-banner {
    height: 200px;
    margin-top: 40px;
  }
  .banner-slide img {
    min-height: 140px;
  }
  .banner-text-block {
    left: 10px;
  }
}

@media (max-width: 480px) {
  .home-banner {
    height: 120px;
    margin-top: 32px;
  }
  .banner-slide img {
    min-height: 80px;
  }
  :deep(.swiper-button-prev),
  :deep(.swiper-button-next) {
    width: 24px;
    height: 24px;
  }
  :deep(.swiper-pagination-bullet) {
    width: 8px;
    height: 8px;
  }
  .banner-text-block {
    left: 6px;
  }
}
</style>