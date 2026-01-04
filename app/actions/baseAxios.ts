import { cookies } from 'next/headers'
import axios from 'axios'
import { env } from '@/utils/env'

const baseAxios = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
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

