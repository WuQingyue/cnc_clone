<template>
    <div class="fuf">
      <h2>常用功能</h2>
      <ul>
        <li v-for="(feature, index) in features" :key="index" @click="navigateToFeature(feature.link)">
          <el-icon><i :class="feature.icon"></i></el-icon>
          <span>{{ feature.text }}</span>
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const features = ref([
    { text: '功能1', link: '/feature1', icon: 'feature-icon-1' },
    { text: '功能2', link: '/feature2', icon: 'feature-icon-2' },
    { text: '功能3', link: '/feature3', icon: 'feature-icon-3' }
  ])
  
  const navigateToFeature = (link) => {
    window.location.href = link
  }
  </script>
  
  <style scoped>
  .fuf {
    padding: 20px;
    background-color: #fff;
    border: 1px solid #ddd;
  }
  
  .fuf h2 {
    margin-bottom: 10px;
  }
  
  .fuf ul {
    list-style: none;
    padding: 0;
  }
  
  .fuf li {
    display: flex;
    align-items: center;
    cursor: pointer;
    margin-bottom: 10px;
  }
  
  .fuf li span {
    margin-left: 10px;
  }
  </style>