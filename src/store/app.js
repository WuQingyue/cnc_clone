import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    // 全局 Loading 状态
    isLoading: false,
    // 用于跟踪并发请求的数量
    activeRequests: 0,
  }),
  actions: {
    /**
     * 开始一个请求或任务
     * 每个异步任务开始时调用此方法
     */
    startLoading() {
      this.activeRequests++
      this.isLoading = true
    },

    /**
     * 结束一个请求或任务
     * 每个异步任务结束时（无论成功或失败）调用此方法
     */
    finishLoading() {
      this.activeRequests--
      if (this.activeRequests <= 0) {
        this.activeRequests = 0 // 避免负数
        this.isLoading = false
      }
    },
    
    /**
     * 强制设置 Loading 状态（用于非请求的异步任务，如 i18n 加载）
     * @param {boolean} status - true 表示显示 loading, false 表示隐藏
     */
    setLoading(status) {
        this.isLoading = status;
        // 如果强制关闭，重置计数器
        if (!status) {
            this.activeRequests = 0;
        }
    }
  },
})