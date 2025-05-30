import {defineStore} from 'pinia'
import axios from 'axios'
import {ref} from 'vue'

export const tag=defineStore('tag',()=>{
  const tags=ref([])
  const article_list=ref([])
  let new_tag=ref('')
  //初始化
  const fetchAllTags=async()=>{
    const res=await axios.get('http://localhost:3000/tags')
    tags.value=res.data
    const res1=await axios.get('http://localhost:3000/articles')
    article_list.value=res1.data
    // console.log('article_list',article_list.value[0].id)
  }
  //初始化数量
  const update_tag=()=>{
    article_list.value.forEach(article=>{
                // console.log('4号位成功',article_list)
      article.tagIDs.forEach(async(tagId)=>{
        // console.log('5号运行成功',article)
        const tag=tags.value.find(t=>t.id==tagId);
        // console.log('6号运行成功',tags.value.find(t=>t.id==tagId))
        if(tag){
          if(!tag.article.includes(article.id)){
          // console.log('3号位成功')
          tag.count+=1;
          tag.article.push(article.id)
          console.log('7号运行成功',tag.id)
          await axios.put(`http://localhost:3000/tags/${tag.id}`,{id:tag.id,tag:tag.tag,article:tag.article,count:tag.count})
          // await axios.patch(`http://localhost:3000/tags/${tag.id}`,{id:tag.id,tag:tag.tag,article:[],count:0})
          // console.log(res)
        }}
      })
    })
        // console.log('2号位成功',tags)
  }
  //新增标签
  const upload=async()=>{
    if(!new_tag.value){
      alert("请输入正确的标签")
      return
    }
    //待做事件：检查错误：1.如果标签重复
    // console.log("tag仓库-upload函数运行成功",{tag:new_tag.value,
    //   count:0,
    //   article:[],
    //   id:Date.now(),
    // })
    await axios.post(`http://localhost:3000/tags`,{tag:new_tag.value,
      count:0,
      article:[],
      id:Date.now(),
    })
    new_tag.value=''
  }

  return {tags,fetchAllTags,update_tag,upload,new_tag}
},{
  persist:true,
})
