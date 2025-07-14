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
  // 确保 RouterLink 可以被 stub
  RouterLink: {
    name: 'RouterLinkStub',
    props: ['to'],
    template: '<a><slot /></a>', // 简单的模板用于渲染内容
  },
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
// 用于存储模拟的 href 值，并作为 mockLocation 的内部状态
let mockHref = '';

describe('Login.vue', () => {
  let wrapper;
  let userStore;

  beforeEach(() => {
    // 在每个测试前重置 Jest 模拟函数的状态
    jest.clearAllMocks(); // 清理所有模拟函数的调用记录和返回值

    // 关键修复 4: 完全模拟 window.location，并确保 href 的赋值可被捕获
    // 保存原始的 window.location
    originalWindowLocation = window.location;

    // 创建一个可控的 location 对象
    const mockLocation = {
      assign: jest.fn(), // 模拟 assign 方法
      replace: jest.fn(), // 模拟 replace 方法
      reload: jest.fn(),  // 模拟 reload 方法
      // 为 href 添加 getter/setter，以便我们可以捕获对它的赋值
      set href(value) {
        mockHref = value; // 当 href 被设置时，更新 mockHref
      },
      get href() {
        return mockHref; // 返回当前模拟的 href 值
      },
      // 添加其他您可能需要的 location 属性，初始化为原始值
      hostname: originalWindowLocation.hostname,
      protocol: originalWindowLocation.protocol,
      origin: originalWindowLocation.origin,
      pathname: originalWindowLocation.pathname,
      search: originalWindowLocation.search,
      hash: originalWindowLocation.hash,
    };

    // 使用 Object.defineProperty 替换全局的 window.location
    Object.defineProperty(window, 'location', {
      configurable: true,
      writable: true,
      value: mockLocation,
    });

    // 初始化 mockHref
    mockHref = 'http://localhost/'; // 确保在每个测试开始时有一个初始值

    const pinia = createPinia();

    wrapper = mount(Login, {
      global: {
        // 在插件数组中注册 Pinia 和 ElementPlus
        plugins: [pinia, ElementPlus],
        // 关键修复 5: 确保 router-link 被正确 stub
        stubs: {
          RouterLink: true, // 使用导入的 RouterLink 名称进行 stub
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
    mockHref = ''; // 重置 mockHref
  });

  // 测试 1: 组件是否成功渲染了标题和表单
  it('renders the login form correctly', () => {
    expect(wrapper.find('h1.title').text()).toBe('Sign In');
    // 断言 Element-Plus 组件是否存在
    expect(wrapper.findComponent({ name: 'ElFormItem' }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: 'ElInput' }).exists()).toBe(true);
    expect(wrapper.find('.login-btn').exists()).toBe(true);
    // 检查 Logo 图片是否存在
    expect(wrapper.find('img.logo').exists()).toBe(true);
    // 检查 Google 登录按钮和图标是否存在
    expect(wrapper.find('.google-btn').exists()).toBe(true);
    expect(wrapper.find('.google-icon').exists()).toBe(true);
    // 关键修复 5: 检查 router-link-stub 的 to 属性
    // 由于我们已经将 RouterLink stub 为 RouterLinkStub，所以可以直接查找它的组件实例
    const signupLink = wrapper.findComponent({ name: 'RouterLinkStub' });
    expect(signupLink.exists()).toBe(true); // 现在这个应该会通过
    expect(signupLink.props().to).toBe('/register');
    // 还可以进一步检查文本内容
    expect(signupLink.text()).toBe('Sign up');
  });

  // 测试 2: 邮箱和密码输入是否能更新 data
  it('updates form model when typing in email and password fields', async () => {
    const emailInput = wrapper.find('input[type="email"]');
    const passwordInput = wrapper.find('input[type="password"]');

    expect(emailInput.exists()).toBe(true);
    expect(passwordInput.exists()).toBe(true);

    await emailInput.setValue('test@example.com');
    await passwordInput.setValue('password123');

    expect(wrapper.vm.form.email).toBe('test@example.com');
    expect(wrapper.vm.form.password).toBe('password123');
  });

  // 测试 3: 成功的邮件登录流程
  it('handles email login successfully and navigates to home', async () => {
    const service = require('@/utils/request');

    service.post.mockResolvedValue({ status: 200 });
    service.get.mockResolvedValue({ status: 200, data: { id: 'mock-user-id', name: 'Test User', email: 'test@example.com' } });

    await wrapper.find('input[type="email"]').setValue('test@example.com');
    await wrapper.find('input[type="password"]').setValue('password123');

    await wrapper.find('.login-btn').trigger('click');

    await flushPromises();
    await wrapper.vm.$nextTick();

    expect(service.post).toHaveBeenCalledTimes(1);
    expect(service.post).toHaveBeenCalledWith(
      '/api/login/email/login',
      { email: 'test@example.com', password: 'password123' },
      { withCredentials: true }
    );

    expect(ElMessageSpy.success).toHaveBeenCalledTimes(1);
    expect(ElMessageSpy.success).toHaveBeenCalledWith('登录成功！');

    expect(service.get).toHaveBeenCalledTimes(1);
    expect(service.get).toHaveBeenCalledWith('/api/login/check_login', { withCredentials: true });

    expect(userStore.user).toEqual({ id: 'mock-user-id', name: 'Test User', email: 'test@example.com' });

    expect(routerPushSpy).toHaveBeenCalledTimes(1);
    expect(routerPushSpy).toHaveBeenCalledWith('/');

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
    // 因为组件代码中使用了 window.location.href = ... 进行跳转
    expect(window.location.href).toBe('http://mock-google-auth-url.com');
    // 注意：由于您的组件代码是直接赋值给 href，而不是调用 assign，所以 assign 应该不会被调用。
    // 如果您希望测试 assign，您需要修改组件代码以使用 assign。
    expect(window.location.assign).not.toHaveBeenCalled(); // 确保 assign 没有被调用
  });

  // 测试 5: 邮件登录失败流程
  it('handles email login failure and displays error message', async () => {
    const service = require('@/utils/request');

    service.post.mockRejectedValue({
      response: {
        data: {
          detail: 'Invalid credentials'
        }
      }
    });

    await wrapper.find('input[type="email"]').setValue('invalid@example.com');
    await wrapper.find('input[type="password"]').setValue('wrongpassword');

    await wrapper.find('.login-btn').trigger('click');

    await flushPromises();
    await wrapper.vm.$nextTick();

    expect(service.post).toHaveBeenCalledTimes(1);

    expect(ElMessageSpy.error).toHaveBeenCalledTimes(1);
    expect(ElMessageSpy.error).toHaveBeenCalledWith('Invalid credentials');

    expect(routerPushSpy).not.toHaveBeenCalled();

    expect(wrapper.vm.loading).toBe(false);
  });
});