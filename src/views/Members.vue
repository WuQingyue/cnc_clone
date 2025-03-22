<template>
    <div class="members-view">
      <LeftNav />
      <div class="main-content">
        <Slideshow />
        <QuickOrder />
        <FUF />
        <FUE />
        <TemplateOrder />   
      </div>
    </div>
  </template>
  
  <script setup>
  import LeftNav from '@/components/Member/LeftNav.vue'
  import Slideshow from '@/components/Member/Slideshow.vue'
  import QuickOrder from '@/components/Member/QuickOrder.vue'
  import FUF from '@/components/Member/FUF.vue'
  import FUE from '@/components/Member/FUE.vue'
  import TemplateOrder from '@/components/Member/TemplateOrder.vue'
  </script>
  
  <style scoped>
  .members-view {
    display: flex;
  }
  
  .main-content {
    flex: 1;
    padding: 20px;
  }
  </style>