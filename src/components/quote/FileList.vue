<template>
  <div class="file-list">
    <h2 class="section-title">文件列表</h2>
    <!-- ★★★ 修改点: 将 v-loading 指令从 .left-section 移到这里 ★★★ -->
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

const loading = ref(false)
const selectedDataStore = useSelectedDataStore()
const router = useRouter()
const selectedDelivery = ref('BD')
const localRecords = ref([])
const showParameterDialog = ref(false)
const selectedRecord = ref(null) 

const fetchPrices = async () => {
  const selectedDatas = selectedDataStore.getSelectedData();
  if (!selectedDatas || selectedDatas.length === 0) {
      console.log('No selected data to fetch prices for.');
      return;
  }
  
  console.log('获取勾选的数据', selectedDatas);
  loading.value = true;

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
          ].flat().filter(Boolean) // 使用.flat()确保数组扁平化
        },
        {
          craftAccessId: item.craftAccessId2,
          craftAttributeAccessIds: [
            item.craftAttributeColorAccessIds2,
            item.craftAttributeGlossinessAccessIds2,
            item.craftAttributeFileAccessIds2
          ].flat().filter(Boolean) // 使用.flat()确保数组扁平化
        }
      ].filter(craft => craft.craftAccessId), // 过滤掉没有craftAccessId的craft对象
      productModelAccessId: item.productModelAccessId,
      goodsQuantity: item.quantity,
      toleranceAccessId: item.toleranceAccessId,
      roughnessAccessId: item.roughnessAccessId,
      deliveryTypeCode: item.deliveryTypeCode,
    }));
    
    const response = await service.post('/api/price/price', requestData, { withCredentials: true });
    const priceData = response.data;
    
    if (response.status === 200 && Array.isArray(priceData)) {
      const quoteInfos = priceData;
      selectedDatas.forEach((record, index) => {
        if (index < quoteInfos.length) {
          record.materialCost = quoteInfos[index].materialPrice;
          record.engineeringCost = quoteInfos[index].programPrice;
          record.processingCost = quoteInfos[index].processPrice;
          record.clampingCost = quoteInfos[index].clampPrice;
          record.surfaceCost = quoteInfos[index].craftPrice;
          record.expeditedPrice = quoteInfos[index].expeditedPrice;
          record.pricePerUnit = quoteInfos[index].price;
          record.totalPrice = record.pricePerUnit * record.quantity;
        }
      });
      localRecords.value = localRecords.value.map(record => {
        const updatedRecord = selectedDatas.find(selRecord => selRecord.fileInfoAccessId === record.fileInfoAccessId);
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
            totalPrice: updatedRecord.totalPrice,
          };
        }
        return record;
      });

      selectedDataStore.setSelectedData(selectedDatas);
    } else {
      console.error('Unexpected response format:', priceData);
      ElMessage.error('获取价格信息失败，返回数据格式不正确');
    }
    
  } catch (error) {
    console.error('请求失败:', error.response?.data || error.message);
    ElMessage.error('获取价格信息失败，请检查网络连接');
  } finally {
    loading.value = false;
  }
};

watch(selectedDelivery, (newDeliveryOption) => {
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

import ParameterInfo from './ParameterInfo.vue'
const props = defineProps({
  selectedRecords: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:selectedRecords', 'listEmpty'])

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
            fetchPrices();
        } catch (error) {
            console.error("存储数据时出错:", error);
            alert('准备询价数据时出错，请稍后重试。');
        }
    }
  }
}, { immediate: true, deep: true })

const deletePart = (index) => {
  localRecords.value.splice(index, 1)
  if (localRecords.value.length === 0) {
    emit('listEmpty')
  }
}

const openParameterDialog = (record) => {
  selectedRecord.value = record;
  showParameterDialog.value = true;
}

const handleParameterConfirm = (newParameters) => {
  Object.assign(selectedRecord.value, newParameters);
  
  const index = localRecords.value.findIndex(record => 
    record.fileInfoAccessId === selectedRecord.value.fileInfoAccessId
  );
  
  if (index !== -1) {
    localRecords.value[index] = { ...localRecords.value[index], ...newParameters };
    const selectedDatas = localRecords.value.filter(record => record.selected);
    selectedDataStore.setSelectedData(selectedDatas);
    // After confirming parameters, prices might change, so re-fetch
    fetchPrices();
  }
}

onMounted(() => {
  // onMounted fetch is handled by the props watcher
})

const selectedRecordsCount = computed(() => {
  return localRecords.value
    .filter(record => record.selected)
    .reduce((total, record) => total + record.quantity, 0)
});

const selectedTotalPrice = computed(() => {
  return localRecords.value
    .filter(record => record.selected)
    .reduce((total, record) => total + record.totalPrice, 0)
    .toFixed(2);
});

const handleAddToCart = async () => {
  try {
    const selectedDatas = localRecords.value.filter(record => record.selected)
    console.log('准备提交的数据:', selectedDatas)
    if (selectedDatas.length === 0) {
      ElMessage.warning('请至少选择一个零件进行询价');
      return;
    }
    const response = await service.post('/api/orders/add_to_cart', selectedDatas, { withCredentials: true })
    if (response.data.success) {
      ElMessage.success('已加入购物车')
    } else {
      ElMessage.error('加入购物车失败')
    }
  } catch (error) {
    console.error('加入购物车失败:', error.response?.data || error.message)
    ElMessage.error('加入购物车失败，请检查网络连接')
  }
}

const handleConfirm = async () => {
  const selectedDatas = localRecords.value.filter(record => record.selected)
  console.log('准备提交的数据:', selectedDatas)
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
    console.log('后端返回的数据:', response);
    
    if (response.status === 200) {
      router.push('/price-inquiry');
    } else {
      ElMessage.error('准备询价数据时出错，请稍后重试。');
    }
  } catch (error) {
    console.error("存储数据时出错:", error);
    ElMessage.error('准备询价数据时出错，请检查网络连接。');
  } finally {
    loadingInstance.close();
  }
}
</script>

<style lang="scss" scoped>
/* 样式保持不变 */
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