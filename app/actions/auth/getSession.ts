'use server'

import { cookies } from 'next/headers'
import { decodeJwt } from 'jose'

type Payload = {
  exp?: number
  iat?: number
  sub?: string
  [key: string]: unknown
}

function decrypt(input: string): Payload | null {
  try {
    const claims = decodeJwt<Payload>(input)
    return claims
  } catch (error) {
    return null
  }
}

/**
 * Obtiene la sesión del usuario decodificando el JWT
 * Similar al proyecto de referencia: no verifica expiración proactivamente,
 * el backend manejará los errores 401 cuando el token expire
 * @returns El payload del JWT si la sesión existe, null si no hay sesión o no se puede decodificar
 */
export default async function getSession(): Promise<Payload | null> {
  const session = cookies().get('session')?.value
  
  if (!session) {
    return null
  }

  return decrypt(session)
}

