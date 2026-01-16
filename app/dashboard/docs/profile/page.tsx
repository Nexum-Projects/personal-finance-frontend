import Link from "next/link"

import { PageContainer } from "@/components/display/containers/page-container"
import { PageHeader } from "@/components/display/page-header/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DocImagePlaceholder } from "@/components/docs/doc-image-placeholder"

export default function DocsProfilePage() {
  return (
    <PageContainer>
      <PageHeader
        backTo={{ href: "/dashboard/docs", label: "Regresar a Documentación" }}
        title="Módulo: Perfil y seguridad"
        description="Administra tus datos de usuario, preferencias (moneda/zona horaria) y contraseña."
      />

      <DocImagePlaceholder title="[IMAGEN / GIF] Menú del avatar (sidebar) + opciones" />

      <Card>
        <CardHeader>
          <CardTitle>Propósito</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            El perfil te permite ver tu información (usuario, correo, rol, estado) y administrar
            preferencias que afectan toda la aplicación, como moneda y zona horaria.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Accesos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Desde el menú del avatar en el sidebar: <b>Ver perfil</b>, <b>Editar usuario</b>,{" "}
              <b>Cambiar contraseña</b> y <b>Cerrar sesión</b>.
            </li>
            <li>
              URL del perfil: <code>/dashboard/profile</code>
            </li>
            <li>
              En el perfil verás tus datos y botones de acción en el encabezado (Editar usuario / Cambiar contraseña).
            </li>
          </ul>
          <DocImagePlaceholder title="[IMAGEN / GIF] Página de perfil con botones de acción" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Editar usuario (preferencias)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <b>Nombre de usuario</b>: actualiza el nombre visible/usuario del sistema.
            </li>
            <li>
              <b>Moneda preferida</b>: define cómo se formatean los montos (USD/GTQ/MXN).
            </li>
            <li>
              <b>Zona horaria</b>: define cómo se muestran fechas y horas (America/Guatemala, etc.).
            </li>
            <li>
              <b>Comportamiento importante</b>: al guardar cambios de moneda o zona horaria, se cierra
              la sesión automáticamente para aplicar los cambios en el token de sesión.
            </li>
            <li>
              <b>Qué cambia con tus preferencias</b>: montos del dashboard, tablas, tooltips y fechas/hora en detalles.
            </li>
          </ul>
          <DocImagePlaceholder title="[IMAGEN / GIF] Formulario de editar usuario + advertencia" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cambiar contraseña</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Requiere <b>contraseña actual</b> y <b>nueva contraseña</b>.
            </li>
            <li>
              Incluye confirmación de contraseña para evitar errores.
            </li>
            <li>
              Opción de <b>mostrar/ocultar</b> contraseñas mientras editas.
            </li>
            <li>
              Recomendación: usa una contraseña única y segura (mínimo 8 caracteres).
            </li>
          </ul>
          <DocImagePlaceholder title="[IMAGEN / GIF] Formulario de cambiar contraseña" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cerrar sesión</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            Puedes cerrar sesión desde el menú del avatar. Esto elimina la sesión actual y te
            redirige al login.
          </p>
          <DocImagePlaceholder title="[IMAGEN / GIF] Opción “Cerrar sesión” en el menú del avatar" />
        </CardContent>
      </Card>

      <div className="text-sm text-muted-foreground">
        Tip: los cambios de preferencias impactan el formateo de montos/fechas en{" "}
        <Link className="underline underline-offset-4" href="/dashboard/docs/dashboard">
          Dashboard
        </Link>{" "}
        y en listados como{" "}
        <Link className="underline underline-offset-4" href="/dashboard/docs/transactions">
          Transacciones
        </Link>
        .
      </div>
    </PageContainer>
  )
}

