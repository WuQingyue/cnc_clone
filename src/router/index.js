import { createRouter, createWebHistory } from 'vue-router'
import ServiceGuidance from '@/components/NavHeader/ServiceGuidance/ServiceGuidance.vue'
import { useAuthStore } from '@/store/modules/auth'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home/Home.vue'),
    meta: {
      title: '首页 - 嘉立诚数控'
    }
  },
  {
    path: '/news',
    name: 'News',
    component: () => import('@/views/NavHeader/About/News.vue'),
    meta: {
      title: '新闻资讯 - 嘉立诚数控'
    }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/NavHeader/About/About.vue'),
    meta: {
      title: '关于我们 - 嘉立诚数控'
    }
  },
  {
    path: '/contact',
    name: 'Contact',
    component: () => import('@/views/NavHeader/Contact/Contact.vue'),
    meta: {
      title: '联系我们 - 嘉立诚数控'
    }
  },
  {
    // 404页面
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: {
      title: '页面未找到 - 嘉立诚数控'
    }
  },
  {
    path: '/service-guidance',
    name: 'ServiceGuidance',
    component: ServiceGuidance
  },
  {
    path: '/quote',
    name: 'OnlineQuote',
    component: () => import('@/views/Order/OnlineQuote.vue')
  },
  // {
  //   path: '/mechanical',
  //   name: 'MechanicalParts',
  //   component: () => import('@/views/MechanicalParts.vue')
  // },
  // {
  //   path: '/aluminum',
  //   name: 'AluminumCase',
  //   component: () => import('@/views/AluminumCase.vue')

  // },
  {
    path: '/sales-promotion',
    name: 'SalesPromotion',
    component: () => import('@/components/NavHeader/SalesPromotion.vue')
  },
  
  {
    path: '/coupons',
    name: 'CouponCenter',
    component: () => import('@/components/CouponCenter/CouponsCenter.vue'),
  },
  {
    path: '/materials',
    name: 'Materials',
    component: () => import('@/components/NavHeader/MaterialsIntroduction.vue')
  },
  {
    path: '/material/:materialId',
    name: 'MaterialDetail',
    component: () => import('@/views/NavHeader/MaterialDetail.vue')
  },
  {
    path: '/user-evaluation',
    name: 'UserEvaluation',
    component: () => import('@/components/NavHeader/ServiceGuidance/UserEvaluation.vue'),
  },
  {
    path: '/technical-column',
    name: 'TechnicalColumn',
    component: () => import('@/components/NavHeader/ServiceGuidance/TechnicalColumn.vue'),
  },
  {
    path: '/forum',
    name: 'TechForum',
    component: () => import('@/components/NavHeader/ServiceGuidance/TechForum.vue'),
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/components/SignUp/Register.vue'),
    meta: {
      title: '用户注册',
      guest: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/components/SignIn/Login.vue'),
    meta: {
      title: '登录 - 嘉立创',
      guest: true
    }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/views/Admin/Admin.vue')
  },
  {
    path: '/members',
    name: 'Members',
    component: () => import('@/views/Members/Members.vue'),
  },
  {
    path: '/guidance',
    name: 'CustomerGuidance',
    component: () => import('@/views/NavHeader/CustomerGuidance/CustomerGuidance.vue')
  },
  {
    path: '/price-inquiry',
    name: 'PriceInquiry',
    component: () => import('@/views/Order/PriceInquiry.vue'),
    meta: {
      title: '订单询价'
    }
  },
  {
    path: '/submitOrderSuccess',
    name: 'SubmitOrder',
    component: () => import('@/views/Order/SubmitOrder.vue')
  },
  {
    path: '/cnc_order',
    name: 'cncOrder',
    component: () => import('@/components/Order/cncOrder.vue')
  },
  {
    path: '/cnc_paid_order',
    name: 'cncPaidOrder',
    component: () => import('@/components/Order/cncPaidOrder.vue')
  },
  {
    path: '/unified-payment',
    name: 'UnifiedPaymentCenter',
    component: () => import('@/components/Order/UnifiedPaymentCenter.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  // 页面滚动行为
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  
  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - 嘉立创` : '嘉立创'
  
  // // 处理需要登录的页面
  // if (to.meta.requiresAuth && !auth.isAuthenticated) {
  //   next({ name: 'Login', query: { redirect: to.fullPath } })
  //   return
  // }
  
  // // 处理游客页面
  // if (to.meta.guest && auth.isAuthenticated) {
  //   next({ name: 'Home' })
  //   return
  // }
  
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next({ path: '/register' }) // 改为重定向到注册页
    return
  }
  
  if (to.meta.guest && auth.isAuthenticated) {
    next({ path: '/' })
    return
  }

  // console.log('路由变化:', {
  //   to: to.fullPath,
  //   query: to.query,
  //   params: to.params
  // })

  next()
})

export default router