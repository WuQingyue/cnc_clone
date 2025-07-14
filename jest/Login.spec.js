// jest/Login.spec.js

// ❗️ 修复 1: 导入 mount 进行完全挂载，而不是 shallowMount
// jest/Login.spec.js

import { mount } from '@vue/test-utils';
import Login from '@/components/SignIn/Login.vue'; // 确保这个路径和您的项目结构一致
import { createPinia } from 'pinia';
import { useUserStore } from '@/store/user';
import ElementPlus from 'element-plus'; // ❗️ 关键修复 1: 导入 Element-Plus

// Mock 依赖项 (保持不变)
jest.mock('vue-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('@/utils/request', () => ({
  post: jest.fn(),
  get: jest.fn(),
}));

// Mock ElMessage (保持不变)
jest.mock('element-plus', () => ({
  ...jest.requireActual('element-plus'),
  ElMessage: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));


describe('Login.vue', () => {
  let wrapper;
  let userStore;

  // 在每个测试前重新挂载组件并设置 store
  beforeEach(() => {
    const pinia = createPinia();

    wrapper = mount(Login, {
      global: {
        // ❗️ 关键修复 2: 在插件数组中注册 ElementPlus
        plugins: [pinia, ElementPlus],
        stubs: {
          'router-link': true, // 只 stub router-link 即可
        },
      },
    });

    userStore = useUserStore();
  });

  // 清理 mock (保持不变)
  afterEach(() => {
    jest.clearAllMocks();
  });

  // 测试 1: 组件是否成功渲染了标题和表单
  it('renders the login form correctly', () => {
    expect(wrapper.find('h1.title').text()).toBe('Sign In');
    // 断言 Element-Plus 组件是否存在
    expect(wrapper.findComponent({ name: 'ElFormItem' }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: 'ElInput' }).exists()).toBe(true);
    expect(wrapper.find('.login-btn').exists()).toBe(true);
  });

  // 测试 2: 邮箱和密码输入是否能更新 data
  it('updates form model when typing in email and password fields', async () => {
    // 查找真实的 <input> DOM 元素进行交互
    const emailInput = wrapper.find('input[type="email"]');
    const passwordInput = wrapper.find('input[type="password"]');

    await emailInput.setValue('test@example.com');
    await passwordInput.setValue('password123');

    // 直接断言组件内部的数据模型是否已更新
    expect(wrapper.vm.form.email).toBe('test@example.com');
    expect(wrapper.vm.form.password).toBe('password123');
  });

  // 测试 3: 成功的邮件登录流程
  it('handles email login successfully and navigates to home', async () => {
    const service = require('@/utils/request');
    const router = require('vue-router').useRouter();
    const { ElMessage } = require('element-plus'); // 获取 mock 后的 ElMessage

    // 模拟成功的 API 响应
    service.post.mockResolvedValue({ status: 200 });
    service.get.mockResolvedValue({ status: 200, data: { name: 'Test User', email: 'test@example.com' } });
    
    // 填充表单
    await wrapper.find('input[type="email"]').setValue('test@example.com');
    await wrapper.find('input[type="password"]').setValue('password123');

    // 触发登录
    await wrapper.find('.login-btn').trigger('click');
    
    // 等待所有异步操作完成
    await new Promise(resolve => setTimeout(resolve,0));

    // 检查是否调用了登录 API
    expect(service.post).toHaveBeenCalledWith(
      '/api/login/email/login',
      { email: 'test@example.com', password: 'password123' },
      { withCredentials: true }
    );
    
    // 检查是否弹出了成功消息
    expect(ElMessage.success).toHaveBeenCalledWith('登录成功！');

    // 检查是否调用了获取用户信息的 API
    expect(service.get).toHaveBeenCalledWith('/api/login/check_login', { withCredentials: true });
    
    // 检查用户信息是否被存储
    expect(userStore.user.name).toBe('Test User');

    // 检查是否跳转到了首页
    expect(router.push).toHaveBeenCalledWith('/');
  });
});