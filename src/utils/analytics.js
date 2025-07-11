// src/utils/analytics.js
import service from '@/utils/request'

export const AnalyticsService = {
  // 获取今日统计数据
   async getTodayStats(date) {
    try {
      const response = await service.get(`/api/ga4/today-stats`, {
        params: { date } // 将日期作为参数传递
      })
      return response.data
    } catch (error) {
      console.error('获取统计数据失败:', error)
      throw error
    }
  },

  // 获取访客数据
  async getVisitorData(date) { // 参数从 period 改为 date
    try {
      const response = await service.get(`/api/ga4/visitor-data`, {
        params: { date } // 将 date 作为参数发送
      })
      return response.data
    } catch (error) {
      console.error('获取访客数据失败:', error)
      throw error
    }
  },

  // 获取金额数据
  async getAmountData(date) {
    try {
      const response = await service.get(`/api/ga4/amount-data`, {
        params: { date }
      })
      return response.data
    } catch (error) {
      console.error('获取金额数据失败:', error)
      throw error
    }
  },
  async getActiveUsersLast30Minutes() {
    try {
      const response = await service.get(`/api/ga4/active-users-last-30-minutes`)
      console.log('getActiveUsersLast30Minutes',response.data)
      return response.data
    } catch (error) {
      console.error('获取过去30分钟活跃用户数失败:', error)
      throw error
    }
  },
  async getActiveUsersLast30MinutesByCountry() {
    try {
      const response = await service.get(`/api/ga4/active-users-last-30-minutes-by-country`)
      return response.data
    } catch (error) {
      console.error('获取过去30分钟活跃用户国家/地区失败:', error)
      throw error
    }
  }
}