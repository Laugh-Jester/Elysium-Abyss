<template>
  <div class="danmaku-container">
    <!-- 弹幕显示区域 -->
    <div class="danmaku-screen" ref="danmakuScreen">
      <div
        v-for="danmaku in danmakuStore.activeDanmaku"
        :key="danmaku.id"
        class="danmaku-item"
        :class="{ 'loop-danmaku': danmaku.type === 'loop' }"
        :style="getDanmakuStyle(danmaku)"
        @mouseenter="danmakuStore.toggleDanmakuPause(danmaku.id, true)"
        @mouseleave="danmakuStore.toggleDanmakuPause(danmaku.id, false)"
      >
        <span class="danmaku-username">{{ danmaku.username }}:</span>
        <span class="danmaku-content">{{ danmaku.content }}</span>
        <span v-if="danmaku.date" class="danmaku-date">({{ formatDate(danmaku.date) }})</span>
      </div>
    </div>

    <!-- 输入框区域 -->
    <div class="input-area">
      <div class="input-container">
        <input
          v-model="danmakuStore.userInfo.username"
          type="text"
          placeholder="昵称"
          class="username-input"
          maxlength="10"
        />
        <input
          v-model="inputContent"
          type="text"
          placeholder="发送弹幕..."
          class="content-input"
          maxlength="50"
          @keyup.enter="sendDanmaku"
          :disabled="sending"
        />
        <button @click="sendDanmaku" class="send-btn" :disabled="sending">
          {{ sending ? '发送中...' : '发送' }}
        </button>
      </div>
    </div>

    <!-- 显示统计信息和控制 -->
    <div class="stats-overlay" v-if="showStats">
      <div class="stats-content">
        <p>历史弹幕: {{ danmakuStore.danmakuHistory.length }}</p>
        <p>今日发送: {{ danmakuStore.statistics.todaySent }}</p>
        <p>总计发送: {{ danmakuStore.statistics.totalSent }}</p>
        <p>当前弹幕: {{ danmakuStore.activeDanmaku.length }}</p>
        <p>循环状态: {{ isLooping ? '开启' : '关闭' }}</p>
      </div>
    </div>

    <!-- 设置按钮 -->
    <div class="control-panel">
      <button @click="showStats = !showStats" class="control-btn">
        {{ showStats ? '隐藏' : '统计' }}
      </button>
      <button @click="toggleLoop" class="control-btn">
        {{ isLooping ? '停止循环' : '开始循环' }}
      </button>
      <button @click="danmakuStore.clearAllDanmaku()" class="control-btn">
        清屏
      </button>
      <button @click="refreshDanmaku" class="control-btn">
        刷新
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useDanmakuStore } from '@/stores/modules/danmaku.js'

const danmakuStore = useDanmakuStore()
const danmakuScreen = ref(null)
const inputContent = ref('')
const showStats = ref(false)
const sending = ref(false)
const isLooping = ref(false)

// 计算弹幕样式
const getDanmakuStyle = (danmaku) => ({
  top: danmaku.top + 'px',
  left: danmaku.left + 'px',
  color: danmaku.color,
  fontSize: danmaku.fontSize + 'px',
  animationDuration: danmaku.duration + 's',
  animationPlayState: danmaku.paused ? 'paused' : 'running'
})

// 格式化日期显示
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}

// 发送弹幕
const sendDanmaku = async () => {
  if (!inputContent.value.trim() || sending.value) return

  sending.value = true
  try {
    const danmaku = await danmakuStore.sendDanmaku(inputContent.value)
    if (danmaku) {
      inputContent.value = ''

      // 设置自动移除弹幕
      setTimeout(() => {
        danmakuStore.removeDanmaku(danmaku.id)
      }, danmaku.duration * 1000)
    }
  } catch (error) {
    console.error('发送弹幕失败:', error)
  } finally {
    sending.value = false
  }
}

// 切换循环播放
const toggleLoop = () => {
  if (isLooping.value) {
    danmakuStore.stopLoop()
    isLooping.value = false
  } else {
    danmakuStore.startLoop()
    isLooping.value = true
  }
}

// 刷新弹幕数据
const refreshDanmaku = async () => {
  await danmakuStore.fetchDanmakuFromServer()
}

// 初始化屏幕
const initScreen = () => {
  if (danmakuScreen.value) {
    const rect = danmakuScreen.value.getBoundingClientRect()
    danmakuStore.initScreen(rect.width, rect.height)
  }
}

