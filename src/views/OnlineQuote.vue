<template>
  <div class="online-quote">
    <!-- 工艺选择部分 -->
    <div class="quote-section">
      <h2 class="section-title">选择工艺</h2>
      <process-selector 
        :selected-process="currentProcess?.type"
        @process-change="handleProcessChange"
      />
    </div>

    <!-- 文件上传部分或文件列表部分 -->
    <div class="quote-section">
      <template v-if="isOrdering">
        <file-list 
          :selectedRecords="selectedRecords"
          :currentProcess="currentProcess"
        />
      </template>
      <template v-else>
        <h2 class="section-title">上传图纸</h2>
        <file-uploader 
          :process-info="currentProcess"
          @upload-success="handleUploadSuccess"
        />
      </template>
    </div>

    <!-- 历史记录组件 -->
    <history-list
      :history-data="historyData"
      @refresh="fetchHistory(currentProcess?.type)"
      @order="handleOrder"
      @delete="handleDelete"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import ProcessSelector from '@/components/quote/ProcessSelector.vue'
import FileUploader from '@/components/quote/FileUploader.vue'
import HistoryList from '@/components/quote/HistoryList.vue'
import FileList from '@/components/quote/FileList.vue' // 引入新组件
import {
  Refresh,
  PictureFilled,
  Document,
  ShoppingCart,
  Delete
} from '@element-plus/icons-vue'

// 当前选择的工艺
const currentProcess = ref(null)
const historyData = ref([])  // 存储历史记录数据
const isOrdering = ref(false) // 标记是否处于下单状态
const selectedRecords = ref([]) // 存储选中的记录

// 获取历史记录
const fetchHistory = async (processType) => {
  if (!processType) return
  
  try {
    const response = await axios.get(
      `http://localhost:8000/api/upload/history/${processType}`,
      { withCredentials: true }
    )
    if (response.data.success) {
      historyData.value = response.data.data
    }
  } catch (error) {
    console.error('获取历史记录失败:', error)
    ElMessage.error('获取历史记录失败')
  }
}

// 处理工艺变更
const handleProcessChange = async (process) => {
  currentProcess.value = process
  // 切换工艺时获取对应的历史记录
  fetchHistory(process.type)
}

// 处理下单
const handleOrder = (record) => {
  isOrdering.value = true
  // 初始化数量为 1
  record.quantity = 1
  selectedRecords.value.push(record)
}

// 处理删除
const handleDelete = async (id) => {
  console.log('删除:', id)
  // TODO: 实现删除逻辑
}

// 上传成功后刷新历史记录
const handleUploadSuccess = () => {
  if (currentProcess.value?.type) {
    fetchHistory(currentProcess.value.type)
  }
}

// 组件挂载时获取历史记录
onMounted(() => {
  // 找到 3D 打印工艺
  const processList = [
    {
      type: 'mechanical',
      name: '机械/自动化零部件选购',
      description: '新人领30元优惠劵',
      route: '/mechanical-parts'
    },
    {
      type: '3dprint',
      name: '3D打印',
      description: '树脂/尼龙/金属3D打印服务',
      acceptTypes: '.stl,.stp,.step,.obj,.3mf,.zip,.rar',
      uploadTips: [
        '支持3D格式:stl/stp/step/obj/3mf，单次上传文件数量≤20个，单个文件大小<100M，全彩打印可上传压缩文件rar/zip',
        '注:为了更准确打印以及避免不必要的纠纷，强烈建议上传STL格式文件!',
        '特别提醒:壁厚需大于1.2mm，处不低于0.8mm'
      ]
    },
    {
      type: 'cnc',
      name: 'CNC加工',
      description: '铝件/钢件/塑胶件，快速打样',
      acceptTypes: '.stp,.step,.dwg,.dxf,.pdf,.zip,.rar',
      uploadTips: [
        '支持3D(必须)格式:step,stp;支持2D格式:dwg,dxf,pdf，可压缩包(zip、rar)直接上传',
        '建议您同时上传3D(必须)和2D图纸，同一款零件3D和2D图纸名称需要一致',
        '单次上传文件 ≤20 个，单个文件大小<100M',
        '嘉立创CNC将对您的文件绝对保密，保护您的知识产权'
      ]
    },
    {
      type: 'sheet',
      name: '钣金加工',
      description: '激光切割/折弯压铆/焊接喷涂',
      acceptTypes: '.dxf,.dwg,.stp,.step',
      uploadTips: [
        '支持格式：DXF、DWG、STP、STEP',
        '单个文件大小不超过50MB',
        '建议上传2D图纸或3D模型',
        '支持各类钣金工艺'
      ]
    },
    {
      type: 'mold',
      name: '手板复模',
      description: '手板件塑料外壳，小批量打样',
      acceptTypes: '.stp,.step,.igs,.iges,.x_t',
      uploadTips: [
        '支持格式：STP、STEP、IGS、IGES、X_T',
        '单个文件大小不超过50MB',
        '建议上传3D模型文件',
        '支持手板、复模等工艺'
      ]
    },
    {
      type: 'aluminum',
      name: '铝合金壳体',
      description: '百种壳体，一个起订',
      route: '/aluminum-case'
    }
  ];
  const threeDPrintProcess = processList.find(process => process.type === '3dprint');
  if (threeDPrintProcess) {
    currentProcess.value = threeDPrintProcess;
    fetchHistory('3dprint');
  }
})
</script>

<style lang="scss" scoped>
.online-quote {
  padding: 100px;
  background: #f5f7fa;
  min-height: 100vh;

  .quote-section {
    background: #fff;
    border-radius: 8px;
    padding: 24px;
    margin-bottom: 20px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

    .section-title {
      font-size: 18px;
      font-weight: bold;
      color: #303133;
      margin-bottom: 20px;
      display: flex; // 添加 flex 布局
      align-items: center; // 垂直居中对齐

      &::before { // 使用伪元素创建竖线
        content: '';
        width: 4px;
        height: 18px; // 与文字大小相同
        background-color: #409eff;
        margin-right: 8px; // 设置竖线和文字的间距为8px
        border-radius: 2px; // 可选：添加圆角效果
      }
    }
  }

  .history-section {
    margin-top: 30px;
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .section-header h3 {
      margin: 0;
      color: #333;
      font-size: 18px;
    }
  }

  .filename-text {
    display: inline-block;
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .image-error,
  .no-preview {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 60px;
    height: 60px;
    background: #f5f7fa;
    border-radius: 4px;
    color: #909399;
  }

  .operation-buttons {
    display: flex;
    gap: 8px;
  }

  .el-image {
    border: 1px solid #ebeef5;
    transition: all 0.3s;
  }

  .el-image:hover {
    transform: scale(1.05);
    box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  }

  :deep(.el-table .cell) {
    white-space: nowrap;
  }
}
</style>