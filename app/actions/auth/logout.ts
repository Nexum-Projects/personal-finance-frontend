'use server'

import { cookies } from 'next/headers'
import { ActionResponse } from '../types'

export default async function logout(): Promise<ActionResponse<null>> {
  try {
    cookies().delete('session')
    cookies().delete('refreshToken')
    
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

