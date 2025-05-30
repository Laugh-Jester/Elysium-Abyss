import {defineStore} from 'pinia'
import {ref} from 'vue'


export const theme=defineStore('theme',()=>{
    // 切换主题
    const isDark=ref(false)
    const themeChange=()=>{
      isDark.value=!isDark.value
      console.log(isDark.value)
    }

  return{isDark,themeChange}
})
