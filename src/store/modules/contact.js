import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useContactStore = defineStore('contact', () => {
  const loading = ref(false)

  // actions
  const submitContactForm = async (formData) => {
    try {
      loading.value = true
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      const data = await response.json()
      return data
    } catch (error) {
      console.error('提交表单失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    submitContactForm
  }
})
