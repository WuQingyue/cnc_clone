import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSelectedDataStore = defineStore('selectedData', () => {
  // 状态
  const selectedData = ref([])

  // 动作
  function setSelectedData(data) {
    selectedData.value = data
    console.log('Store 中的数据已更新:', selectedData.value)
  }

  function getSelectedData() {
    return selectedData.value
  }

  function clearSelectedData() {
    selectedData.value = []
  }

  return {
    selectedData,
    setSelectedData,
    getSelectedData,
    clearSelectedData
  }
})