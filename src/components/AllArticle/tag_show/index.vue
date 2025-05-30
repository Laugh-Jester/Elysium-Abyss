<script setup>
import {onMounted,ref} from 'vue'
import {tag} from '@/stores/modules/tag.js'
const scrollBox = ref(null)
function handleWheel(e) {
  if (scrollBox.value) {
    scrollBox.value.scrollLeft += e.deltaY
  }
}
const Tag=tag();
onMounted(async()=>{
  await Tag.fetchAllTags()
  Tag.update_tag();
})
</script>

<template>
  <div class="body">
    <div class="img"></div>
    <div class="content">
      <div class="tag_list" ref="scrollBox"  @wheel.prevent="handleWheel">
        <router-link  class="tag_name" v-for="item in Tag.tags" :key=item.id :to="`/all/tag/${item.id}`">
          {{ item.tag }} <span style="font-size:13px;font-weight:bold;color:var(--tag-count-color);">({{ item.count }})</span>
        </router-link>
      </div>
      <router-view></router-view>
    </div>
  </div>
</template>

<style scoped>
.body{
  background-color: var(--tag-body-bkcolor);
}
.img{
  width:100%;
  height:7vh;
}
.content{
  width:100%;
  height:93vh;
  background-color:var(--tag-content-1-bkcolor);
  /* background-color:black; */
  padding:10px 3% 0 5%;
}
.tag_list{
  display:flex;
  margin:0 5px;
  flex-direction: row;
  overflow-x: scroll; /* ✅ 开启横向滚动 */
  overflow-y: hidden; /* ✅ 禁止纵向滚动 */
  max-width:100%;
  perspective:10000px;
}
.tag_list::-webkit-scrollbar {
  display: none;
}
.tag_list a.router-link-active{
  background-color:var(--tag-active-bkcolor);
}
.tag_name {
  padding: 3px 10px;
  flex-shrink: 0;
  margin-right: 8px;
  background-color: var(--tag-unactive-bkcolor);
  text-align: center;
  line-height: 50px;
  color: var(--tag-text-color);
  border-radius: 6px 6px 0 0;
  transition: transform 0.8s ease, box-shadow 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transform-style: preserve-3d;
}

.tag_name:hover {
  transform: rotateX(25deg);
  box-shadow: 0 8px 16px var(--tag-hover-shadow);
  cursor: pointer;
}

</style>
