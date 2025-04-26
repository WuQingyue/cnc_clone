<template>
  <div class="file-list">
    <h2 class="section-title">文件列表</h2>
    <div class="file-list-container">
      <!-- 左部分：文件信息和文件上传框 -->
      <div class="left-section">
        <!-- 数据展示 -->
        <table class="data-table">
          <thead>
            <tr>
              <th>选择</th>
              <th>序号</th>
              <th>图纸</th>
              <th>模型信息</th>
              <th>参数信息</th>
              <th>数量（件）</th>
              <th>单价</th>
              <th>总价</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(record, index) in localRecords" :key="index">
              <td>
                <input type="checkbox" v-model="record.selected" />
              </td>
              <td>{{ index + 1 }}</td> 
              <td>{{ record.file_name }}</td>
              <td>
                尺寸: {{ record.sizeX }}*{{ record.sizeY }}*{{ record.sizeZ }}<br>
                体积: {{ record.modelVolume }}<br>
                表面积: {{ record.modelSurfaceArea }}<br>
                备注: {{ record.remarks }}
              </td>
              <td class="parameter-info-cell" @click="openParameterDialog(record)">
                <div class="parameter-details">
                  <div>{{ record.material || '铝合金-6061' }}</div>
                  <div v-if="record.surfaceTreatment === 'none'">
                    表面不做处理
                  </div>
                  <div v-else>
                    <template v-if="record.selectedTreatment">
                      表面处理一: {{ record.selectedTreatment }} 
                      <span v-if="record.selectedColor">- {{ record.selectedColor }}</span>
                      <span v-if="record.glossiness">- {{ record.glossiness }}</span>
                      <span v-if="record.uploadedFileName">- {{ record.uploadedFileName }}</span>
                    </template>
                    <template v-if="record.selectedTreatment2">
                      <br>表面处理二: {{ record.selectedTreatment2 }}
                      <span v-if="record.selectedColor2">- {{ record.selectedColor2 }}</span>
                      <span v-if="record.glossiness2">- {{ record.glossiness2 }}</span>
                      <span v-if="record.uploadedFileName2">- {{ record.uploadedFileName2 }}</span>
                    </template>
                  </div>
                  <div>最严公差: {{ record.tolerance || 'GB/T 1804-2000 m级' }}</div>
                  <div>最小粗糙度: {{ record.roughness || 'Ra3.2' }}</div>
                </div>
                <el-icon class="edit-icon">
                  <Edit />
                </el-icon>
              </td>
              <td>
                {{ record.quantity }}
              </td>
              <td>{{ record.pricePerUnit }}</td>
              <td>{{ record.totalPrice }}</td>
              <td>
                <button @click="copyPart(index)">复制零件</button>
                <button @click="deletePart(index)">删除零件</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- 右部分：信息框 -->
      <div class="right-section">
        <div class="info-box">
          <div class="delivery-options">
            <label :class="{ 'selected-option': selectedDelivery === 'UD' }">
              <input 
                type="radio" 
                v-model="selectedDelivery" 
                value="UD" 
                name="deliveryOption"
              />
              加急交期：5个工作日
            </label>
            <label :class="{ 'selected-option': selectedDelivery === 'BD' }">
              <input 
                type="radio" 
                v-model="selectedDelivery" 
                value="BD" 
                name="deliveryOption"
              />
              标准交期：10个工作日
            </label>
          </div>

          <!-- 添加零件数量和总价的显示 -->
          <div>
            <div>零件数量: {{ selectedRecordsCount }}</div>
            <div>总价: ¥{{ selectedTotalPrice }}</div>
          </div>
          <button class="blue-button">
            <div class="inquiry-link" @click="handleConfirm">提交询价</div>
          </button>
          <button class="white-button">
            <el-icon><ShoppingCart /></el-icon>
            <span>加入购物车</span>
          </button>
          <div ref="paypalButtonContainer"></div>
        </div>
      </div>
    </div>
    <!-- 引入 ParameterInfo 组件 -->
    <ParameterInfo 
      :visible="showParameterDialog"
      @update:visible="showParameterDialog = $event"
      @confirm="handleParameterConfirm"
      :record="selectedRecord"  
    />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { ShoppingCart, Edit } from '@element-plus/icons-vue' // 引入 Edit 图标
