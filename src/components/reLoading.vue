<script setup>

</script>
<template>
  <div class="loading-container">
    <div class="loader"></div>
  </div>
</template>

<style scoped>
.loading-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(to bottom, #ffe6f0, #ffffff);
  /* background: linear-gradient(135deg, #ffd89b, #ff6f61); */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

/* HTML: <div class="loader"></div> */
.loader {
  height: 200px;
  aspect-ratio: 1;
  display: grid;
  background:
    radial-gradient(farthest-side,#000 15%,#0000 18%),
    radial-gradient(50% 100% at 50% 160%,	#e8e8f0 95%,#0000) top/100% 50%,
    radial-gradient(50% 100% at 50% -60%,	#e8e8f0 95%,#0000) bottom/100% 50%;
  background-repeat: no-repeat;
}
.loader:before {
  content: "";
  background: inherit;
  opacity: 0.6;
  animation: l1 1s infinite;
}
@keyframes l1 {
  to {transform:scale(3);opacity:0}
}
</style>
