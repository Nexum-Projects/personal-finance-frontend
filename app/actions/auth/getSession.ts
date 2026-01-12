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
    // Invalidar sesión si el JWT está expirado (exp en segundos)
    if (typeof claims.exp === "number" && claims.exp * 1000 <= Date.now()) {
      return null
    }
    return claims
  } catch (error) {
    return null
  }
}

/**
 * Obtiene la sesión del usuario decodificando el JWT
 * Verifica expiración con `exp` para que, al expirar el token, la sesión sea `null`
 * @returns El payload del JWT si la sesión existe, null si no hay sesión o no se puede decodificar
 */
export default async function getSession(): Promise<Payload | null> {
  const cookieStore = await cookies()
  const session = cookieStore.get('session')?.value
  
  if (!session) {
    return null
  }

  return decrypt(session)
}

