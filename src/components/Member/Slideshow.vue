<template>
    <div class="slideshow">
      <div v-for="(slide, index) in slides" :key="index" class="slide">
        <img :src="slide.image" :alt="slide.alt" />
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const slides = ref([
    { image: '/images/slide1.jpg', alt: 'Slide 1' },
    { image: '/images/slide2.jpg', alt: 'Slide 2' }
  ])
  </script>
  
  <style scoped>
  .slideshow {
    width: 100%;
    overflow: hidden;
  }
  
  .slide {
    width: 100%;
    display: flex;
    justify-content: center;
  }
  
  .slide img {
    width: 100%;
    height: auto;
  }
  </style>