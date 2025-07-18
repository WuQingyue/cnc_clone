import { mount, flushPromises } from '@vue/test-utils';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';
import FileList from '@/components/quote/FileList.vue'; // ★ 待测试的主组件
import ParameterInfo from '@/components/quote/ParameterInfo.vue'; // ★ 待测试的子组件
import service from '@/utils/request';
import { useSelectedDataStore } from '@/store/PriceInquiryDatas';

// --- 模块和依赖模拟 (保持不变) ---

// 模拟 'element-plus'
jest.mock('element-plus', () => ({
  __esModule: true,
  ...jest.requireActual('element-plus'),
  ElMessage: {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
  },
  ElLoading: {
    service: jest.fn(() => ({
      close: jest.fn(),
    })),
  },
}));

// 模拟 '@/utils/request'
jest.mock('@/utils/request', () => ({
  post: jest.fn(),
  get: jest.fn(),
  delete: jest.fn(),
}));

// 模拟 'vue-router'
const mockRouterPush = jest.fn();
jest.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockRouterPush,
  }),
}));

// 修复后的 Pinia Store 模拟
let mockStoreData = [];
const mockSetSelectedData = jest.fn((data) => {
  mockStoreData = data;
});
const mockGetSelectedData = jest.fn(() => mockStoreData);

jest.mock('@/store/PriceInquiryDatas', () => ({
  useSelectedDataStore: () => ({
    getSelectedData: mockGetSelectedData,
    setSelectedData: mockSetSelectedData,
  }),
}));

// 模拟 ParameterInfo 依赖 (保持不变)
jest.mock('@/components/quote/AutomationTool', () => ({
    parametersList: [ { id: 'cat-1', name: '铝合金', children: [ { materialAccessId: 'AL-6061-ID', materialName: '铝合金-6061', materialRemark: '6061备注' }, { materialAccessId: 'AL-7075-ID', materialName: '铝合金-7075', materialRemark: '7075备注' }, ] } ],
    surfaceTreatmentData: [ { craftAccessId: 'craft-1', craftName: '喷砂', craftCategory: '类别二', craftRemark: '喷砂备注', option: { optionName: '颜色', attrs: [ { craftAttributeAccessId: 'color-1', value: '本色' }, { craftAttributeAccessId: 'color-2', value: '黑色' } ] } }, { craftAccessId: 'craft-2', craftName: '阳极氧化', craftCategory: '类别三', craftRemark: '阳极氧化备注' }, { craftAccessId: 'craft-3', craftName: '丝印', craftRemark: '丝印备注' } ],
    currentParameters: { value: {} },
    updateParameters: jest.fn(),
}), { virtual: true });

global.require = jest.fn(() => 'test-image.png');


// --- 测试套件 ---

