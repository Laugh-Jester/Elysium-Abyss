import {defineStore} from 'pinia'
import {ref} from 'vue'
import axios from 'axios'
export const photo=defineStore('photo',()=>{
  const photos=ref([])
  const maxNum=ref(10)
  let length=ref(0)
  const initPhotos=async()=>{
    const res=await axios.get("http://localhost:3000/photo")
    // console.log("photo_walls仓库成功获取数据：",res.data)
    photos.value=res.data
    // console.log(photos.value)


    //填充数据
    length.value = photos.value.length;
        while(length.value<maxNum.value){

      photos.value.push({
        "id":`${length.value}`,
        "photo":"src/assets/images/background/host-4.jpg",
        "content":"有趣的未来仍待探索(☆▽☆)"
      })
      length.value = photos.value.length;
    }
    // console.log(length);
  }
  return{photos,initPhotos}
},{
  persist:true,
})
