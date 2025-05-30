<script setup>
import SunMoon from '@/components/toplist/view/SunMoon.vue'
import {ref,onMounted,onUnmounted,nextTick,watch} from 'vue'
import {gsap} from "gsap"
import Draggable from "gsap/Draggable"
import {article} from "@/stores/modules/article"
const Article=article()
gsap.registerPlugin(Draggable)
const isHidden=ref(false)
let lastScrollY=window.scrollY


const handleScroll=()=>{
  const currentScrollY=window.scrollY
  isHidden.value = currentScrollY > lastScrollY && currentScrollY > 50
  lastScrollY = currentScrollY
}
const search=ref(null)
const isOpen=ref(false)
const toggle = async () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    // 展开动画
    gsap.to('.search-ball', {
      width: 350,
      height: 200,
      borderRadius: '10px',
      duration: 0.5,
      ease: 'power2.out'
    })

    // 等 Vue 渲染 input 后再聚焦
    await nextTick()
    search.value.focus()
  } else {
    // 关闭动画
    Article.clearData()
    gsap.to('.search-ball', {
      width: 120,
      height: 120,
      borderRadius: '50%',
      duration: 0.5,
      ease: 'power2.inOut'
    })
  }
}
onMounted(async() => {
  window.addEventListener('scroll', handleScroll)
  Article.fetchAllArticles()
})
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
watch(()=>Article.article_search,()=>{
  Article.updateSearchContent()
})
</script>

