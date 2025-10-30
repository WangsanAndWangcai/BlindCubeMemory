<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'

const timer = ref<number | null>(null)
const startTime = ref<number | null>(null)
const running = ref(false)

const timeCnt = defineModel<number>()

function start() {
  if (running.value) return
  running.value = true
  startTime.value = Date.now() - timeCnt.value // 支持暂停后继续
  timer.value = window.requestAnimationFrame(update)
}

function stop() {
  running.value = false
  if (timer.value !== null) {
    cancelAnimationFrame(timer.value)
    timer.value = null
  }
}

function reset() {
  stop()
  timeCnt.value = 0
}

// 用 requestAnimationFrame 每帧更新
function update() {
  if (!running.value || startTime.value === null) return
  timeCnt.value = Date.now() - startTime.value
  timer.value = window.requestAnimationFrame(update)
}

// ✅ 格式化显示时间 mm:ss.SS
const formattedTime = computed(() => {
  const totalMs = timeCnt.value
  const m = Math.floor(totalMs / 60000)
  const s = Math.floor((totalMs % 60000) / 1000)
  const ms = Math.floor((totalMs % 1000) / 10)
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(ms).padStart(2, '0')}`
})

onUnmounted(() => stop())

defineExpose({
  start,
  stop,
  reset,
  running,
})

</script>

<template>
  <div style="text-align:center; font-size: 2em; margin-top: 40px;" class="time-display">
    {{ formattedTime }}
  </div>
</template>


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
  font-family: consolas;
  color: #333;
}

.buttons {
  display: flex;
  gap: 10px;
}
</style>
