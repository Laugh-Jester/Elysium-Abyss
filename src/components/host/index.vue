<script setup>
import articlebox from './body/ArticleBox.vue'
import articlelist from './body/ArticleList.vue'
import wave from '@/components/host/head/WaveStyle.vue'
import quote from '@/components/host/head/FamousQuotes.vue'
import bilbil from '@/components/host/material/BilBil-logo.vue'
import {theme,count,tag} from '@/stores'
import { ref,onMounted } from 'vue'
import {gsap} from "gsap"
import ScrollTrigger from 'gsap/ScrollTrigger'
import FlipClock from '@/components/host/body/clock/FlipClock.vue'
gsap.registerPlugin(ScrollTrigger)
const Tag=tag();
const bodySection = ref(null)
const Theme=theme();
const Count=count();
// 移动至body
const scrollToBody = () => {
  bodySection.value?.scrollIntoView({ behavior: 'smooth' })
}
// 拖拽旋转
  let isDragging = false;
  let currentBox = null;
  let startX = 0, startY = 0;
  let startAngle = { x: 0, y: 0 };
  const circle = document.createElement('div');
  const rotateMap = {};
  const maxAngle =10;
  const sensitivity = 0.3;
onMounted(async() => {
  // 初始化标签
  await Tag.fetchAllTags()
  Tag.update_tag();
  // 初始化标签

  //拖拽.home-box
  const boxes = document.querySelectorAll('.home-box')
  boxes.forEach((box, index) => {
  const id = index.toString(); // 自动生成 ID（从 "0" 开始）
  box.dataset.id = id;         // 设置 data-id 属性
  rotateMap[id] = { x: 0, y: 0 };

  box.addEventListener('mousedown', (e) => {
    isDragging = true;
    currentBox = box;
    startX = e.clientX;
    startY = e.clientY;
    startAngle = { ...rotateMap[id] };

      box.style.transition = 'none';
      box.style.cursor = 'grabbing';
      box.style.userSelect = 'none';
      //创建坐标
  // 创建圆圈
  circle.style.position = 'absolute';
  circle.style.width = `5px`;
  circle.style.height = `5px`;
  circle.style.borderRadius = '50%';
  circle.style.background = 'rgba(222, 223,145, 1)';
  circle.style.pointerEvents = 'none'; // 防止干扰事件

  // 相对于 box 定位
  const rect = box.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  circle.style.left = `${x - 2.5}px`; // 减去半径，确保中心对准点击点
  circle.style.top = `${y - 2.5}px`;

  // 添加到 box 中
  box.appendChild(circle);
    })
  })

  document.addEventListener('mousemove', (e) => {
    if (!isDragging || !currentBox) return;
    const id = currentBox.dataset.id;
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;
    //   console.log('X:',deltaX)
    // console.log('y:',deltaY)
    // 鼠标移动映射为角度变化（缩放比例）
    let rotateX = startAngle.x + deltaX * sensitivity; // ← 修正了方向
    let rotateY = startAngle.y - deltaY * sensitivity;

    // 限制角度范围
    rotateX = Math.max(-maxAngle, Math.min(maxAngle, rotateX));
    rotateY = Math.max(-maxAngle, Math.min(maxAngle, rotateY));

    // console.log('X:',rotateX)
    // console.log('y:',rotateY)
    rotateMap[id] = { x: rotateX, y: rotateY };
    currentBox.style.transform = `rotateX(${rotateY}deg) rotateY(${rotateX}deg)`;
  });

  document.addEventListener('mouseup', () => {
    if (!currentBox) return;
    const id = currentBox.dataset.id;

    isDragging = false;
    currentBox.style.cursor = 'pointer';
    currentBox.style.transition = 'transform 0.4s ease';

    // 复位
    rotateMap[id] = { x: 0, y: 0 };
    currentBox.style.transform = 'rotateX(0deg) rotateY(0deg)';
    currentBox = null;
    circle.remove();
  });
  //拖拽.home-box

  //添加颜色
  const tag_names=document.querySelectorAll('.tag_name')
tag_names.forEach((box, index) => {
  const hue = (index * 20) % 360; // 每隔36度循环（360 / 10 颜色）→ 多种颜色
  box.style.color = `hsl(${hue}, 90%, 60%)`; // 高饱和明亮纯色
});
  //添加颜色
})

</script>

<template>
<div class="head">
  <h1>Blog | Jester</h1>
  <quote></quote>
  <div class="scroll-down" @click="scrollToBody">
    <i class="uil uil-angle-down"></i>
  </div>