// 窗口大小变化处理
const handleResize = () => {
  initScreen()
}

// 定期保存数据
let saveInterval

onMounted(async () => {
  // 加载本地数据
  danmakuStore.loadFromLocalStorage()

  // 初始化屏幕
  initScreen()

  // 从服务器获取弹幕历史
  await danmakuStore.fetchDanmakuFromServer()

  // 自动开始循环播放
  if (danmakuStore.danmakuHistory.length > 0) {
    danmakuStore.startLoop()
    isLooping.value = true
  }

  // 监听窗口大小变化
  window.addEventListener('resize', handleResize)

  // 定期保存数据
  saveInterval = setInterval(() => {
    danmakuStore.saveToLocalStorage()
  }, 30000) // 每30秒保存一次
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)

  if (saveInterval) {
    clearInterval(saveInterval)
  }

  // 停止循环播放
  danmakuStore.stopLoop()

  // 组件卸载时保存数据
  danmakuStore.saveToLocalStorage()
})
</script>

<style scoped>
.danmaku-container {
  width: 100vw;
  height: 100vh;
  position: relative;
  background-image: var(--msgboard--bg);
  background-repeat: no-repeat;
  background-size: cover;
  overflow: hidden;
}

.danmaku-screen {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.danmaku-item {
  position: absolute;
  white-space: nowrap;
  font-weight: 500;
  color: var(--msgboard--text);
  text-shadow: 2px 2px 4px var(--msgboard--shadow);
  cursor: pointer;
  z-index: 10;
  animation: flyDanmaku linear forwards;
  transition: all 0.2s ease;
}

.danmaku-item:hover {
  transform: scale(1.1);
  text-shadow: 2px 2px 8px var(--msgboard--shadow);
}

.loop-danmaku {
  opacity: 0.8;
}

.loop-danmaku .danmaku-username {
  color: #87CEEB !important;
}

@keyframes flyDanmaku {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-120vw);
  }
}

.danmaku-username {
  color: var(--msgboard--username);
  margin-right: 8px;
  font-weight: bold;
}

.danmaku-content {
  color: var(--msgboard--text);
  margin-right: 8px;
}

.danmaku-date {
  color: #aaa;
  font-size: 0.85em;
  font-style: italic;
}

.input-area {
  position: absolute;
  bottom: 15%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
}

.input-container {
  display: flex;
  gap: 10px;
  padding: 20px;
  background: var(--msgboard--input-bg);
  border-radius: 25px;
  box-shadow: 0 8px 32px var(--msgboard--shadow);
  backdrop-filter: blur(10px);
}

.username-input {
  width: 100px;
  padding: 12px 16px;
  border: 2px solid var(--msgboard--input-border);
  border-radius: 20px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s ease;
}

.content-input {
  width: 300px;
  padding: 12px 16px;
  border: 2px solid var(--msgboard--input-border);
  border-radius: 20px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s ease;
}

.content-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.username-input:focus,
.content-input:focus {
  border-color: var(--msgboard--button-bg);
  box-shadow: 0 0 0 3px var(--msgboard--shadow);
}

.send-btn {
  padding: 12px 24px;
  background: var(--msgboard--button-bg);
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.send-btn:hover:not(:disabled) {
  background: var(--msgboard--button-hover);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px var(--msgboard--shadow);
}

.send-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.stats-overlay {
  position: absolute;
  top: 150px;
  left: 20px;
  background: var(--msgboard--stats-bg);
  color: white;
  padding: 15px;
  border-radius: 10px;
  font-size: 14px;
  z-index: 200;
}

.stats-content p {
  margin: 5px 0;
}

.control-panel {
  position: absolute;
  top: 100px;
  left: 20px;
  display: flex;
  gap: 10px;
  z-index: 200;
}

.control-btn {
  padding: 8px 16px;
  background: var(--msgboard--panel-bg);
  color: white;
  border: 1px solid var(--msgboard--panel-border);
  border-radius: 15px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s ease;
}

.control-btn:hover {
  background: var(--msgboard--input-bg);
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .input-container {
    flex-direction: column;
    width: 90vw;
  }

  .username-input,
  .content-input {
    width: 100%;
  }

  .danmaku-item {
    font-size: 16px;
  }

  .stats-overlay,
  .control-panel {
    position: static;
    margin: 10px;
  }
}
</style>
