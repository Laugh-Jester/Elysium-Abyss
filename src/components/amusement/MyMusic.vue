<script setup>
</script>

<template>
  <div class="construction-page">
    <div class="content">
      <div class="icon">
        🛠️
      </div>
      <h1>页面施工中</h1>
      <p>我们正在努力建设这个页面，请稍后再来！</p>
    </div>
  </div>
</template>

<style scoped>
.construction-page {
  height: 100vh;
  background:var(--construction-bkcolor);
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Segoe UI", sans-serif;
  text-align: center;
  color: #333;
  padding: 2rem;
}

.content {
  animation: fadeIn 1s ease-out;
}

.icon {
  font-size: 5rem;
  margin-bottom: 1rem;
  animation: hammerShake 1.8s infinite ease-in-out;
}

h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: var(--construction-titlecolor);
}

p {
  font-size: 1.1rem;
  color: var(--construction-color);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes hammerShake {
  0%, 100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(6deg);
  }
  50% {
    transform: rotate(-6deg);
  }
  75% {
    transform: rotate(3deg);
  }
}
</style>