<wave></wave>
</div>
<div class="transition">
    <div class="welcome">
      <div class="welcome-sb">
        <div class="img-box"></div>
        <p  v-if="!Theme.isDark">欢迎来到『Jester』的小站，这里没什么正经事，但笑一笑总是没错的～<br>希望你能在这里收获欢乐<br> (￣▽￣)～■干杯□～(￣▽￣)</p>
        <p  v-else> (`∀´)Ψ  你已踏入炽焰织就的梦魇 Ψ(`∀´)<br>小心你的每一步，地狱不欢迎后悔的人。<br>危机四伏，不过恶魔喜欢你这样“好奇”的灵魂。</p>
        <div class="img-box"></div>
      </div>
    </div>
</div>
<div class="body"  ref="bodySection">
  <div class="row-2">
    <div class="personal-introduction">
        <img src="../../assets/images/clown-logo.png" alt="" width="100" class="rotate logo"/>
        <h3>Jester</h3>
        <div class="intorduction-data">
          <div><P>文章<br>{{ Count.article_count }}</p></div>
          <div><p>分类<br>{{ Count.distract_count }}</p></div>
          <div><p>访客量<br>{{ Count.visitors_count }}</p></div>
        </div>
        <router-link to="" class="introduction-a"><img src="../../assets/svg/fidget-spinner.svg" alt="" width="20" class="loading"/>微言圈</router-link>
        <div class="intorduction-data">
          <a href="" class="a"><img src="../../assets/gif/github.gif" alt="" width="20"/></a>
          <a href="" class="a"><img src="../../assets/gif/twitter.gif" alt="" width="20"/></a>
          <a href="" class="a"><bilbil></bilbil></a>
        </div>
    </div>

    <FlipClock />

    <div class="tag_show">
      <div class="tag_list">
        <router-link  class="tag_name" v-for="item in Tag.tags" :key=item.id :to="`/all/tag/${item.id}`">
          {{ item.tag }} <span >{{ item.count }}</span>
        </router-link>
      </div>
    </div>



  </div>
  <div class="row-1">


    <articlebox/>

    <articlelist/>

    <div class="home-box"></div>

    <div class="home-box" style="  margin-bottom:10px;">
      <div class="portal"></div>
      <div class="card">在荒原深处的遗迹中，矗立着一扇残破的石门。<p style="color:rgb(206, 114, 10);">门框铭刻着一句话：“天堂与地狱，仅一线之隔——有胆量，就进来吧。”</p>人们仿佛受到召唤，不自觉地聚集于此，眼中失却神采，如朝圣般步入门中。<br>自那以后，无人归来，唯有石门在夜色中微光闪烁，似在等待下一个勇者。</div>
    </div>

  </div>
</div>

  <div class="footer">
    <div class="logo"></div>
    <div class="other-router">
      <div class="small-box"></div>
      <div class="small-box"></div>
      <div class="small-box"></div>
    </div>
    <div class="website-message"></div>
  </div>
</template>

