import { cookies } from 'next/headers'
import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

const baseAxios = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

baseAxios.interceptors.request.use((config) => {
  const session = cookies().get('session')?.value
  if (session) {
    config.headers.Authorization = `Bearer ${session}`
  }
  return config
})

export default baseAxios

