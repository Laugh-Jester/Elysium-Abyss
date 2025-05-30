<script setup>
import {ref,onMounted,nextTick} from 'vue'
import axios from 'axios'
import router from '@/router'
import {gsap} from "gsap"
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
const article_list=ref([])
const tags=ref([])
onMounted(async()=>{
  const [resTags, resArticles] = await Promise.all([
    axios.get('http://localhost:3000/tags'),
    axios.get('http://localhost:3000/articles')
  ])
  tags.value = resTags.data
  article_list.value = resArticles.data
  article_list.value.forEach(article=>{
  article.tagIDs = getTagNames(article.tagIDs)
  })
   await nextTick()
  const boxes=document.querySelectorAll(".list")
  console.log(boxes)
  boxes.forEach((box)=>{
    console.log("运行成功")
    gsap.from(box,{
      scrollTrigger:{
        trigger:box,
        start:"100px bottom",
        toggleActions:"play none none none"
      },
      ease:"none",
      duration:0.4,
      opacity:0,
    })
  })
  }
)

const getTagNames = (ids) => {
  return ids.map(id => tags.value.find(tag => tag.id == id)?.tag || '')
}

function routeChange(id){
  router.push(`/article/${id}`)
}
</script>

<template>
<div class="article-list">
  <div class="tool">
    发现
  </div>
  <div class="list" v-for="item in article_list" :key="item.id" @click="routeChange(item.id)">
    <div class="box">
      <div class="date">发布于 {{ item.date }}</div>
      <div class="title">{{ item.title }}</div>
      <div class="message">
        <div class="clicks"><img src="../../../assets/svg/view.svg" alt="" width="18" />{{ item.clicks }} 浏览</div>
        <div class="comments"><img src="../../../assets/svg/comment.svg" alt="" width="18"/>{{ item.comments_count }} 评论</div>
        <div class="likes"><img src="../../../assets/svg/heart.svg" alt="" width="18"/>{{ item.likes }} 点赞</div>
      </div>
      <div class="intrduce">这是一篇关于前端开发实践的文章，涵盖了组件设计、样式布局和性能优化的技巧，适合初学者快速入门。这是一篇关于前端开发实践的文章，涵盖了组件设计、样式布局和性能优化的技巧，适合初学者快速入门。,这是一篇关于前端开发实践的文章，涵盖了组件设计、样式布局和性能优化的技巧，适合初学者快速入门。</div>
      <div class="tag-box"><div class="tag" v-for="Tag in item.tagIDs" :key="Tag.id">{{ Tag}}</div>
      </div>
    </div>
    <div class="img">
          <img src="../../../assets/images/cover/cover-1.png" alt="" />
    </div>
  </div>
</div>
</template>


<style scoped>
.article-list{
  display:flex;
  flex-direction:column;
  gap:5px;
  margin-top:20px;
}
.tool{
  width:100%;
  border-bottom:3px dotted #37df37;
  padding:0 0 5px 0;
  font-size:20px;
  font-weight: bold;
}
.list{
  /* opacity: 0; */
  height:230px;
  display:flex;
  flex-direction:row;
  border-radius: 10px;
  box-shadow:0 0 10px 1px rgb(0, 183, 255);
  margin:10px 0;
  position: relative;
  cursor:pointer;
  overflow:hidden;
  transition:all 0.5s ease;
}
.list:hover{
  transform:scale(0.98);
}
.box{
  width:50%;
  border:1px solid rgba(12, 175, 201, 0.329);
  display:flex;
  flex-direction: column;
  transition: all 0.3s ease;
  background-color:var(--article-bkcolor);
  padding:10px 15px;
  gap:8px;
  position: relative;
  border-radius:5px 0 0 5px;
  color:var(--article-dfcolor);
}
.date{
  font-size:15px;
}
.title{
  font-size:20px;
  font-weight: bold;
  color:var(--article-titlecolor);
}
.message{
  display:flex;
  flex-direction: row;
  gap:10px;
}
.clicks,.comments,.likes{
  font-size:14px;
  font-weight: 500;
  display:flex;
  justify-content: center;
  align-items:center;
  gap:1px;
}
.tag-box{
  display:flex;
  flex-direction: row;
  gap:5px;
}
.tag{
  background-color:var(--article-tag-bkcolor);
  padding:3px 5px;
  font-size:13px;
  transition:all 0.5s ease;
}
.tag:hover{
  transform: translateY(-2px);
  box-shadow: 0 3px 6px 1px rgba(0, 0, 0, 0.7);
}
.intrduce{
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  font-size: 18px;
  font-weight:350;
  margin:10px 0;
  max-height:100px;
  overflow:hidden;
  text-overflow: ellipsis;
}
.img{
  width:50%;
  transition: all 0.3s ease;
}
.img img{
  width:100%;
  height:100%;
  border-radius:0 5px 5px 0;
}
.img:hover{
  transform: scale(1.05);
}
</style>
