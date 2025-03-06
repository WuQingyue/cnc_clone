import { createStore } from 'vuex'

export default createStore({
  state: {
    // 用户信息
    userInfo: null,
    
    // 网站基本信息
    siteInfo: {
      name: '嘉立诚数控科技有限公司',
      phone: '400-0755-519',
      email: 'info@jlc-cnc.com',
      address: '深圳市宝安区福永街道凤凰工业园',
      beian: '粤ICP备XXXXXXXX号-1'
    },

    // 导航菜单
    menuItems: [
      { name: '首页', path: '/' },
      { name: '产品中心', path: '/products' },
      { name: '加工工艺', path: '/process' },
      { name: '新闻资讯', path: '/news' },
      { name: '关于我们', path: '/about' },
      { name: '联系我们', path: '/contact' }
    ],

    // 加工工艺列表
    processList: [
      {
        id: 1,
        name: 'CNC加工',
        icon: 'cnc-icon',
        description: '精密CNC数控加工，满足各类零件加工需求'
      },
      {
        id: 2,
        name: '3D打印',
        icon: '3d-print-icon',
        description: '快速成型，适合小批量和定制化生产'
      },
      {
        id: 3,
        name: '钣金加工',
        icon: 'sheet-metal-icon',
        description: '专业钣金加工，提供一站式解决方案'
      },
      {
        id: 4,
        name: '表面处理',
        icon: 'surface-icon',
        description: '多种表面处理工艺，品质保证'
      }
    ],

    // 新闻列表
    newsList: [],

    // 加载状态
    loading: false
  },

  mutations: {
    // 设置用户信息
    SET_USER_INFO(state, userInfo) {
      state.userInfo = userInfo
    },

    // 设置新闻列表
    SET_NEWS_LIST(state, newsList) {
      state.newsList = newsList
    },

    // 设置加载状态
    SET_LOADING(state, status) {
      state.loading = status
    }
  },

  actions: {
    // 获取新闻列表
    async fetchNewsList({ commit }, params) {
      try {
        commit('SET_LOADING', true)
        // 这里应该是实际的API调用
        const response = await fetch('/api/news', {
          method: 'GET',
          params
        })
        const data = await response.json()
        commit('SET_NEWS_LIST', data.list)
        return data
      } catch (error) {
        console.error('获取新闻列表失败:', error)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // 提交联系表单
    async submitContactForm({ commit }, formData) {
      try {
        commit('SET_LOADING', true)
        // 这里应该是实际的API调用
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        })
        const data = await response.json()
        return data
      } catch (error) {
        console.error('提交表单失败:', error)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    }
  },

  getters: {
    // 获取用户信息
    getUserInfo: state => state.userInfo,

    // 获取网站信息
    getSiteInfo: state => state.siteInfo,

    // 获取导航菜单
    getMenuItems: state => state.menuItems,

    // 获取加工工艺列表
    getProcessList: state => state.processList,

    // 获取新闻列表
    getNewsList: state => state.newsList,

    // 获取加载状态
    isLoading: state => state.loading,

    // 获取特定新闻
    getNewsById: state => id => {
      return state.newsList.find(news => news.id === id)
    },

    // 获取特定工艺
    getProcessById: state => id => {
      return state.processList.find(process => process.id === id)
    }
  },

  // 模块
  modules: {
    // 可以添加其他模块
  }
})