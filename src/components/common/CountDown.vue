<template>
  <div class="countdown">
    <!-- 倒计时按钮 -->
    <el-button
      :type="type"
      :disabled="disabled || counting"
      :loading="loading"
      @click="handleClick"
    >
      <template v-if="loading">
        {{ loadingText }}
      </template>
      <template v-else-if="counting">
        {{ countdownText }}
      </template>
      <template v-else>
        {{ text }}
      </template>
    </el-button>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'

const props = defineProps({
  // 初始时间（秒）
  time: {
    type: Number,
    default: 60
  },
  // 按钮文字
  text: {
    type: String,
    default: '获取验证码'
  },
  // 加载中文字
  loadingText: {
    type: String,
    default: '发送中...'
  },
  // 倒计时文字格式
  countdownFormat: {
    type: String,
    default: '重新获取({time}s)'
  },
  // 按钮类型
  type: {
    type: String,
    default: 'primary'
  },
  // 是否禁用
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click', 'complete'])

// 状态
const counting = ref(false)
const loading = ref(false)
const currentTime = ref(props.time)

// 倒计时文字
const countdownText = computed(() => {
  return props.countdownFormat.replace('{time}', currentTime.value)
})

let timer = null

// 开始倒计时
const startCountdown = () => {
  counting.value = true
  currentTime.value = props.time
  
  timer = setInterval(() => {
    if (currentTime.value > 0) {
      currentTime.value--
    } else {
      stopCountdown()
    }
  }, 1000)
}

// 停止倒计时
const stopCountdown = () => {
  clearInterval(timer)
  counting.value = false
  currentTime.value = props.time
  emit('complete')
}

// 点击处理
const handleClick = async () => {
  if (counting.value || loading.value) return
  
  try {
    loading.value = true
    await emit('click')
    startCountdown()
  } finally {
    loading.value = false
  }
}

// 组件卸载时清理
onUnmounted(() => {
  clearInterval(timer)
})

// 对外暴露方法
defineExpose({
  start: startCountdown,
  stop: stopCountdown
})
</script>

<style lang="scss" scoped>
.countdown {
  .el-button {
    width: 120px;  // 固定宽度，防止文字变化导致按钮宽度变化
    
    &.is-disabled {
      cursor: not-allowed;
    }
  }
}
</style>
