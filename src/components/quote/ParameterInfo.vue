<template>
  <el-dialog
    v-model="dialogVisible"
    width="1400px"
    :close-on-click-modal="false"
    destroy-on-close
  >
    <div class="dialog-header">选择加工参数</div>
    <el-divider />

    <div class="dialog-content">
      <div class="left-section">
        <!-- 材料选择 -->
        <div class="param-item">
          <div class="material-selection">
            <div class="required-label">材料：</div>
            <span class="selected-value" v-if="selectedMaterial">
              {{ getSelectedMaterialLabel }}
            </span>
          </div>
          <div class="material-selector">
            <div class="selector-header">
              <div class="category-title">分类</div>
              <div class="material-title">材料</div>
            </div>
            <div class="selector-content">
              <div class="category-list">
                <div
                  v-for="category in parametersList"
                  :key="category.id"
                  class="category-item"
                  :class="{ 'active': currentCategory?.id === category.id }"
                  @click="selectCategory(category)"
                >
                  {{ category.name }}
                </div>
              </div>
              <div class="material-list">
                <div
                  v-for="material in currentMaterials"
                  :key="material.materialAccessId"
                  class="material-item"
                  :class="{ 'active': selectedMaterial?.materialAccessId === material.materialAccessId }"
                  @click="selectMaterial(material)"
                >
                  <div class="material-name">{{ material.materialName }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 表面处理 -->
        <div class="param-item">
          <div class="surface-treatment-selection">
            <div class="required-label">表面处理：</div>
            <span class="selected-value">{{ getSurfaceTreatmentLabel }}</span>
          </div>
          <div class="button-group">
            <el-button 
              :class="{ 'selected': surfaceTreatment === 'none' }"
              @click="surfaceTreatment = 'none'"
            >
              表面不做处理
              <el-icon v-if="surfaceTreatment === 'none'" class="check-icon"><Check /></el-icon>
            </el-button>
            <el-button 
              :class="{ 'selected': surfaceTreatment === 'need' }"
              @click="surfaceTreatment = 'need'"
            >
              表面需要处理
              <el-icon v-if="surfaceTreatment === 'need'" class="check-icon"><Check /></el-icon>
            </el-button>
          </div>
          <!-- 显示框 -->
          <div class="surface-treatment-display" v-if="surfaceTreatment === 'need'">
            <div class="upper-section">
              <div class="part">
                <span>表面处理一</span>
                <el-select v-model="selectedTreatment" placeholder="请选择">
                  <el-option
                    v-for="item in surfaceTreatmentData"
                    :key="item.craftAccessId"
                    :label="item.craftName"
                    :value="item.craftName"
                  />
                </el-select>
              </div>
              <div class="part">
                <span>颜色</span>
                <el-select 
                  v-model="selectedColor" 
                  placeholder="请选择"
                  :disabled="!colorOption"
                >
                  <el-option
                    v-for="option in colorOption?.attrs || []"
                    :key="option.craftAttributeAccessId"
                    :label="option.value"
                    :value="option.value"
                  />
                </el-select>
              </div>
              <div class="part">
                <span>图纸</span>
                <div class="upload-container">
                  <div 
                    class="upload-button"
                    @click="fileInput.click()"
                    :class="{ 'is-hover': isHover, 'disabled': isButton1Disabled }"
                    @mouseover="isHover = true"
                    @mouseleave="isHover = false"
                    :disabled="isButton1Disabled"
                  >
                    <el-icon v-if="!uploadedFile"><Plus /></el-icon>
                    <span v-if="!uploadedFile" class="button-text" style="margin-bottom: 2px;">请上传图纸</span>
                    <span v-if="uploadedFile" class="button-text" style="margin-bottom: 2px;">更新文件</span>
                  </div>
                  <div v-if="uploadedFile" class="file-name">{{ uploadedFileName }}</div>
                </div>
                <input 
                  type="file" 
                  ref="fileInput"
                  @change="handleFileUpload"
                  style="display: none"
                  :disabled="isButton1Disabled"
                />
              </div>
              <div class="part">
                <span>光泽</span>
                <el-radio-group v-model="glossiness">
                  <el-radio
                    v-for="option in glossinessOptions?.attrs || []"
                    :key="option.craftAttributeAccessId"
                    :label="option.value"
                  >
                    {{ option.value }}
                  </el-radio>
                </el-radio-group>
              </div>
            </div>
            <div v-html="surfaceTreatmentNoteDisplay"></div>
            <div class="upper-section">
              <div class="part">
                <span>表面处理二</span>
                <el-select v-model="selectedTreatment2" placeholder="请选择" :disabled="isSecondTreatmentDisabled">
                  <el-option
                    v-for="item in filteredSurfaceTreatmentData"
                    :key="item.craftAccessId"
                    :label="item.craftName"
                    :value="item.craftName"
                  />
                </el-select>
              </div>
              <div class="part">
                <span>颜色</span>
                <el-select 
                  v-model="selectedColor2" 
                  placeholder="请选择"
                  :disabled="!colorOption2 || isSecondTreatmentDisabled"
                >
                  <el-option
                    v-for="option in colorOption2?.attrs || []"
                    :key="option.craftAttributeAccessId"
                    :label="option.value"
                    :value="option.value"
                  />
                </el-select>
              </div>
              <div class="part">
                <span>图纸</span>
                <div class="upload-container">
                  <div 
                    class="upload-button"
                    @click="fileInput2.click()"
                    :class="{ 'is-hover': isHover2, 'disabled': isButton2Disabled }"
                    @mouseover="isHover2 = true"
                    @mouseleave="isHover2 = false"
                    :disabled="isButton2Disabled"
                  >
                    <el-icon v-if="!uploadedFile2"><Plus /></el-icon>
                    <span v-if="!uploadedFile2" class="button-text" style="margin-bottom: 2px;">请上传图纸</span>
                    <span v-if="uploadedFile2" class="button-text" style="margin-bottom: 2px;">更新文件</span>
                  </div>
                  <div v-if="uploadedFile2" class="file-name">{{ uploadedFileName2 }}</div>
                </div>
                <input 
                  type="file" 
                  ref="fileInput2"
                  @change="handleFileUpload2"
                  style="display: none"
                  :disabled="isButton2Disabled"
                />
              </div>
              <div class="part">
                <span>光泽</span>
                <el-radio-group v-model="glossiness2" :disabled="isSecondTreatmentDisabled">
                  <el-radio
                    v-for="option in glossinessOptions2?.attrs || []"
                    :key="option.craftAttributeAccessId"
                    :label="option.value"
                  >
                    {{ option.value }}
                  </el-radio>
                </el-radio-group>
              </div>
            </div>
            <div v-html="surfaceTreatmentNoteDisplay2"></div>
          </div>
          <div v-else class="surface-treatment-display" v-html="surfaceTreatmentDisplay"></div>
        </div>

        <!-- 加工数量 -->
        <div class="param-item">
          <div class="required-label">加工数量：</div>
          <el-input-number v-model="quantity" :min="1" />
          <span class="discount-text">[数量折扣]</span>
        </div>

        <!-- 最严公差 -->
        <div class="param-item">
          <div class="required-label">最严公差：</div>
          <el-select v-model="tolerance">
            <el-option
              v-for="item in toleranceOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>

        <!-- 最小粗糙度 -->
        <div class="param-item">
          <div class="required-label">最小粗糙度：</div>
          <el-select v-model="roughness">
            <el-option
              v-for="item in roughnessOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>

        <!-- 是否有螺纹 -->
        <div class="param-item">
          <div class="label">是否有螺纹：</div>
          <el-radio-group v-model="hasThread">
            <el-radio :label="false">否</el-radio>
            <el-radio :label="true">是</el-radio>
          </el-radio-group>
        </div>

        <!-- 是否有装配关系 -->
        <div class="param-item">
          <div class="label">是否有装配关系：</div>
          <el-radio-group v-model="hasAssembly">
            <el-radio :label="false">否</el-radio>
            <el-radio :label="true">是</el-radio>
          </el-radio-group>
        </div>

        <!-- 备注 -->
        <div class="param-item">
          <div class="label">备注：</div>
          <el-input
            v-model="notes"
            type="textarea"
            :rows="3"
            placeholder="请输入备注信息"
          />
        </div>
      </div>

      <!-- 右侧价格信息区域 -->
      <div class="right-section">
        <!-- 文件信息 -->
        <div class="file-info">
          <img :src="fileImage" class="file-image" />
          <div class="file-name">{{ fileName }}</div>
          <div class="file-dimensions">{{ fileDimensions }}</div>
        </div>

        <!-- 价格明细 -->
        <div class="price-details">
          <div class="price-item">
            <span>材料费</span>
            <span class="price">¥{{ materialCost }}</span>
          </div>
          <div class="price-item">
            <span>工程费<span class="red-text">(仅新单收取，返单免收)</span></span>
            <span class="price">¥{{ engineeringCost }}</span>
          </div>
          <div class="price-item">
            <span>装夹费<span class="red-text">(平台补贴全免)</span></span>
            <span class="price">¥{{ clampingCost }}</span>
          </div>
          <div class="price-item">
            <span>加工费</span>
            <span class="price">¥{{ processingCost }}</span>
          </div>
          <div class="price-item">
            <span>表面处理费</span>
            <span class="price">¥{{ surfaceCost }}</span>
          </div>
        </div>

        <el-divider />

        <!-- 总价 -->
        <div class="total-price">
          <div class="price-item">
            <span>总计（含税）:</span>
            <span class="total">¥{{ totalPrice }}</span>
          </div>
          <div class="price-per-unit">¥{{ pricePerUnit }}/件</div>
        </div>

        <!-- 确认按钮 -->
        <el-button type="primary" class="confirm-btn" @click="handleConfirm">
          确认
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { ref, watch, computed, onMounted } from 'vue'
import {
  parametersList,
  currentParameters,
  updateParameters,
  surfaceTreatmentData
} from './AutomationTool'
import { ElMessage } from 'element-plus'
import axios from 'axios'
export default {
  name: 'ParameterInfo',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:visible', 'confirm'],
  setup(props, { emit }) {
    const dialogVisible = ref(false)
    const selectedParameterId = ref(currentParameters.value.id)

    watch(() => props.visible, (val) => {
      dialogVisible.value = val
      if (val) {
        resetSelection()
      }
    })

    watch(dialogVisible, (val) => {
      emit('update:visible', val)
    })

    const handleParametersChange = (parameterId) => {
      updateParameters(parameterId)
    }

    const closeDialog = () => {
      dialogVisible.value = false
    }

    const confirmParameters = () => {
      emit('confirm', currentParameters.value)
      dialogVisible.value = false
    }

    const currentCategory = ref(null)
    const selectedMaterial = ref(null)

    // 当前选中分类的材料列表
    const currentMaterials = computed(() => {
      if (!currentCategory.value) return []
      return currentCategory.value.children || []
    })

    // 获取选中材料的显示文本
    const getSelectedMaterialLabel = computed(() => {
      if (!selectedMaterial.value) return ''
      return `${selectedMaterial.value.materialName}`
    })

    // 选择分类
    const selectCategory = (category) => {
      if (!category) return
      currentCategory.value = category
    }

    // 选择材料
    const selectMaterial = (material) => {
      if (!material) return
      selectedMaterial.value = material
    }

    // 模拟数据
    const surfaceTreatment = ref('none')
    const quantity = ref(1)
    const toleranceOptions = ref([{ value: 'GB/T 1804-2000 m级', label: 'GB/T 1804-2000 m级' },{ value: '±0.10mm', label: '±0.10mm' },{ value: '±0.05mm', label: '±0.05mm' }])
    const tolerance = ref('')
    const roughnessOptions = ref([{ value: 'Ra3.2', label: 'Ra3.2' },{ value: 'Ra1.6', label: 'Ra1.6' }])
    const roughness = ref('')
    const hasThread = ref(false)
    const hasAssembly = ref(false)
    const notes = ref('')
    const fileImage = ref('')
    const fileName = ref('文件名称')
    const fileDimensions = ref('尺寸信息')
    const materialCost = ref(0)
    const engineeringCost = ref(0)
    const clampingCost = ref(0)
    const processingCost = ref(0)
    const surfaceCost = ref(0)
    const pricePerUnit = ref(0)

    const handleConfirm = () => {
    if (!selectedMaterial.value) {
      ElMessage.warning('请选择材料')
      return
    }
    
    const parameters = {
      material: selectedMaterial.value.materialName,
      surfaceTreatment: surfaceTreatment.value,
      tolerance: tolerance.value,
      roughness: roughness.value,
      selectedTreatment: selectedTreatment.value,
      selectedColor: selectedColor.value,
      glossiness: glossiness.value,
      uploadedFileName: uploadedFileName.value,
      selectedTreatment2: selectedTreatment2.value,
      selectedColor2: selectedColor2.value,
      glossiness2: glossiness2.value,
      uploadedFileName2: uploadedFileName2.value,
      totalPrice: totalPrice.value,
      pricePerUnit: pricePerUnit.value
    }
    
    emit('confirm', parameters)
    dialogVisible.value = false
  }

    const getSurfaceTreatmentLabel = computed(() => {
      if (surfaceTreatment.value === 'none') {
        return '表面不做处理'
      } else {
        if (selectedTreatment.value) {
          if(selectedColor.value) {
            if(glossiness.value) {
              if(selectedTreatment2.value) {
                if(selectedColor2.value) {
                  if(glossiness2.value) {
                    return `${selectedTreatment.value} - ${selectedColor.value} - ${glossiness.value} , ${selectedTreatment2.value} - ${selectedColor2.value} - ${glossiness2.value}`
                  } else {
                    if(uploadedFileName2.value) {
                      return `${selectedTreatment.value} - ${selectedColor.value} - ${glossiness.value} , ${selectedTreatment2.value} - ${selectedColor2.value} - ${uploadedFileName2.value}`
                    } else {
                      return `${selectedTreatment.value} - ${selectedColor.value} - ${glossiness.value} , ${selectedTreatment2.value} - ${selectedColor2.value}`
                    }
                  }
                } else {
                  if(uploadedFileName2.value) {
                    return `${selectedTreatment.value} - ${selectedColor.value} - ${glossiness.value} , ${selectedTreatment2.value} - ${uploadedFileName2.value}`
                  } else {
                    return `${selectedTreatment.value} - ${selectedColor.value} - ${glossiness.value} , ${selectedTreatment2.value}`
                  }
                }
              } else {
                  return `${selectedTreatment.value} - ${selectedColor.value} - ${glossiness.value}`
              }
            } else {
              if(uploadedFileName.value) {
                return `${selectedTreatment.value} - ${selectedColor.value} - ${uploadedFileName.value}`
              } else {
                return `${selectedTreatment.value} - ${selectedColor.value}`
              }
            }
          } else {
            if(uploadedFileName.value) {
              return `${selectedTreatment.value} - ${uploadedFileName.value}`
            } else {
              return `${selectedTreatment.value}`
            }
          }
        } else {
          return '表面需要处理'
        }
      }
    })

    // 显示框内容
    const surfaceTreatmentDisplay = computed(() => {
      if (surfaceTreatment.value === 'none' && selectedMaterial.value) {
        return selectedMaterial.value.materialRemark || '无备注信息'
      }
      return ''
    })
    //监听表面不做处理
    watch(surfaceTreatment, (newVal) => {
      selectedTreatment.value = '';
      selectedColor.value = '';
      glossiness.value = '';
      selectedTreatment2.value = '';
      selectedColor2.value = '';
      glossiness2.value = '';
      uploadedFileName.value = '';
      uploadedFileName2.value = ''
      craftAccessId1.value = '';
      craftAttributeColorAccessIds1.value = '';
      craftAttributeGlossinessAccessIds1.value = '';
      craftAttributeFileAccessIds1.value = '';
      craftAccessId2.value = '';
      craftAttributeColorAccessIds2.value = '';
      craftAttributeGlossinessAccessIds2.value = '';
      craftAttributeFileAccessIds2.value = '';
    })

    // 表面处理一
    const selectedTreatment = ref('')
    // 表面处理一颜色
    const selectedColor = ref('')
    //表面处理一备注
    const surfaceTreatmentNoteDisplay = computed(() => {
      if (selectedTreatment.value) {
        const selectedItem = surfaceTreatmentData.find(item => item.craftName === selectedTreatment.value);
        return selectedItem?.craftRemark || '无备注信息';
      }
      return ''
    })

    // 表面处理一颜色选项
    const colorOption = computed(() => {
      if (!selectedTreatment.value) return null;
      const selectedItem = surfaceTreatmentData.find(item => item.craftName === selectedTreatment.value);
      return selectedItem?.option?.optionName === '颜色' ? selectedItem.option : null;
    });
    // 表面处理一光泽
    const glossiness = ref('');
    // 表面处理一光泽选项计算属性
    const glossinessOptions = computed(() => {
      if (!selectedTreatment.value) return [];
      if(colorOption.value){
        const selectedItem = colorOption.value.attrs.find(item => item.value === selectedColor.value);
        return selectedItem?.option?.optionName === '光泽' ? selectedItem.option : null;
      }else{
        return  null;
      }
    });
    // 表面处理一图纸
    const paperOptions = computed(() => {
      if (!selectedTreatment.value) {
        return [];
      }else{
        if(selectedColor.value){  
          const selectedItem = colorOption.value.attrs.find(item => item.value === selectedColor.value);
          return selectedItem?.option?.optionName === '图纸' ? selectedItem.option : [];
        }else{
          const selectedItem = surfaceTreatmentData.find(item => item.craftName === selectedTreatment.value);
          return selectedItem?.option?.optionName === '图纸' ? selectedItem.option : [];
        }
      }
    });
    const craftAccessId1 = ref('')
    const craftAttributeColorAccessIds1 = ref('')
    const craftAttributeGlossinessAccessIds1 = ref('')
    const craftAttributeFileAccessIds1 = ref('')
    const craftAccessId2 = ref('')
    const craftAttributeColorAccessIds2 = ref('')
    const craftAttributeGlossinessAccessIds2 = ref('')
    const craftAttributeFileAccessIds2 = ref('')

    //表面处理一监听
    watch(selectedTreatment, (newVal) => {
      // 清空选择
      selectedColor.value = '';
      glossiness.value = '';
      selectedTreatment2.value = '';
      selectedColor2.value = '';
      glossiness2.value = '';
      uploadedFileName.value = '';
      uploadedFileName2.value = '';
      craftAccessId1.value = '';
      craftAttributeColorAccessIds1.value = '';
      craftAttributeGlossinessAccessIds1.value = '';
      craftAttributeFileAccessIds1.value = '';
      craftAccessId2.value = '';
      craftAttributeColorAccessIds2.value = '';
      craftAttributeGlossinessAccessIds2.value = '';
      craftAttributeFileAccessIds2.value = '';
      // 表面处理一默认值
      if (surfaceTreatmentData.length > 0 && !selectedTreatment.value) {
        selectedTreatment.value = surfaceTreatmentData[0].craftName
      }
      if(selectedTreatment.value){
        craftAccessId1.value = surfaceTreatmentData.find(item => item.craftName === selectedTreatment.value)?.craftAccessId || ''
        if(colorOption.value){
          craftAttributeColorAccessIds1.value = colorOption.value.attrs[0]?.craftAttributeAccessId || ''
        }
        else{
          craftAttributeColorAccessIds1.value = ''
        }
      }
      if (colorOption.value) {
        selectedColor.value = colorOption.value.attrs[0]?.value || '';
        craftAttributeColorAccessIds1.value = colorOption.value.attrs[0]?.craftAttributeAccessId || ''
      } 
      if (glossinessOptions.value) {
        glossiness.value = glossinessOptions.value.attrs[0]?.value || '';
        craftAttributeGlossinessAccessIds1.value = glossinessOptions.value.attrs[0]?.craftAttributeAccessId || ''
      } 
      if(paperOptions.value){
        craftAttributeFileAccessIds1.value = paperOptions.value.attrs[0]?.craftAttributeAccessId || ''
      }
    })

    const isButton1Disabled = computed(() => {
      const allowedValues = ['激光打标', '丝印']
      return !allowedValues.includes(selectedTreatment.value)
    })


    // 表面处理二
    const selectedTreatment2 = ref('')
    // 表面处理二颜色
    const selectedColor2 = ref('')
    //表面处理二备注
    const surfaceTreatmentNoteDisplay2 = computed(() => {
      if (selectedTreatment2.value) {
        const selectedItem = surfaceTreatmentData.find(item => item.craftName === selectedTreatment2.value);
        return selectedItem?.craftRemark || '无备注信息';
      }
      return ''
    })

    // 表面处理二颜色选项
    const colorOption2 = computed(() => {
      if (!selectedTreatment2.value) return null;
      const selectedItem = surfaceTreatmentData.find(item => item.craftName === selectedTreatment2.value);
      return selectedItem?.option?.optionName === '颜色' ? selectedItem.option : null;
    });
    // 表面处理二光泽
    const glossiness2 = ref('');
    // 表面处理二光泽选项计算属性
    const glossinessOptions2 = computed(() => {
      if (!selectedTreatment2.value) return [];
      const selectedItem = colorOption2.value.attrs.find(item => item.value === selectedColor2.value);
      return selectedItem?.option?.optionName === '光泽' ? selectedItem.option : null;
    });
    // 表面处理二图纸
    const paperOptions2 = computed(() => {
      if (!selectedTreatment2.value) {
        return [];
      }else{
        if(selectedColor2.value){  
          const selectedItem = colorOption2.value.attrs.find(item => item.value === selectedColor2.value);
          return selectedItem?.option?.optionName === '图纸' ? selectedItem.option : [];
        }else{
          const selectedItem = surfaceTreatmentData.find(item => item.craftName === selectedTreatment2.value);
          return selectedItem?.option?.optionName === '图纸' ? selectedItem.option : [];
        }
      }
    });

    //表面处理二监听
    watch(selectedTreatment2, (newVal) => {
      
      // 表面处理二默认值
      if (surfaceTreatmentData.length > 0 && !selectedTreatment2.value) {
        selectedTreatment2.value = surfaceTreatmentData[0].craftName
      }
      if(selectedTreatment2.value){
        craftAccessId2.value = surfaceTreatmentData.find(item => item.craftName === selectedTreatment2.value)?.craftAccessId || ''
        if(colorOption2.value){
          craftAttributeColorAccessIds2.value = colorOption2.value.attrs[0]?.craftAttributeAccessId || ''
        }
        else{
          craftAttributeColorAccessIds2.value = ''
        }
      }
      if (colorOption2.value) {
        selectedColor2.value = colorOption2.value.attrs[0]?.value || '';
        craftAttributeColorAccessIds2.value = colorOption2.value.attrs[0]?.craftAttributeAccessId || ''
      } 
      if (glossinessOptions2.value) {
        glossiness2.value = glossinessOptions2.value.attrs[0]?.value || '';
        craftAttributeGlossinessAccessIds2.value = glossinessOptions2.value.attrs[0]?.craftAttributeAccessId || ''
      } 
      if(paperOptions2.value){
        craftAttributeFileAccessIds2.value = paperOptions2.value.attrs[0]?.craftAttributeAccessId || ''
      }
    })

    // 表面处理二禁用状态
    const isSecondTreatmentDisabled = computed(() => {
      return !selectedTreatment.value;
    });
    const isButton2Disabled = computed(() => {
      const allowedValues = ['激光打标', '丝印']
      return !allowedValues.includes(selectedTreatment2.value)
    })

    // 动态更新表面处理二的选项
    const filteredSurfaceTreatmentData = computed(() => {
      if (!selectedTreatment.value) return [];
      const selectedItem = surfaceTreatmentData.find(item => item.craftName === selectedTreatment.value);
      if (selectedItem?.craftCategory === '类别二') {
        return surfaceTreatmentData.filter(item => item.craftCategory === '类别三');
      } else if (selectedItem?.craftCategory === '类别三') {
        return surfaceTreatmentData.filter(item => item.craftCategory === '类别二');
      }
      return [];
    });

    // 重置选择
    const resetSelection = () => {
      if (parametersList.length > 0) {
        // 默认选择"铝合金"分类
        currentCategory.value = parametersList.find(category => category.name === '铝合金')
        // 默认选择"铝合金-6061"材料
        if (currentCategory.value) {
          selectedMaterial.value = currentCategory.value.children.find(material => material.materialName === '铝合金-6061')
        }
      }
    }
   
    // 加载状态
    const isLoading = ref(false)
    // 获取价格信息
    const fetchPrices = async () => {
      isLoading.value = true
      try {
 
        const response = await axios.post('http://localhost:8000/api/price/price', {
          materialAccessId: selectedMaterial.value.materialAccessId,
          crafts: [
            {
              craftAccessId: craftAccessId1.value,
              craftAttributeAccessIds: [
                craftAttributeColorAccessIds1.value,
                craftAttributeGlossinessAccessIds1.value,
                craftAttributeFileAccessIds1.value
              ].filter(Boolean) // 过滤空值
            },
            {
              craftAccessId: craftAccessId2.value,
              craftAttributeAccessIds: [
                craftAttributeColorAccessIds2.value,
                craftAttributeGlossinessAccessIds2.value,
                craftAttributeFileAccessIds2.value
              ].filter(Boolean)
            }
          ], 
          goodsQuantity: quantity.value,
          toleranceAccessId: "4c5b4f8543b34dd2b4c861a270f36ea7",
          roughnessAccessId: "4e6158ff486640ab9c82196c64196fe9",
          deliveryTypeCode: "BD"
        })
        console.log('response', response)
        // 正确解析响应数据
        const priceData = response.data
        console.log('priceData', priceData)
        materialCost.value = priceData.materialPrice
        engineeringCost.value = priceData.programPrice
        clampingCost.value = priceData.clampPrice
        processingCost.value = priceData.processPrice
        surfaceCost.value = priceData.craftPrice
        pricePerUnit.value = priceData.price
      } catch (error) {
        console.error('请求失败:', error.response?.data || error.message)
        ElMessage.error('获取价格信息失败，请检查网络连接')
      } finally {
        isLoading.value = false
      }
    }
    // 添加计算属性
    const totalPrice = computed(() => {
      return pricePerUnit.value * quantity.value
    })

    // 监听参数变化触发价格计算
    watch([selectedMaterial, surfaceTreatment, selectedTreatment, selectedTreatment2, quantity, tolerance, roughness, selectedColor, selectedColor2, glossiness, glossiness2, uploadedFileName, uploadedFileName2], () => {
      if (selectedMaterial.value) {
        fetchPrices()
      }
    })

    // 组件挂载时初始化
    onMounted(() => {
      resetSelection()
      // 初始化下拉框默认值
      if (toleranceOptions.value.length > 0) tolerance.value = toleranceOptions.value[0].value
      if (roughnessOptions.value.length > 0) roughness.value = roughnessOptions.value[0].value
    })

    // 图纸上传1
    const uploadedFile = ref(null)
    const uploadedFileName = ref('')
    const fileInput = ref(null)
    const isHover = ref(false)

    const handleFileUpload = (e) => {
      const file = e.target.files[0]
      if (file) {
        uploadedFile.value = file
        uploadedFileName.value = file.name
      }
    }

    const updateFile = () => {
      uploadedFile.value = null
      uploadedFileName.value = ''
      fileInput.value.value = null
    }

    // 图纸上传2
    const uploadedFile2 = ref(null)
    const uploadedFileName2 = ref('')
    const fileInput2 = ref(null)
    const isHover2 = ref(false)

    const handleFileUpload2 = (e) => {
      const file = e.target.files[0]
      if (file) {
        uploadedFile2.value = file
        uploadedFileName2.value = file.name
      }
    }

    const updateFile2 = () => {
      uploadedFile2.value = null
      uploadedFileName2.value = ''
      fileInput2.value.value = null
    }

    return {
      dialogVisible,
      selectedParameterId,
      parametersList,
      currentParameters,
      handleParametersChange,
      closeDialog,
      confirmParameters,
      currentCategory,
      currentMaterials,
      selectedMaterial,
      surfaceTreatment,
      selectedTreatment,
      selectedColor,
      glossiness,
      quantity,
      toleranceOptions,
      tolerance,
      roughnessOptions,
      roughness,
      hasThread,
      hasAssembly,
      notes,
      fileImage,
      fileName,
      fileDimensions,
      materialCost,
      engineeringCost,
      clampingCost,
      processingCost,
      surfaceCost,
      totalPrice,
      pricePerUnit,
      handleConfirm,
      getSelectedMaterialLabel,
      getSurfaceTreatmentLabel,
      surfaceTreatmentDisplay,
      selectCategory,
      selectMaterial,
      colorOption,
      colorOption2,
      surfaceTreatmentData,
      glossinessOptions,
      glossinessOptions2,
      paperOptions,
      paperOptions2,
      surfaceTreatmentNoteDisplay,
      selectedTreatment2,
      selectedColor2,
      glossiness2,
      surfaceTreatmentNoteDisplay2,
      isSecondTreatmentDisabled,
      uploadedFile,
      uploadedFileName,
      fileInput,
      isHover,
      handleFileUpload,
      updateFile,
      uploadedFile2,
      uploadedFileName2,
      fileInput2,
      isHover2,
      handleFileUpload2,
      updateFile2,
      isButton1Disabled,
      isButton2Disabled,
      filteredSurfaceTreatmentData
    }
  }
}
</script>

<style scoped>
.dialog-header {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 20px;
}

.dialog-content {
  display: flex;
  gap: 50px;
}

.left-section {
  flex: 0 0 60%;
}

.right-section {
  flex: 0 0 30%;
  max-height: 700px; /* 设置最大高度 */
  overflow-y: auto; /* 超出最大高度时显示垂直滚动条 */
}

.param-item {
  margin-bottom: 20px;
}

.required-label::before {
  content: '*';
  color: #f56c6c;
  margin-right: 4px;
}

.label, .required-label {
  margin-bottom: 8px;
  font-weight: bold;
}

.button-group {
  display: flex;
  gap: 10px;
}

.button-group .el-button {
  position: relative;
}

.button-group .el-button.selected {
  color: #409EFF;
  border-color: #409EFF;
}

.check-icon {
  position: absolute;
  right: 5px;
  bottom: 5px;
  font-size: 14px;
}

.selected-value {
  color: #409EFF;
  margin-left: 10px;
}

.discount-text {
  color: #409EFF;
  margin-left: 10px;
  cursor: pointer;
}

.file-info {
  text-align: center;
  margin-bottom: 20px;
}

.file-image {
  width: 100px;
  height: 100px;
  object-fit: contain;
  margin-bottom: 10px;
}

.price-details {
  margin-bottom: 20px;
  margin-right: 60px;
}

.price-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.red-text {
  color: #f56c6c;
  font-size: 12px;
}

.price {
  color: #303133;
}

.total-price {
  margin-bottom: 20px;
  margin-right: 60px;
}

.total {
  color: #409EFF;
  font-size: 18px;
  font-weight: bold;
}

.price-per-unit {
  text-align: right;
  color: #303133;
  font-size: 14px;
}

.confirm-btn {
  width: 100%;
  margin-top: 20px;
}

/* 材料选择器样式 */
.material-selector {
  margin-top: 10px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
}

.selector-header {
  display: flex;
  background-color: #f5f7fa;
  border-bottom: 1px solid #dcdfe6;
}

.category-title,
.material-title {
  padding: 12px 20px;
  font-weight: bold;
  color: #606266;
}

.category-title {
  width: 150px;
  border-right: 1px solid #dcdfe6;
}

.material-title {
  flex: 1;
}

.selector-content {
  display: flex;
  height: 300px;
}

.category-list {
  width: 150px;
  border-right: 1px solid #dcdfe6;
  overflow-y: auto;
}

.category-item {
  padding: 12px 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.category-item:hover {
  background-color: #f5f7fa;
}

.category-item.active {
  background-color: #ecf5ff;
  color: #409EFF;
}

.material-list {
  flex: 1;
  overflow-y: auto;
  background-color: #f5f7fa;
}

.material-item {
  padding: 12px 20px;
  cursor: pointer;
  border-bottom: 1px solid #ebeef5;
  transition: all 0.3s;
}

.material-item:hover {
  background-color: #ecf5ff;
}

.material-item.active {
  background-color: #ecf5ff;
  color: #409EFF;
}

.material-name {
  font-size: 14px;
  margin-bottom: 4px;
}

.selected-value {
  color: #409EFF;
  margin-left: 10px;
  font-size: 14px;
}

/* 滚动条样式 */
.category-list::-webkit-scrollbar,
.material-list::-webkit-scrollbar {
  width: 6px;
}

.category-list::-webkit-scrollbar-thumb,
.material-list::-webkit-scrollbar-thumb {
  background-color: #c0c4cc;
  border-radius: 3px;
}

.category-list::-webkit-scrollbar-track,
.material-list::-webkit-scrollbar-track {
  background-color: #f5f7fa;
}

.material-selection {
  display: flex;
}

.surface-treatment-selection {
  display: flex;
}

.surface-treatment-display {
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  margin-top: 10px;
  color: #606266;
}

.upper-section {
  display: flex;
  justify-content: space-between;
  gap: 10px; /* 每个部分之间的间距 */
  margin-bottom: 10px;
}

.part {
  flex: 1; /* 每个部分占 25% 宽度 */
  display: flex;
  flex-direction: column;
  gap: 8px; /* 内部元素间距 */
}

.part span {
  font-weight: bold;
  margin-bottom: 8px;
}

.lower-section {
  text-align: center;
  font-weight: bold;
  margin-top: 10px;
}

.required-label {
  margin-right: 10px;
  font-weight: bold;
}
.icon-button {
  padding: 8px 12px;
}
.icon-button .el-icon {
  margin-right: 0;
}
.upload-container {
  position: relative;
  display: inline-block;
}

.upload-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 8px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  color: #606266;
  background-color: #fff;
  height: 32px;
}

.file-name {
  position: absolute;
  right: 0;
  bottom: -24px;
  font-weight: bold;
  color: #606266;
  font-size: 12px;
}

.button-text {
  margin-bottom: 2px;
}

.upload-button:hover {
  border-color: #409EFF;
  color: #409EFF;
}

.upload-button:hover .el-icon {
  color: #409EFF;
}
.upload-button.disabled {
  background-color: #f5f7fa;
  border-color: #e4e7ed;
  color: #c0c4cc;
  cursor: not-allowed;
}

.upload-button.disabled .el-icon {
  color: #c0c4cc;
}
</style>