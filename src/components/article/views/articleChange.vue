<script setup>
import { ref, onMounted,watch } from 'vue';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js'
import 'highlight.js/styles/monokai.css'
import axios from 'axios'
import { useRoute } from 'vue-router';
const route=useRoute()
const mdContent = ref('');  // 用来存储解析后的Markdown内容
const prop=defineProps({
	id:Number
})

onMounted(async () => {
  const res=await axios.get(`http://localhost:3000/articles?id=${prop.id}`)
  const response = await fetch(res.data[0].content);  // 通过 HTTP 请求获取 .md 文件
  const content = await response.text();  // 读取文件内容
  mdContent.value = parseMarkdown(content);  // 解析Markdown为HTML
});

const parseMarkdown = (content) => {
  const md = new MarkdownIt({
        highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return `<pre class="hljs"><code>${hljs.highlight(str, { language: lang }).value}</code></pre>`
        } catch (__) {//注释
          }
      }
      return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`
    }
  })
  return md.render(content);  // 将Markdown内容渲染为HTML
};
const loadArticle = async(id) => {
  // 加载文章数据的逻辑
  console.log("目前子页面的id为",id)
  try {
    // 关键修改：使用传入的 id 参数，而不是 prop.id
    const res = await axios.get(`http://localhost:3000/articles?id=${id}`)
    const response = await fetch(res.data[0].content);
    const content = await response.text();
    mdContent.value = parseMarkdown(content);
  } catch (error) {
    console.error('加载文章失败:', error)
  }
}
watch(() => route.params.id, (newId, oldId) => {
  if (newId !== oldId) {
    // 重新加载数据或执行其他逻辑
    loadArticle(newId)
  }
}, { immediate: true })
</script>

<template>
  <div class="page-container">
    <div v-html="mdContent"  class="MD pixel"></div>
  </div>
</template>


<style scoped>
.page-container{
  width:100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding:10px clamp(16px,10vw,200px) 20px clamp(16px,10vw,200px);
}
.MD{
  line-height:1.75;
  width:100%;
  color:var(--article-content-dfcolor);
  border:2px dashed var(--article-content-bdcolor);
  border-radius: 5px;
  padding:10px 20px 10px 20px;
  background-color:var(--article-content-bkcolor);
  box-shadow: 0 0 15px 2px rgb(255, 255, 255);
}
:deep(code){
  padding:10px;
  font-family: 'Pixelify_Sans','ipix',sans-serif;
}
:deep(pre){
  background-color:black;
}
</style>
