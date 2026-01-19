import Link from "next/link"

import { PageContainer } from "@/components/display/containers/page-container"
import { PageHeader } from "@/components/display/page-header/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DocImagePlaceholder } from "@/components/docs/doc-image-placeholder"
import { getServerI18n } from "@/utils/i18n/server"

type Copy = {
  back: string
  title: string
  desc: string
  placeholderMenu: string
  purposeTitle: string
  purposeP1: string
  accessTitle: string
  accessBullets: string[]
  placeholderProfile: string
  editTitle: string
  editBullets: string[]
  placeholderEdit: string
  passwordTitle: string
  passwordBullets: string[]
  placeholderPassword: string
  logoutTitle: string
  logoutP1: string
  placeholderLogout: string
  tipPrefix: string
  tipDashboard: string
  tipAnd: string
  tipTransactions: string
  tipSuffix: string
}

export default async function DocsProfilePage() {
  const { language } = await getServerI18n()

  const copy: Copy =
    language === "EN"
      ? {
          back: "Back to Documentation",
          title: "Module: Profile & security",
          desc: "Manage your user data, preferences (currency/time zone/language) and password.",
          placeholderMenu: "[IMAGE / GIF] Avatar menu (sidebar) + options",
          purposeTitle: "Purpose",
          purposeP1:
            "Your profile lets you see your information (username, email, role, status) and manage preferences that affect the entire app, such as currency and time zone.",
          accessTitle: "Access",
          accessBullets: [
            "From the avatar menu in the sidebar: View profile, Edit user, Change password and Sign out.",
            "Profile URL: /dashboard/profile",
            "On the profile you’ll see your data and action buttons in the header (Edit user / Change password).",
          ],
          placeholderProfile: "[IMAGE / GIF] Profile page with action buttons",
          editTitle: "Edit user (preferences)",
          editBullets: [
            "Username: updates the visible name/username.",
            "Preferred currency: affects how amounts are formatted.",
            "Time zone: affects how dates and times are displayed.",
            "Preferred language: affects UI translations across the app.",
            "Important behavior: when saving currency/time zone/language, the session is closed to apply changes in the session token.",
            "Where it impacts: dashboard amounts, tables, tooltips and timestamps in detail pages.",
          ],
          placeholderEdit: "[IMAGE / GIF] Edit user form + warning",
          passwordTitle: "Change password",
          passwordBullets: [
            "Requires current password and new password.",
            "Includes password confirmation to avoid mistakes.",
            "Show/hide password toggle while editing.",
            "Tip: use a unique and strong password (min 8 characters).",
          ],
          placeholderPassword: "[IMAGE / GIF] Change password form",
          logoutTitle: "Sign out",
          logoutP1:
            "You can sign out from the avatar menu. This removes your current session and redirects you to login.",
          placeholderLogout: '[IMAGE / GIF] "Sign out" option in avatar menu',
          tipPrefix:
            "Tip: preference changes affect amount/date formatting in ",
          tipDashboard: "Dashboard",
          tipAnd: " and lists like ",
          tipTransactions: "Transactions",
          tipSuffix: ".",
        }
      : language === "PT"
        ? {
            back: "Voltar para Documentação",
            title: "Módulo: Perfil e segurança",
            desc: "Administre seus dados, preferências (moeda/fuso/idioma) e senha.",
            placeholderMenu: "[IMAGEM / GIF] Menu do avatar (sidebar) + opções",
            purposeTitle: "Propósito",
            purposeP1:
              "O perfil permite ver suas informações (usuário, e-mail, função, status) e administrar preferências que afetam toda a aplicação, como moeda e fuso horário.",
            accessTitle: "Acessos",
            accessBullets: [
              "No menu do avatar no sidebar: Ver perfil, Editar usuário, Alterar senha e Sair.",
              "URL do perfil: /dashboard/profile",
              "No perfil você verá seus dados e botões de ação no cabeçalho (Editar usuário / Alterar senha).",
            ],
            placeholderProfile: "[IMAGEM / GIF] Página de perfil com botões de ação",
            editTitle: "Editar usuário (preferências)",
            editBullets: [
              "Nome de usuário: atualiza o nome/usuário visível.",
              "Moeda preferida: define como os valores são formatados.",
              "Fuso horário: define como datas/horas são exibidas.",
              "Idioma preferido: define as traduções da interface.",
              "Comportamento importante: ao salvar moeda/fuso/idioma, a sessão é encerrada para aplicar mudanças no token.",
              "Impacto: valores do painel, tabelas, tooltips e timestamps em detalhes.",
            ],
            placeholderEdit: "[IMAGEM / GIF] Formulário de editar usuário + aviso",
            passwordTitle: "Alterar senha",
            passwordBullets: [
              "Requer senha atual e nova senha.",
              "Inclui confirmação da senha.",
              "Opção de mostrar/ocultar senha.",
              "Dica: use uma senha única e forte (mínimo 8 caracteres).",
            ],
            placeholderPassword: "[IMAGEM / GIF] Formulário de alterar senha",
            logoutTitle: "Sair",
            logoutP1:
              "Você pode sair pelo menu do avatar. Isso remove a sessão atual e redireciona para o login.",
            placeholderLogout: '[IMAGEM / GIF] Opção "Sair" no menu do avatar',
            tipPrefix: "Dica: mudanças de preferências impactam formatação em ",
            tipDashboard: "Painel",
            tipAnd: " e listas como ",
            tipTransactions: "Transações",
            tipSuffix: ".",
          }
        : {
            back: "Regresar a Documentación",
            title: "Módulo: Perfil y seguridad",
            desc: "Administra tus datos de usuario, preferencias (moneda/zona horaria/idioma) y contraseña.",
            placeholderMenu: "[IMAGEN / GIF] Menú del avatar (sidebar) + opciones",
            purposeTitle: "Propósito",
            purposeP1:
              "El perfil te permite ver tu información (usuario, correo, rol, estado) y administrar preferencias que afectan toda la aplicación, como moneda y zona horaria.",
            accessTitle: "Accesos",
            accessBullets: [
              "Desde el menú del avatar en el sidebar: Ver perfil, Editar usuario, Cambiar contraseña y Cerrar sesión.",
              "URL del perfil: /dashboard/profile",
              "En el perfil verás tus datos y botones de acción en el encabezado (Editar usuario / Cambiar contraseña).",
            ],
            placeholderProfile: "[IMAGEN / GIF] Página de perfil con botones de acción",
            editTitle: "Editar usuario (preferencias)",
            editBullets: [
              "Nombre de usuario: actualiza el nombre visible/usuario del sistema.",
              "Moneda preferida: define cómo se formatean los montos.",
              "Zona horaria: define cómo se muestran fechas y horas.",
              "Idioma preferido: define el idioma de la interfaz.",
              "Comportamiento importante: al guardar cambios de moneda/zona horaria/idioma, se cierra sesión automáticamente para aplicar cambios en el token.",
              "Qué cambia con tus preferencias: montos del dashboard, tablas, tooltips y fechas/hora en detalles.",
            ],
            placeholderEdit: "[IMAGEN / GIF] Formulario de editar usuario + advertencia",
            passwordTitle: "Cambiar contraseña",
            passwordBullets: [
              "Requiere contraseña actual y nueva contraseña.",
              "Incluye confirmación de contraseña para evitar errores.",
              "Opción de mostrar/ocultar contraseñas mientras editas.",
              "Recomendación: usa una contraseña única y segura (mínimo 8 caracteres).",
            ],
            placeholderPassword: "[IMAGEN / GIF] Formulario de cambiar contraseña",
            logoutTitle: "Cerrar sesión",
            logoutP1:
              "Puedes cerrar sesión desde el menú del avatar. Esto elimina la sesión actual y te redirige al login.",
            placeholderLogout: "[IMAGEN / GIF] Opción “Cerrar sesión” en el menú del avatar",
            tipPrefix:
              "Tip: los cambios de preferencias impactan el formateo de montos/fechas en ",
            tipDashboard: "Dashboard",
            tipAnd: " y en listados como ",
            tipTransactions: "Transacciones",
            tipSuffix: ".",
          }

  return (
    <PageContainer>
      <PageHeader
        backTo={{ href: "/dashboard/docs", label: copy.back }}
        title={copy.title}
        description={copy.desc}
      />

      <DocImagePlaceholder title={copy.placeholderMenu} />

      <Card>
        <CardHeader>
          <CardTitle>{copy.purposeTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>{copy.purposeP1}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{copy.accessTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <ul className="list-disc pl-5 space-y-2">
            {copy.accessBullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          <DocImagePlaceholder title={copy.placeholderProfile} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{copy.editTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <ul className="list-disc pl-5 space-y-2">
            {copy.editBullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          <DocImagePlaceholder title={copy.placeholderEdit} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{copy.passwordTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <ul className="list-disc pl-5 space-y-2">
            {copy.passwordBullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          <DocImagePlaceholder title={copy.placeholderPassword} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{copy.logoutTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>{copy.logoutP1}</p>
          <DocImagePlaceholder title={copy.placeholderLogout} />
        </CardContent>
      </Card>

      <div className="text-sm text-muted-foreground">
        {copy.tipPrefix}
        <Link className="underline underline-offset-4" href="/dashboard/docs/dashboard">
          {copy.tipDashboard}
        </Link>
        {copy.tipAnd}
        <Link className="underline underline-offset-4" href="/dashboard/docs/transactions">
          {copy.tipTransactions}
        </Link>
        {copy.tipSuffix}
      </div>
    </PageContainer>
  )
}