import { useSelectedDataStore } from '@/store/PriceInquiryDatas'
import { useRouter } from 'vue-router'
import service from '@/utils/request'
import { ElMessage } from 'element-plus'

// 获取 store 实例
const selectedDataStore = useSelectedDataStore()
const router = useRouter()
const selectedDelivery = ref('BD')
// 创建本地数据副本
const localRecords = ref([])
const showParameterDialog = ref(false) // 控制 ParameterInfo 对话框的显示与隐藏
const selectedRecord = ref(null) // 用于存储当前选中的需要修改参数的记录


const fetchPrices = async () => {
  const selectedDatas = selectedDataStore.getSelectedData();
  console.log('获取勾选的数据', selectedDatas);

  try {
    const requestData = selectedDatas.map(item => ({
      materialAccessId: item.materialAccessId,
      crafts: [
        {
          craftAccessId: item.craftAccessId1,
          craftAttributeAccessIds: [
            item.craftAttributeColorAccessIds1,
            item.craftAttributeGlossinessAccessIds1,
            item.craftAttributeFileAccessIds1
          ].filter(Boolean)
        },
        {
          craftAccessId: item.craftAccessId2,
          craftAttributeAccessIds: [
            item.craftAttributeColorAccessIds2,
            item.craftAttributeGlossinessAccessIds2,
            item.craftAttributeFileAccessIds2
          ].filter(Boolean)
        }
      ],
      productModelAccessId: item.productModelAccessId,
      goodsQuantity: item.quantity,
      toleranceAccessId: item.toleranceAccessId,
      roughnessAccessId: item.roughnessAccessId,
      deliveryTypeCode: item.deliveryTypeCode
    }));
    console.log('requestData', requestData);
    
    const response = await service.post('/api/price/price', requestData, { withCredentials: true });
    console.log('response', response);
    const priceData = response.data;
    console.log('FileList中的priceData', priceData)
    if (response.status === 200) {
      // 假设我们只处理第一个报价信息（如果需要处理多个，可以遍历 quoteInfos）
      const quoteInfos = priceData;
      console.log('quoteInfos', quoteInfos)
      selectedDatas.forEach((record, index) => {
        if (index < quoteInfos.length) {
          record.materialCost = quoteInfos[index].materialPrice;
          record.engineeringCost = quoteInfos[index].programPrice;
          record.processingCost = quoteInfos[index].processPrice;
          record.clampingCost = quoteInfos[index].clampPrice;
          record.surfaceCost = quoteInfos[index].craftPrice;
          record.expeditedPrice = quoteInfos[index].expeditedPrice;
          record.pricePerUnit = quoteInfos[index].price; // 更新单价
          record.totalPrice = quoteInfos[index].price * record.quantity; // 更新总价
        }
      });
      // 更新 localRecords 中的数据
      localRecords.value = localRecords.value.map(record => {
        const updatedRecord = selectedDatas.find(selRecord => selRecord.fileInfoAccessId === record.fileInfoAccessId); // 假设记录中有唯一标识符 id
        if (updatedRecord) {
          return {
            ...record,
            materialCost: updatedRecord.materialCost,
            engineeringCost: updatedRecord.engineeringCost,
            processingCost: updatedRecord.processingCost,
            clampingCost: updatedRecord.clampingCost,
            surfaceCost: updatedRecord.surfaceCost,
            expeditedPrice: updatedRecord.expeditedPrice,
            pricePerUnit: updatedRecord.pricePerUnit,
            totalPrice: updatedRecord.totalPrice
          };
        }
        return record;
      });

      // 更新 store 中的数据
      selectedDataStore.setSelectedData(selectedDatas);
      console.log('更新store中的数据', selectedDataStore.getSelectedData())
    } else {
      console.error('Unexpected response format:', priceData);
      ElMessage.error('获取价格信息失败，返回数据格式不正确');
    }
  } catch (error) {
    console.error('请求失败:', error.response?.data || error.message);
    ElMessage.error('获取价格信息失败，请检查网络连接');
  }
};
// 新增：监听交期选项的变化
watch(selectedDelivery, (newDeliveryOption) => {
  console.log('交期选项已更改为:', selectedDelivery.value);
  if(selectedDelivery.value === 'UD'){
    localRecords.value.forEach(record => {
    record.deliveryTypeCode = newDeliveryOption; 
    record.EstimatedDeliveryTime = '5个工作日'
  })
  }else{
    localRecords.value.forEach(record => {
    record.deliveryTypeCode = newDeliveryOption; 
    record.EstimatedDeliveryTime = "10个工作日"
  })
  }
  const selectedDatas = selectedDataStore.getSelectedData()
  selectedDatas.forEach(record => {
    record.deliveryTypeCode = newDeliveryOption; 
  });
  selectedDataStore.setSelectedData(selectedDatas)
  fetchPrices()
});

