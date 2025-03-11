import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    isLoggedIn: false
  }),
  
  actions: {
    // 设置用户信息
    setUser(userData) {
      this.user = userData
      this.isLoggedIn = true
      console.log('用户信息已更新:', this.user)
    },
    
    // 清除用户信息
    clearUser() {
      this.user = null
      this.isLoggedIn = false
      console.log('用户信息已清除')
    },

    // 检查登录状态
    checkAuth() {
      return this.isLoggedIn && this.user !== null
    }
  },
  
  persist: true  // 启用 Pinia 持久化

})