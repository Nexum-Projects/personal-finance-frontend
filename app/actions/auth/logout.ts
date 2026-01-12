'use server'

import { cookies } from 'next/headers'
import { ActionResponse } from '../types'

export default async function logout(): Promise<ActionResponse<null>> {
  try {
    const cookieStore = await cookies()
    cookieStore.delete('session')
    cookieStore.delete('refreshToken')
    
    return {
      status: 'success',
      data: null,
    }
  } catch (error) {
    return {
      status: 'error',
      errors: [
        {
          title: 'Error interno',
          message: 'Ocurrió un error al intentar cerrar sesión',
        },
      ],
    }
  }
}

