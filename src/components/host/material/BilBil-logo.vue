<script setup>

</script>


<template>
  <div class="continer">
    <div class="box">
        <div class="logo-face">
            <div class="logo-face-inner"></div>
            <div class="left-line"></div>
            <div class="right-line"></div>
            <div class="left-eye"></div>
            <div class="right-eye"></div>
            <div class="left-nose"></div>
            <div class="right-nose"></div>
        </div>
    </div>
    </div>
</template>


<style scoped>
.continer{
  width:18px;
  height:13px;
  position:relative;
}
.box {
  position:absolute;
    width: 800px;
    height: 600px;
    /* background: lightblue; */
    display: flex;
    transform:scale(0.09);
    transform-origin:top left;
    animation: larger 2s ease infinite;
}
@keyframes larger{
  0%,100%{
    transform:scale(0.09) rotate(0);
  }
  25%{
    transform:scale(0.095) rotate(3deg);
  }
  50%{
    transform:scale(0.09) rotate(0);
  }
  75%{
    transform:scale(0.095) rotate(-3deg);
  }
}

.logo-face {
    width: 200px;
    height: 150px;
    background: rgba(37,103,245,0.5);
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}

.logo-face::before {
    content: "";
    width: 20px;
    height: 30px;
    background:#2567F5;
    border-radius: 20px;
    position: absolute;
    bottom: -10px;
    left: 30px;
}

.logo-face::after {
    content: "";
    width: 20px;
    height: 30px;
    background: #2567F5;
    border-radius: 20px;

    position: absolute;
    bottom: -10px;
    right: 30px;
}

.logo-face-inner {
    width: 160px;
    height: 110px;
    background: rgba(255, 255, 255,0);
    border-radius: 15px;
}

.left-line {
    width: 50px;
    height: 12px;
    border-radius: 12px;
    background: #2567F5;
    transform: rotate(45deg);
    position: absolute;
    top: -0.1px;
    left: 60px;
      transform-origin: top left;
    animation:ear-left-rotate 1s infinite;
}
@keyframes ear-left-rotate{
  0%,50%,100%{
    transform:rotate(-135deg) scaleX(1.2);
  }
  25%{
    transform:rotate(-150deg) scaleX(1.1);
  }
  75%{
    transform:rotate(-120deg) scaleX(0.9);
  }
}

.right-line {
    width: 50px;
    height: 12px;
    border-radius: 12px;
    background: #2567F5;
    transform: rotate(-45deg);

    position: absolute;
    top: -0.1px;
    right: 60px;
      transform-origin: top right;
    animation:ear-right-rotate 1s ease infinite;
}
@keyframes ear-right-rotate{
  0%,50%,100%{
    transform:rotate(135deg) scaleX(1.2);
  }
  25%{
    transform:rotate(150deg) scaleX(1.1);
  }
  75%{
    transform:rotate(120deg) scaleX(0.9);
  }
}

.left-eye {
    width: 40px;
    height: 16px;
    background: #2567F5;
    transform: rotate(-15deg);
    position: absolute;
    top: 50px;
    left: 40px;
    animation:left-rotate 1s ease infinite;
}
@keyframes left-rotate{
  0%,100%{
    transform:rotate(-15deg) translateY(0);
  }
  50%{
    transform:rotate(-30deg) translateY(-5px);
  }
}

.right-eye {
    width: 40px;
    height: 16px;
    background: #2567F5;
    transform: rotate(15deg);

    position: absolute;
    top: 50px;
    right: 40px;
    animation:right-rotate 1s ease infinite;
}
@keyframes right-rotate{
  0%,100%{
    transform:rotate(15deg) translateY(0);
  }
  50%{
    transform:rotate(30deg) translateY(-5px);
  }
}

.left-nose {
    width: 30px;
    height: 30px;
    border-radius: 100%;
    box-shadow: 4px 10px 0px #2567F5;

    position: absolute;
    left: 50%;
    margin-left: -30px;
    bottom: 55px;
    animation: up 1s ease infinite;
}

.right-nose {
    width: 30px;
    height: 30px;
    border-radius: 100%;
    box-shadow: -4px 10px 0px #2567F5;

    position: absolute;
    right: 50%;
    margin-right: -30px;
    bottom: 55px;
        animation: up 1s ease infinite;
}
@keyframes up{
  0%,100%{
    transform:translateY(0);
  }
  50%{
    transform:translateY(-3px);
  }
}
</style>
