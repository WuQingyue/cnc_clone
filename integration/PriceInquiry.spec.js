import { mount, flushPromises } from '@vue/test-utils';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';
import PriceInquiry from '@/views/Order/PriceInquiry.vue';

// --- 模块和依赖模拟 ---

const mockRouterPush = jest.fn();
jest.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockRouterPush,
  }),
}));

let mockStoreData = []; 
const mockSelectedData = [
  { fileInfoAccessId: 'file-id-1', quantity: 2, totalPrice: 200 },
  { fileInfoAccessId: 'file-id-2', quantity: 5, totalPrice: 250 }
];
jest.mock('@/store/PriceInquiryDatas', () => ({
  useSelectedDataStore: () => ({
    getSelectedData: jest.fn().mockImplementation(() => mockStoreData),
  }),
}));

jest.mock('element-plus', () => ({
  ...jest.requireActual('element-plus'),
  ElMessage: { success: jest.fn(), error: jest.fn() },
}));


// --- 测试套件 ---
describe('PriceInquiry.vue - 集成测试 (存根策略)', () => {
  let wrapper;
  const pinia = createPinia();

  // mount 函数现在包含存根配置
  const mountComponent = () => {
    wrapper = mount(PriceInquiry, {
      global: {
        plugins: [pinia, ElementPlus],
        // ★★★★★ 关键修复点: 存根所有直接子组件 ★★★★★
        stubs: {
          DeliveryInfo: true, // true 表示用一个简单的 <delivery-info-stub> 替换
          OrderInfo: true,
          TotalInfo: true,
        },
      },
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // 为每个测试用例重置 store 数据
    mockStoreData = [...mockSelectedData];
  });

  // 测试用例 1: 验证组件挂载和子组件渲染
  test('应能正确挂载并渲染所有子组件的存根', () => {
    mountComponent();
    // 断言存根组件存在于渲染树中
    expect(wrapper.findComponent({ name: 'DeliveryInfo' }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: 'OrderInfo' }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: 'TotalInfo' }).exists()).toBe(true);
  });

  // 测试用例 2: 验证 props 是否正确传递
  test('应将正确的数据通过 props 传递给 TotalInfo 组件', async () => {
    mountComponent();
    await flushPromises(); // 确保 computed 属性更新

    const totalInfoStub = wrapper.findComponent({ name: 'TotalInfo' });
    // 验证从 Pinia 获取的数据是否被正确地传递下去
    expect(totalInfoStub.props('selectedDatas')).toEqual(mockSelectedData);
    // 初始地址应为 null
    expect(totalInfoStub.props('selectedAddress')).toBeNull();
  });

  // 测试用例 3: 验证子组件的事件是否能正确更新父组件
  test('当 DeliveryInfo 发出 address-selected 事件时，应更新 selectedAddress', async () => {
    mountComponent();
    const newAddress = { id: 'addr-new', name: '新地址' };

    const deliveryInfoStub = wrapper.findComponent({ name: 'DeliveryInfo' });
    // 模拟子组件发出事件
    await deliveryInfoStub.vm.$emit('address-selected', newAddress);

    // 验证 PriceInquiry 的状态已更新，并传递给了 TotalInfo
    const totalInfoStub = wrapper.findComponent({ name: 'TotalInfo' });
    expect(totalInfoStub.props('selectedAddress')).toEqual(newAddress);
  });

  // 测试用例 4: 验证提交状态的事件处理
  test('当 TotalInfo 发出 submitting 事件时，应显示/隐藏全局加载遮罩', async () => {
    mountComponent();

    // 初始状态下，遮罩层不应存在
    expect(wrapper.find('.loading-overlay').exists()).toBe(false);

    const totalInfoStub = wrapper.findComponent({ name: 'TotalInfo' });
    
    // 模拟开始提交
    await totalInfoStub.vm.$emit('submitting', true);
    expect(wrapper.find('.loading-overlay').exists()).toBe(true);
    expect(wrapper.text()).toContain('正在提交订单，请稍候...');

    // 模拟提交结束
    await totalInfoStub.vm.$emit('submitting', false);
    expect(wrapper.find('.loading-overlay').exists()).toBe(false);
  });
  
  // 测试用例 5: 空数据状态
  test('当没有已选零件时，应能正确传递空数组给子组件', async () => {
    mockStoreData = []; // 设置空数据
    mountComponent();
    await flushPromises();

    const totalInfoStub = wrapper.findComponent({ name: 'TotalInfo' });
    expect(totalInfoStub.props('selectedDatas')).toEqual([]);
  });
});