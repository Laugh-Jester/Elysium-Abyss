<script setup>
import wave from '@/components/host/head/WaveStyle.vue'
import { ref,onMounted } from 'vue'
import {gsap} from "gsap"
import ScrollTrigger from 'gsap/ScrollTrigger'
import Draggable from 'gsap/Draggable'
import {photo} from '@/stores/modules/photo_wall.js'

const Photo=photo()
const circleRef = ref(null)
const boxRef = ref(null)
gsap.registerPlugin(ScrollTrigger)
gsap.registerPlugin(Draggable)

//波纹效果
function triggerRipple() {
    const rippleAnimation = gsap.fromTo(circleRef.value, {
    r: 0,
    opacity: 0.8,
  }, {
    r: 300,
    opacity: 0,
    duration: 2.5,
    stagger:0.5,
    blur:10,
    ease: "expoScale(0.5,7,none)"
  });
  return rippleAnimation;
}
//自动动画
function createAutoPlayTimeline(box) {
  const randomDelay = Math.random() * 3;
  let autoPlayTl = gsap.timeline({
    paused: true,
    repeat: -1,
    repeatDelay: 0,
    pin:true,
    anticipatePin: 1,
  });
  autoPlayTl.set(box, {
    top:()=>{return (Math.random()*80-40)+"vh";},
    x:"-80vw",
    opacity:1,
  })
  .to(box, {
  x: "119vh",
  rotationX:()=>{
    return Math.random()*180;
  },
  rotationY:()=>{
    return Math.random()*180;
  },
  duration: 5,
  delay: randomDelay
  })
  return autoPlayTl;
}
//初始动画时间轴
function showIntroAnimation() {
  const tl = gsap.timeline();
  tl.fromTo('.span-1', {
    y:-100,
    opacity:0,
  },{
    y:50,
    opacity:1,
    stagger:1,
    duration: 0.8,
    ease:"power4.out",
  })
  .to('.head',{
  opacity:0,
  duration:0.5,
},"<")
  .from('#water-drop',{
    opacity:0,
    y:"-50vh",
    duration:1,
    onComplete(){
      gsap.set("#water-drop",{
        opacity:0,
      })
    }
  })
  .add(triggerRipple())
  .to(boxRef.value, {
    filter:"blur(10px)",
    duration: 3,
    ease: "sine.inOut"
  },"<")
  .to(".span-1",{
    opacity:0,
    duration:2 ,
    ease: "sine.inOut"
  },"<")
  .from('.container',{
    yPercent:100,
    duration:1,
  })
// 盒子接文字
  .from('.cutout',{
    x:1500,
    duration:5,
  })
  .from('.cutout-content',{
    x:-1500,
    duration:5,
  },"<")
  .to('.container',{
    scale:5,
    duration:2,
  })
  .to(".cutout",{
    backgroundColor:"#11111131",
    blur:10,
    duration:2,
  },"<")
  .to(".cutout-content",{
    scale:0.2,
    duration:2,
  },"<")
  .from(".text span",{
    y:100,
    opacity:0,
    stagger:0.1,
    duration:1,
  })
  .add(() => {
    const boxes=document.querySelectorAll('.experience')
  boxes.forEach((box) => {
    let autoPlayTl = createAutoPlayTimeline(box);
    autoPlayTl.play();

    Draggable.create(box, {
      bounds: ".container",
      inertia: true,
      onDrag: function() {
        // 暂停当前拖拽盒子的动画
        autoPlayTl.pause();
        gsap.to(box, {
          scale: 2,
          duration: 0.2,
          ease: "power2.out"
        });
        gsap.set(box, {
          rotationX: 0,
          rotationY: 0
        });
      },
      onRelease: function() {
        // 松开后，播放消失动画
        gsap.to(box, {
          opacity: 0,
          scale: 0,
          rotation: 360,
          blur: 10,
          duration: 1,
          ease: "power2.inOut",
          onComplete: function() {
            // 恢复所有状态，包括位置
            gsap.set(box, {
              opacity: 1,
              scale: 1,
              rotation: 0,
              blur: 0,
              x: 0,        // 重置X位置
              y: 0         // 重置Y位置
            });

            // 重新创建并启动时间线
            autoPlayTl.kill();  // 杀死旧的时间线
            autoPlayTl = createAutoPlayTimeline(box);  // 创建新的时间线
            autoPlayTl.play();  // 播放新时间线
          }
        });
      }
    });
  });
  }, "<")
  .fromTo(".text span",
    { color: "red" },  // 起始颜色
    {
      color: "black",    // 目标颜色
      stagger: 0.1,
      duration: 1,
      ease: "power2.inOut",
    })
  .to(".text span:last-child", {
    textContent: "🖤",  // 修改为🖤
    duration: 1,        // 动画时长
    ease: "power2.inOut" // 缓动效果
  })
//改变大小
  return tl;
}
//第二段动画
function showYellowBox() {
  const tl = gsap.timeline();
  tl.fromTo(".bottom",{
    x:"-100vw",
  },{
    x:0,
    duration:5,
    ease:"none",
  })
  return tl;
}
// 第三段动画
function showBlueBox() {
  const tl = gsap.timeline();
  tl.from('.blue', {
    xPercent: 100,
    duration: 1,
  });
  return tl;
}
// 结束动画
function fadeOutAllAbs() {
  const tl = gsap.timeline();
  tl.to('.abs', {
    opacity: 0,
    duration: 1,
  });
  return tl;
}

