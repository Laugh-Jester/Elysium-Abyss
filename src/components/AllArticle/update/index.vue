<script setup>
import { onMounted } from 'vue'
import { UploadFilled } from '@element-plus/icons-vue'
import {theme,article,tag} from "@/stores"
const Article=article()
const Theme=theme()
const Tag=tag()
onMounted(async()=>{
  Tag.fetchAllTags()
  Tag.update_tag()
})
const handleCoverChange = (file) => {
  console.log('上传的封面文件：', file)
  // 你可以在这里保存封面文件到 Article.new_article.cover 或其他字段
}

</script>

<template>
  <div class="plum-wrapper">
    <el-card class="plum-card">
      <template #header>
        <div class="plum-title" v-if="!Theme.isDark">✿ 梅语 • 发布文章</div>
        <div class="plum-title" v-else>✦ 黑域 • 发布文章</div>
      </template>

      <el-form :model="form" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="Article.new_article.title" placeholder="梅落时，我写下你名字…" v-if="!Theme.isDark"/>
          <el-input v-model="Article.new_article.title" placeholder="命名你的篇章…" v-else/>
        </el-form-item>

        <el-form-item label="作者">
          <el-input v-model="Article.new_article.author" placeholder="谁执笔，写红尘一梦？" v-if="!Theme.isDark"/>
          <el-input v-model="Article.new_article.author" placeholder="署上你的名字…" v-else/>
        </el-form-item>

        <el-form-item label="标签">
          <el-select v-model="Article.new_article.tags" multiple placeholder="选些红尘标签吧~" style="width: 100%;" v-if="!Theme.isDark">
            <el-option v-for="item in Tag.tags" :key="item.id" :label="item.tag" :value="item.tag" />
          </el-select>
          <el-select v-model="Article.new_article.tags" multiple placeholder="选择一些暗影之词…" style="width: 100%;" v-else>
            <el-option v-for="item in Tag.tags" :key="item.id" :label="item.tag" :value="item.tag" />
          </el-select>
            <el-input
              style="margin-top:20px"
              v-model="Tag.new_tag"
              placeholder="输入新标签，回车添加"
              @keyup.enter="Tag.upload();Tag.update_tag()"
            >
              <template #append>
                <el-button @click="Tag.upload();Tag.update_tag()">添加</el-button>
              </template>
            </el-input>
        </el-form-item>
        <el-form-item label="封面图">
          <el-upload
            class="upload-demo"
            drag
            action="#"
            :auto-upload="false"
            :on-change="handleCoverChange"
          >
            <el-icon><UploadFilled /></el-icon>
            <div class="el-upload__text">点击或拖入一幅画吧</div>
          </el-upload>
        </el-form-item>

        <el-form-item label="内容">
          <el-input
            type="textarea"
            v-model="Article.new_article.content"
            placeholder="笔落惊梅，一页心绪…"
            :rows="10"
            v-if="!Theme.isDark"
          />
                    <el-input
            type="textarea"
            v-model="Article.new_article.content"
            placeholder="黑夜将文字藏入灵魂…"
            :rows="10"
            v-else
          />
        </el-form-item>

        <el-form-item>
          <el-button type="danger" @click="Article.upload()" v-if="!Theme.isDark">❀ 发布</el-button>
          <el-button type="danger" @click="Article.upload()" v-else>✧ 发布</el-button>
          <el-button>重写</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>



<style scoped>
.plum-wrapper {
  background: var(--upload-bd);
  min-height: 100vh;
  padding: 40px 20px;
  font-family: 'STKaiti', 'Microsoft YaHei', sans-serif;
  color: var(--upload-color);
}

.plum-card {
  backdrop-filter: blur(8px);
  background-color: var(--upload-card-bd);
  border: 2px solid var(--upload-bdcolor);
  border-radius: 16px;
  padding: 20px;
  margin-top:30px;
}

.plum-title {
  font-size: 24px;
  font-weight: bold;
  color: var(--upload-title-color);
  text-align: center;
  letter-spacing: 2px;
}

.upload-demo {
  width: 100%;
}

/* .el-form-item__label {
  color: var(--upload-tag-color);
}
.el-input__inner,
.el-textarea__inner {
  background-color: #222 !important;
  color: #f0f0f0;
  border: 1px solid #444;
}
.el-select,
.el-upload {
  --el-border-color: #444;
}

.el-upload__text {
  color: #aaa;
}

.el-form-item__label {
  color: #888;
} */

.el-button {
  background-color: var(--upload-btn-bkcolor);
  color:var(--upload-btn-color);
  border-color:var(--upload-btn-bdcolor);
}

.el-button:hover {
  background-color: #7f39fb;
  border-color: #7f39fb;
}
</style>
