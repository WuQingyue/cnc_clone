import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useNewsStore = defineStore('news', () => {
  // state
  const newsList = ref([])
  const loading = ref(false)

  // getters
  const getNewsList = computed(() => newsList.value)
  const getNewsById = computed(() => (id) => {
    return newsList.value.find(news => news.id === id)
  })
  const isLoading = computed(() => loading.value)

  // actions
  const fetchNewsList = async (params) => {
    try {
      loading.value = true
      const response = await fetch('/api/news', {
        method: 'GET',
        params
      })
      const data = await response.json()
      newsList.value = data.list
      return data
    } catch (error) {
      console.error('获取新闻列表失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    newsList,
    loading,
    getNewsList,
    getNewsById,
    isLoading,
    fetchNewsList
  }
})
