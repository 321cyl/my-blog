<template>
  <div class="home">
    <h1>📚 文章列表</h1>

    <p v-if="loading">加载中...</p>

    <p v-else-if="posts.length === 0">暂无文章</p>

    <div v-else class="posts">
      <router-link
        v-for="post in posts"
        :key="post._id"
        :to="`/post/${post._id}`"
        class="post-card"
      >
        <h2>{{ post.title }}</h2>
        <div class="meta">
          <span class="category">{{ post.category }}</span>
          <span v-for="tag in post.tags" :key="tag" class="tag">#{{ tag }}</span>
          <span class="date">{{ formatDate(post.createdAt) }}</span>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../utils/api'

const posts = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await api.get('/posts')
    posts.value = res.data
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
h1 {
  margin-bottom: 24px;
  font-size: 24px;
}

.post-card {
  display: block;
  background: white;
  padding: 20px 24px;
  margin-bottom: 16px;
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  transition: box-shadow 0.2s;
}

.post-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.post-card h2 {
  font-size: 18px;
  margin-bottom: 10px;
  color: #222;
}

.meta {
  font-size: 13px;
  color: #888;
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
</style>