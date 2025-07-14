// jest/Login.spec.js

import { mount } from '@vue/test-utils'; // ❗️ 使用 mount
import Login from '@/components/SignIn/Login.vue'; // 确保这个路径和您的项目结构一致
import { createPinia } from 'pinia';
import { useUserStore } from '@/store/user';
import ElementPlus from 'element-plus'; // 导入 Element-Plus
import flushPromises from 'flush-promises'; // 导入 flushPromises

// ❗️ 关键修复 1: 更显式地模拟 useRouter 和 push 方法
// 在 mock 工厂函数外部创建模拟函数
const mockRouterPush = jest.fn();
jest.mock('vue-router', () => ({
  // useRoute 示例，如果组件中使用了 route 对象，可能需要模拟
  // useRoute: jest.fn(() => ({ path: '/mock-current-path' })),
  useRouter: jest.fn(() => ({
    push: mockRouterPush,
    // 如果组件内部还使用了 useRouter 返回的其他属性或方法 (如 replace, currentRoute 等)，也需要在这里模拟
    // replace: jest.fn(),
    // currentRoute: { value: { path: '/mock-current-path' } }
  })),
  // 如果组件直接从 vue-router 导入了其他内容，也需要在这里导出模拟
}));


jest.mock('@/utils/request', () => ({
  post: jest.fn(),
  get: jest.fn(),
  // 如果 service 对象还有其他方法（如 put, delete 等），也需要在这里模拟
}));