import ParameterInfo from './ParameterInfo.vue' // 引入 ParameterInfo 组件
const props = defineProps({
  selectedRecords: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:selectedRecords'])

// 监听 props 变化更新本地数据
watch(() => props.selectedRecords, (record) => {
  record = JSON.parse(JSON.stringify(record))
  console.log('record', record)
  // 将 record 对象加入到 localRecords.value 中
  localRecords.value.push(record);
  console.log('下单localRecords.value', localRecords.value)
  const selectedDatas = localRecords.value.filter(record => record.selected)
  console.log('被选中的数据', selectedDatas)
  // selectedDataStore.setSelectedData(selectedDatas)
  if (selectedDatas.length > 0) {
    try {
      // 使用 store 存储数据
      selectedDataStore.setSelectedData(selectedDatas)
      fetchPrices()
    } catch (error) {
      console.error("存储数据时出错:", error)
      alert('准备询价数据时出错，请稍后重试。')
    }
  }
}, { immediate: true, deep: true })

const copyPart = (index) => {
  const newRecord = JSON.parse(JSON.stringify(localRecords.value[index]))
  console.log('newRecord', newRecord)
  localRecords.value.push(newRecord)
  console.log('复制localRecords.value', localRecords.value)
}

const deletePart = (index) => {
  localRecords.value.splice(index, 1)
  console.log('localRecords.value', localRecords.value)
}


const openParameterDialog = (record) => {
  selectedRecord.value = record; // 设置当前选中的记录
  showParameterDialog.value = true; // 显示对话框
}

const handleParameterConfirm = (newParameters) => {
  // 更新当前选中的记录的参数
  Object.assign(selectedRecord.value, newParameters);
  console.log('修改参数后的selectedRecord.value', selectedRecord.value)
  
  // 更新 localRecords 中的相应记录
  const index = localRecords.value.findIndex(record => 
    record.fileInfoAccessId === selectedRecord.value.fileInfoAccessId
  );
  
  if (index !== -1) {
    // 更新 localRecords 中的记录
    localRecords.value[index] = { ...localRecords.value[index], ...newParameters };
    console.log('更新后的 localRecords:', localRecords.value);
    
    // 更新 store 中的数据
    const selectedDatas = localRecords.value.filter(record => record.selected);
    selectedDataStore.setSelectedData(selectedDatas);
    console.log('更新后的store中的数据', selectedDataStore.getSelectedData())
  }
}

onMounted(() => {
  // fetchPrices()
})
// 计算选中的零件数量
const selectedRecordsCount = computed(() => {
  return localRecords.value
    .filter(record => record.selected)
    .reduce((total, record) => total + record.quantity, 0)
});

// 计算选中的总价
const selectedTotalPrice = computed(() => {
  return localRecords.value
    .filter(record => record.selected)
    .reduce((total, record) => total + record.totalPrice, 0)
    .toFixed(2); // 保留两位小数
});


const handleConfirm = async () => {
  // 筛选出被选中的记录
  const selectedDatas = localRecords.value.filter(record => record.selected)
  console.log('准备提交的数据:',selectedDatas)
  if (selectedDatas.length > 0) {
    try {
      // 跳转到询价页面
      router.push('/price-inquiry')
    } catch (error) {
      console.error("存储数据时出错:", error)
      alert('准备询价数据时出错，请稍后重试。')
    }
  } else {
    alert('请至少选择一个零件进行询价')
  }
}

</script>

<style lang="scss" scoped>
.delivery-options {
  margin-bottom: 20px;  /* 添加底部间距 */
}
.delivery-options label {
  display: block;  /* 每个单选按钮占一行 */
  margin: 5px 0;  /* 添加上下间距 */
}
.custom-number-input {
  display: inline-flex;
  align-items: center;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
  transition: border-color 0.2s;

  &:hover {
    border-color: #409eff;
  }

  .number-btn {
    width: 32px;
    height: 32px;
    padding: 0;
    border: none;
    border-radius: 0;
    background: #f5f7fa;

    &:hover {
      background: #ecf5ff;
      color: #409eff;
    }

    &:active {
      background: #d9ecff;
    }

    &:disabled {
      background: #f5f7fa;
      color: #c0c4cc;
      cursor: not-allowed;
    }
  }

  .number-value {
    width: 40px;
    text-align: center;
    font-size: 14px;
    color: #606266;
    border-left: 1px solid #ebeef5;
    border-right: 1px solid #ebeef5;
  }
}
.file-list {
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

  .section-title {
    font-size: 18px;
    font-weight: bold;
    color: #303133;
    margin-bottom: 20px;
    display: flex;
    align-items: center;

    &::before {
      content: '';
      width: 4px;
      height: 18px;
      background-color: #409eff;
      margin-right: 8px;
      border-radius: 2px;
    }
  }

  .file-list-container {
    display: flex;
    gap: 20px;

    .left-section {
      flex: 2;
    }

    .right-section {
      flex: 1;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;

      th, td {
        border: 1px solid #ebeef5;
        padding: 8px;
        text-align: center;
      }
    }

    .file-actions {
      margin-bottom: 10px;
    }

    .info-box {
      background: #f5f7fa;
      padding: 20px;
      border-radius: 8px;
      .delivery-options {
          margin-bottom: 15px; // 与下方内容间距

          label {
            display: block; // 每个选项占一行
            margin-bottom: 8px; // 选项之间的间距
            cursor: pointer;
            color: #606266; // 默认文字颜色
            transition: color 0.3s; // 平滑颜色过渡

            input[type="radio"] {
              margin-right: 5px; // 单选按钮和文字的间距
              vertical-align: middle; // 垂直居中对齐
            }
          }

          // 选中状态的样式
          .selected-option {
            color: #409eff; // 选中的文字颜色为蓝色
          }
          }
      .info-text {
        margin-bottom: 10px;
      }

      .red-text {
        color: red;
        margin-bottom: 20px;
      }

      .blue-button {
        background: #409eff;
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
        width: 100%;
        margin-bottom: 10px;
        cursor: pointer;

        .inquiry-link {
          color: white;
          text-decoration: none;
          display: block;
          width: 100%;
        }
      }

      .white-button {
        background: white;
        color: #409eff;
        padding: 10px 20px;
        border: 1px solid #409eff;
        border-radius: 4px;
        width: 100%;
      }

      .blue-icon {
        display: inline-block;
        width: 16px;
        height: 16px;
        background: #409eff;
        margin-right: 5px;
      }
    }
  }

  .parameter-info-cell {
    position: relative;
    background-color: #e6f7ff; /* 浅蓝色背景 */
    border: 1px dashed #409eff; /* 浅蓝色虚线边框 */

    .parameter-details div {
      margin: 4px 0;
      line-height: 1.5;
      text-align: left;
    }

    .edit-icon {
      position: absolute;
      top: 2px;
      right: 2px;
      color: #409eff;
    }
  }
}
</style>