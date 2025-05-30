<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const quotes = ref([])
const displayedText = ref('')
const currentQuote = ref(null)
const isTyping = ref(false)
const showSource = ref(false)

let typeTimer = null
let deleteTimer = null

const typeText = (text, onTyped) => {
  displayedText.value = ''
  isTyping.value = true
  showSource.value = false
  let i = 0
  clearInterval(typeTimer)
  typeTimer = setInterval(() => {
    if (i < text.length) {
      displayedText.value += text[i++]
    } else {
      clearInterval(typeTimer)
      isTyping.value = false
      showSource.value = true
      onTyped && onTyped()
    }
  }, 100)
}

const deleteText = (onDeleted) => {
  let i = displayedText.value.length
  isTyping.value = true
  showSource.value = false
  clearInterval(deleteTimer)
  deleteTimer = setInterval(() => {
    if (i > 0) {
      displayedText.value = displayedText.value.slice(0, --i)
    } else {
      clearInterval(deleteTimer)
      isTyping.value = false
      onDeleted && onDeleted()
    }
  }, 100)
}

const showRandomQuote = () => {
  if (!quotes.value.length) return
  let next
  do {
    next = quotes.value[Math.floor(Math.random() * quotes.value.length)]
  } while (next === currentQuote.value && quotes.value.length > 1)

  currentQuote.value = next

  typeText(next.text, () => {
    setTimeout(() => {
      deleteText(() => {
        setTimeout(showRandomQuote, 500)
      })
    }, 3000)
  })
}

onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:3000/quotes')
    quotes.value = res.data
    showRandomQuote()
  } catch (err) {
    console.error('请求失败', err)
  }
})
</script>

<template>
  <div class="text-box" v-if="currentQuote">
    <p class="quote-text">{{ displayedText }}<span v-if="isTyping" class="cursor">|</span></p>
    <transition name="fade">
      <p v-show="showSource" class="quote-source">{{ currentQuote.source }}</p>
    </transition>
  </div>
</template>

<style scoped>
.text-box {
  min-width: 0;
  position: absolute;
  margin: 1rem auto;
  padding: 1rem;
  background: var(--h1-color);
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

.quote-text {
  font-size: 2.3vh;
  font-family: 'Courier New', monospace;
  color: var(--toplist-color);
  text-shadow:0 0 10px var(--toplist-color);
  min-height: 1rem;
  text-decoration:underline;
}

.cursor {
  display: inline-block;
  width: 1px;
  background-color: #666;
  animation: blink 0.7s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1 }
  50% { opacity: 0 }
}

.quote-source {
  text-align: right;
  color: #f70000;
  text-shadow:0 0 10px var(--toplist-color);
  font-size: 1.5vh;
  margin-top: 0.4rem;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