// Mock ElMessage (保持不变)
jest.mock('element-plus', () => ({
  ...jest.requireActual('element-plus'), // 保留其他 element-plus 的真实功能
  ElMessage: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));


describe('Login.vue', () => {
  let wrapper;
  let userStore;
  // ❗️ 关键修复 2: 在 describe 作用域内引用我们显式创建的模拟函数
  const routerPushSpy = mockRouterPush;


  // 在每个测试前重新挂载组件并设置 store
  beforeEach(() => {
    // 在每个测试前重置 Jest 模拟函数的状态
    jest.clearAllMocks(); // 清理所有模拟函数的调用记录和返回值

    const pinia = createPinia();

    wrapper = mount(Login, {
      global: {
        // ❗️ 关键修复 3: 在插件数组中注册 Pinia 和 ElementPlus
        plugins: [pinia, ElementPlus],
        // 不再需要 stub Element-Plus 的组件
        stubs: {
          'router-link': true, // 只 stub router-link 即可
        },
         // 如果组件使用了全局注册的组件、指令、Mixin 等，也需要在这里提供
        // components: { 'some-globally-registered-comp': SomeComp },
        // directives: { 'some-directive': SomeDirective },
        // mixins: [SomeMixin],
      },
      // 如果组件通过 provide/inject 依赖了什么，也需要在这里提供
      // provide: { 'some-key': 'some-value' },
    });

    // 在组件挂载后，获取 store 的实例
    userStore = useUserStore();
  });

  // afterEach 可以选择性保留，因为 beforeEach 中已经 clearAllMocks 了
  // afterEach(() => {
  //    jest.clearAllMocks();
  // });

  // 测试 1: 组件是否成功渲染了标题和表单
  it('renders the login form correctly', () => {
    expect(wrapper.find('h1.title').text()).toBe('Sign In');
    // 断言 Element-Plus 组件是否存在，现在 mount 后它们会被渲染
    expect(wrapper.findComponent({ name: 'ElFormItem' }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: 'ElInput' }).exists()).toBe(true);
    expect(wrapper.find('.login-btn').exists()).toBe(true);
    // 检查 Logo 图片是否存在 (如果需要更详细的测试，可以断言 src 属性或 alt 属性)
    expect(wrapper.find('img.logo').exists()).toBe(true);
    // 检查 Google 登录按钮和图标是否存在
    expect(wrapper.find('.google-btn').exists()).toBe(true);
    expect(wrapper.find('.google-icon').exists()).toBe(true);
    // 检查注册链接是否存在
    expect(wrapper.find('.signup-link a').exists()).toBe(true);
  });

  // 测试 2: 邮箱和密码输入是否能更新 data
  it('updates form model when typing in email and password fields', async () => {
    // ❗️ 修复 4: 查找真实的 <input> DOM 元素进行交互
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
    const service = require('@/utils/request');
    // 不再需要 const router = require('vue-router').useRouter(); 在 describe 作用域外已经获取到 mockRouterPush

    // 模拟成功的 API 响应
    service.post.mockResolvedValue({ status: 200 });
    service.get.mockResolvedValue({ status: 200, data: { id: 'mock-user-id', name: 'Test User', email: 'test@example.com' } }); // 模拟返回完整用户信息

    // 填充表单
    await wrapper.find('input[type="email"]').setValue('test@example.com');
    await wrapper.find('input[type="password"]').setValue('password123');

    // 触发登录按钮点击事件
    await wrapper.find('.login-btn').trigger('click');

    // ❗️ 关键修复 4: 同时等待所有 Promise 完成和 Vue 的下一个更新周期
    await flushPromises(); // 等待 API 请求和 Pinia 状态更新等 Promise 完成
    await wrapper.vm.$nextTick(); // 等待 Vue 完成因状态变化可能引起的 DOM 更新或副作用


    // 检查是否调用了登录 API
    expect(service.post).toHaveBeenCalledTimes(1); // 确保只调用一次
    expect(service.post).toHaveBeenCalledWith(
      '/api/login/email/login',
      { email: 'test@example.com', password: 'password123' },
      { withCredentials: true }
    );

    // 检查是否弹出了成功消息
    expect(ElMessage.success).toHaveBeenCalledTimes(1); // 确保只调用一次
    expect(ElMessage.success).toHaveBeenCalledWith('登录成功！');

    // 检查是否调用了获取用户信息的 API
    expect(service.get).toHaveBeenCalledTimes(1); // 确保只调用一次
    expect(service.get).toHaveBeenCalledWith('/api/login/check_login', { withCredentials: true });

    // 检查用户信息是否被正确设置到 store
    expect(userStore.user).toEqual({ id: 'mock-user-id', name: 'Test User', email: 'test@example.com' });

    // ❗️ 关键修复 5: 断言我们显式创建的模拟函数是否被调用
    expect(routerPushSpy).toHaveBeenCalledTimes(1); // 确保只调用一次
    expect(routerPushSpy).toHaveBeenCalledWith('/');

     // 检查 loading 状态是否正确 (可选)
    expect(wrapper.vm.loading).toBe(false);
  });

   // 测试 4: Google 登录流程 (可选)
  it('handles Google login and redirects', async () => {
      const axiosMock = require('axios'); // 使用 axios 的 mock

      // 模拟 Google 登录 API 成功响应
      axiosMock.get.mockResolvedValue({
          data: {
              success: true,
              auth_url: 'http://mock-google-auth-url.com'
          }
      });

      // 模拟 window.location
      const mockWindow = { location: { href: '' } };
      global.window = mockWindow; // 将模拟的 window 赋值给全局对象

      // 触发 Google 登录按钮点击事件
      await wrapper.find('.google-btn').trigger('click');

      // 等待 Promise 完成
      await flushPromises();

      // 检查是否调用了 Google 登录 API
      expect(axiosMock.get).toHaveBeenCalledTimes(1);
      expect(axiosMock.get).toHaveBeenCalledWith(
          '/api/login/login',
          { withCredentials: true }
      );

      // 检查是否进行了页面重定向
      expect(mockWindow.location.href).toBe('http://mock-google-auth-url.com');

      // 清理模拟的 window 对象
      delete global.window;
  });

  // 测试 5: 邮件登录失败流程 (可选)
  it('handles email login failure and displays error message', async () => {
    const service = require('@/utils/request');
    const { ElMessage } = require('element-plus');

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

    // 检查是否弹出了错误消息
    expect(ElMessage.error).toHaveBeenCalledTimes(1);
    expect(ElMessage.error).toHaveBeenCalledWith('Invalid credentials');

    // 检查 router.push 是否没有被调用
    expect(routerPushSpy).not.toHaveBeenCalled();

     // 检查 loading 状态是否正确
    expect(wrapper.vm.loading).toBe(false);
  });
});