onMounted(()=>{
//初始化滚动播放时间轴
let master = gsap.timeline({
  scrollTrigger: {
    trigger: ".animate", // 外层容器，用来触发整个时间线
    start: "top top",
    end: "+="+window.innerHeight*5, // 根据需要的滚动长度调整
    scrub: 1,
    pin: true,
  }
});
let master_1=gsap.timeline({
    repeat: -1,
    repeatDelay: 0,
})
let master_2 = gsap.timeline({
  scrollTrigger: {
    trigger: ".site-2", // 外层容器，用来触发整个时间线
    start: "top top",
    end: "+="+window.innerHeight*5, // 根据需要的滚动长度调整
    scrub: 1,
    pin: true,
  }
});
//在时间轴上拖入动画
master
  .add(showIntroAnimation())
master_1
  .add(showYellowBox());
master_2
  .add(showBlueBox())
  .add(fadeOutAllAbs());

Photo.initPhotos()
})



//滚动到目标位置
const bodySection = ref(null)
const scrollToBody = () => {
  bodySection.value?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
<div class="background-fixed" ref="boxRef">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="water-drop">
      <g>
        <path fill="#8dd1ff" d="M12.60505,2.96365a.71742.71742,0,0,0-1.2101,0c-.20288.37164-4.96427,9.13272-5.34579,12.56283A6.25568,6.25568,0,0,0,7.44957,20.475,5.98373,5.98373,0,0,0,12,22.36828,5.98373,5.98373,0,0,0,16.55043,20.475a6.25568,6.25568,0,0,0,1.40041-4.94855C17.56932,12.09637,12.80793,3.33529,12.60505,2.96365Z"></path>
        <path fill="#fff" d="M12.84766,20.106a.75.75,0,0,1,0-1.5,1.39459,1.39459,0,0,0,1.07714-.42432,1.509,1.509,0,0,0,.31153-1.2041.74972.74972,0,1,1,1.49023-.166,2.99479,2.99479,0,0,1-.68457,2.37061A2.8875,2.8875,0,0,1,12.84766,20.106Z"></path>
        <path fill="#004fac" d="M12,22.75a6.50794,6.50794,0,0,1-4.9502-2.05957,6.80412,6.80412,0,0,1-1.52343-5.38281c.415-3.73242,5.59472-13.2627,5.81543-13.667a.77958.77958,0,0,1,1.3164,0c.22071.40429,5.40039,9.93457,5.81543,13.667h0a6.80412,6.80412,0,0,1-1.52343,5.38281A6.50794,6.50794,0,0,1,12,22.75ZM12,3.59766c-1.42383,2.71972-4.68359,9.18066-4.9834,11.876A5.26108,5.26108,0,0,0,8.168,19.69043,5.03025,5.03025,0,0,0,12,21.25a5.03025,5.03025,0,0,0,3.832-1.55957,5.26108,5.26108,0,0,0,1.15137-4.2168C16.68359,12.77832,13.42383,6.31738,12,3.59766Z"></path>
      </g>
    </svg>
    <svg class="ripple" viewBox="0 0 200 200" v-for="_ in 5" :key="_">
            <defs>
        <!-- 定义模糊滤镜 -->
        <filter id="blurEffect">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
        </filter>
      </defs>
      <circle ref="circleRef" cx="100" cy="100" r="0" fill="none" stroke="#72c2ff" stroke-width="10" opacity="0.8" filter="url(#blurEffect)" />
    </svg>
</div>
<div class="head">
  <h1  class="blog">Blog | Jester</h1>
  <span class="welcome" >欢迎来到『Jester』的小站：一场不被安排的喜剧，和一点不合时宜的思考</span>
  <div class="scroll-down" @click="scrollToBody">
    <i class="uil uil-angle-down"></i>
</div>
</div>
  <wave></wave>
<div class="animate">
<div class="abs My-introduce">
  <span class="span-1">你好！欢迎来到我的小站</span>
  <span class="span-1">我是 Jester，一个热爱探索的人</span>
  <span class="span-1">无论是技术的世界，还是生活中的点滴，我都抱着一颗好奇心，愿意不断尝试与成长</span>
  <span class="span-1">这里是我分享心得、交流想法的地方，希望你在这里能找到一些灵感，或者笑一笑，带着轻松和愉悦离开</span>
  <div class="container">
    <div class="cutout">
      <!-- <div class="cutout-content" v-for="(item) in 10" :key="item"> -->
      <div class="cutout-content">
      <div class="jester">
        <span>J</span>
        <span>E</span>
        <span>S</span>
        <span>T</span>
        <span>E</span>
        <span>R</span>
        </div>
      <div class="text">
          <span>绞</span>
          <span>尽</span>
          <span>心</span>
          <span>机</span>
          <span>饰</span>
          <span>荒</span>
          <span>诞</span>
          <span>，</span>
          <span>只</span>
          <span>为</span>
          <span>搏</span>
          <span>君</span>
          <span>一</span>
          <span>笑</span>
          <span>尔</span>
          <span>❤️</span>
        </div>
      <div class="experience"  v-for="(item) in Photo.photos" :key="item.id">
        <img :src="item.photo" alt=""/>
        <div class="card">{{ item.content }}</div>
      </div>

      </div>
    </div>
  </div>
</div>
</div>
<div class="site-1">
  <div class="bottom"></div>
</div>

<div style="width:100vw;height:100vh;background-color:black" class="site-2">
  <div class="abs yellow">yellow</div>
  <div class="abs blue">blue</div>
</div>


  <div class="footer">

  </div>
</template>

<style scoped>

/* 头部部分 */
.background-fixed {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  /* background-image: var(--background-url); */
  background-image:url('../../assets/images/background/host-5.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}
#water-drop{
  position: absolute;
  width:15%;
  height:15%;
  top:33%;
  left:42%;
}
.ripple {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
.blog {
  font-size: 8vh;
  text-shadow: 0 0 8px #ffcad4, 0 0 15px #ffc9a9;
  color: #fff;
  animation: pulseGlow 3s infinite ease-in-out, floatUp 3s ease-in-out infinite;
  animation-delay: 0.5s;
  animation-fill-mode: forwards;
}

/* 欢迎框的动态和发光背景 */
.welcome {
  display: block;
  font-size: 2.3vh;
  padding: 1rem 2rem;
  margin-top: 1rem;
  color: #e3d5ca;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(4px);
  position: relative;
  overflow: hidden;
  animation: fadeIn 2s ease-in-out 1.2s forwards;
  opacity: 0;
}

/* welcome 背后动感水光纹理 */
.welcome::before {
  content: "";
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(ellipse at center, rgba(255,255,255,0.06), transparent 70%);
  animation: moveWaves 10s linear infinite;
  z-index: 0;
  filter: blur(8px);
}
.welcome > * {
  position: relative;
  z-index: 1;
}


.url-fixed{
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  /* background-image: var(--background-url); */
  background-image:url('../../assets/images/background/host-2.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}
.head{
  position: fixed;
  top:0;
  left:0;
  width:100vw;
  height:100vh;
  display:flex;
  flex-direction: column;
  justify-content:center;
  align-items:center;
  overflow:hidden;
}
/* 箭头样式 */
.scroll-down {
  position: absolute;
  bottom: 80px;
  font-size:6rem;
  color:rgba(34,98,219,0.5);
  cursor: pointer;
  animation: bounce 2s infinite;
  z-index: 2;
}
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
    opacity:1;
  }
  50% {
    transform: translateY(30px);
    opacity:0.25;
  }
}

.animate{
  width:100vw;
  height:100vh;
  display:flex;
  flex-direction: column;
  justify-content:center;
  align-items:center;
  overflow:hidden;
  /* margin-top:100vh; */
}
.abs{
  /* 去掉：堆叠 */
  position:fixed;
  top:0;
  left:0;
  width:100vw;
  height:100vh;
  display:flex;
  align-items: center;
  justify-content: center;
  z-index:1;
}
.My-introduce{
  display:flex;
  flex-direction: column;
}
.span-1{
  font-size:3vh;
  color: #e3d5ca;
  opacity:0,
}
.blue{
  background-color:blue;
}
.yellow{
  background-color:yellow;
}

.container {
  width: 100vw;
  height: 100vh;
  background-color: #e71543; /* 主红色背景 */
  background-image: linear-gradient(to right, transparent 99%, black 99%),
                    linear-gradient(to bottom, transparent 99%, black 99%);
  background-size: 75px 75px; /* 网格大小 */
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
}
.site-1{
   perspective: 1000px;
   width:100vw;
   height:6vh;
   overflow: hidden;
   border:3px solid rgb(0, 0, 0);
}
.site-2{
  width:100vw;
  overflow:hidden;
}
.bottom{
  width:200vw;
  height:6vh;
  background-color:#e71543;
  background-image: linear-gradient(to right, transparent 99%, black 99%),
                    linear-gradient(to bottom, transparent 99%, black 99%);
  background-size: 175px 6vh; /* 网格大小 */
  display: flex;
  justify-content: center;
  align-items: center;
  transform-origin: bottom;
}
.cutout {
  perspective: 1000px;
  width: 600px;
  height: 200px;
  border-radius: 160px;
  background-color: #11111171;
  box-shadow:
    inset 8px 8px 20px rgba(0, 0, 0, 0.5),
    inset -8px -8px 20px rgba(255, 255, 255, 0.1),
    0 0 0 6px #e71543,
    0 0 0 10px rgba(0,0,0,0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow:hidden;
}

.cutout-content {
  perspective:1000px;
  position:absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #e71543;
  font-weight: bold;
  text-shadow: 0 0 10px black;
}
.jester{
  display:flex;
  flex-direction: row;
  font-size: 130px;
  user-select: none;
  pointer-events: none;
}
.text{
  position:absolute;
  top:100%;
  display: flex;
  flex-direction: row;
  font-size:35px;
  user-select: none;
  pointer-events: none;
}
.experience{
  border:5px solid black;
  position: absolute;
  background-color: black;
  opacity: 0;
  transform-style: preserve-3d;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.experience img{
  height:15vh;
}
.experience .card{
  display:flex;
  justify-content: center;
  align-items: center;
  background: black;
  color:white;
  padding:5px;
  font-size:10px;
}
</style>
