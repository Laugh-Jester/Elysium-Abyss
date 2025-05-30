<script setup>
import {ref,onMounted} from 'vue'
import axios from 'axios'
import router from '@/router'
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
  })
// 鼠标滚动
const getTagNames = (ids) => {
  return ids.map(id => tags.value.find(tag => tag.id == id)?.tag || '')
}
const scrollBox = ref(null)
function handleWheel(e) {
  if (scrollBox.value) {
    scrollBox.value.scrollLeft += e.deltaY
  }
}
function routeChange(id){
  router.push(`/article/${id}`)
}
</script>

<template>
<div class="big-box">
  <div class="sort">随记<button>more</button></div>
  <div class="article" ref="scrollBox"  @wheel.prevent="handleWheel">
    <div class="box" v-for="item in article_list" :key="item.id" @click="routeChange(item.id)">
    <img src="../../../assets/images/cover/cover-1.png" alt=""/>
    <div class="message">
      <div class="date">发布于 {{ item.date }}</div>
      <div class="title">{{ item.title }}</div>
      <div class="small-box">
        <div class="clicks"><img src="../../../assets/svg/view.svg" alt="" width="14" />浏览 {{ item.clicks }}</div>
        <div class="comments"><img src="../../../assets/svg/comment.svg" alt="" width="14"/>评论 {{ item.comments_count }}</div>
      </div>
      <div class="tag-box">
        <div class="tag" v-for="Tag in item.tagIDs" :key="Tag.id">{{ Tag}}</div>
      </div>
  </div>
  </div>
  </div>
</div>
</template>

<style scoped>
.big-box{
  display:flex;
  flex-direction:column;
  gap:5px;
  margin-top:20px;
}
.sort{
  width:100%;
  position:relative;
  border-bottom:3px dotted #37df37;
  padding:0 0 5px 0;
  font-size:20px;
  font-weight: bold;
}
.sort button{
  position:absolute;
  right:0;
  bottom:5px;
  background:none;
  border:none;
  font-size:18px;
}
.article{
  display:flex;
  flex-direction: row;
  max-width:100%;
  overflow:hidden;
}
.box{
  width:35%;
  border:1px solid rgba(12, 175, 201, 0.329);
  border-radius: 5px;
  display:flex;
  flex-direction: column;
  margin:10px;
  cursor:pointer;
  transition: all 0.3s ease;
  background-color:var(--article-bkcolor);
}
.box:hover{
  box-shadow:0 0 10px 2px rgb(52, 50, 148);
}
.message{
  display:flex;
  flex-direction: column;
  padding:10px;
  gap:8px;
  color:var(--article-dfcolor);
}
.date{
  font-size:13px;
  font-weight:200;
}
.title{
  font-size:20px;
  font-weight: bold;
  color:var(--article-titlecolor);
}
.small-box{
  display:flex;
  flex-direction: row;
  gap:10px;
}
.clicks,.comments{
  gap:1px;
  font-size: 13px;
  display:flex;
  justify-content: center;
  align-items:center;
}
.tag-box{
  display:flex;
  flex-direction: row;
  gap:5px;
}
.tag{
  background-color:var(--article-tag-bkcolor);
  padding:3px 5px;
  font-size:12px;
  transition:all 0.5s ease;
}
.tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 3px 6px 1px rgba(0, 0, 0, 0.7);
}
</style>
