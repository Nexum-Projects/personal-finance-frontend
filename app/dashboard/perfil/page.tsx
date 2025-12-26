"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User } from "lucide-react"

export default function PerfilPage() {
  const [username, setUsername] = useState<string>("")
  const [email, setEmail] = useState<string>("")

  useEffect(() => {
    const getUsernameFromToken = () => {
      const cookies = document.cookie.split(";")
      const sessionCookie = cookies.find((c) => c.trim().startsWith("session="))

      if (sessionCookie) {
        try {
          const token = sessionCookie.split("=")[1]
          const payload = JSON.parse(atob(token.split(".")[1]))
          setUsername(payload?.username || payload?.sub || "")
          setEmail(payload?.email || "")
        } catch {
          setUsername("")
        }
      }
    }

    getUsernameFromToken()
  }, [])

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Mi Perfil</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona tu información personal
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground">
                <User className="h-8 w-8" />
              </div>
              <div>
                <CardTitle>{username || "Usuario"}</CardTitle>
                <CardDescription>{email || "No hay email disponible"}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Nombre de usuario</Label>
              <Input
                id="username"
                value={username}
                disabled
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                disabled
                className="bg-muted"
              />
            </div>
            <div className="pt-4">
              <Button disabled>
                Actualizar Perfil
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                La funcionalidad de actualización de perfil estará disponible próximamente.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

