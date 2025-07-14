// jest/Login.spec.js

import { mount } from '@vue/test-utils';
import Login from '@/components/SignIn/Login.vue';
import { createPinia } from 'pinia';
import { useUserStore } from '@/store/user';
import ElementPlus from 'element-plus';
import flushPromises from 'flush-promises';
import axios from 'axios';

// 关键修复 1: 更显式地模拟 useRouter 和 push 方法
const mockRouterPush = jest.fn();
jest.mock('vue-router', () => ({
  useRouter: jest.fn(() => ({
    push: mockRouterPush,
    // 如果组件内部还使用了 useRouter 返回的其他属性或方法 (如 replace, currentRoute 等)，也需要在这里模拟
  })),
}));

// 关键修复 2: 模拟 axios 包本身
jest.mock('axios'); // 模拟整个 axios 包

// Mock service
jest.mock('@/utils/request', () => ({
  post: jest.fn(),
  get: jest.fn(),
}));

// 关键修复 3: 模拟 Element-Plus 的 ElMessage
jest.mock('element-plus', () => ({
  ...jest.requireActual('element-plus'),
  ElMessage: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// 在 describe 作用域内引用我们显式创建的模拟函数和从 mock 中获取的引用
const routerPushSpy = mockRouterPush;
const ElMessageSpy = jest.requireMock('element-plus').ElMessage; // 获取 ElMessage 的模拟引用

// 用于存储原始的 window.location 对象
let originalWindowLocation;

describe('Login.vue', () => {
  let wrapper;
  let userStore;

  beforeEach(() => {
    // 在每个测试前重置 Jest 模拟函数的状态
    jest.clearAllMocks(); // 清理所有模拟函数的调用记录和返回值

    // 关键修复 4: 完全模拟 window.location
    // 保存原始的 window.location
    originalWindowLocation = window.location;

    // 创建一个可控的 location 对象
    const mockLocation = {
      assign: jest.fn(), // 模拟 assign 方法，组件内部常用此方法进行导航
      replace: jest.fn(), // 如果您的代码使用 replace，也需要模拟
      reload: jest.fn(),  // 如果您的代码使用 reload，也需要模拟
      // 您可以为 href 添加 getter/setter，或者仅在需要时设置一个默认值
      // 对于大多数导航测试，模拟 assign 就足够了
      set href(value) {
        // 当代码尝试设置 href 时，记录这个值
        this._href = value;
      },
      get href() {
        // 返回当前模拟的 href 值
        return this._href || originalWindowLocation.href; // 默认返回原始的 href
      },
      _href: originalWindowLocation.href, // 初始化模拟的 href
      // 添加其他您可能需要的 location 属性，例如 hostname, protocol 等
      hostname: originalWindowLocation.hostname,
      protocol: originalWindowLocation.protocol,
      origin: originalWindowLocation.origin,
      pathname: originalWindowLocation.pathname,
      search: originalWindowLocation.search,
      hash: originalWindowLocation.hash,
    };

    // 使用 Object.defineProperty 替换全局的 window.location
    // configurable: true 允许我们在 afterEach 中恢复它
    Object.defineProperty(window, 'location', {
      configurable: true,
      writable: true, // 确保我们可以写入新的 value
      value: mockLocation,
    });

    const pinia = createPinia();

    wrapper = mount(Login, {
      global: {
        // 在插件数组中注册 Pinia 和 ElementPlus
        plugins: [pinia, ElementPlus],
        // 只 stub router-link
        stubs: {
          'router-link': true,
        },
      },
    });

    // 在组件挂载后，获取 store 的实例
    userStore = useUserStore();
  });

  afterEach(() => {
    // 关键修复 4 (续): 在每个测试后恢复原始的 window.location
    Object.defineProperty(window, 'location', {
      configurable: true,
      writable: true,
      value: originalWindowLocation,
    });

    jest.clearAllMocks(); // 清理所有模拟函数的调用记录
  });

  // 测试 1: 组件是否成功渲染了标题和表单
  it('renders the login form correctly', () => {
    expect(wrapper.find('h1.title').text()).toBe('Sign In');
    // 断言 Element-Plus 组件是否存在
    expect(wrapper.findComponent({ name: 'ElFormItem' }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: 'ElInput' }).exists()).toBe(true);
    expect(wrapper.find('.login-btn').exists()).toBe(true);
    // 检查 Logo 图片是否存在 (如果需要更详细的测试，可以断言 src 属性或 alt 属性)
    expect(wrapper.find('img.logo').exists()).toBe(true);
    // 检查 Google 登录按钮和图标是否存在
    expect(wrapper.find('.google-btn').exists()).toBe(true);
    expect(wrapper.find('.google-icon').exists()).toBe(true);
    // 关键修复 5: 检查 router-link-stub 的 to 属性，而不是查找内部的 a 标签
    const signupLink = wrapper.findComponent({ name: 'RouterLinkStub' });
    expect(signupLink.exists()).toBe(true);
    expect(signupLink.props().to).toBe('/register');
    // 还可以进一步检查文本内容
    expect(signupLink.text()).toBe('Sign up');
  });

  // 测试 2: 邮箱和密码输入是否能更新 data
  it('updates form model when typing in email and password fields', async () => {
    // 查找真实的 <input> DOM 元素进行交互
    const emailInput = wrapper.find('input[type="email"]');
    const passwordInput = wrapper.find('input[type="password"]');

    // 检查输入框是否存在
    expect(emailInput.exists()).toBe(true);
    expect(passwordInput.exists()).toBe(true);

    await emailInput.setValue('test@example.com');
    await passwordInput.setValue('password123');

    // 直接断言组件内部的数据模型是否已更新
    expect(wrapper.vm.form.email).toBe('test@example.com');
    expect(wrapper.vm.form.password).toBe('password123');
  });

  // 测试 3: 成功的邮件登录流程
  it('handles email login successfully and navigates to home', async () => {
    const service = require('@/utils/request'); // 获取 service 的 mock

    // 模拟成功的 API 响应
    service.post.mockResolvedValue({ status: 200 });
    service.get.mockResolvedValue({ status: 200, data: { id: 'mock-user-id', name: 'Test User', email: 'test@example.com' } }); // 模拟返回完整用户信息

    // 填充表单
    await wrapper.find('input[type="email"]').setValue('test@example.com');
    await wrapper.find('input[type="password"]').setValue('password123');

    // 触发登录按钮点击事件
    await wrapper.find('.login-btn').trigger('click');

    // 同时等待所有 Promise 完成和 Vue 的下一个更新周期
    await flushPromises(); // 等待 API 请求和 Pinia 状态更新等 Promise 完成
    await wrapper.vm.$nextTick(); // 等待 Vue 完成因状态变化可能引起的 DOM 更新或副作用

    // 检查是否调用了登录 API
    expect(service.post).toHaveBeenCalledTimes(1); // 确保只调用一次
    expect(service.post).toHaveBeenCalledWith(
      '/api/login/email/login',
      { email: 'test@example.com', password: 'password123' },
      { withCredentials: true }
    );

    // 检查是否弹出了成功消息 (使用 ElMessageSpy)
    expect(ElMessageSpy.success).toHaveBeenCalledTimes(1); // 确保只调用一次
    expect(ElMessageSpy.success).toHaveBeenCalledWith('登录成功！');

    // 检查是否调用了获取用户信息的 API
    expect(service.get).toHaveBeenCalledTimes(1); // 确保只调用一次
    expect(service.get).toHaveBeenCalledWith('/api/login/check_login', { withCredentials: true });

    // 检查用户信息是否被正确设置到 store
    expect(userStore.user).toEqual({ id: 'mock-user-id', name: 'Test User', email: 'test@example.com' });

    // 断言我们显式创建的模拟函数是否被调用
    expect(routerPushSpy).toHaveBeenCalledTimes(1); // 确保只调用一次
    expect(routerPushSpy).toHaveBeenCalledWith('/');

    // 检查 loading 状态是否正确 (可选)
    expect(wrapper.vm.loading).toBe(false);
  });

  // 测试 4: Google 登录流程
  it('handles Google login and redirects', async () => {
    // 使用模拟的 axios.get 方法进行模拟
    axios.get.mockResolvedValue({
      data: {
        success: true,
        auth_url: 'http://mock-google-auth-url.com'
      }
    });

    // 触发 Google 登录按钮点击事件
    await wrapper.find('.google-btn').trigger('click');

    // 等待 Promise 完成
    await flushPromises();

    // 检查是否调用了 Google 登录 API (使用模拟的 axios.get)
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      '/api/login/login',
      { withCredentials: true }
    );

    // 关键修复 6: 断言 window.location.href 的值是否被设置
    // 如果组件代码是通过 window.location.href = '...' 进行跳转的，
    // 我们现在可以通过我们自定义的 mockLocation.href 的 getter 来获取并断言
    expect(window.location.href).toBe('http://mock-google-auth-url.com');
    // 如果组件内部使用的是 window.location.assign()，则应该断言 assign 方法被调用
    expect(window.location.assign).toHaveBeenCalledTimes(1);
    expect(window.location.assign).toHaveBeenCalledWith('http://mock-google-auth-url.com');
  });

  // 测试 5: 邮件登录失败流程
  it('handles email login failure and displays error message', async () => {
    const service = require('@/utils/request'); // 获取 service 的 mock

    // 模拟登录 API 失败响应
    service.post.mockRejectedValue({
      response: {
        data: {
          detail: 'Invalid credentials'
        }
      }
    });

    // 填充表单 (即使是无效的凭证也需要填充)
    await wrapper.find('input[type="email"]').setValue('invalid@example.com');
    await wrapper.find('input[type="password"]').setValue('wrongpassword');

    // 触发登录按钮点击事件
    await wrapper.find('.login-btn').trigger('click');

    // 等待 Promise 完成 (等待 post 请求的 reject)
    await flushPromises();
    // 等待 Vue 的下一个更新周期，确保 ElMessage 被调用
    await wrapper.vm.$nextTick();

    // 检查是否调用了登录 API
    expect(service.post).toHaveBeenCalledTimes(1);

    // 检查是否弹出了错误消息 (使用 ElMessageSpy)
    expect(ElMessageSpy.error).toHaveBeenCalledTimes(1);
    expect(ElMessageSpy.error).toHaveBeenCalledWith('Invalid credentials');

    // 检查 router.push 是否没有被调用
    expect(routerPushSpy).not.toHaveBeenCalled();

    // 检查 loading 状态是否正确
    expect(wrapper.vm.loading).toBe(false);
  });
});