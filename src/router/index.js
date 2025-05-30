import { createRouter, createWebHashHistory } from 'vue-router'
import home from '@/components/host/index.vue'
import desk from '@/components/toplist/index.vue'
import register from '@/components/login/index.vue'
import article from '@/components/article/index.vue'
import Msgbd from '@/components/social/MessageBoards.vue'
import sort from '@/components/AllArticle/update/index.vue'
import tag from '@/components/AllArticle/tag_show/index.vue'
import game from '@/components/amusement/FunGame.vue'
import music from '@/components/amusement/MyMusic.vue'
import tag_content from '@/components/AllArticle/tag_show/view/tag_content.vue'
// import newhome from '@/components/host/NewHome.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  scrollBehavior(){
    return {top:0}
  },
  routes: [
    {path:'/',component:desk,
      redirect:'/home',
      children:[
        // {path:'/home',component:home},
        {path:'/home',component:home},
        {path:'/article/:id',component:article},
        {path:'/social/Msgbd',component:Msgbd},
        {path:'/all/sort',component:sort},
        {path:'/all/tag',component:tag,
          redirect:'/all/tag/1',
          children:[{path:'/all/tag/:id',component:tag_content}]
        },
        {path:'/amusement/game',component:game},
        {path:'/amusement/music',component:music},
          ]
    },
    {path:'/login',component:register},
  ],
})

export default router
