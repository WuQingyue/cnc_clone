import { mount, flushPromises } from '@vue/test-utils';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';
import OnlineQuote from '@/views/Order/OnlineQuote.vue';
import FileUploader from '@/components/quote/FileUploader.vue';
import HistoryList from '@/components/quote/HistoryList.vue';
import FileList from '@/components/quote/FileList.vue'; // 导入 FileList 以便在存根中引用它
import service from '@/utils/request';

// --- 模块模拟  ---
// `jest.mock` 是 Jest 的一个核心功能，用于替换模块的实际实现。
// 模拟 `element-plus` 模块。
jest.mock('element-plus', () => ({
  __esModule: true,// 告诉 Jest 这个模块是 ES Module。
  ...jest.requireActual('element-plus'),// 保留 `element-plus` 原始模块的所有功能...
  // 模拟 `ElMessage` 组件，将其方法替换为 Jest 的模拟函数 `jest.fn()`。
  // 这样做可以防止在测试时弹出真实的消息提示，同时我们还能检查这些方法是否被调用。
  ElMessage: {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
  },
  // 模拟 `ElLoading` 服务
  ElLoading: {
    service: jest.fn(() => ({ // 模拟 `service` 方法，让它返回一个对象
      close: jest.fn(),// 这个对象里有一个 `close` 方法，也是一个模拟函数。这样代码调用 `ElLoading.service().close()` 时不会报错。
    })),
  },
}));
// 模拟我们封装的请求模块。
jest.mock('@/utils/request', () => ({
  get: jest.fn(),// 将 `get` 方法替换为一个模拟函数。
  post: jest.fn(),// 将 `post` 方法替换为一个模拟函数。
  delete: jest.fn(),// 将 `delete` 方法替换为一个模拟函数。
}));
// 模拟 `vue-router` 的 `useRouter` hook。
jest.mock('vue-router', () => ({
  useRouter: () => ({// 当组件调用 `useRouter()` 时，会得到我们提供的这个对象。
    push: jest.fn(),// 这个对象里有一个 `push` 方法，可以用来检查路由跳转是否被调用。
  }),
}));
// 模拟 Pinia 的 `user` store。
jest.mock('@/store/user', () => ({
  useUserStore: () => ({
    isLoggedIn: true,// 强制设定用户为已登录状态。
  }),
}));
// 模拟 Pinia 的 `PriceInquiryDatas` store。
jest.mock('@/store/PriceInquiryDatas', () => ({
    useSelectedDataStore: () => ({
      getSelectedData: jest.fn().mockReturnValue([]),// 模拟 `getSelectedData` 方法，并让它总是返回一个空数组。
      setSelectedData: jest.fn(),// 模拟 `setSelectedData` 方法。
    }),
  }));
// 模拟全局的 `require` 函数。在某些构建环境中（如 Webpack），`require` 可能被用来导入图片等资源。
// 这里我们让任何 `require` 调用都返回一个固定的字符串 'safety.png'，以避免测试出错。
global.require = jest.fn(() => 'safety.png');

