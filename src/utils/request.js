import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useAppStore } from '@/store/app' // 引入我们刚创建的 store

// 创建 axios 实例
const service = axios.create({
  baseURL: '',
  timeout: 150000
})

// 请求拦截器
service.interceptors.request.use(
  async config => {
    const appStore = useAppStore()
    appStore.startLoading()
    const auth = (await import('@/store/modules/auth')).useAuthStore()
    if (auth.token) {
      config.headers['Authorization'] = `Bearer ${auth.token}`
    }
    return config
  },
  error => {
    const appStore = useAppStore()
    appStore.finishLoading()
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  async response => {
    const appStore = useAppStore()
    appStore.finishLoading()
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
    const appStore = useAppStore()
    appStore.finishLoading()
    console.error('响应错误:', error)
    ElMessage.error(error.message || '网络错误')
    return Promise.reject(error)
  }
)

export default service 