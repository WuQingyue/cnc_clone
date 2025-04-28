import { defineStore } from 'pinia'

export const useSelectedDataStore = defineStore('selectedData', {
  state: () => ({
    selectedData: []
  }),
  actions: {
    setSelectedData(data) {
      this.selectedData = data
      console.log('Store 中的数据已更新:', this.selectedData)
    },
    getSelectedData() {
      return this.selectedData
    },
    clearSelectedData() {
      this.selectedData = []
    }
  },
  persist: true
})