<script setup>
import {ref,onMounted,watch} from 'vue'
import MarkdownViewer from './views/articleChange.vue'
import axios from 'axios'
import { useRoute } from 'vue-router';
const route=useRoute()
const id = ref(route.params.id)
const message=ref([])
onMounted(async()=>{
  const res=await axios.get('http://localhost:3000/articles')
  message.value=res.data.filter(e=>e.id==id.value)[0]
})
const loadArticle = async(id) => {
  // 加载文章数据的逻辑
  console.log("目前文章id为",id)
  const res=await axios.get(`http://localhost:3000/articles/${id}`)
  message.value=res.data
}
watch(() => route.params.id, (newId, oldId) => {
  if (newId !== oldId) {
    // 重新加载数据或执行其他逻辑
    loadArticle(newId)
  }
}, { immediate: true })
</script>

<template>
  <div >
    <div class="top">
      <div class="message">
        <div>{{ message.title }}</div>
        <div>{{ message.date }}</div>
        <div>clicks:{{ message.clicks }} | likes:{{ message.likes }}</div>
      </div>
    </div>

    <div class="body">
      <MarkdownViewer :id="id"/>
    </div>
  </div>
</template>

<style scoped>
.top{
  width:100%;
  height:42vh;
  background-image:var(--article-bkurl);
  background-size:100% 220%;
  position: relative;
  background-position: center 25%;
  background-repeat: no-repeat;
}
.message{
  display:flex;
  padding:10px;
  padding-left:0;
  flex-direction: column;
  min-width:100px;
  min-height:10px;
  font-size:18px;
  position:absolute;
  bottom:0;
  left:clamp(16px,10vw,200px);
  color:var(--article-msg-color);
  font-family: "ZCOOL KuaiLe", sans-serif;
  font-weight: 400;
  font-style: normal;
}

.body{
  background-color:var(--article-body-bkcolor);
  min-height:58vh;
}
</style>
