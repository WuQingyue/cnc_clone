import { createRouter, createWebHistory } from 'vue-router'
import ServiceGuidance from '@/components/NavHeader/ServiceGuidance/ServiceGuidance.vue'
import { useUserStore } from '@/store/user'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home/Home.vue'),
    meta: {
      title: '首页 - SmartCNC'
    }
  },
  {
    path: '/news',
    name: 'News',
    component: () => import('@/views/NavHeader/About/News.vue'),
    meta: {
      title: '新闻资讯 - SmartCNC'
    }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/NavHeader/About/About.vue'),
    meta: {
      title: '关于我们 - SmartCNC'
    }
  },
  {
    path: '/contact',
    name: 'Contact',
    component: () => import('@/views/NavHeader/Contact/Contact.vue'),
    meta: {
      title: '联系我们 - SmartCNC'
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
      title: '登录',
      guest: true
    }
  },
  {
    path: '/cart',
    name: 'Cart',
    component: () => import('@/components/Cart/cart.vue'),
    meta: {
      title: '购物车',
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
  },
  {
    // 404页面
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: {
      title: '页面未找到 - SmartCNC'
    }
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
  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - SmartCNC` : 'SmartCNC'

  const userStore = useUserStore()
  const isLoggedIn = !!userStore.user // 检查用户是否存在来判断登录状态

  const requiresAuth = to.meta.requiresAuth;
  const isGuestPage = to.meta.guest;

  if (requiresAuth && !isLoggedIn) {
    // 如果页面需要登录，但用户未登录，则重定向到登录页
    // 将用户尝试访问的页面路径作为查询参数，以便登录后可以跳回
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } else if (isGuestPage && isLoggedIn) {
    // 如果用户已登录，但尝试访问访客页面（如登录、注册页），则重定向到首页
    next({ name: 'Home' })
  } else {
    // 其他情况，直接放行
    next()
  }
})


export default router