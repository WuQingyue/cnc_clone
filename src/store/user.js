import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    isLoggedIn: false,
    isAdmin:false
  }),
  
  actions: {
    // 设置用户信息
    setUser(userData) {
      this.user = userData
      this.isLoggedIn = true
      if(this.user.user.email === 'admin@tongtron.com'){
        this.isAdmin = true
      }
      console.log('用户信息已更新:', this.user.user)
      console.log('用户eamil信息已更新:', this.user.user.email)
      console.log('用户信息已更新:', this.isLoggedIn)
      console.log('用户信息已更新:', this.isAdmin)
    },
    
    // 清除用户信息
    clearUser() {
      this.user = null
      this.isLoggedIn = false
      this.isAdmin = false
      console.log('用户信息已清除')
    },

    // 检查登录状态
    checkAuth() {
      return this.isLoggedIn && this.user !== null
    },
    checkIsAdmin(){
      return this.isAdmin
    }
  },
  
  persist: true  // 启用 Pinia 持久化

})