<template>
<div>
  <div class="top-list" :class="{hidden:isHidden}">

    <div class="box1">
      <router-link to="/home"><div></div>Jester</router-link>
    </div>

    <div class="box2">
      <router-link to="" class="tag-1"><img src="@/assets/svg/article.svg" alt="" width="30" height="30"/>文章
        <div class="popup-box">
          <router-link to="/all/sort"><img src="@/assets/svg/classification.svg" alt="" width="30" height="30"/>投文</router-link>
          <router-link to="/all/tag"><img src="@/assets/svg/tag.svg" alt="" width="30" height="30"/>标签</router-link>
      </div>
    </router-link>
    <router-link to="" class="tag-1"><img src="@/assets/svg/chat.svg" alt="" width="30" height="30"/>社交
      <div class="popup-box">
        <router-link to="/social/Msgbd"><img src="@/assets/svg/message.svg" alt="" width="30" height="30"/>留言板</router-link>
      </div>
    </router-link>
    <router-link to="" class="tag-1"><img src="@/assets/svg/balloons.svg" alt="" width="30" height="30"/>娱乐
      <div class="popup-box">
        <router-link to="/amusement/game"><img src="@/assets/svg/game.svg" alt="" width="30" height="30"/>游戏</router-link>
        <router-link to="/amusement/music"><img src="@/assets/svg/music.svg" alt="" width="30" height="30"/>音乐</router-link>
      </div>
    </router-link>
    <!-- <router-link to="" class="tag-1"><img src="@/assets/svg/search.svg" alt="" width="30" height="30"/>搜索 -->
      <!-- <router-link to="" class="tag-1">
        <img src="@/assets/svg/search-1.svg" alt="" width="30" height="30"/>
        <input ref="search" type="test" style="width:300px;height:30px;border-radius:15px;padding:5px;border:3px solid var(--toplist-color)">
        <div class="popup-box">
          <router-link to="/amusement/game"><img src="@/assets/svg/game.svg" alt="" width="30" height="30"/>游戏</router-link>
          <router-link to="/amusement/music"><img src="@/assets/svg/music.svg" alt="" width="30" height="30"/>音乐</router-link>
        </div>
      </router-link> -->
    <!-- </router-link> -->
    </div>

    <div class="box3">
      <SunMoon size="30px" ball="gradient" halo="flex"/>
      <router-link to="" style="margin-right:25px">
        <img src="@/assets/images/clown-logo.png" alt="" width="60" height="60" class="rotate"/>
        <div class="popup-box">
          <router-link to="/login"><img src="@/assets/svg/login.svg" alt="" width="30" height="30"/>登录</router-link>
          <router-link to=""><img src="@/assets/svg/logout.svg" alt="" width="30" height="30"/>注销</router-link>
        </div>
      </router-link>
    </div>
  </div>
  <div class="search-ball" @click="toggle">
    <div class="search-box"   v-show="isOpen" >
    <input
      v-model="Article.article_search"
      ref="search"
      type="text"
      class="search-input"
      placeholder="请输入内容"
    />
    <div class="search-content" v-if="Article.article_find.length">
      <div class="find" v-for="item in Article.article_find" :key="item">
        <!-- <span>- {{ item.title }}</span>
        <hr/> -->
        <router-link :to="'/article/'+item.id" class="text" >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 512 512" id="magnifying-glass">
            <path fill="#000" d="M494.476 419.894L389.024 314.442C376.198 301.616 358.253 296.858 341.652 300.219C341.445 299.961 341.341 299.651 341.135 299.444L313.88 272.189C362.959 202.888 354.012 105.97 289.728 47.1158C220.116 -16.6515 111.614 -11.8416 47.8464 57.7699C-15.9209 127.381 -11.1113 235.884 58.5003 299.651C91.289 329.699 132.714 344.489 174.036 344.489C208.842 344.489 243.544 333.991 272.971 313.149L300.174 340.353C300.174 340.353 300.692 340.663 300.95 340.87C297.589 357.471 302.295 375.365 315.173 388.243L420.624 493.694C430.812 503.882 444.155 508.95 457.549 508.95C470.944 508.95 484.287 503.882 494.476 493.694C514.852 473.317 514.852 440.218 494.476 419.842V419.894ZM68.9989 288.222C5.69697 230.247 1.35245 131.57 59.3273 68.2684C89.9955 34.8073 132.042 17.7923 174.192 17.7923C211.738 17.7923 249.44 31.2904 279.281 58.5968C342.583 116.572 346.927 215.248 288.952 278.55C230.977 341.852 132.301 346.197 68.9989 288.222ZM306.949 325.251L285.28 303.582C290.555 299.082 295.572 294.272 300.382 289.049C301.726 287.601 302.967 286.101 304.26 284.601L325.93 306.271C322.103 308.495 318.431 311.184 315.173 314.494C311.863 317.804 309.173 321.423 306.949 325.302V325.251ZM483.46 482.782C476.53 489.712 467.325 493.539 457.498 493.539C447.672 493.539 438.466 489.712 431.536 482.782L326.084 377.33C311.759 363.005 311.759 339.731 326.084 325.457C333.221 318.32 342.634 314.752 352.047 314.752C361.459 314.752 370.82 318.32 378.009 325.457L483.46 430.909C490.39 437.839 494.217 447.045 494.217 456.871C494.217 466.698 490.39 475.903 483.46 482.833V482.782ZM259.939 79.6457C263.093 82.5419 263.3 87.455 260.404 90.6097C257.507 93.7645 252.594 93.9714 249.44 91.0752C204.032 49.4948 133.283 52.6499 91.7022 98.0058C90.1507 99.6608 88.0825 100.54 85.9621 100.54C84.1003 100.54 82.1863 99.8671 80.7382 98.5225C77.5834 95.6263 77.3771 90.7132 80.2732 87.5584C127.646 35.8415 208.222 32.3247 259.887 79.6457H259.939Z"></path>
          </svg> {{ item.title }}
        </router-link>
          <hr style="margin-top:2px;">
      </div>
      </div>
    <div class="search-content-none" v-else>
      <div>这里什么都没有－_－b</div>
    </div>
    </div>
    <span v-show="!isOpen">搜索</span>
  </div>
  <router-view></router-view>
</div>
</template>

