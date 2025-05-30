<script setup>
const getPath = (i) => {
  const paths = [
    "M0,30 C150,80 350,0 600,30 C850,60 1050,20 1200,30 V100 H0 Z",
    "M0,40 C200,100 400,20 600,40 C800,60 1000,20 1200,40 V100 H0 Z",
    "M0,20 C250,60 450,0 600,20 C750,40 950,0 1200,20 V100 H0 Z",
    "M0,35 C180,90 360,10 600,35 C840,60 1020,25 1200,35 V100 H0 Z",
    "M0,25 C100,50 400,0 600,25 C800,50 1100,0 1200,25 V100 H0 Z"
  ]
  return paths[i - 1] || paths[0]
}
</script>

<template>
  <div class="wave-container">
    <div v-for="i in 5" :key="i" class="wave-wrapper">
      <svg class="wave" viewBox="0 0 1200 100" preserveAspectRatio="none">
        <path :d="getPath(i)" />
      </svg>
      <svg class="wave" viewBox="0 0 1200 100" preserveAspectRatio="none">
        <path :d="getPath(i)" />
      </svg>
    </div>
  </div>
</template>

<style scoped>
.wave-container {
  position:fixed;
  bottom: 0;
  width: 100vw;
  height: 100px;
  overflow: hidden;
  pointer-events: none;
  z-index:99;
}

.wave-wrapper {
  position: absolute;
  bottom: 0;
  width: 200%;
  height: 100px;
  display: flex;
  animation: wave-scroll linear infinite;
}

.wave-wrapper:nth-child(1) {
  z-index: 5;
  opacity: 0.6;
  animation-duration: 8s;
}
.wave-wrapper:nth-child(2) {
  z-index: 4;
  opacity: 0.5;
  animation-duration: 12s;
  animation-direction: reverse;
}
.wave-wrapper:nth-child(3) {
  z-index: 3;
  opacity: 0.4;
  animation-duration: 15s;
}
.wave-wrapper:nth-child(4) {
  z-index: 2;
  opacity: 0.3;
  animation-duration: 18s;
  animation-direction: reverse;
}
.wave-wrapper:nth-child(5) {
  z-index: 1;
  opacity: 0.2;
  animation-duration: 22s;
}

.wave {
  width: 100%;
  height: 100px;
  will-change: transform;
}

.wave path {
  fill: var(--h1-color);
}

@keyframes wave-scroll {
  0% {
    transform: translate3d(0, 0, 0);
  }
  100% {
    transform: translate3d(-50%, 0, 0);
  }
}
</style>
