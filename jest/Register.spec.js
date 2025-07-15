// jest/Register.spec.js

import { mount } from '@vue/test-utils';
import Register from '@/components/SignUp/Register.vue'; // 确保路径正确
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';
import flushPromises from 'flush-promises';

// 导入原始模块，以便获取其类型或结构，但 Jest 会替换掉它的实现
import service from '@/utils/request';


// 直接在测试用例中访问导入的模拟模块
jest.mock('@/utils/request', () => ({
  post: jest.fn(),
  get: jest.fn(), // 保持模拟的完整性
}));

// 模拟 vue-router
const mockRouterPush = jest.fn();
jest.mock('vue-router', () => ({
  useRouter: jest.fn(() => ({
    push: mockRouterPush,
  })),
  RouterLink: {},
}));

// 模拟 Element-Plus 的 ElMessage
jest.mock('element-plus', () => ({
  ...jest.requireActual('element-plus'),
  ElMessage: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// 获取模拟函数的引用
const routerPushSpy = mockRouterPush;
const ElMessageSpy = jest.requireMock('element-plus').ElMessage;

// 模拟 window.location
let originalWindowLocation;
let mockHref = '';

describe('Register.vue', () => {
  let wrapper;

  beforeEach(() => {
    jest.clearAllMocks();
    originalWindowLocation = window.location;
    const mockLocation = {
      assign: jest.fn(),
      replace: jest.fn(),
      reload: jest.fn(),
      set href(value) {
        mockHref = value;
      },
      get href() {
        return mockHref;
      },
      origin: originalWindowLocation.origin,
    };
    Object.defineProperty(window, 'location', {
      configurable: true,
      writable: true,
      value: mockLocation,
    });
    mockHref = 'http://localhost/';
    const pinia = createPinia();
    wrapper = mount(Register, {
      global: {
        plugins: [pinia, ElementPlus],
        stubs: {
          'router-link': {
            name: 'RouterLinkStub',
            props: ['to'],
            template: '<a><slot /></a>',
          },
        },
      },
    });
  });

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      writable: true,
      value: originalWindowLocation,
    });
    mockHref = '';
  });

  // 测试 1 (单元测试): 组件是否成功渲染了注册表单
  it('renders the signup form correctly', () => {
    expect(wrapper.find('h1.title').text()).toBe('Sign Up');
    expect(wrapper.find('input[type="email"]').exists()).toBe(true);
    expect(wrapper.find('input[type="password"]').exists()).toBe(true);
    const nameInputs = wrapper.findAll('.name-item .el-input__inner');
    expect(nameInputs.length).toBe(2);
    expect(wrapper.find('.continue-btn').exists()).toBe(true);
    expect(wrapper.find('.google-btn').exists()).toBe(true);
    const signinLink = wrapper.findComponent({ name: 'RouterLinkStub' });
    expect(signinLink.exists()).toBe(true);
    expect(signinLink.props().to).toBe('/login');
    expect(signinLink.text()).toBe('Sign in');
  });

  // 测试 2 (单元测试): 表单输入是否能更新 data
  it('updates form model when typing in form fields', async () => {
    const firstNameInput = wrapper.findAll('input[type="text"]')[0];
    const lastNameInput = wrapper.findAll('input[type="text"]')[1];
    const emailInput = wrapper.find('input[type="email"]');
    const passwordInput = wrapper.find('input[type="password"]');

    await firstNameInput.setValue('John');
    await lastNameInput.setValue('Doe');
    await emailInput.setValue('john.doe@example.com');
    await passwordInput.setValue('password123');

    expect(wrapper.vm.form.firstName).toBe('John');
    expect(wrapper.vm.form.lastName).toBe('Doe');
    expect(wrapper.vm.form.email).toBe('john.doe@example.com');
    expect(wrapper.vm.form.password).toBe('password123');
  });

  // 测试 3 (协调性测试): 成功的邮件注册流程
  it('handles email registration successfully and navigates to login', async () => {
    // 关键修复：直接对导入的模拟模块 service.post 进行配置
    service.post.mockResolvedValue({ data: { success: true } });

    await wrapper.find('input[type="text"]:first-of-type').setValue('Jane');
    await wrapper.find('.name-fields .name-item:last-of-type input').setValue('Smith');
    await wrapper.find('input[type="email"]').setValue('jane.smith@example.com');
    await wrapper.find('input[type="password"]').setValue('strongpassword123');
    await wrapper.find('.continue-btn').trigger('click');

    await flushPromises();

    // 关键修复：断言时也直接使用 service.post
    expect(service.post).toHaveBeenCalledTimes(1);
    expect(service.post).toHaveBeenCalledWith(
      '/api/login/register',
      {
        firstname: 'Jane',
        lastname: 'Smith',
        email: 'jane.smith@example.com',
        password: 'strongpassword123',
      },
      expect.any(Object)
    );
    expect(ElMessageSpy.success).toHaveBeenCalledTimes(1);
    expect(ElMessageSpy.success).toHaveBeenCalledWith('注册成功！');
    expect(routerPushSpy).toHaveBeenCalledTimes(1);
    expect(routerPushSpy).toHaveBeenCalledWith('/login');
  });

  // 测试 4 (协调性测试): Google 注册流程
  it('handles Google sign up and redirects', async () => {
    await wrapper.find('.google-btn').trigger('click');
    expect(window.location.href).toBe('/api/login/login');
  });

  // 测试 5 (协调性测试): 邮件注册失败流程
  it('does not navigate or show success message on registration failure', async () => {
    const apiError = new Error('Email already exists');
    // 关键修复：直接对导入的模拟模块 service.post 进行配置
    service.post.mockRejectedValue(apiError);

    await wrapper.find('input[type="text"]:first-of-type').setValue('Test');
    await wrapper.find('.name-fields .name-item:last-of-type input').setValue('User');
    await wrapper.find('input[type="email"]').setValue('test@example.com');
    await wrapper.find('input[type="password"]').setValue('password123');
    await wrapper.find('.continue-btn').trigger('click');
    
    await flushPromises();

    // 关键修复：断言时也直接使用 service.post
    expect(service.post).toHaveBeenCalledTimes(1);
    expect(ElMessageSpy.success).not.toHaveBeenCalled();
    expect(routerPushSpy).not.toHaveBeenCalled();
  });

  // 测试 6 专门针对验证规则的测试组 (单元测试)
  describe('表单验证', () => {
    // 辅助函数，用于填充一个有效的表单，除了一个字段
    const fillFormWithOneInvalidField = async (invalidField) => {
      const validData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      };
      // 使用无效数据覆盖有效数据
      const formData = { ...validData, ...invalidField };
      
      // 使用 setValue 填充表单
      await wrapper.find('input[type="text"]:first-of-type').setValue(formData.firstName);
      await wrapper.find('.name-fields .name-item:last-of-type input').setValue(formData.lastName);
      await wrapper.find('input[type="email"]').setValue(formData.email);
      await wrapper.find('input[type="password"]').setValue(formData.password);
    };

    it('当名字为空时，不应提交表单', async () => {
      await fillFormWithOneInvalidField({ firstName: '' });
      await wrapper.find('.continue-btn').trigger('click');
      await flushPromises();

      // 断言：API 未被调用，错误消息已显示
      expect(service.post).not.toHaveBeenCalled();
      expect(ElMessageSpy.error).toHaveBeenCalledWith('注册失败！');
    });

    it('当姓氏为空时，不应提交表单', async () => {
      await fillFormWithOneInvalidField({ lastName: '' });
      await wrapper.find('.continue-btn').trigger('click');
      await flushPromises();

      expect(service.post).not.toHaveBeenCalled();
      expect(ElMessageSpy.error).toHaveBeenCalledWith('注册失败！');
    });

    it('当邮箱格式不正确时，不应提交表单', async () => {
      await fillFormWithOneInvalidField({ email: 'invalid-email' });
      await wrapper.find('.continue-btn').trigger('click');
      await flushPromises();

      expect(service.post).not.toHaveBeenCalled();
      expect(ElMessageSpy.error).toHaveBeenCalledWith('注册失败！');
    });

    it('当密码过短时，不应提交表单', async () => {
      await fillFormWithOneInvalidField({ password: 'short' });
      await wrapper.find('.continue-btn').trigger('click');
      await flushPromises();
      
      expect(service.post).not.toHaveBeenCalled();
      expect(ElMessageSpy.error).toHaveBeenCalledWith('注册失败！');
    });
  });

});