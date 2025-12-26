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

// Interceptor de respuesta para manejar errores de autenticación
baseAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Si es un error 401 (Unauthorized) o 403 (Forbidden), cerrar sesión
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Eliminar cookies de sesión
      cookies().delete('session')
      cookies().delete('refreshToken')
    }
    return Promise.reject(error)
  }
)

export default baseAxios

