'use server'

import { cookies } from 'next/headers'
import { isAxiosError } from 'axios'
import { z } from 'zod'

import baseAxios from '../baseAxios'
import { ActionResponse } from '../types'
import { parseApiError } from '@/utils/helpers/parse-api-error'

type Props = {
  usernameOrEmail: string
  password: string
}

const TokenResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
})

const PageDetailResponseSchema = z.object({
  data: TokenResponseSchema,
})

export default async function login({
  usernameOrEmail,
  password,
}: Props): Promise<ActionResponse<{ accessToken: string; refreshToken: string }>> {
  try {
    const response = await baseAxios.post<z.infer<typeof PageDetailResponseSchema>>(
      '/auth/login',
      {
        usernameOrEmail,
        password,
      }
    )

    const validatedResponse = PageDetailResponseSchema.parse(response.data)
    const { accessToken, refreshToken } = validatedResponse.data

    // Guardar el accessToken en la cookie 'session' (httpOnly para seguridad)
    const expires = new Date(Date.now() + 3600 * 1000 * 8) // 8 horas

    const cookieStore = await cookies()
    cookieStore.set('session', accessToken, {
      expires,
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    })

    // Guardar refreshToken en otra cookie (opcional, si lo necesitas)
    if (refreshToken) {
      const refreshExpires = new Date(Date.now() + 3600 * 1000 * 24 * 30) // 30 días
      cookieStore.set('refreshToken', refreshToken, {
        expires: refreshExpires,
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      })
    }

    return {
      status: 'success',
      data: {
        accessToken,
        refreshToken,
      },
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      const responseData = error.response.data
      const humanizedError = parseApiError(responseData)
      const responseCode =
        responseData && typeof responseData === "object" && "code" in responseData
          ? String((responseData as { code?: unknown }).code ?? "")
          : undefined

      return {
        status: 'error',
        errors: [
          {
            title: humanizedError.title,
            message: humanizedError.description,
            code: responseCode || undefined,
            statusCode: error.response.status,
          },
        ],
      }
    }

    const humanizedError = parseApiError(error)
    return {
      status: 'error',
      errors: [
        {
          title: humanizedError.title,
          message: humanizedError.description,
        },
      ],
    }
  }
}

