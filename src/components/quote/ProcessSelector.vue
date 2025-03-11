<template>
  <div class="process-selector">
    <div class="process-list">
      <div 
        v-for="process in processList" 
        :key="process.type"
        class="process-item"
        :class="{ 
          'is-selected': selectedProcess === process.type,
          'is-link': process.route 
        }"
        @click="handleProcessClick(process)"
      >
        <h3 class="process-name">{{ process.name }}</h3>
        <p class="process-desc">{{ process.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const props = defineProps({
  selectedProcess: String
})
const emit = defineEmits(['process-change'])

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
    acceptTypes: '.stl,.stp,.step,.igs,.iges,.obj',
    uploadTips: [
      '支持格式：STL、STP、STEP、IGS、IGES、OBJ',
      '单个文件大小不超过50MB',
      '建议上传3D模型文件',
      '支持树脂、尼龙、金属等材料打印'
    ]
  },
  {
    type: 'cnc',
    name: 'CNC加工',
    description: '铝件/钢件/塑胶件，快速打样',
    acceptTypes: '.stp,.step,.igs,.iges,.x_t,.prt',
    uploadTips: [
      '支持格式：STP、STEP、IGS、IGES、X_T、PRT',
      '单个文件大小不超过50MB',
      '建议上传3D模型文件',
      '支持铝件、钢件、塑胶件加工'
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
]

const handleProcessClick = (process) => {
  if (process.route) {
    router.push(process.route)
  } else {
    emit('process-change', process)
  }
}
</script>

<style lang="scss" scoped>
.process-selector {
  .process-list {
    display: flex;
    gap: 20px;
    flex-wrap: nowrap;
    
    .process-item {
      flex: 1;
      min-width: 160px;
      padding: 16px;
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s;
      
      &:hover {
        border-color: #409eff;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      }
      
      &.is-selected {
        border-color: #409eff;
        background-color: #ecf5ff;
      }
      
      .process-name {
        font-size: 16px;
        font-weight: bold;
        color: #303133;
        margin-bottom: 8px;
      }
      
      .process-desc {
        font-size: 12px;
        color: #909399;
        line-height: 1.4;
      }
    }
  }
}
</style>