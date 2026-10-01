<template>
  <div class="admin">
    <div class="header">
      <h1>后台管理</h1>
      <div>
        <span v-if="username" class="welcome">👤 {{ username }}</span>
        <button v-if="token" class="logout" @click="handleLogout">退出登录</button>
      </div>
    </div>

    <!-- 未登录提示 -->
    <div v-if="!token" class="not-login">
      <p>你还未登录</p>
      <router-link to="/login" class="btn-login">去登录</router-link>
    </div>

    <!-- 已登录：显示发布表单 -->
    <div v-else>
      <div class="card">
        <h2>📝 发布新文章</h2>

        <div class="form-item">
          <label>标题</label>
          <input v-model="form.title" type="text" placeholder="文章标题" />
        </div>

        <div class="form-item">
          <label>分类</label>
          <input v-model="form.category" type="text" placeholder="如：随笔 / 前端 / 后端" />
        </div>

        <div class="form-item">
          <label>标签（逗号分隔）</label>
          <input v-model="form.tagsStr" type="text" placeholder="如：Vue,JavaScript" />
        </div>

        <div class="form-item">
          <label>内容（支持 Markdown）</label>
          <textarea v-model="form.content" rows="12" placeholder="# 标题&#10;&#10;正文内容..."></textarea>
        </div>

        <button class="btn-publish" @click="handlePublish" :disabled="publishing">
          {{ publishing ? '发布中...' : '发布' }}
        </button>

        <p v-if="message" :class="['message', messageType]">{{ message }}</p>
      </div>

      <div class="card">
        <h2>📚 已发布文章</h2>

        <p v-if="posts.length === 0">暂无文章</p>

        <div v-else>
          <div v-for="post in posts" :key="post._id" class="post-row">
            <div class="post-info">
              <strong>{{ post.title }}</strong>
              <span class="post-meta">{{ post.category }} · {{ formatDate(post.createdAt) }}</span>
            </div>
            <button class="btn-delete" @click="handleDelete(post._id)">删除</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../utils/api'

const router = useRouter()

const token = ref(localStorage.getItem('token') || '')
const username = ref(localStorage.getItem('username') || '')

const form = ref({
  title: '',
  category: '',
  tagsStr: '',
  content: ''
})

const publishing = ref(false)
const message = ref('')
const messageType = ref('success')

const posts = ref([])

async function loadPosts() {
  try {
    const res = await api.get('/posts')
    posts.value = res.data
  } catch (err) {
    console.error(err)
  }
}

async function handlePublish() {
  if (!form.value.title || !form.value.content) {
    message.value = '标题和内容不能为空'
    messageType.value = 'error'
    return
  }

  publishing.value = true
  message.value = ''

  try {
    const tags = form.value.tagsStr
      .split(',')
      .map(t => t.trim())
      .filter(t => t)

    await api.post('/posts', {
      title: form.value.title,
      content: form.value.content,
      category: form.value.category || '未分类',
      tags
    })

    message.value = '✅ 发布成功'
    messageType.value = 'success'

    // 清空表单
    form.value = { title: '', category: '', tagsStr: '', content: '' }

    // 刷新列表
    await loadPosts()
  } catch (err) {
    message.value = err.response?.data?.msg || '发布失败'
    messageType.value = 'error'

    // token 过期 → 跳登录
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      token.value = ''
    }
  } finally {
    publishing.value = false
  }
}

async function handleDelete(id) {
  if (!confirm('确定删除这篇文章吗？')) return

  try {
    await api.delete(`/posts/${id}`)
    await loadPosts()
  } catch (err) {
    alert('删除失败')
  }
}

function handleLogout() {
  localStorage.removeItem('token')
  localStorage.removeItem('username')
  token.value = ''
  username.value = ''
  router.push('/')
}

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

onMounted(() => {
  if (token.value) {
    loadPosts()
  }
})
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.header h1 {
  font-size: 24px;
}

.welcome {
  margin-right: 12px;
  color: #666;
}

.logout {
  padding: 6px 14px;
  background: #f0f0f0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: #666;
}

.logout:hover {
  background: #e0e0e0;
}

.not-login {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 8px;
}

.btn-login {
  display: inline-block;
  margin-top: 16px;
  padding: 10px 24px;
  background: #409eff;
  color: white;
  text-decoration: none;
  border-radius: 4px;
}

.card {
  background: white;
  padding: 24px 28px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.card h2 {
  font-size: 18px;
  margin-bottom: 20px;
}

.form-item {
  margin-bottom: 16px;
}

label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  color: #555;
}

input,
textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  font-family: inherit;
  box-sizing: border-box;
}

textarea {
  font-family: Consolas, Monaco, monospace;
  resize: vertical;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: #409eff;
}

.btn-publish {
  padding: 10px 30px;
  background: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 15px;
}

.btn-publish:disabled {
  background: #a0cfff;
  cursor: not-allowed;
}

.message {
  margin-top: 14px;
  font-size: 14px;
}

.message.success {
  color: #67c23a;
}

.message.error {
  color: #f56c6c;
}

.post-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.post-row:last-child {
  border-bottom: none;
}

.post-meta {
  margin-left: 12px;
  color: #999;
  font-size: 13px;
}

.btn-delete {
  padding: 4px 12px;
  background: #fef0f0;
  color: #f56c6c;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
}

.btn-delete:hover {
  background: #fde2e2;
}
</style>