<style scoped>
/* 一级：导航栏 */
.top-list {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px; /* 固定高度 */
  display: flex;
  flex-direction: row;
  align-items: center; /* 垂直居中内容 */
  z-index: 10;
  box-shadow: var(--toplist-border-shadow);
  transition: all 0.3s ease;
}
.top-list:hover{
  border: 2px solid transparent;
  animation: rainbowBorder 1.2s linear infinite;
}
@keyframes rainbowBorder {
  0%   { box-shadow: 0 0 8px 2px #ff9a9e; }
  33%  { box-shadow: 0 0 8px 4px #fad0c4; }
  66%  { box-shadow: 0 0 8px 3px#a1c4fd; }
  100% { box-shadow: 0 0 8px 2px#ff9a9e; }
}
/* 二级：首页 */
.box1{
margin-left:30px;
}
.box1 a{
  color:var(--toplist-color);
  font-size:30px;
  width: 150px;
  height: 60px;
  text-shadow: 1px 1px 2px;
}
.box1 a:after,.box1 div{
  position:absolute;
    opacity:0;
    width:150px;
    height:60px;
    content:'';
    transition:1s;
    margin-left:0;
}
.box1 a:after{
  background-color:rgba(245,245,245,1);
   z-index:1;
    border-radius:17px;
    border:1px solid rgba(255, 255, 255, 0.2);
}
.box1 div{
    background:url( "../assets/images/clown.png") no-repeat 50% 50%;
    background-size:60% 75%;
    z-index:2;
}
.box1:hover a:after{
  opacity:1;
}
.box1:hover div{
  opacity:1;
  transform:scale(0.8);
}

/* 二级：中间盒子 */
.box2{
  display:flex;
  flex-direction:row;
  height:50px;
  margin:auto;
}
.box2 img{
  margin-right:3px;
}
.box2 a{
  font-size:18px;
  font-weight:bold;
  margin:15px;
  color:var(--toplist-color);
  transition: all 0.5s ease;
}
.tag-1:after{
  content: '';
      position: absolute;
      bottom: 0;
      height: 4px;
      width: 75px;
      background-color: #37df37;
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 0.4s ease-out;
}
.tag-1:hover{
  color:#37df37;
}
.tag-1:hover::after{
transform:scaleX(1);
}
/* 二级：右边盒子 */
.box3{
  display:flex;
  flex-direction:row;
  justify-content:flex-end;
  width:300px;
  margin-right:40px;
}
/* 弹窗 */
.popup-box {
  display:flex;
  flex-direction: row;
  position: absolute;
  top: 100%; /* 紧贴底部 */
  background-color: #fff;
  color: #333;
  border-radius: 25px;
  padding:8px 20px;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  opacity: 0;
  visibility: hidden;
  transition: all 0.5s ease;
  z-index: 100;
}
.popup-box a{
  margin:0 10px 0 0;
  padding:5px;
  border-radius:30px;
  transition:all 0.5s ease;
}
.popup-box a:hover{
  background-color:#7AABF0;
  transform:scale(1.1);
}
a:hover  .popup-box {
  opacity: 1;
  visibility: visible;
  transform: translateY(4px);
}
/* 搜素球 */
.search-ball{
  position: fixed;
      top: 100px;
      right: 50px;
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: var(--searchball-bk);
      /* box-shadow:
        inset -10px -10px 20px rgba(255, 255, 255, 0.4),
        inset 10px 10px 20px rgba(0, 0, 0, 0.2),
        0 20px 30px rgba(0, 0, 0, 0.3); */
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--searchball-color);
      font-size: 20px;
      font-weight: bold;
      cursor: pointer;
      user-select: none;
      transition: box-shadow 0.3s ease;
      z-index:99;
}
.search-ball:hover{
        box-shadow:
        inset -10px -10px 25px rgba(255, 255, 255, 0.5),
        inset 10px 10px 25px rgba(0, 0, 0, 0.25),
        0 25px 40px rgba(0, 0, 0, 0.4);
}
.search-box{
  width:100%;
  height:95%;
  margin:10px;
  padding:5px;
  display:flex;
  flex-direction: column;
  align-items: center;
}
.search-input {
  width: 100%;
  border: none;
  outline: none;
  padding: 8px;
  font-size: 16px;
  border-radius:6px 6px 0 0;
}
.search-content{
  border-top:2px dotted red;
  border-radius: 0 0 10px 10px;
  display:flex;
  flex-direction: column;
  width:100%;
  height:200px;
  overflow:hidden;
  padding-left:10px;
  background-color:white;
   overflow-y: auto;
}
.search-content-none{
  /* background-image:url('https://w.wallhaven.cc/full/lq/wallhaven-lqwgv2.jpg');
  background-size: 100% 100%; */
  background-color:white;
  border-top:2px dotted red;
  width:100%;
  height:100%;
  color:black;
  padding:5px;
  display:flex;
  align-items: center;
}
.find{
  margin-top:5px;
  color:black;
  width:100%;
  padding-bottom:9px;
  padding:5px;
}
.find .text{
  color:#333;
  transition:all 0.5s ease;
  display:flex;
  padding:3px;
  align-items: center;
}
.find .text:hover{
  background-color:#3498db;
}
.find svg{
margin-right:5px;
}


</style>
