// stores/danmaku.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useDanmakuStore = defineStore('danmaku', () => {
  // State
  const danmakuHistory = ref([])
  const activeDanmaku = ref([])

  const userInfo = ref({
    username: '',
    preferredColor: '#ffffff',
    preferredSize: 18
  })

  const settings = ref({
    speed: 8,
    density: 0.3,
    showUserDanmaku: true,
    showSystemDanmaku: true,
    fontSize: 18,
    opacity: 1,
    maxDanmakuCount: 50,
    loopInterval: 15000 // 循环播放间隔(毫秒)
  })

  const tracks = ref([])
  const screenInfo = ref({
    width: 0,
    height: 0,
    trackHeight: 40,
    maxTracks: 0
  })

  const statistics = ref({
    totalSent: 0,
    todaySent: 0,
    lastSentTime: null
  })

  // 循环播放相关状态
  const loopTimer = ref(null)
  const currentLoopIndex = ref(0)

  // Getters
  const availableTracks = computed(() => {
    return tracks.value.filter(track => !track.occupied)
  })

  const todayDanmaku = computed(() => {
    const today = new Date().toDateString()
    return danmakuHistory.value.filter(danmaku =>
      new Date(danmaku.date).toDateString() === today
    )
  })

  const danmakuByUser = computed(() => {
    const grouped = {}
    danmakuHistory.value.forEach(danmaku => {
      if (!grouped[danmaku.username]) {
        grouped[danmaku.username] = []
      }
      grouped[danmaku.username].push(danmaku)
    })
    return grouped
  })

  const speedConfig = computed(() => ({
    duration: settings.value.speed,
    delay: 1000 / settings.value.density
  }))

  // Actions
  function initScreen(width, height) {
    screenInfo.value.width = width
    screenInfo.value.height = height
    screenInfo.value.maxTracks = Math.floor(height * 0.8 / screenInfo.value.trackHeight)

    tracks.value = Array(screenInfo.value.maxTracks).fill().map((_, index) => ({
      id: index,
      occupied: false,
      lastDanmakuTime: 0,
      y: index * screenInfo.value.trackHeight
    }))
  }

  function getAvailableTrack() {
    const currentTime = Date.now()

    for (let track of tracks.value) {
      if (!track.occupied || currentTime - track.lastDanmakuTime > 3000) {
        track.occupied = true
        track.lastDanmakuTime = currentTime
        return track
      }
    }

    const randomTrack = tracks.value[Math.floor(Math.random() * tracks.value.length)]
    randomTrack.occupied = true
    randomTrack.lastDanmakuTime = currentTime
    return randomTrack
  }

  function releaseTrack(trackId) {
    const track = tracks.value.find(t => t.id === trackId)
    if (track) {
      track.occupied = false
    }
  }

  // 从后端获取所有弹幕
  async function fetchDanmakuFromServer() {
    try {
      const response = await fetch('http://localhost:3000/danmaku')
      if (response.ok) {
        const data = await response.json()
        danmakuHistory.value = data
        return data
      }
      throw new Error('获取弹幕失败')
    } catch (error) {
      console.error('获取弹幕失败:', error)
      return []
    }
  }

  // 发送弹幕到后端
  async function sendDanmakuToServer(content, username) {
    const danmakuData = {
      username: username || userInfo.value.username || '匿名用户',
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD 格式
      content: content.trim()
    }

    try {
      const response = await fetch('http://localhost:3000/danmaku', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(danmakuData)
      })

      if (response.ok) {
        const savedDanmaku = await response.json()
        // 更新本地历史记录
        danmakuHistory.value.push(savedDanmaku)
        return savedDanmaku
      }
      throw new Error('发送弹幕失败')
    } catch (error) {
      console.error('发送弹幕失败:', error)
      return null
    }
  }

  // 创建弹幕显示对象
  function createDisplayDanmaku(danmakuData, options = {}) {
    const track = getAvailableTrack()

    return {
      id: Date.now() + Math.random(),
      serverId: danmakuData.id,
      username: danmakuData.username,
      content: danmakuData.content,
      date: danmakuData.date,
      timestamp: new Date().toISOString(),
      trackId: track.id,
      left: screenInfo.value.width,
      top: track.y + Math.random() * 20,
      duration: settings.value.speed + Math.random() * 4,
      paused: false,
      color: options.color || userInfo.value.preferredColor,
      fontSize: options.fontSize || settings.value.fontSize,
      type: options.type || 'user'
    }
  }

  // 发送弹幕（用户主动发送）
  async function sendDanmaku(content, username = null, options = {}) {
    if (!content.trim()) return null

    // 先发送到后端
    const savedDanmaku = await sendDanmakuToServer(content, username)
    if (!savedDanmaku) return null

    // 创建显示弹幕
    const displayDanmaku = createDisplayDanmaku(savedDanmaku, options)

    // 添加到活跃弹幕
    activeDanmaku.value.push(displayDanmaku)

    // 更新统计
    statistics.value.totalSent++
    statistics.value.todaySent++
    statistics.value.lastSentTime = displayDanmaku.timestamp

    return displayDanmaku
  }

  // 播放单个弹幕（用于循环播放）
  function playDanmaku(danmakuData, options = {}) {
    const displayDanmaku = createDisplayDanmaku(danmakuData, {
      ...options,
      type: 'loop'
    })

    activeDanmaku.value.push(displayDanmaku)
    return displayDanmaku
  }

  // 开始循环播放
  function startLoop() {
    if (loopTimer.value) {
      clearInterval(loopTimer.value)
    }

    loopTimer.value = setInterval(() => {
      if (danmakuHistory.value.length === 0) return

      // 循环播放历史弹幕
      const danmaku = danmakuHistory.value[currentLoopIndex.value]
      if (danmaku) {
        const displayDanmaku = playDanmaku(danmaku, {
          color: '#87CEEB', // 循环弹幕使用不同颜色
          type: 'loop'
        })

        // 设置自动移除
        setTimeout(() => {
          removeDanmaku(displayDanmaku.id)
        }, displayDanmaku.duration * 1000)
      }

      // 更新索引
      currentLoopIndex.value = (currentLoopIndex.value + 1) % danmakuHistory.value.length
    }, settings.value.loopInterval)
  }

  // 停止循环播放
  function stopLoop() {
    if (loopTimer.value) {
      clearInterval(loopTimer.value)
      loopTimer.value = null
    }
  }

  function removeDanmaku(danmakuId) {
    const index = activeDanmaku.value.findIndex(d => d.id === danmakuId)
    if (index > -1) {
      const danmaku = activeDanmaku.value[index]
      releaseTrack(danmaku.trackId)
      activeDanmaku.value.splice(index, 1)
    }
  }

  function toggleDanmakuPause(danmakuId, paused) {
    const danmaku = activeDanmaku.value.find(d => d.id === danmakuId)
    if (danmaku) {
      danmaku.paused = paused
    }
  }

  function clearAllDanmaku() {
    activeDanmaku.value = []
    tracks.value.forEach(track => {
      track.occupied = false
    })
  }

  function updateUserInfo(newUserInfo) {
    userInfo.value = { ...userInfo.value, ...newUserInfo }
    saveToLocalStorage()
  }

  function updateSettings(newSettings) {
    settings.value = { ...settings.value, ...newSettings }

    // 如果循环间隔改变，重启循环
    if (newSettings.loopInterval && loopTimer.value) {
      stopLoop()
      startLoop()
    }

    saveToLocalStorage()
  }

  function getDanmakuHistory(limit = 50) {
    return danmakuHistory.value
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit)
  }

  function searchDanmaku(keyword) {
    return danmakuHistory.value.filter(danmaku =>
      danmaku.content.includes(keyword) ||
      danmaku.username.includes(keyword)
    )
  }

  function saveToLocalStorage() {
    try {
      const dataToSave = {
        userInfo: userInfo.value,
        settings: settings.value,
        statistics: statistics.value
      }
      localStorage.setItem('danmaku-data', JSON.stringify(dataToSave))
    } catch (error) {
      console.error('保存数据失败:', error)
    }
  }

  function loadFromLocalStorage() {
    try {
      const saved = localStorage.getItem('danmaku-data')
      if (saved) {
        const data = JSON.parse(saved)
        userInfo.value = { ...userInfo.value, ...data.userInfo }
        settings.value = { ...settings.value, ...data.settings }
        statistics.value = { ...statistics.value, ...data.statistics }
      }
    } catch (error) {
      console.error('加载数据失败:', error)
    }
  }

  function resetStatistics() {
    statistics.value = {
      totalSent: 0,
      todaySent: 0,
      lastSentTime: null
    }
    saveToLocalStorage()
  }

  return {
    // State
    danmakuHistory,
    activeDanmaku,
    userInfo,
    settings,
    tracks,
    screenInfo,
    statistics,

    // Getters
    availableTracks,
    todayDanmaku,
    danmakuByUser,
    speedConfig,

    // Actions
    initScreen,
    getAvailableTrack,
    releaseTrack,
    fetchDanmakuFromServer,
    sendDanmakuToServer,
    sendDanmaku,
    playDanmaku,
    startLoop,
    stopLoop,
    removeDanmaku,
    toggleDanmakuPause,
    clearAllDanmaku,
    updateUserInfo,
    updateSettings,
    getDanmakuHistory,
    searchDanmaku,
    saveToLocalStorage,
    loadFromLocalStorage,
    resetStatistics
  }
})
