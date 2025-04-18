import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUnifiedPaymentDataStore = defineStore('unifiedPaymentData', () => {
  // 状态
  const unifiedPaymentData = ref([])

  // 动作
  function setUnifiedPaymentData(data) {
    unifiedPaymentData.value = data
    console.log('待支付Store 中的数据已更新:', unifiedPaymentData.value)
  }

  function getUnifiedPaymentData() {
    return unifiedPaymentData.value
  }

  function clearUnifiedPaymentData() {
    unifiedPaymentData.value = []
  }

  return {
    unifiedPaymentData,
    setUnifiedPaymentData,
    getUnifiedPaymentData,
    clearUnifiedPaymentData
  }
})