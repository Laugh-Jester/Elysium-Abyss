import {defineStore} from 'pinia'
import axios from 'axios'
import {ref} from 'vue'

export const article=defineStore('article',()=>{
  const article_list=ref([])
  const article_search=ref('')
  const article_find=ref([])
  const new_article=ref({})
  //初始化
  const fetchAllArticles=async()=>{
    const res=await axios.get('http://localhost:3000/articles')
    article_list.value=res.data
    console.log("仓库article获取数据成功",article_list.value)
  }
  //更新评论
  const updateCommentsCount=async(id,newCount)=>{
    await axios.patch(`http://localhost:3000/articles/?id=${id}`,{comments_count:newCount})
    if(this.articleMap[id]){
      this.articleMap[id].comments_count=newCount
    }
  }
  //更新搜素内容
  const updateSearchContent=async()=>{
    if (article_search.value==""){
      article_find.value=[]
      return
    }
    article_find.value=article_list.value.filter(article=>article.title.toLowerCase().includes(article_search.value.toLowerCase()))
  }
  const clearData=()=>{
    article_find.value=[]
    article_search.value=''
  }
  //上传文章
  const upload=async()=>{
    //报错
    // if(!new_article.value.length){
    //   return
    // }
    // console.log("运行成功")
    if (!new_article.value.title){
      alert("标题不可为空")
      return
    }
    if (!new_article.value.content){
      alert("文章内容不可为空")
      return
    }
    if(!new_article.value.cover){
      alert("请上传你的封面")
      return
    }
    const today = new Date()
    const formatted = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
    console.log("article仓库-upload运行成功",{...new_article,
      date:formatted,
      comments_count: 0,
      clicks: 0,
      likes: 0,
      isTop: false,
      id:new Date()
    })
    await axios.post(`http://localhost:3000/articles`,{...new_article.value,
      date:formatted,
      comments_count: 0,
      clicks: 0,
      likes: 0,
      isTop: false,
      id:Date.now()
    })
    console.log("上传成功")
    new_article.value={}
  }
  return {article_list,article_search,fetchAllArticles,updateCommentsCount,article_find,updateSearchContent,clearData,new_article,upload}
},{
  persist:false,
})
