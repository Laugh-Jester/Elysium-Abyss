<script setup>
import { ref } from 'vue'
// 错误消息列表
const messages = ref([])

// 添加新消息
function addMessage(text1,text2) {
  const id = Date.now() + Math.random() // 保证唯一 key
  messages.value.push({ id, text1,text2 })
  console.log('检查点3',messages.value)
  // 3秒后自动移除
  setTimeout(() => {
    messages.value = messages.value.filter(m => m.id !== id)
  }, 3000)
}
// 手动删除
function removeMessage(index) {
  messages.value.splice(index, 1)
}

// 暴露给父组件用
defineExpose({
  addMessage
})
</script>
<template>
  <div class="message-container">
    <transition-group name="fade" tag="div">
      <div
        class="message-box"
        v-for="(msg, index) in messages"
        :key="msg.id"
      >
        <div class="title">{{ msg.text2 }}</div>
        <div class="content">{{ msg.text1 }}</div>
        <span class="close-btn" @click="removeMessage(index)">×</span>
      </div>
    </transition-group>
  </div>
</template>


<style scoped>
.message-container {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.message-box {
  width: 250px;
  background: white;
  border: 1px solid #ccc;
  padding: 12px;
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  overflow: hidden;
  margin:10px;
}

.title {
  font-weight: bold;
  color: red;
  margin-bottom: 5px;
}

.content {
  font-size: 14px;
}

.close-btn {
  position: absolute;
  top: 8px;
  right: 10px;
  cursor: pointer;
}

/* --- 下面是淡入淡出动画 --- */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
