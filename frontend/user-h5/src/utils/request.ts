import axios from 'axios'
import { Toast } from 'antd-mobile'
import { getToken, removeToken } from './auth'

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000
})

request.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    if (error.response?.status === 401) {
      removeToken()
      window.location.href = '/login'
      Toast.show('登录已过期，请重新登录')
    } else {
      Toast.show(error.response?.data?.message || '请求失败')
    }
    return Promise.reject(error)
  }
)

export default request
