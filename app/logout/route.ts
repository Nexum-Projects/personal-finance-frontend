import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  const cookieStore = await cookies()
  cookieStore.delete("session")
  cookieStore.delete("refreshToken")

  return NextResponse.redirect(new URL("/login", request.url))
}


