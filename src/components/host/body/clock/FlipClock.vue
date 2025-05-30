<template>
 <div class="clock" ref="clockRef">
        <div class="flip">
            <div class="digital front" data-number="0"></div>
            <div class="digital back" data-number="1"></div>
        </div>
        <div class="flip">
            <div class="digital front" data-number="0"></div>
            <div class="digital back" data-number="1"></div>
        </div>
        <em class="divider">:</em>
        <div class="flip">
            <div class="digital front" data-number="0"></div>
            <div class="digital back" data-number="1"></div>
        </div>
        <div class="flip">
            <div class="digital front" data-number="0"></div>
            <div class="digital back" data-number="1"></div>
        </div>
        <em class="divider">:</em>
        <div class="flip">
            <div class="digital front" data-number="0"></div>
            <div class="digital back" data-number="1"></div>
        </div>
        <div class="flip">
            <div class="digital front" data-number="0"></div>
            <div class="digital back" data-number="1"></div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

class Flipper {
  constructor(node, currentTime, nextTime) {
    this.isFlipping = false
    this.duration = 600
    this.flipNode = node
    this.frontNode = node.querySelector('.front')
    this.backNode = node.querySelector('.back')
    this.setFrontTime(currentTime)
    this.setBackTime(nextTime)
  }

  setFrontTime(time) {
    this.frontNode.dataset.number = time
  }

  setBackTime(time) {
    this.backNode.dataset.number = time
  }

  flipDown(currentTime, nextTime) {
    if (this.isFlipping) return
    this.isFlipping = true
    this.setFrontTime(currentTime)
    this.setBackTime(nextTime)
    this.flipNode.classList.add('running')
    setTimeout(() => {
      this.flipNode.classList.remove('running')
      this.isFlipping = false
      this.setFrontTime(nextTime)
    }, this.duration)
  }
}

const getTimeFromDate = (date) => {
  return date
    .toTimeString()
    .slice(0, 8)
    .split(':')
    .join('')
}

const flippers = []
const clockRef = ref(null)

onMounted(() => {
  const flips = clockRef.value.querySelectorAll('.flip')
  const now = new Date()
  const nowTimeStr = getTimeFromDate(new Date(now.getTime() - 1000))
  const nextTimeStr = getTimeFromDate(now)

  flips.forEach((flip, i) => {
    flippers.push(new Flipper(flip, nowTimeStr[i], nextTimeStr[i]))
  })

  setInterval(() => {
    const now = new Date()
    const nowTimeStr = getTimeFromDate(new Date(now.getTime() - 1000))
    const nextTimeStr = getTimeFromDate(now)

    flippers.forEach((flipper, i) => {
      if (nowTimeStr[i] !== nextTimeStr[i]) {
        flipper.flipDown(nowTimeStr[i], nextTimeStr[i])
      }
    })
  }, 1000)
})
</script>

<style scoped>
  .clock {
    display: flex;
    margin-top:20px;
    margin-bottom:20px;
  }

  /* 时钟的分隔 */
  .clock .divider {
    font-size: 66px;
    line-height: 102px;
    font-style: normal;
    color: rgb(51, 50, 50);
  }

  /* 时钟的卡片 */
  .clock .flip {
    position: relative;
    width: 60px;
    height: 100px;
    margin: 2px;
    font-size: 70px;
    font-weight: 700;
    line-height: 100px;
    text-align: center;
    background: rgb(46, 45, 45);
    border: 1px solid rgb(34, 33, 33);
    border-radius: 10px;
    box-shadow: 0 0 6px rgba(54, 54, 54, 0.5);
  }

  /* 时钟上的数字 */
  .clock .flip .digital::before, .clock .flip .digital::after {
    position: absolute;
    content: attr(data-number);
    left: 0;
    right: 0;
    background: var(--clock-bkcolor);
    border:var(--clock-bd);
    box-shadow:var(--clock-bsha);
    overflow: hidden;
    -webkit-perspective: 160px;
            perspective: 160px;
  }

  /* 翻页前的数字 */
  .clock .flip .digital::before {
    top: 0;
    bottom: 50%;
    border-bottom: 1px solid #666;
    border-radius: 10px 10px 0 0;
    color:var(--clock-bf-color);
    background:var(--clock-bf-bdcolor);
  }

  /* 翻页后的数字 */
  .clock .flip .digital::after {
    top: 50%;
    bottom: 0;
    line-height: 0;
    border-radius: 0 0 10px 10px;
     color: var(--clock-af-color);
  }


  .clock .flip .back::before,
  .clock .flip .front::after {
    z-index: 1;
  }
  .clock .flip .back::after {
    z-index: 2;
  }
  .clock .flip .front::before {
    z-index: 3;
  }

  .clock .flip .back::after {
    -webkit-transform-origin: center top;
            transform-origin: center top;
    -webkit-transform: rotateX(0.5turn);
            transform: rotateX(0.5turn);
  }

  .clock .flip.running .front::before {
    -webkit-transform-origin: center bottom;
            transform-origin: center bottom;
    -webkit-animation: frontFlipDown 0.6s ease-in-out;
            animation: frontFlipDown 0.6s ease-in-out;
    box-shadow: 0 -2px 6px rgba(255, 255, 255, 0.3);
    -webkit-backface-visibility: hidden;
            backface-visibility: hidden;
  }

  .clock .flip.running .back::after {
    -webkit-animation: backFlipDown 0.6s ease-in-out;
            animation: backFlipDown 0.6s ease-in-out;
  }

  @-webkit-keyframes frontFlipDown {
    to {
      -webkit-transform: rotateX(0.5turn);
              transform: rotateX(0.5turn);
    }
  }

  @keyframes frontFlipDown {
    to {
      -webkit-transform: rotateX(0.5turn);
              transform: rotateX(0.5turn);
    }
  }

  @-webkit-keyframes backFlipDown {
    to {
      -webkit-transform: rotateX(0);
              transform: rotateX(0);
    }
  }

  @keyframes backFlipDown {
    to {
      -webkit-transform: rotateX(0);
              transform: rotateX(0);
    }
  }

</style>