// `describe` 创建一个测试套件，将相关的测试用例组织在一起。
describe('OnlineQuote.vue - 文件上传集成测试', () => {
  let wrapper;// 声明一个变量 `wrapper`，它将持有被挂载组件的实例，方便在各个测试用例中访问。
  const pinia = createPinia();// 创建一个 Pinia 实例，供所有测试用例共享。

  // --- 模拟数据 ---
  // 创建一个模拟的 File 对象，用于模拟用户上传的文件。
  const mockFile = new File(['(⌐□_□)'], 'test-model.stl', { type: 'application/vnd.ms-pki.stl' });
  // 模拟文件上传后返回的 fileInfoAccessId。
  const mockFileInfoAccessId = 'file-access-id-12345';
  // 模拟历史记录数据。
  const mockHistoryData = [{
    id: 'history-id-001',
    file_name: 'test-model.stl',
    upload_time: new Date().toISOString(),
    file_size: 12345,
    status: 'success',
    preview_url: 'http://example.com/preview.png',
  }];
  // 模拟文件分析成功后后端返回的结果。
  const mockAnalysisResult = {
      success: true,
      data: {
          productModelAccessId: 'prod-model-id-67890',
          sizeX: 10, sizeY: 20, sizeZ: 30,
          modelVolume: 6000, modelSurfaceArea: 2200,
      }
  };
  // 模拟当前处理信息。
  const mockProcessInfo = {
    type: 'cnc',
    acceptTypes: '.stl,.step,.stp',
    uploadTips: ['IMAGE_PLACEHOLDER'],
  };
  // `beforeEach` 是一个钩子函数，在当前 `describe` 块中的每个测试用例 (`test`) 运行之前都会执行一次。
  beforeEach(async () => {
    jest.clearAllMocks();// 清除所有模拟函数（mock）的调用记录，确保每个测试用例都在一个干净的环境中运行，互不干扰。
    // 为模拟的 `service.get` 方法提供具体的实现。
    service.get.mockImplementation(async (url) => {
      if (url.includes('/api/upload/history/cnc')) { // 如果请求的是历史记录接口
        return { data: { success: true, data: [] } };// 返回一个成功的、但内容为空的响应，模拟初始状态。
      }
      return { data: {} };// 其他 GET 请求返回一个默认空对象。
    });
    // 为模拟的 `service.post` 方法提供具体的实现。
    service.post.mockImplementation(async (url) => {
        if (url.includes('/api/upload/uploadDrawFile')) { // 如果请求的是文件上传接口
            return { data: { success: true, data: [{ fileInfoAccessId: mockFileInfoAccessId }] } };// 返回一个成功的、但内容为空的响应，模拟初始状态。
        }
        if (url.includes('/api/upload/get_analysis_result')) { // 如果请求的是文件分析接口
            return { data: mockAnalysisResult };// 返回一个成功的、但内容为空的响应，模拟初始状态。
        }
        return { status: 200 };// 其他 POST 请求返回一个默认空对象。
    });
    // 使用 `mount` 挂载 `OnlineQuote` 组件，并传入配置。
    wrapper = mount(OnlineQuote, {
      global: {
        plugins: [pinia, ElementPlus],
        // ★★★ 将 FileList 存根为一个简单的占位符 ★★★
        stubs: {
          CustomerGuidance: true,
          // 将 FileList 组件替换为一个简单的、不会出错的 <div /> 存根。
          // 我们甚至不需要模板，`true` 就可以创建一个最简单的存根。
          FileList: true,
        },
      },
    });
    // 手动设置组件实例上的 `currentProcess` 数据，因为这部分数据可能是从父组件传入或异步获取的。
    wrapper.vm.currentProcess = mockProcessInfo;
    // 等待所有因组件挂载而产生的异步操作完成。
    await flushPromises();
  });

  // --- 测试用例 ---
  // `test` 定义一个具体的测试用例。
  test('上传成功后，应自动请求并展示更新后的历史记录列表', async () => {
    // 重新定义 `service.get` 的行为，这次让它返回我们准备好的模拟历史数据。
    service.get.mockResolvedValue({ data: { success: true, data: mockHistoryData } });
    // 找到组件中的 `FileUploader` 子组件。
    const fileUploader = wrapper.findComponent(FileUploader);
    // 模拟文件上传事件。
    await fileUploader.vm.handleBeforeUpload(mockFile);
    // 等待所有因文件上传而产生的异步操作完成。
    await flushPromises();
    // 断言历史记录列表组件中是否包含我们上传的文件名。
    expect(wrapper.findComponent(HistoryList).text()).toContain('test-model.stl');
  });

  // 这个测试用例现在将与 FileList 存根进行交互
  test('应该完整地执行文件上传、历史记录下单和返回初始界面的流程', async () => {
    // 同样，先让获取历史记录的请求返回模拟数据。
    service.get.mockResolvedValue({ data: { success: true, data: mockHistoryData } });
    // 找到组件中的 `FileUploader` 子组件。
    const fileUploader = wrapper.findComponent(FileUploader);
    // 模拟文件上传事件。
    await fileUploader.vm.handleBeforeUpload(mockFile);
    // 等待所有因文件上传而产生的异步操作完成。
    await flushPromises();
    
    // 找到组件中的 `FileUploader` 子组件。
    const orderButton = wrapper.find('.history-section .el-button--primary');
    // 模拟点击下单按钮。
    await orderButton.trigger('click');
    // 等待所有因下单而产生的异步操作完成。
    await flushPromises();

    // ★ 我们现在只验证 FileList 的存根是否存在 ★
    expect(wrapper.vm.isOrdering).toBe(true);
    
    // 查找 FileList 的存根组件
    const fileListStub = wrapper.findComponent(FileList);
    // 断言这个存根组件现在是可见的
    expect(fileListStub.exists()).toBe(true);

    // ★ 模拟来自存根的事件 ★
    // 后续的删除流程，我们需要模拟是 FileList 的存根发出了 listEmpty 事件
    fileListStub.vm.$emit('listEmpty');
    await flushPromises();

    // 断言 OnlineQuote 的状态是否正确响应了事件
    expect(wrapper.vm.isOrdering).toBe(false);
    // 再次查找，断言存根组件现在已经因为 v-if="isOrdering" 而被销毁
    expect(wrapper.findComponent(FileList).exists()).toBe(false);
  });
});