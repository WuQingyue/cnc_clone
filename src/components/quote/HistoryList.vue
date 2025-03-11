<template>
  <div class="history-list">
    <el-table
      :data="currentPageData"
      style="width: 100%"
      :header-cell-style="{
        background: '#F5F7FA',
        color: '#606266',
        height: '50px',
        fontWeight: 500
      }"
    >
      <el-table-column
        type="index"
        label="序号"
        width="80"
        align="center"
      />
      <el-table-column
        label="预览图"
        width="120"
        align="center"
      >
        <template #default="{ row }">
          <el-image
            v-if="row.previewUrl"
            :src="row.previewUrl"
            :preview-src-list="[row.previewUrl]"
            fit="contain"
            class="preview-image"
          />
          <div v-else class="no-preview">
            暂无预览
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="文件名"
        min-width="200"
      />
      <el-table-column
        prop="uploadTime"
        label="最新上传时间"
        width="180"
        align="center"
      >
        <template #default="{ row }">
          {{ row.uploadTime ? formatDate(row.uploadTime) : '-' }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="150"
        align="center"
      >
        <template #default="{ row }">
          <template v-if="row.id">
            <el-button link type="primary" @click="handleDownload(row)">
              下载
            </el-button>
            <el-button link type="danger" @click="handleDelete(row)">
              删除
            </el-button>
          </template>
          <span v-else>-</span>
        </template>
      </el-table-column>
    </el-table>



    <el-pagination
      v-if="historyData.length"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :total="historyData.length"
      :page-sizes="[10, 20, 50]"
      layout="total, sizes, prev, pager, next"
      class="pagination"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  processType: {
    type: String,
    required: true
  },
  historyData: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['delete'])

const currentPage = ref(1)
const pageSize = ref(10)

const currentPageData = computed(() => {
  if (!props.historyData.length) {
    return [{}]
  }
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return props.historyData.slice(start, end)
})

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const handleDownload = (file) => {
  if (file.url) {
    window.open(file.url, '_blank')
  }
}

const handleDelete = (file) => {
  emit('delete', file)
}
</script>

<style lang="scss" scoped>
.history-list {
  position: relative;
  
  .preview-image {
    width: 60px;
    height: 60px;
    border-radius: 4px;
  }
  
  .no-preview {
    color: #909399;
    font-size: 12px;
  }
  
  .empty-block {
    position: absolute;
    top: 50px;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff;
    
    .el-empty {
      padding: 40px 0;
    }
  }
  
  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }

  :deep(.el-table) {
    --el-table-border-color: #EBEEF5;
    --el-table-border: 1px solid var(--el-table-border-color);
    
    th {
      font-weight: 500;
    }
    
    td {
      padding: 12px 0;
    }
    
    .el-table__empty-block {
      min-height: 300px;
    }
  }
}
</style>