<style scoped>
.head,.body,.footer{
  perspective:1000px;
}
/* 头部部分 */
.head{
  position:relative;
  top:0;
  left:0;
  width:100vw;
  height:100vh;
  background-image:var(--background-url);
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: center;
  z-index:0;
  display:flex;
  flex-direction: column;
  justify-content:center;
  align-items:center;
}
.head h1{
  font-size: 5.5vh;
  font-weight: bold;
  text-align: center;
  color: var(--h1-color);
  position: absolute;
  top:33vh;
  z-index: 1;
  text-shadow:
    0 0 5px #000,        /* 黑色阴影增强对比 */
    0 0 10px #0ff,        /* 外层发光效果 */
    0 0 20px #0ff,
    0 0 40px #0ff;
}
.head h1:hover{
  animation: glow-pulse 2s ease-in-out infinite;
}
@keyframes glow-pulse {
  0%, 100% {
    transform:scale(1);
    text-shadow:
      0 0 5px #000,
      0 0 10px #38fd38,
      0 0 20px #38fd38,
      0 0 40px #38fd38,
  }
  50% {
    transform:scale(1.2);
    text-shadow:
      0 0 5px #000,
      0 0 15px #38fd38,
      0 0 30px #38fd38,
      0 0 60px #38fd38;
  }
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
/* 过渡部分 */
.transition{
  background-color:var(--transition-bkcolor);
}
/* 身体部分 */
.body{
  width:100vw;
  min-height:100vh;
  display:flex;
  flex-direction: row;
  justify-content:center;
  background:var(--bkcolor);
}
/* 二级盒子：第一列 */
.row-1{
  perspective:1000px;
  display:flex;
  flex-direction: column;
  width:55vw;
  margin-right:auto;
  margin-left:8%;
}
/* 三级盒子：welcome盒子 */
.welcome{
  margin-left:3%;
  margin-right:13.5%;
  border:5px dotted var(--welcome-bdcolor);
  border-radius:10px;
}
.welcome-sb .img-box{
  width:100px;
  height:137px;
  background-image:var(--welcome-img-url);
  background-size:cover;
  animation:larger 1.3s ease infinite;
}
@keyframes larger{
  0%,80%{
    transform:translateY(0) scaleX(1);
  }
  40%{
    transform:translateY(-20px) scaleX(0.9);
  }
}
.welcome-sb{
  border-top:none;
  padding:10px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color:var(--welcome-bkcolor)
}
.welcome-sb p{
  font-size:18px;
  font-weight: bold;
  width:70%;
  text-transform: uppercase;
  text-align: center;
  color:var(--welcome-color);
}
/* 二级盒子：第二列 */
.row-2{
  perspective:1000px;
  display:flex;
  flex-direction: column;
  width:20vw;
  margin-left:3%;
}
/* 三级盒子：自我介绍 */
.personal-introduction{
  display:flex;
  border-radius:20px;
  flex-direction:column;
  border:1px solid var(--tag-show-bdcolor);
  justify-content: center;
  align-items:center;
  padding:10px;
  text-align:center;
  margin-top:20px;
  background-color: var(--tag-show-bkcolor);
}
/* 标题 */
.personal-introduction h3{
  font-size:30px;
  margin:10px 0;
  color:var(--home-color);
}
/* 点击数据 */
.personal-introduction .intorduction-data{
  display:flex;
  flex-direction: row;
  gap:10px;
  margin:10px 0 15px 0;
  justify-content:center;
  color:var(--home-color);
}
/* 微言圈 */
.personal-introduction .introduction-a{
  padding:5px 30px;
  border:1px solid var(--welcome-bdcolor);
  border-radius:20px;
  color:var(--color);
  font-size:15px;
  font-weight:bold;
  position:relative;
  overflow:hidden;
  color:var(--home-color);
}
.personal-introduction .introduction-a::after{
  content:'';
  position:absolute;
  left:0;
  width:300px;
  height:50px;
  background-color:var(--welcome-bdcolor);
  opacity:0.3;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 1s ease-out;
}
.personal-introduction .introduction-a:hover::after{
  transform:scaleX(1);
}
.personal-introduction .introduction-a .loading{
  margin-right:5px;
  animation:rotate 0.8s ease infinite;
}
@keyframes rotate{
  0%{
    transform:rotate(0);
  }
  100%{
    transform:rotate(360deg);
  }
}
/* 信息跳转 */
.personal-introduction a{
  color:var(--color);
}
.personal-introduction .intorduction-data .a{
  border:1px solid var(--welcome-bdcolor);
  border-radius: 50%;
  padding:2.5px;
  background-color:rgba(183, 193, 216, 0.6);
  transition: all 0.4s ease;
}
.personal-introduction .intorduction-data .a:hover{
transform:scale(1.1);
background-color:white;
}
/* 标签盒子 */
.tag_show{
  display:flex;
  width:100%;
  min-height:200px;
  flex-direction: row;
  background-color:var(--tag-show-bkcolor);
  border:1px solid var(--tag-show-bdcolor);
  border-radius:10px;
  padding:5px;
  position:sticky;
  top:100px;
}
.tag_show a{
  display:inline-block;
  padding:3px;
  margin:3px 10px;
  font-size:20px;
  transition:all 0.5s ease;
}
.tag_show a:hover{
  transform:scale(0.95);
}
.tag_show span{
  font-size:13px;
  position:absolute;
}

/* 一级盒子：底部 */
.footer{
  background:var(--bkcolor-bottom);
  min-height:400px;
  width:100vw;
  display:flex;
  flex-direction: column;
}
.footer .logo{
  border:1px solid black;
  background-color:rgba(0,0,0,0);
  display:flex;
  flex-direction: row;
    min-height:50px;
}
.footer .other-router{
  border:1px solid black;
    background-color:rgba(0,0,0,0);
  display:flex;
  flex-direction: column;
      min-height:200px;
}
.footer .website-message{
  border:1px solid black;
  display:flex;
    background-color:rgba(0,0,0,0);
  flex-direction: row;
      min-height:150px;
}


/* 传送门盒子 */
.portal{
  width:100%;
  min-height:600px;
  background-image:url('../../assets/gif/portal.gif');
  background-size:cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius:10px 10px 0 0;
}
.card{
  display: flex;
  flex-direction: column;
  font-size:20px;
  padding:10px;
  width:100%;
  min-height:200px;
  border-radius:0 0 10px 10px;
  justify-content: center;
  align-items: center;
  color:var(--home-color);
  background-color:white;
}

</style>
