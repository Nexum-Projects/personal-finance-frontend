import { Suspense } from "react"
import { ResetPasswordClient } from "./reset-password-client"

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-muted-foreground">Cargando...</div>}>
      <ResetPasswordClient />
    </Suspense>
  )
}


