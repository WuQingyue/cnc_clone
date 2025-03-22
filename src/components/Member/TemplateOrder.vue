<template>
    <div class="template-order">
      <h2>模板订单</h2>
      <ul>
        <li v-for="(template, index) in templates" :key="index" @click="navigateToTemplate(template.link)">
          <el-icon><i :class="template.icon"></i></el-icon>
          <span>{{ template.text }}</span>
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const templates = ref([
    { text: '模板1', link: '/template1', icon: 'template-icon-1' },
    { text: '模板2', link: '/template2', icon: 'template-icon-2' },
    { text: '模板3', link: '/template3', icon: 'template-icon-3' }
  ])
  
  const navigateToTemplate = (link) => {
    window.location.href = link
  }
  </script>
  
  <style scoped>
  .template-order {
    padding: 20px;
    background-color: #fff;
    border: 1px solid #ddd;
  }
  
  .template-order h2 {
    margin-bottom: 10px;
  }
  
  .template-order ul {
    list-style: none;
    padding: 0;
  }
  
  .template-order li {
    display: flex;
    align-items: center;
    cursor: pointer;
    margin-bottom: 10px;
  }
  
  .template-order li span {
    margin-left: 10px;
  }
  </style>