<template>
  <div class="detail" v-if="post">
    <router-link to="/" class="back">← 返回首页</router-link>

    <h1>{{ post.title }}</h1>

    <div class="meta">
      <span class="category">{{ post.category }}</span>
      <span v-for="tag in post.tags" :key="tag" class="tag">#{{ tag }}</span>
      <span class="date">{{ formatDate(post.createdAt) }}</span>
    </div>

    <article class="content" v-html="renderedContent"></article>
  </div>

  <div v-else-if="loading" class="loading">加载中...</div>
  <div v-else class="not-found">文章不存在</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'
import api from '../utils/api'

const route = useRoute()
const post = ref(null)
const loading = ref(true)

// 配置 marked 用 highlight.js 渲染代码块
marked.setOptions({
  highlight: function (code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value
    }
    return hljs.highlightAuto(code).value
  }
})

// Markdown 转 HTML
const renderedContent = computed(() => {
  if (!post.value) return ''
  return marked.parse(post.value.content)
})

onMounted(async () => {
  try {
    const res = await api.get(`/posts/${route.params.id}`)
    post.value = res.data
  } catch (err) {
    console.error('获取文章失败:', err)
  } finally {
    loading.value = false
  }
})

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
</script>

<style scoped>
.back {
  display: inline-block;
  color: #409eff;
  text-decoration: none;
  margin-bottom: 20px;
}

h1 {
  font-size: 28px;
  margin-bottom: 16px;
}

.meta {
  font-size: 13px;
  color: #888;
  margin-bottom: 30px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
}

.category {
  background: #e8f4ff;
  color: #409eff;
  padding: 2px 8px;
  border-radius: 4px;
  margin-right: 8px;
}

.tag {
  margin-right: 6px;
  color: #666;
}

.date {
  float: right;
}

/* Markdown 内容样式 */
.content {
  background: white;
  padding: 30px 40px;
  border-radius: 8px;
  line-height: 1.8;
  color: #333;
}

.content :deep(h1),
.content :deep(h2),
.content :deep(h3) {
  margin: 20px 0 12px;
}

.content :deep(p) {
  margin: 12px 0;
}

.content :deep(code) {
  background: #f5f5f5;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: Consolas, Monaco, monospace;
  font-size: 0.9em;
}

.content :deep(pre) {
  background: #f6f8fa;
  padding: 16px;
  border-radius: 6px;
  overflow-x: auto;
  margin: 16px 0;
}

.content :deep(pre code) {
  background: none;
  padding: 0;
}

.content :deep(blockquote) {
  border-left: 4px solid #409eff;
  padding-left: 16px;
  color: #666;
  margin: 16px 0;
}

.content :deep(ul),
.content :deep(ol) {
  margin: 12px 0 12px 24px;
}

.loading,
.not-found {
  text-align: center;
  padding: 60px 20px;
  color: #888;
}
</style>