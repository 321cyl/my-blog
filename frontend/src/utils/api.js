import axios from 'axios'

// 后端地址
const api = axios.create({
  baseURL: 'http://localhost:3000/api'
})

// 请求前自动带上 token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api