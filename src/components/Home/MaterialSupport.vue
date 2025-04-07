<template>
  <section class="material-support">
    <div class="container">
      <h2 class="section-title">支持的材料</h2>
      
      <el-tabs v-model="activeTab" class="material-tabs">
        <el-tab-pane label="CNC加工" name="cnc">
          <div class="material-content">
            <!-- 左侧材料列表 -->
            <div class="material-list">
              <div v-for="material in cncMaterials" 
                   :key="material.id" 
                   class="material-item"
                   :class="{ 'active': selectedMaterial?.id === material.id }"
                   @click="selectMaterial(material)"
                   @mouseenter="selectMaterial(material)">
                <div class="material-image">
                  <img :src="material.image" :alt="material.name">
                  <!-- 遮罩层 -->
                  <div class="image-overlay">
                    <span class="overlay-text">{{ material.name }}</span>
                  </div>
                </div>
                <div class="material-name">{{ material.name }}</div>
              </div>
            </div>

            <!-- 右侧材料详情 -->
            <div class="material-detail" v-if="selectedMaterial">
              <div class="detail-header">
                <h3>{{ selectedMaterial.name }}</h3>
              </div>
              <div class="detail-content">
                <div class="detail-image">
                  <img :src="selectedMaterial.detailImage" :alt="selectedMaterial.name">
                </div>
                <div class="detail-info">
                  <div class="info-section">
                    <h4>优点：</h4>
                    <p>{{ selectedMaterial.advantages }}</p>
                  </div>
                  <div class="info-section">
                    <h4>缺点：</h4>
                    <p>{{ selectedMaterial.disadvantages }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="钣金加工" name="sheet">
          <div class="material-content">
            <!-- 左侧材料列表 -->
            <div class="material-list">
              <div v-for="material in sheetMaterials" 
                   :key="material.id" 
                   class="material-item"
                   :class="{ 'active': selectedMaterial?.id === material.id }"
                   @click="selectMaterial(material)"
                   @mouseenter="selectMaterial(material)">
                <div class="material-image">
                  <img :src="material.image" :alt="material.name">
                  <!-- 遮罩层 -->
                  <div class="image-overlay">
                    <span class="overlay-text">{{ material.name }}</span>
                  </div>
                </div>
                <div class="material-name">{{ material.name }}</div>
              </div>
            </div>

            <!-- 右侧材料详情 -->
            <div class="material-detail" v-if="selectedMaterial">
              <div class="detail-header">
                <h3>{{ selectedMaterial.name }}</h3>
              </div>
              <div class="detail-content">
                <div class="detail-image">
                  <img :src="selectedMaterial.detailImage" :alt="selectedMaterial.name">
                </div>
                <div class="detail-info">
                  <div class="info-section">
                    <h4>优点：</h4>
                    <p>{{ selectedMaterial.advantages }}</p>
                  </div>
                  <div class="info-section">
                    <h4>缺点：</h4>
                    <p>{{ selectedMaterial.applications }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const activeTab = ref('cnc')
const selectedMaterial = ref(null)

const cncMaterials = [
  {
    id: 1,
    name: '铝合金6061',
    image: require('@/assets/images/material1.jpg'),
    detailImage: require('@/assets/images/material1.jpg'),
    advantages: '具有良好的可成型性、可焊接性、可机加工性能，同时具有中等强度，在退火后仍能维持较好的操作性。加工性能极佳、优良的焊接特点及电镀性、良好的抗腐蚀性、韧性高及加工后不变形、材料致密无缺陷及易于抛光、上色膜容易、氧化效果极佳等优良特点。',
    disadvantages: '主要缺点是硬度低、耐磨性比较差，在某些介质条件中耐腐蚀性还不尽如人意等。铝的电极电位很负，因此与其他金属接触时，铝通常作为阳极容易发生严重的电偶腐蚀现象等'
  },
  {
    id: 2,
    name: '工程塑料-ABS',
    image: require('@/assets/images/material2.png'),
    detailImage: require('@/assets/images/material2.png'),
    advantages: '具有优良的机械性能和加工性能，抗冲击强度高，硬度大，耐磨性好，易于加工成型，表面光泽度好，可电镀、喷涂、染色等。',
    disadvantages: '耐候性、耐热性和阻燃性较差，在阳光下容易老化变色，使用温度范围较窄。'
  },
  {
    id: 3,
    name: '亚克力',
    image: require('@/assets/images/material3.png'),
    detailImage: require('@/assets/images/material3.png'),
    advantages: '透明度高，光泽度好，耐候性优异，易于加工成型，可染色，具有良好的绝缘性能。',
    disadvantages: '易划伤，抗冲击性能较差，耐溶剂性差。'
  },
  {
    id: 4,
    name: '电木',
    image: require('@/assets/images/material4.png'),
    detailImage: require('@/assets/images/material4.png'),
    advantages: '耐热性好，机械强度高，耐化学性好，绝缘性能优异，尺寸稳定性好。',
    disadvantages: '加工性能较差，易碎，不耐冲击。'
  },
  {
    id: 5,
    name: '紫铜T2',
    image: require('@/assets/images/material5.png'),
    detailImage: require('@/assets/images/material5.png'),
    advantages: '导电性和导热性极好，延展性好，耐腐蚀性强，易于加工。',
    disadvantages: '价格较高，易氧化变色，强度相对较低。'
  }
]
const sheetMaterials = [
  {
    id: 1,
    name: '冷轧板',
    image: require('@/assets/images/material7.jpg'),
    advantages: '价格低廉、易于加工成型、表面光滑、强度适中',
    detailImage: require('@/assets/images/material7.jpg'),
    applications: '广泛应用于家电外壳、机箱机柜、电气柜等领域'
  },
  {
    id: 2,
    name: '不锈钢304',
    image: require('@/assets/images/material6.jpg'),
    advantages: '优异的耐腐蚀性、强度高、美观耐用',
    detailImage: require('@/assets/images/material6.jpg'),
    disadvantages: '价格相对较高、加工难度大',
    applications: '食品设备、医疗器械、厨房设备等要求防腐的场合'
  },
  {
    id: 3,
    name: '镀锌板',
    image: require('@/assets/images/material8.png'),
    advantages: '良好的防腐性能、价格适中、易于加工',
    detailImage: require('@/assets/images/material8.png'),
    disadvantages: '焊接时需要特殊处理、表面处理选择有限',
    applications: '户外设备外壳、通风管道、建筑构件等'
  },
  {
    id: 4,
    name: '铝合金5052',
    image: require('@/assets/images/material9.jpg'),
    advantages: '重量轻、耐腐蚀、易于加工、外观好',
    detailImage: require('@/assets/images/material9.jpg'),
    disadvantages: '强度相对较低、价格较高',
    applications: '电子设备外壳、通信设备、仪器仪表等'
  },
  {
    id: 5,
    name: '不锈钢201',
    image: require('@/assets/images/material10.jpg'),
    advantages: '优异的耐腐蚀性、强度高、美观耐用',
    detailImage: require('@/assets/images/material10.jpg'),
    disadvantages: '价格相对较高、加工难度大',
    applications: '食品设备、医疗器械、厨房设备等要求防腐的场合'
  }
]
const selectMaterial = (material) => {
  selectedMaterial.value = material
}

// 默认选中第一个材料
if (cncMaterials.length > 0) {
  selectedMaterial.value = cncMaterials[0]
}
</script>

<style lang="scss" scoped>
.material-support {
  padding: 60px 0;
  background: #fff;

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 15px;
  }

  .section-title {
    font-size: 32px;
    color: #333;
    text-align: center;
    margin-bottom: 40px;
    font-weight: 500;
  }

  .material-tabs {
    :deep(.el-tabs__header) {
      margin-bottom: 30px;
      border-bottom: none;
    }

    :deep(.el-tabs__nav-wrap) {
      &::after {
        display: none;
      }
    }

    :deep(.el-tabs__item) {
      font-size: 16px;
      height: 40px;
      line-height: 40px;
      padding: 0 30px;
      color: #666;

      &.is-active {
        color: #409EFF;
        font-weight: 500;
      }
    }
  }

  .material-content {
    display: flex;
    gap: 30px;
  }

  .material-list {
    flex: 0 0 200px;
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 15px;
    max-height: 600px;
    overflow-y: auto;
  }

  .material-item {
    background: #fff;
    border-radius: 4px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 1px solid #EBEEF5;

    &:hover, &.active {
      border-color: #409EFF;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

      .material-name {
        color: #409EFF;
      }
    }

    .material-image {
      height: 120px;
      overflow: hidden;
      position: relative;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
      }

      .image-overlay {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        background: rgba(0, 0, 0, 0.6); // 黑色透明背景
        padding: 8px;
        text-align: center;

        .overlay-text {
          color: #fff;
          font-size: 14px;
          font-weight: 500;
        }
      }
    }

    .material-name {
      padding: 10px;
      font-size: 14px;
      color: #333;
      text-align: center;
      border-top: 1px solid #EBEEF5;
      transition: color 0.3s ease;
    }
  }

  .material-detail {
    flex: 1;
    background: #fff;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #EBEEF5;

    .detail-header {
      padding: 20px;
      border-bottom: 1px solid #EBEEF5;
      display: flex;
      align-items: center;
      gap: 15px;

      .company-logo {
        height: 30px;
      }

      h3 {
        font-size: 20px;
        color: #333;
        margin: 0;
        font-weight: 500;
      }
    }

    .detail-content {
      padding: 20px;
    }

    .detail-image {
      height: 300px;
      overflow: hidden;
      margin-bottom: 20px;
      border-radius: 4px;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .detail-info {
      .info-section {
        margin-bottom: 20px;

        h4 {
          font-size: 16px;
          color: #333;
          margin-bottom: 10px;
          font-weight: 500;
        }

        p {
          font-size: 14px;
          color: #666;
          line-height: 1.8;
          margin: 0;
        }
      }
    }
  }

  @media (max-width: 992px) {
    .material-content {
      flex-direction: column;
    }

    .material-list {
      flex: none;
      grid-template-columns: repeat(3, 1fr);
      max-height: none;
    }
  }

  @media (max-width: 768px) {
    padding: 40px 0;

    .material-list {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 480px) {
    .material-list {
      grid-template-columns: repeat(1, 1fr);
    }
  }
}
</style>