<template>
  <div class="login">
    <h1>后台登录</h1>

    <form @submit.prevent="handleLogin">
      <div class="form-item">
        <label>用户名</label>
        <input v-model="username" type="text" placeholder="请输入用户名" required />
      </div>

      <div class="form-item">
        <label>密码</label>
        <input v-model="password" type="password" placeholder="请输入密码" required />
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? '登录中...' : '登录' }}
      </button>

      <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../utils/api'

const router = useRouter()

const username = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')

async function handleLogin() {
  loading.value = true
  errorMsg.value = ''

  try {
    const res = await api.post('/auth/login', {
      username: username.value,
      password: password.value
    })

    localStorage.setItem('token', res.data.token)
    localStorage.setItem('username', res.data.username)

    router.push('/admin')
  } catch (err) {
    errorMsg.value = err.response?.data?.msg || '登录失败，请稍后重试'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login {
  max-width: 400px;
  margin: 60px auto;
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

h1 {
  text-align: center;
  margin-bottom: 30px;
  font-size: 22px;
}

.form-item {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  color: #555;
}

input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: #409eff;
}

button {
  width: 100%;
  padding: 12px;
  background: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 15px;
  cursor: pointer;
  margin-top: 10px;
}

button:hover:not(:disabled) {
  background: #3078d0;
}

button:disabled {
  background: #a0cfff;
  cursor: not-allowed;
}

.error {
  color: #f56c6c;
  text-align: center;
  margin-top: 15px;
  font-size: 14px;
}
</style>