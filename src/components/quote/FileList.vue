
<template>
  <div class="file-list">
    <h2 class="section-title">文件列表</h2>
    <div class="file-list-container" v-loading="loading">
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
                <button class="delete-btn" @click="deletePart(index)">删除零件</button>
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
          <button class="white-button" @click="handleAddToCart">
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
import { ShoppingCart, Edit } from '@element-plus/icons-vue' 
import { useSelectedDataStore } from '@/store/PriceInquiryDatas'
import { useRouter } from 'vue-router'
import service from '@/utils/request'
import { ElMessage, ElLoading } from 'element-plus'
import ParameterInfo from './ParameterInfo.vue'

const loading = ref(false)
const selectedDataStore = useSelectedDataStore()
const router = useRouter()
const selectedDelivery = ref('BD')
const localRecords = ref([])
const showParameterDialog = ref(false)
const selectedRecord = ref(null) 

const props = defineProps({
  selectedRecords: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:selectedRecords', 'listEmpty'])

const fetchPrices = async () => {
  const recordsToPrice = localRecords.value.filter(r => r.selected);
  if (!recordsToPrice || recordsToPrice.length === 0) {
      return;
  }
  
  loading.value = true;

  try {
    const requestData = recordsToPrice.map(item => ({
      materialAccessId: item.materialAccessId,
      crafts: [
        {
          craftAccessId: item.craftAccessId1,
          craftAttributeAccessIds: [
            item.craftAttributeColorAccessIds1,
            item.craftAttributeGlossinessAccessIds1,
            item.craftAttributeFileAccessIds1
          ].flat().filter(Boolean)
        },
        {
          craftAccessId: item.craftAccessId2,
          craftAttributeAccessIds: [
            item.craftAttributeColorAccessIds2,
            item.craftAttributeGlossinessAccessIds2,
            item.craftAttributeFileAccessIds2
          ].flat().filter(Boolean)
        }
      ].filter(craft => craft.craftAccessId),
      productModelAccessId: item.productModelAccessId,
      goodsQuantity: item.quantity,
      toleranceAccessId: item.toleranceAccessId,
      roughnessAccessId: item.roughnessAccessId,
      deliveryTypeCode: item.deliveryTypeCode,
    }));
    
    const response = await service.post('/api/price/price', requestData, { withCredentials: true });
    const priceData = response.data;
    
    if (response.status === 200 && Array.isArray(priceData)) {
      // 直接并高效地更新 localRecords
      priceData.forEach((quoteInfo, index) => {
        // 假设返回的priceData与请求的recordsToPrice顺序一致
        const correspondingRecord = recordsToPrice[index];
        if (correspondingRecord) {
          const recordInLocalList = localRecords.value.find(
            lr => lr.fileInfoAccessId === correspondingRecord.fileInfoAccessId
          );
          if (recordInLocalList) {
            recordInLocalList.materialCost = quoteInfo.materialPrice;
            recordInLocalList.engineeringCost = quoteInfo.programPrice;
            recordInLocalList.processingCost = quoteInfo.processPrice;
            recordInLocalList.clampingCost = quoteInfo.clampPrice;
            recordInLocalList.surfaceCost = quoteInfo.craftPrice;
            recordInLocalList.expeditedPrice = quoteInfo.expeditedPrice;
            recordInLocalList.pricePerUnit = quoteInfo.price;
            recordInLocalList.totalPrice = quoteInfo.price * recordInLocalList.quantity;
          }
        }
      });
      // 将更新后的数据同步到Pinia Store
      selectedDataStore.setSelectedData(localRecords.value.filter(r => r.selected));
    } else {
      ElMessage.error('获取价格信息失败，返回数据格式不正确');
    }
    
  } catch (error) {
    ElMessage.error('获取价格信息失败，请检查网络连接');
  } finally {
    loading.value = false;
  }
};

watch(selectedDelivery, (newDeliveryOption) => {
  // 当交期变化时，更新所有记录的交期代码
  localRecords.value.forEach(record => {
    record.deliveryTypeCode = newDeliveryOption; 
    record.EstimatedDeliveryTime = newDeliveryOption === 'UD' ? '5个工作日' : '10个工作日';
  });

  // 更新Pinia Store中的数据
  const selectedDatas = selectedDataStore.getSelectedData();
  selectedDatas.forEach(record => {
    record.deliveryTypeCode = newDeliveryOption; 
  });
  selectedDataStore.setSelectedData(selectedDatas);

  // 重新获取价格，因为交期会影响价格
  fetchPrices();
});

watch(() => props.selectedRecords, (record) => {
  if (record && Object.keys(record).length > 0) {
    const newRecord = JSON.parse(JSON.stringify(record));
    if (!localRecords.value.some(r => r.fileInfoAccessId === newRecord.fileInfoAccessId)) {
        localRecords.value.push(newRecord);
    }
    const selectedDatas = localRecords.value.filter(r => r.selected);
    if (selectedDatas.length > 0) {
        try {
            selectedDataStore.setSelectedData(selectedDatas);
            fetchPrices(); // 新增记录时获取初始价格
        } catch (error) {
            alert('准备询价数据时出错，请稍后重试。');
        }
    }
  }
}, { immediate: true, deep: true });

const deletePart = (index) => {
  localRecords.value.splice(index, 1);
  if (localRecords.value.length === 0) {
    emit('listEmpty');
  }
  // 更新store
  selectedDataStore.setSelectedData(localRecords.value.filter(r => r.selected));
};

const openParameterDialog = (record) => {
  selectedRecord.value = record;
  showParameterDialog.value = true;
};

const handleParameterConfirm = (newParameters) => {
  // 找到被编辑的记录的索引
  const index = localRecords.value.findIndex(record => 
    record.fileInfoAccessId === selectedRecord.value.fileInfoAccessId
  );
  
  if (index !== -1) {
    // 使用从弹窗传回的、已包含最新价格的完整数据来更新本地记录
    localRecords.value[index] = { ...localRecords.value[index], ...newParameters };
    
    // 更新Pinia Store
    const selectedDatas = localRecords.value.filter(record => record.selected);
    selectedDataStore.setSelectedData(selectedDatas);
    
    // 不再调用 fetchPrices()！因为价格已经由子组件计算并返回了。
  }
};

onMounted(() => {
  // onMounted的初次价格获取由 props watcher 触发
});

const selectedRecordsCount = computed(() => {
  return localRecords.value
    .filter(record => record.selected)
    .reduce((total, record) => total + record.quantity, 0);
});

const selectedTotalPrice = computed(() => {
  return localRecords.value
    .filter(record => record.selected)
    .reduce((total, record) => total + record.totalPrice, 0)
    .toFixed(2);
});

const handleAddToCart = async () => {
  try {
    const selectedDatas = localRecords.value.filter(record => record.selected);
    if (selectedDatas.length === 0) {
      ElMessage.warning('请至少选择一个零件进行询价');
      return;
    }
    const response = await service.post('/api/orders/add_to_cart', selectedDatas, { withCredentials: true });
    if (response.data.success) {
      ElMessage.success('已加入购物车');
    } else {
      ElMessage.error('加入购物车失败');
    }
  } catch (error) {
    ElMessage.error('加入购物车失败，请检查网络连接');
  }
};

const handleConfirm = async () => {
  const selectedDatas = localRecords.value.filter(record => record.selected);
  if (selectedDatas.length === 0) {
    ElMessage.warning('请至少选择一个零件进行询价');
    return;
  }

  const loadingInstance = ElLoading.service({
    lock: true,
    text: '正在准备询价数据，即将跳转...',
    background: 'rgba(0, 0, 0, 0.7)',
  });

  try {
    const response = await service.post('/api/orders/save_selected_datas', selectedDatas, { withCredentials: true });
    if (response.status === 200) {
      router.push('/price-inquiry');
    } else {
      ElMessage.error('准备询价数据时出错，请稍后重试。');
    }
  } catch (error) {
    ElMessage.error('准备询价数据时出错，请检查网络连接。');
  } finally {
    loadingInstance.close();
  }
};
</script>

<style lang="scss" scoped>
/* (样式无变化，此处省略) */
.delete-btn {
  background-color: #409eff;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #66b1ff;
  }

  &:active {
    background-color: #3a8ee6;
  }
}

.delivery-options {
  margin-bottom: 20px;
}
.delivery-options label {
  display: block;
  margin: 5px 0;
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
          margin-bottom: 15px;

          label {
            display: block; 
            margin-bottom: 8px;
            cursor: pointer;
            color: #606266;
            transition: color 0.3s;

            input[type="radio"] {
              margin-right: 5px;
              vertical-align: middle;
            }
          }

          .selected-option {
            color: #409eff;
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
        color: white; /* Ensure text is white */

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
    background-color: #e6f7ff;
    border: 1px dashed #409eff;
    cursor: pointer; /* Add cursor pointer */

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