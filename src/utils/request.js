import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/store/modules/auth'

// 创建 axios 实例
const service = axios.create({
  baseURL: '',
  timeout: 15000
})

// 请求拦截器
service.interceptors.request.use(
  async config => {
    const auth = (await import('@/store/modules/auth')).useAuthStore()
    if (auth.token) {
      config.headers['Authorization'] = `Bearer ${auth.token}`
    }
    return config
  },
  error => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  async response => {
    const res = response
    console.log("res",res)
    if (res.status !== 200) {
      ElMessage.error(res.message || '请求失败')
      
      // 处理特定错误码
      if (res.code === 401) {
        const auth = (await import('@/store/modules/auth')).useAuthStore()
        auth.clearAuth()
      }
      
      return Promise.reject(new Error(res.message || '请求失败'))
    }
    
    return res
  },
  error => {
    console.error('响应错误:', error)
    ElMessage.error(error.message || '网络错误')
    return Promise.reject(error)
  }
)

export default service 