// jest/Login.spec.js

import { shallowMount } from '@vue/test-utils'
import Login from '@/views/Login.vue' // 确保路径正确
import { createPinia } from 'pinia' // ❗️【修复】从 'pinia' 导入 createPinia，而不是 createStore
import { useUserStore } from '@/store/user'

// Mock 依赖项
jest.mock('vue-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

jest.mock('@/utils/request', () => ({
  post: jest.fn(),
  get: jest.fn(),
}))

describe('Login.vue', () => {
  let wrapper
  let userStore

  // 在每个测试前重新挂载组件并设置 store
  beforeEach(() => {
    // ❗️【修复】为每个测试创建一个新的、干净的 Pinia 实例
    const pinia = createPinia()

    wrapper = shallowMount(Login, {
      global: {
        // 将 pinia 实例作为插件传递给组件
        plugins: [pinia],
        stubs: ['el-form', 'el-form-item', 'el-input', 'el-button', 'el-message', 'router-link'],
      },
    })

    // 在组件挂载后，获取 store 的实例以进行断言
    userStore = useUserStore()
  })

  // 清理 mock
  afterEach(() => {
    jest.clearAllMocks();
  });

  // 测试 1: 组件是否成功渲染了标题和表单
  it('renders the login form correctly', () => {
    expect(wrapper.find('h1.title').text()).toBe('Sign In')
    expect(wrapper.find('el-form-item[label="Email"]').exists()).toBe(true)
    expect(wrapper.find('el-form-item[label="Password"]').exists()).toBe(true)
    expect(wrapper.find('.login-btn').exists()).toBe(true)
  })

  // 测试 2: 邮箱和密码输入是否能更新 data
  // ❗️【修复】由于 Vue 3 + script setup，直接访问 vm.form 不可靠。
  // 我们通过查找组件的 v-model 来验证
  it('updates form model when typing in email and password fields', async () => {
    const emailInput = wrapper.findComponent({ props: { placeholder: 'Enter your email' } })
    const passwordInput = wrapper.findComponent({ props: { placeholder: 'Enter your password' } })

    await emailInput.setValue('test@example.com')
    await passwordInput.setValue('password123')
    
    // El-input 的 v-model 会触发 update:modelValue 事件
    expect(emailInput.emitted('update:modelValue')[0]).toEqual(['test@example.com'])
    expect(passwordInput.emitted('update:modelValue')[0]).toEqual(['password123'])
  })

  // 测试 3: 成功的邮件登录流程
  it('handles email login successfully and navigates to home', async () => {
    const service = require('@/utils/request')
    const router = require('vue-router').useRouter()

    // 模拟成功的 API 响应
    service.post.mockResolvedValue({ status: 200 })
    service.get.mockResolvedValue({ status: 200, data: { name: 'Test User', email: 'test@example.com' } })
    
    // 填充表单
    await wrapper.findComponent({ props: { placeholder: 'Enter your email' } }).setValue('test@example.com')
    await wrapper.findComponent({ props: { placeholder: 'Enter your password' } }).setValue('password123')


    // 触发登录
    await wrapper.find('.login-btn').trigger('click')
    
    // 等待异步操作完成
    await new Promise(resolve => setTimeout(resolve, 0));

    // 检查是否调用了登录 API
    expect(service.post).toHaveBeenCalledWith(
      '/api/login/email/login',
      { email: 'test@example.com', password: 'password123' },
      { withCredentials: true }
    )
    
    // 检查是否调用了获取用户信息的 API
    expect(service.get).toHaveBeenCalledWith('/api/login/check_login', { withCredentials: true })
    
    // 检查用户信息是否被存储
    expect(userStore.user.name).toBe('Test User')

    // 检查是否跳转到了首页
    expect(router.push).toHaveBeenCalledWith('/')
  })
})