describe('FileList.vue - 集成测试', () => {
  let wrapper;
  const pinia = createPinia();

  const mockInitialRecord = {
    selected: true,
    fileInfoAccessId: 'file-id-001',
    productModelAccessId: 'model-id-001',
    file_name: 'part-A.stl',
    sizeX: 10, sizeY: 20, sizeZ: 30,
    modelVolume: 6000, modelSurfaceArea: 2200,
    remarks: '初始备注',
    material: '铝合金-6061',
    categoryName: '铝合金',
    materialAccessId: 'AL-6061-ID',
    surfaceTreatment: 'none',
    selectedTreatment: '', selectedColor: '', glossiness: '', uploadedFileName: '',
    selectedTreatment2: '', selectedColor2: '', glossiness2: '', uploadedFileName2: '',
    tolerance: 'GB/T 1804-2000 m级',
    toleranceAccessId: 'tol-1',
    roughness: 'Ra3.2',
    roughnessAccessId: 'ra-1',
    quantity: 1,
    pricePerUnit: 0,
    totalPrice: 0,
    deliveryTypeCode: 'BD',
  };

  // ★★★ 修改点: 使模拟响应函数更清晰 ★★★
  const createMockPriceResponse = (basePrice, quantity = 1, expedited = 0) => ({
    status: 200,
    data: [{
      materialPrice: 50,
      programPrice: 100,
      processPrice: 150,
      clampPrice: 20,
      craftPrice: 30,
      expeditedPrice: expedited,
      price: basePrice + expedited, // 总单价
    }]
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    mockStoreData = [];
    service.post.mockClear();

    // ★★★ 修改点: 在挂载时就提供初始价格的模拟 ★★★
    // 这样做更符合真实场景：组件一挂载就会请求价格。
    service.post.mockResolvedValue(createMockPriceResponse(350));

    wrapper = mount(FileList, {
      global: {
        plugins: [pinia, ElementPlus],
        stubs: {
          'el-icon': true, 'Edit': true, 'ShoppingCart': true, 'Check': true, 'Plus': true,
        }
      },
      props: {
        // 创建一个深拷贝，防止 props 因意外被修改而影响其他测试
        selectedRecords: JSON.parse(JSON.stringify(mockInitialRecord)),
      },
    });

    // 等待初始的 watch 和 fetchPrices 完成
    await flushPromises();
  });

  test('组件挂载后应正确显示初始数据并自动请求价格', async () => {
    // 断言 1: Pinia store 被正确设置
    expect(mockSetSelectedData).toHaveBeenCalledWith([expect.objectContaining({ fileInfoAccessId: 'file-id-001' })]);
    
    // 断言 2: 价格 API 被调用了1次
    expect(service.post).toHaveBeenCalledTimes(1);
    expect(service.post).toHaveBeenCalledWith('/api/price/price', expect.any(Array), { withCredentials: true });

    // 断言 3: 表格中显示了获取到的价格 (现在会通过)
    const row = wrapper.find('tbody tr');
    expect(row.text()).toContain('part-A.stl');
    expect(row.text()).toContain('铝合金-6061');
    expect(row.find('td:nth-child(7)').text()).toBe('350'); // 单价
    expect(row.find('td:nth-child(8)').text()).toBe('350'); // 总价

    // 断言 4: 右侧信息框计算正确
    expect(wrapper.find('.right-section').text()).toContain('零件数量: 1');
    expect(wrapper.find('.right-section').text()).toContain('总价: ¥350.00');
  });

  test('更改交期选项应重新请求价格', async () => {
    // 初始加载已经调用了1次，我们为下一次调用设置新的模拟
    const expeditedPrice = 50;
    service.post.mockResolvedValue(createMockPriceResponse(350, 1, expeditedPrice));

    // 找到加急交期的 radio input 并模拟点击
    const urgentDeliveryRadio = wrapper.find('input[value="UD"]');
    await urgentDeliveryRadio.setValue('UD');
    await flushPromises();

    // 断言 1: 价格 API 再次被调用 (总共2次)
    expect(service.post).toHaveBeenCalledTimes(2);
    const lastCallPayload = service.post.mock.calls[1][1]; // 获取第二次调用的载荷
    expect(lastCallPayload[0].deliveryTypeCode).toBe('UD');
    
    // 断言 2: 表格中的价格已更新 (现在会通过)
    const row = wrapper.find('tbody tr');
    const expectedPrice = String(350 + expeditedPrice);
    expect(row.find('td:nth-child(7)').text()).toBe(expectedPrice); // 新单价
    expect(row.find('td:nth-child(8)').text()).toBe(expectedPrice); // 新总价
  });

  test('删除最后一个零件时应发射 listEmpty 事件', async () => {
    // 点击删除按钮
    const deleteButton = wrapper.find('.delete-btn');
    await deleteButton.trigger('click');
    await flushPromises();

    // 断言 1: 表格变为空
    expect(wrapper.find('tbody tr').exists()).toBe(false);
    
    // 断言 2: listEmpty 事件被发射
    expect(wrapper.emitted().listEmpty).toBeTruthy();
    expect(wrapper.emitted().listEmpty.length).toBe(1);
  });
  

  test('完整流程：打开参数弹窗、修改参数、确认并更新价格', async () => {
    // 在这个测试开始前，初始加载已经调用了1次API。我们清除它，以便从0开始精确计数。
    service.post.mockClear();

    // 1. 点击参数单元格，打开 ParameterInfo 弹窗
    const parameterCell = wrapper.find('.parameter-info-cell');
    await parameterCell.trigger('click');
    await flushPromises();

    const parameterDialog = wrapper.findComponent(ParameterInfo);
    expect(parameterDialog.props('visible')).toBe(true);

    // 断言：弹窗打开时不应触发API调用
    expect(service.post).toHaveBeenCalledTimes(0);
    
    // 2. 在弹窗中修改参数（例如，修改数量）
    const newQuantity = 5;
    // ★★★ 修复点 1: 定义基础单价和期望的总价 ★★★
    const baseUnitPrice = 350;
    const expectedTotalPrice = baseUnitPrice * newQuantity; // 1750

    // ★★★ 修复点 2: 在模拟API时，传递正确的 *单价* ★★★
    service.post.mockResolvedValue(createMockPriceResponse(baseUnitPrice)); 

    const quantityInput = parameterDialog.find('.el-input-number input');
    await quantityInput.setValue(newQuantity);
    await flushPromises();

    // 断言：这是由用户主动修改参数触发的第一次API调用
    expect(service.post).toHaveBeenCalledTimes(1);
    
    // ★★★ 修复点 3: 使用正确的期望总价进行断言 ★★★
    // 现在组件会正确计算 totalPrice = 350 * 5 = 1750
    expect(parameterDialog.text()).toContain(`总计（含税）:¥${expectedTotalPrice}`);
    // 也可以断言单价
    expect(parameterDialog.text()).toContain(`¥${baseUnitPrice}/件`);


    // 3. 点击弹窗中的“确认”按钮
    const confirmButton = parameterDialog.find('.confirm-btn');
    await confirmButton.trigger('click');
    await flushPromises();

    // 断言 1: 弹窗已关闭
    expect(wrapper.findComponent(ParameterInfo).props('visible')).toBe(false);

    // 断言 2: 确认后没有新增API调用，总调用次数仍然是 1
    expect(service.post).toHaveBeenCalledTimes(1);

    // 断言 3: FileList 表格中的数据已更新
    const row = wrapper.find('tbody tr');
    expect(row.find('td:nth-child(6)').text()).toBe(String(newQuantity)); // 数量
    expect(row.find('td:nth-child(7)').text()).toBe(String(baseUnitPrice)); // 单价
    expect(row.find('td:nth-child(8)').text()).toBe(String(expectedTotalPrice)); // 总价
});

});