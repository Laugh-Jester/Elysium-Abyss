<script setup>
import { ref, onMounted } from 'vue'
import Loading from './components/reLoading.vue'

const isLoading = ref(true)

onMounted(() => {
  // 模拟加载，比如获取数据
  setTimeout(() => {
    isLoading.value = false
  }, 1500)
})
</script>

<template>
    <Loading v-if="isLoading" />
    <router-view v-else />
</template>

<style scoped>

</style>
