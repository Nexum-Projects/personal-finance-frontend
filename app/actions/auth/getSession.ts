'use server'

import { cookies } from 'next/headers'

// Función simple para verificar si hay sesión
// Si necesitas decodificar el JWT, instala jose: yarn add jose
export default async function getSession(): Promise<boolean> {
  const session = cookies().get('session')?.value
  return !!session
}

