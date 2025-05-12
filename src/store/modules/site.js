import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useSiteStore = defineStore('site', () => {
  // state
  const siteInfo = ref({
    name: '厦门修蓁慧进技术有限公司',
    phone: '400-0755-519',
    email: 'info@jlc-cnc.com',
    address: '深圳市宝安区福永街道凤凰工业园',
    beian: '粤ICP备XXXXXXXX号-1'
  })

  const menuItems = ref([
    { name: '首页', path: '/' },
    { name: '产品中心', path: '/products' },
    { name: '加工工艺', path: '/process' },
    { name: '新闻资讯', path: '/news' },
    { name: '关于我们', path: '/about' },
    { name: '联系我们', path: '/contact' }
  ])

  const processList = ref([
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
  ])

  // getters
  const getSiteInfo = computed(() => siteInfo.value)
  const getMenuItems = computed(() => menuItems.value)
  const getProcessList = computed(() => processList.value)
  const getProcessById = computed(() => (id) => {
    return processList.value.find(process => process.id === id)
  })

  return {
    siteInfo,
    menuItems,
    processList,
    getSiteInfo,
    getMenuItems,
    getProcessList,
    getProcessById
  }
})
