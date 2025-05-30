import {defineStore} from 'pinia'
import {ref} from 'vue'

export const count=defineStore('count',()=>{
    // 切换主题
  const article_count=ref(0);
  const distract_count=ref(0);
  const visitors_count=ref(0);

  return{article_count,distract_count,visitors_count}
},{
  persist:true,
})
