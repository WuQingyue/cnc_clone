import { mount, flushPromises } from '@vue/test-utils';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';
import Cart from '@/components/Cart/cart.vue'; // ★ 待测试的主页面组件
import { nextTick } from 'vue';


// 模拟 vue-router
const mockRouterPush = jest.fn();
jest.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockRouterPush,
  }),
}));

// 模拟 Element Plus 的服务
jest.mock('element-plus', () => ({
  ...jest.requireActual('element-plus'),
  ElMessage: {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
  },
}));

// 模拟 service (axios 实例)
const service = require('@/utils/request').default;
jest.mock('@/utils/request', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

// 模拟 ParameterInfo 的依赖
jest.mock('@/components/quote/AutomationTool.js', () => ({
  parametersList: [
    {
      name: '铝合金',
      children: [
        { materialName: '铝合金-6061', materialAccessId: 'mat-id-6061' },
      ],
    },
  ],
  surfaceTreatmentData: [],
}), { virtual: true });

const mockCartData = {
  success: true,
  result: [
    {
      cart: { id: 1, quantity: 2, price: 200, expected_delivery_date: '2025-08-01' },
      model_processing_info: { material: '铝合金-6061', surface_treatment: false, tolerance: '标准公差', roughness: 'Ra3.2' },
      model_size_info: { file_name: 'part-A.stl', length: 10, width: 20, height: 30, volume: 6000, surface_area: 2200 },
      preview_url: 'http://example.com/part-A.png',
      productModelAccessId: 'model-1',
      fileInfoAccessId: 'file-1'
    },
    {
      cart: { id: 2, quantity: 5, price: 500, expected_delivery_date: '2025-08-02' },
      model_processing_info: { material: '不锈钢-304', surface_treatment: true, treatment1_option: '拉丝' },
      model_size_info: { file_name: 'part-B.stl', length: 50, width: 50, height: 50, volume: 125000, surface_area: 15000 },
      preview_url: 'http://example.com/part-B.png',
      productModelAccessId: 'model-2',
      fileInfoAccessId: 'file-2'
    }
  ]
};

// --- 测试套件 ---
describe('Cart.vue - 购物车页面集成测试', () => {
  let wrapper;
  const pinia = createPinia();

  const mountComponent = async () => {
    wrapper = mount(Cart, {
      global: {
        plugins: [pinia, ElementPlus],
        stubs: {
          ParameterInfo: true,
          'el-icon': true,
          Document: true,
          Edit: true
        },
      },
    });
    await flushPromises();
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
    service.get.mockResolvedValue({ data: mockCartData });
    service.post.mockResolvedValue({ data: { success: true } });
  });


  test('应能正确加载并渲染购物车列表', async () => {
    await mountComponent();
    expect(service.get).toHaveBeenCalledWith('/api/orders/get_cart', { withCredentials: true });
    const rows = wrapper.findAll('tbody .el-table__row');
    expect(rows.length).toBe(mockCartData.result.length);
    expect(wrapper.text()).toContain('part-A.stl');
    expect(wrapper.text()).toContain('铝合金-6061');
    expect(wrapper.text()).toContain('200.00');
  });

    // 移除商品测试
    test('移除商品后应更新表格和总计', async () => {
        await mountComponent();

        // 直接调用 handleSelectionChange 方法来模拟全选
        // 我们手动将购物车的所有数据作为“已勾选”项传入
        await wrapper.vm.handleSelectionChange(wrapper.vm.cart);
        await nextTick(); // 等待计算属性等状态更新

        // 现在断言应该是正确的
        expect(wrapper.vm.selectedItems.length).toBe(2);
        expect(wrapper.vm.totalAmount).toBe(700);

        // 点击第一行的移除按钮
        const removeButton = wrapper.find('tbody .el-table__row').find('button.el-button--danger');
        await removeButton.trigger('click');
        await flushPromises();

        // 验证表格行数减少
        expect(wrapper.findAll('tbody .el-table__row').length).toBe(1);
        // 验证总金额已更新
        expect(wrapper.vm.selectedItems.length).toBe(1);
        expect(wrapper.vm.totalAmount).toBe(500);
        // 验证提示消息被调用
        expect(ElementPlus.ElMessage.success).toHaveBeenCalledWith('已移除商品');
    });

    // 修改参数测试
    test('修改参数后应更新行内数据和总计', async () => {
        await mountComponent();

        // 同样，直接调用方法来模拟全选
        await wrapper.vm.handleSelectionChange(wrapper.vm.cart);
        await nextTick();
        
        expect(wrapper.vm.selectedItems.length).toBe(2);
        expect(wrapper.vm.totalAmount).toBe(700);

        // 点击第一行的参数单元格
        const paramCell = wrapper.find('.parameter-info-cell');
        await paramCell.trigger('click');
        await nextTick();

        // 验证弹窗已打开
        const parameterDialog = wrapper.findComponent({ name: 'ParameterInfo' });
        expect(parameterDialog.props('visible')).toBe(true);

        // 模拟弹窗确认返回了新参数
        const newParams = {
        ...parameterDialog.props('record'),
        quantity: 3,
        totalPrice: 330, // 新的总价
        };
        await parameterDialog.vm.$emit('confirm', newParams);
        await flushPromises();

        // 验证总金额已更新
        expect(wrapper.vm.totalAmount).toBe(330 + 500);
    });

  test('点击提交询价应调用API并跳转', async () => {
    await mountComponent();
    expect(wrapper.find('.cart-summary .el-button--primary').attributes('disabled')).toBeDefined();
    await wrapper.find('tbody .el-checkbox__original').setValue(true);
    await flushPromises(); // 等待勾选状态更新
    expect(wrapper.find('.cart-summary .el-button--primary').attributes('disabled')).toBeUndefined();
    await wrapper.find('.cart-summary .el-button--primary').trigger('click');
    await flushPromises();
    expect(service.post).toHaveBeenCalledWith(
      '/api/orders/save_selected_datas',
      expect.any(Array),
      { withCredentials: true }
    );
    expect(mockRouterPush).toHaveBeenCalledWith('/price-inquiry');
  });

  test('当API返回失败时应显示错误消息', async () => {
    service.get.mockRejectedValue(new Error('网络错误'));
    await mountComponent();
    expect(ElementPlus.ElMessage.error).toHaveBeenCalledWith('购物车数据获取失败');
  });
});