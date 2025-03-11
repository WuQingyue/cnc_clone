import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

export const useAuthStore = defineStore('auth', () => {
  // 状态
  const token = ref(localStorage.getItem('token') || '')
  const user = ref(JSON.parse(localStorage.getItem('user') || '{}'))
  const qrcodeInfo = ref(null)
  const registerStep = ref(1)
  const tempRegisterData = ref({})

  // Getters
  const isAuthenticated = computed(() => !!token.value)
  const userInfo = computed(() => user.value)
  const clientId = computed(() => user.value?.clientId || '')
  const currentStep = computed(() => registerStep.value)

  // Actions
  // 设置认证信息
  const setAuth = (tokenValue, userData) => {
    token.value = tokenValue
    user.value = userData
    localStorage.setItem('token', tokenValue)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  // 清除认证信息
  const clearAuth = () => {
    token.value = ''
    user.value = {}
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    qrcodeInfo.value = null
    registerStep.value = 1
    tempRegisterData.value = {}
  }

  // 获取二维码
  const getQrcode = async () => {
    try {
      // 这里应该调用实际的 API
      const response = await fetch('/api/auth/qrcode')
      const data = await response.json()
      qrcodeInfo.value = data
      return data
    } catch (error) {
      console.error('获取二维码失败:', error)
      throw error
    }
  }

  // 检查二维码扫描状态
  const checkQrcodeStatus = async () => {
    try {
      if (!qrcodeInfo.value?.qrcodeId) return false
      
      // 这里应该调用实际的 API
      const response = await fetch(`/api/auth/qrcode/check/${qrcodeInfo.value.qrcodeId}`)
      const data = await response.json()
      
      if (data.isScanned) {
        tempRegisterData.value = {
          ...tempRegisterData.value,
          openId: data.openId
        }
      }
      
      return data.isScanned
    } catch (error) {
      console.error('检查二维码状态失败:', error)
      return false
    }
  }

  // 发送验证码
  const sendVerifyCode = async (phone) => {
    try {
      // 这里应该调用实际的 API
      const response = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ phone })
      })
      
      const data = await response.json()
      
      if (data.success) {
        ElMessage.success('验证码已发送')
        return true
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      ElMessage.error(error.message || '发送验证码失败')
      throw error
    }
  }

  // 验证手机号
  const verifyPhone = async (phone, code) => {
    try {
      // 这里应该调用实际的 API
      const response = await fetch('/api/auth/verify-phone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phone,
          code,
          openId: tempRegisterData.value.openId
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        tempRegisterData.value = {
          ...tempRegisterData.value,
          phone,
          verified: true
        }
        return true
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      ElMessage.error(error.message || '验证失败')
      throw error
    }
  }

  // 完成注册
  const completeRegister = async () => {
    try {
      if (!tempRegisterData.value.verified) {
        throw new Error('请先完成手机验证')
      }

      // 这里应该调用实际的 API
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(tempRegisterData.value)
      })
      
      const data = await response.json()
      
      if (data.success) {
        setAuth(data.token, data.user)
        ElMessage.success('注册成功')
        return data
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      ElMessage.error(error.message || '注册失败')
      throw error
    }
  }

  // 更新注册步骤
  const updateRegisterStep = (step) => {
    registerStep.value = step
  }

  // 更新临时注册数据
  const updateTempRegisterData = (data) => {
    tempRegisterData.value = {
      ...tempRegisterData.value,
      ...data
    }
  }

  return {
    // 状态
    token,
    user,
    qrcodeInfo,
    registerStep,
    tempRegisterData,
    
    // Getters
    isAuthenticated,
    userInfo,
    clientId,
    currentStep,
    
    // Actions
    setAuth,
    clearAuth,
    getQrcode,
    checkQrcodeStatus,
    sendVerifyCode,
    verifyPhone,
    completeRegister,
    updateRegisterStep,
    updateTempRegisterData
  }
})
