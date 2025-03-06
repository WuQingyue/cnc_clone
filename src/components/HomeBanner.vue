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
          image: require('@/assets/images/banner1.png')
        },
        {
          image: require('@/assets/images/banner2.jpg')
        },
        {
          image: require('@/assets/images/banner3.jpg')
        },
        {
          image: require('@/assets/images/banner4.jpg')
        },
        {
          image: require('@/assets/images/banner5.jpg')
        },
        {
          image: require('@/assets/images/banner6.jpg')
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

<style lang="scss" scoped>
.home-banner {
  height: 600px;
  position: relative;
  margin-top: 80px;

  @include responsive(md) {
    height: 500px;
  }

  @include responsive(sm) {
    height: 400px;
  }

  .banner-swiper {
    height: 100%;
  }

  .banner-slide {
    position: relative;
    height: 100%;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .banner-content {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.4);
      color: white;
      @include flex-center;
      text-align: center;

      .slide-title {
        font-size: 48px;
        font-weight: bold;
        margin-bottom: 20px;
        line-height: 1.2;
        opacity: 0;
        transform: translateY(30px);
        animation: fadeInUp 0.8s forwards;

        span {
          color: $primary-color;
        }

        @include responsive(md) {
          font-size: 36px;
        }

        @include responsive(sm) {
          font-size: 28px;
        }
      }

      .slide-desc {
        font-size: 20px;
        margin-bottom: 30px;
        opacity: 0;
        transform: translateY(30px);
        animation: fadeInUp 0.8s 0.3s forwards;

        @include responsive(md) {
          font-size: 18px;
        }

        @include responsive(sm) {
          font-size: 16px;
        }
      }

      .slide-btn {
        opacity: 0;
        transform: translateY(30px);
        animation: fadeInUp 0.8s 0.6s forwards;
      }
    }
  }
}

// 自定义 Swiper 样式
:deep(.swiper-pagination-bullet) {
  width: 12px;
  height: 12px;
  background: rgba(255, 255, 255, 0.6);
  opacity: 1;
}

:deep(.swiper-pagination-bullet-active) {
  background: $primary-color;
}

:deep(.swiper-button-prev),
:deep(.swiper-button-next) {
  color: white;
  width: 50px;
  height: 50px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  transition: all 0.3s ease;

  &:hover {
    background: rgba($primary-color, 0.8);
  }

  &::after {
    font-size: 24px;
  }
}

// 动画
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>