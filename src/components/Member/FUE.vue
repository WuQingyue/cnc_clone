<template>
    <div class="fue">
      <h2>常用入口</h2>
      <ul>
        <li v-for="(entry, index) in entries" :key="index" @click="navigateToEntry(entry.link)">
          <el-icon><i :class="entry.icon"></i></el-icon>
          <span>{{ entry.text }}</span>
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const entries = ref([
    { text: '入口1', link: '/entry1', icon: 'entry-icon-1' },
    { text: '入口2', link: '/entry2', icon: 'entry-icon-2' },
    { text: '入口3', link: '/entry3', icon: 'entry-icon-3' }
  ])
  
  const navigateToEntry = (link) => {
    window.location.href = link
  }
  </script>
  
  <style scoped>
  .fue {
    padding: 20px;
    background-color: #fff;
    border: 1px solid #ddd;
  }
  
  .fue h2 {
    margin-bottom: 10px;
  }
  
  .fue ul {
    list-style: none;
    padding: 0;
  }
  
  .fue li {
    display: flex;
    align-items: center;
    cursor: pointer;
    margin-bottom: 10px;
  }
  
  .fue li span {
    margin-left: 10px;
  }
  </style>