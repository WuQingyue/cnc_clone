import { shallowMount } from '@vue/test-utils'
import Login from '@/views/Login.vue' // 假设你的组件路径是这个
import { createStore } from 'pinia'
import { useUserStore } from '@/store/user'

// Mock 依赖
jest.mock('vue-router', () => ({
  useRouter: () => ({
    push: jest.fn(), // Mock push 方法
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
    const pinia = createStore()
    userStore = useUserStore(pinia)

    wrapper = shallowMount(Login, {
      global: {
        plugins: [pinia],
        stubs: ['el-form', 'el-form-item', 'el-input', 'el-button', 'el-message', 'router-link'],
      },
    })
  })

  // 测试 1: 组件是否成功渲染了标题和表单
  it('renders the login form correctly', () => {
    expect(wrapper.find('h1.title').text()).toBe('Sign In')
    expect(wrapper.find('el-form-item[label="Email"]').exists()).toBe(true)
    expect(wrapper.find('el-form-item[label="Password"]').exists()).toBe(true)
    expect(wrapper.find('.login-btn').exists()).toBe(true)
  })

  // 测试 2: 邮箱和密码输入是否能更新 data
  it('updates form data when typing in email and password fields', async () => {
    const emailInput = wrapper.findComponent({ name: 'el-input', props: { type: 'email' } })
    const passwordInput = wrapper.findComponent({ name: 'el-input', props: { type: 'password' } })

    await emailInput.setValue('test@example.com')
    await passwordInput.setValue('password123')

    expect(wrapper.vm.form.email).toBe('test@example.com')
    expect(wrapper.vm.form.password).toBe('password123')
  })

  // 测试 3: 点击登录按钮时，如果表单无效，不应发送请求
  it('does not submit login form if validation fails', async () => {
    const service = require('@/utils/request')
    const loginButton = wrapper.find('.login-btn')
    
    await loginButton.trigger('click')

    // 由于表单为空，验证会失败，所以 post 请求不应该被调用
    expect(service.post).not.toHaveBeenCalled()
  })

  // 测试 4: 成功的邮件登录流程
  it('handles email login successfully and navigates to home', async () => {
    const service = require('@/utils/request')
    const router = require('vue-router').useRouter()

    // 模拟成功的 API 响应
    service.post.mockResolvedValue({ status: 200 })
    service.get.mockResolvedValue({ status: 200, data: { name: 'Test User', email: 'test@example.com' } })
    
    // 填充表单
    await wrapper.setData({
      form: {
        email: 'test@example.com',
        password: 'password123'
      }
    })

    // 触发登录
    const loginButton = wrapper.find('.login-btn')
    await loginButton.trigger('click')
    
    // 检查是否调用了登录 API
    expect(service.post).toHaveBeenCalledWith(
      '/api/login/email/login',
      { email: 'test@example.com', password: 'password123' },
      { withCredentials: true }
    )

    // 等待异步操作完成
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    // 检查是否调用了获取用户信息的 API
    expect(service.get).toHaveBeenCalledWith('/api/login/check_login', { withCredentials: true })
    
    // 检查用户信息是否被存储
    expect(userStore.user.name).toBe('Test User')

    // 检查是否跳转到了首页
    expect(router.push).toHaveBeenCalledWith('/')
  })
})