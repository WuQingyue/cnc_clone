import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)

  // 登录状态
  const isLoggedIn = computed(() => !!user.value && !!user.value.user_name)

  // 设置用户信息
  function setUser(userInfo) {
    user.value = userInfo
  }

  // 清除用户信息
  function clearUser() {
    user.value = null
  }

  // 检查是否为管理员
  function checkIsAdmin() {
    return user.value && user.value.user_email === 'tongtron@admin.com'
  }

  return {
    user,
    isLoggedIn,
    setUser,
    clearUser,
    checkIsAdmin
  }
})