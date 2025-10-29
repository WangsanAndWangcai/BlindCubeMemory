<template>
  <div class="timer-container">
    <div class="time-display">{{ formattedTime }}</div>
    <div class="buttons">
      <el-button type="primary" @click="toggleTimer">
        {{ running ? '暂停' : '开始' }}
      </el-button>
      <el-button type="danger" @click="resetTimer" :disabled="time === 0">
        重置
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'

const time = ref(0)         // 记录的秒数
const timer = ref<number>() // 定时器 ID
const running = ref(false)  // 是否正在运行

// 切换开始 / 暂停
function toggleTimer() {
  if (!running.value) {
    running.value = true
    timer.value = window.setInterval(() => {
      time.value += 1
    }, 1000)
  } else {
    running.value = false
    clearInterval(timer.value)
  }
}

// 重置
function resetTimer() {
  clearInterval(timer.value)
  time.value = 0
  running.value = false
}

// 格式化显示时间 mm:ss
const formattedTime = computed(() => {
  const m = Math.floor(time.value / 60)
  const s = time.value % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
})

// 组件销毁时清理
onUnmounted(() => clearInterval(timer.value))
</script>

<style scoped>
.timer-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 20px;
}

.time-display {
  font-size: 48px;
  font-weight: bold;
  font-family: monospace;
  color: #333;
}

.buttons {
  display: flex;
  gap: 10px;
}
</style>
