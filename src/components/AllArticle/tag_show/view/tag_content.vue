<script setup>
import { ref, watch, onMounted } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'
import router from '@/router'

const route = useRoute()
const id = ref(route.params.id)
let articles = ref([])
const article_list = ref([])
const tag = ref(null)
const tag_list=ref([])

const getTagNames = (ids) => {
  return ids.map(id => tag_list.value.find(tag => tag.id == id)?.tag || '')
}

function routeChange(id){
  router.push(`/article/${id}`)
}
async function fetchData(tagId) {
  const res = await axios.get(`http://localhost:3000/articles`)
  article_list.value = res.data
  const res1 = await axios.get(`http://localhost:3000/tags/?id=${tagId}`)
  tag.value = res1.data[0]
  const res2=await axios.get('http://localhost:3000/tags')
  tag_list.value=res2.data
  articles.value=[]
  // console.log('这里是tag',tag.value)
  if (tag.value && tag.value.article) {
    tag.value.article.forEach(id => {
      article_list.value.forEach(article => {
        if (article.id === id) {
          article.tagIDs = getTagNames(article.tagIDs)
          articles.value.push(article)
        }
      })
    })
  }
  // console.log('articles:', articles.value)
  // console.log('这里是id',id.value)
}

// 组件第一次挂载时加载数据
onMounted(() => {
  fetchData(id.value)
})

// 监听路由参数变化，重新加载数据
watch(() => route.params.id, (newId) => {
  id.value = newId
  fetchData(newId)
})
</script>


<template>
<div class="body">

  <div class="title">
    <div v-if="tag">
      <h1>标签 —— <span style="color:var(--current-tag-color);">{{ tag.tag }}</span></h1>
    </div>
    <div v-else>加载中...</div>
  </div>

  <div class="article_list">
    <div class="box" v-for="item in articles" :key=item.id @click="routeChange(item.id)">
      <img :src="item.cover" alt=""/>
      <div class="message">
        <h3>{{item.title}}</h3>
        <!-- <div class="tag">{{ getTagNames(item.tagIDs) }}</div> -->
        <div class="tag-box">
          <span v-for="Tag in item.tagIDs" :key="Tag.id">{{ Tag }}</span>
        </div>
        <div class="date">{{ item.date }}</div>
      </div>
    </div>
  </div>

  <div class="footer">
    {{ }}
  </div>
</div>
</template>

<style scoped>
.body{
  padding:2% 3%;
  height:80vh;
  background-color:var(--tag-content-2-bkcolor);
  color:var(--article-text-color);
}
.title{
  margin-bottom:20px;
}
.article_list{
  display:flex;
  flex-wrap:wrap;
  flex-direction: row;
  gap:40px;
  width:100%;
}
.box {
  display: flex;
  flex-direction: row;
  width: 47%;
  border-radius: 10px;
  background-color: var(--tag-content-3-bkcolor);
  box-shadow: 0 4px 12px 1px var(--tag-content-shadow);
  padding: 10px;
  gap: 10px;
  transition: all 0.3s ease;
}

.box:hover {
  box-shadow: 0 6px 18px 3px var(--tag-content-shadow);
  border-color: var(--tag-active-bkcolor);
  cursor: pointer;
}

.box img {
  width: 30%;
  transition: transform 0.3s ease;
}

.box img:hover {
  transform: scale(1.03);
}

.message{
  display:flex;
  width:69%;
  flex-direction: column;
  gap:10px;
  position: relative;
}
.tag-box{
  display:flex;
  flex-direction: row;
  flex-wrap:wrap;
}
.tag-box span {
  display: inline-block;
  padding: 4px 8px;
  margin: 4px;
  color: var(--article-tag-color);
  background-color: var(--tag-content-4-bkcolor);
  border-radius: 5px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.tag-box span:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px var(--tag-hover-shadow);
  cursor: pointer;
}

.date{
  position:absolute;
  bottom:2px;
  right:0;
  font-size:18px;
  font-weight: bold;
}
</style>
