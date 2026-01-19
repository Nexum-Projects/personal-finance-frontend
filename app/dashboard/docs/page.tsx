import Link from "next/link"
import {
  BookOpen,
  LayoutDashboard,
  Wallet,
  FolderTree,
  Receipt,
  ArrowLeftRight,
  Calendar,
  User,
  Sparkles,
} from "lucide-react"

import { PageContainer } from "@/components/display/containers/page-container"
import { PageHeader } from "@/components/display/page-header/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { DocImagePlaceholder } from "@/components/docs/doc-image-placeholder"
import { getServerI18n } from "@/utils/i18n/server"

type DocLink = {
  title: string
  description: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

export default async function DocsIndexPage() {
  const { language } = await getServerI18n()

  const copy =
    language === "EN"
      ? {
          pageTitle: "Documentation",
          pageDesc:
            "Quick guide by module to learn how to use the system: purpose, filters, actions and key screens.",
          goDashboard: "Go to Dashboard",
          placeholderNavTitle: "[IMAGE / GIF] Navigation overview",
          placeholderNavDesc:
            "Suggestion: screenshot of the sidebar with main modules and the avatar menu.",
          indexTitle: "Index",
          indexDesc: "Select a module to see how it works.",
          conventionsTitle: "General conventions",
          conventionsDesc:
            "How to interpret tables, filters and actions across the system.",
          glossaryTitle: "Quick glossary",
          glossaryDesc: "Terms used on screens and in this guide.",
          placeholderExamplesTitle: "[IMAGE / GIF] Examples of search, filters and actions",
          placeholderExamplesDesc:
            "Suggestion: screenshot of a table showing the search input, filter panel, and row actions menu.",
          links: [
            {
              title: "Getting started",
              description:
                "What to create first to start using the system (checklist).",
              href: "/dashboard/docs/getting-started",
              icon: Sparkles,
            },
            {
              title: "Dashboard",
              description:
                "Financial overview, charts and monthly budget analytics.",
              href: "/dashboard/docs/dashboard",
              icon: LayoutDashboard,
            },
            {
              title: "Accounts",
              description:
                "Create and manage accounts, balances and account types.",
              href: "/dashboard/docs/accounts",
              icon: Wallet,
            },
            {
              title: "Categories",
              description:
                "Manage income and expense categories, with type filters.",
              href: "/dashboard/docs/categories",
              icon: FolderTree,
            },
            {
              title: "Transactions",
              description:
                "Income/expense entries, search, filters and actions.",
              href: "/dashboard/docs/transactions",
              icon: Receipt,
            },
            {
              title: "Transfers",
              description:
                "Transfers between accounts with from/to validation.",
              href: "/dashboard/docs/transfers",
              icon: ArrowLeftRight,
            },
            {
              title: "Monthly budgets",
              description:
                "Monthly periods, category budgets and analytics.",
              href: "/dashboard/docs/monthly-budgets",
              icon: Calendar,
            },
            {
              title: "Profile & security",
              description:
                "Preferences (currency/time zone), change password and sign out.",
              href: "/dashboard/docs/profile",
              icon: User,
            },
          ] satisfies DocLink[],
          conventions: [
            { label: "Search", text: "Most lists include a search input to filter by text." },
            { label: "Filters", text: "Some lists include a filter panel (e.g. date range and type)." },
            { label: "Sorting", text: "Many tables can be sorted by clicking on column headers." },
            { label: "Pagination", text: "If there are many records, results are paginated (usually 10 by default)." },
            { label: "Row actions", text: "Each row usually has an actions menu (view, edit, delete)." },
            { label: "Page reset", text: "When you change search/filters, the system usually resets to page 1." },
          ],
          glossary: [
            { label: "Income", text: "Money that goes into an account (e.g. salary)." },
            { label: "Expense", text: "Money that goes out of an account (e.g. food)." },
            { label: "Transfer", text: "Internal movement between two accounts (no category)." },
            { label: "Monthly budget", text: "A month+year period used for analytics and category budgets." },
            { label: "Category budget", text: "Planned amount to spend in a category within a monthly budget." },
            { label: "Date range", text: "Start/end filter used to limit data to a period." },
            { label: "Actions", text: "Buttons/menus to operate on a record: view, edit, delete (and sometimes reactivate)." },
          ],
        }
      : language === "PT"
        ? {
            pageTitle: "Documentação",
            pageDesc:
              "Guia rápido por módulos para aprender a usar o sistema: propósito, filtros, ações e telas principais.",
            goDashboard: "Ir para o Painel",
            placeholderNavTitle: "[IMAGEM / GIF] Visão geral da navegação",
            placeholderNavDesc:
              "Sugestão: captura do sidebar com os módulos principais e o menu do avatar.",
            indexTitle: "Índice",
            indexDesc: "Selecione um módulo para ver como funciona.",
            conventionsTitle: "Convenções gerais",
            conventionsDesc:
              "Como interpretar tabelas, filtros e ações em todo o sistema.",
            glossaryTitle: "Glossário rápido",
            glossaryDesc: "Termos usados nas telas e neste guia.",
            placeholderExamplesTitle:
              "[IMAGEM / GIF] Exemplos de busca, filtros e ações",
            placeholderExamplesDesc:
              "Sugestão: captura de uma tabela mostrando a busca, o painel de filtros e o menu de ações por linha.",
            links: [
              {
                title: "Primeiros passos",
                description:
                  "O que criar primeiro para começar a usar o sistema (checklist).",
                href: "/dashboard/docs/getting-started",
                icon: Sparkles,
              },
              {
                title: "Painel",
                description:
                  "Resumo financeiro, gráficos e análise de orçamentos mensais.",
                href: "/dashboard/docs/dashboard",
                icon: LayoutDashboard,
              },
              {
                title: "Contas",
                description:
                  "Crie e administre contas, saldos e tipos de conta.",
                href: "/dashboard/docs/accounts",
                icon: Wallet,
              },
              {
                title: "Categorias",
                description:
                  "Gerencie categorias de receitas e despesas, com filtro por tipo.",
                href: "/dashboard/docs/categories",
                icon: FolderTree,
              },
              {
                title: "Transações",
                description:
                  "Registro de receitas e despesas, busca, filtros e ações.",
                href: "/dashboard/docs/transactions",
                icon: Receipt,
              },
              {
                title: "Transferências",
                description:
                  "Transferências entre contas com validação de origem/destino.",
                href: "/dashboard/docs/transfers",
                icon: ArrowLeftRight,
              },
              {
                title: "Orçamentos mensais",
                description:
                  "Períodos mensais, orçamentos por categoria e análises.",
                href: "/dashboard/docs/monthly-budgets",
                icon: Calendar,
              },
              {
                title: "Perfil e segurança",
                description:
                  "Preferências (moeda/fuso), alterar senha e sair.",
                href: "/dashboard/docs/profile",
                icon: User,
              },
            ] satisfies DocLink[],
            conventions: [
              { label: "Busca", text: "A maioria das listas inclui um campo de busca para filtrar por texto." },
              { label: "Filtros", text: "Algumas listas incluem um painel de filtros (ex.: intervalo de datas e tipo)." },
              { label: "Ordenação", text: "Em muitas tabelas você pode ordenar clicando nos cabeçalhos." },
              { label: "Paginação", text: "Se houver muitos registros, os resultados são paginados (geralmente 10)." },
              { label: "Ações por linha", text: "Cada linha geralmente tem um menu de ações (ver, editar, excluir)." },
              { label: "Reset de página", text: "Ao mudar busca/filtros, o sistema normalmente volta para a página 1." },
            ],
            glossary: [
              { label: "Receita", text: "Dinheiro que entra em uma conta (ex.: salário)." },
              { label: "Despesa", text: "Dinheiro que sai de uma conta (ex.: alimentação)." },
              { label: "Transferência", text: "Movimento interno entre duas contas (sem categoria)." },
              { label: "Orçamento mensal", text: "Período mês+ano usado para análises e orçamentos por categoria." },
              { label: "Orçamento por categoria", text: "Valor planejado para gastar em uma categoria dentro do orçamento mensal." },
              { label: "Intervalo de datas", text: "Filtro início/fim para limitar dados a um período." },
              { label: "Ações", text: "Botões/menus para operar um registro: ver, editar, excluir (e às vezes reativar)." },
            ],
          }
        : {
            pageTitle: "Documentación",
            pageDesc:
              "Guía rápida por módulos para aprender a usar el sistema: propósito, filtros, acciones y pantallas clave.",
            goDashboard: "Ir al Dashboard",
            placeholderNavTitle: "[IMAGEN / GIF] Vista general de la navegación",
            placeholderNavDesc:
              "Sugerencia: captura del sidebar con los módulos principales y el menú del avatar.",
            indexTitle: "Índice",
            indexDesc: "Selecciona un módulo para ver su funcionamiento.",
            conventionsTitle: "Convenciones generales",
            conventionsDesc:
              "Cómo interpretar tablas, filtros y acciones en todo el sistema.",
            glossaryTitle: "Glosario rápido",
            glossaryDesc: "Términos usados en las pantallas y en esta guía.",
            placeholderExamplesTitle:
              "[IMAGEN / GIF] Ejemplos de búsqueda, filtros y acciones",
            placeholderExamplesDesc:
              "Sugerencia: captura de una tabla mostrando el buscador, el panel de filtros y el menú de acciones por fila.",
            links: [
              {
                title: "Primeros pasos",
                description:
                  "Qué crear primero para empezar a usar el sistema (checklist).",
                href: "/dashboard/docs/getting-started",
                icon: Sparkles,
              },
              {
                title: "Dashboard",
                description:
                  "Resumen financiero, gráficas y analítica de presupuestos mensuales.",
                href: "/dashboard/docs/dashboard",
                icon: LayoutDashboard,
              },
              {
                title: "Cuentas",
                description:
                  "Crea y administra cuentas, balances y tipos de cuenta.",
                href: "/dashboard/docs/accounts",
                icon: Wallet,
              },
              {
                title: "Categorías",
                description:
                  "Gestiona categorías de ingresos y gastos, con filtros por tipo.",
                href: "/dashboard/docs/categories",
                icon: FolderTree,
              },
              {
                title: "Transacciones",
                description:
                  "Registro de ingresos y gastos, búsqueda, filtros y acciones.",
                href: "/dashboard/docs/transactions",
                icon: Receipt,
              },
              {
                title: "Transferencias",
                description:
                  "Transferencias entre cuentas con control de origen/destino.",
                href: "/dashboard/docs/transfers",
                icon: ArrowLeftRight,
              },
              {
                title: "Presupuestos mensuales",
                description:
                  "Períodos mensuales, presupuestos por categoría y analíticas.",
                href: "/dashboard/docs/monthly-budgets",
                icon: Calendar,
              },
              {
                title: "Perfil y seguridad",
                description:
                  "Preferencias (moneda/zona horaria), cambiar contraseña y cierre de sesión.",
                href: "/dashboard/docs/profile",
                icon: User,
              },
            ] satisfies DocLink[],
            conventions: [
              { label: "Búsqueda", text: "la mayoría de listados incluye un campo de búsqueda para filtrar por texto." },
              { label: "Filtros", text: "algunos listados incluyen un panel de filtros (por ejemplo, rango de fechas y tipo)." },
              { label: "Ordenamiento", text: "en muchas tablas puedes ordenar haciendo clic en encabezados (cuando hay iconos de orden)." },
              { label: "Paginación", text: "si hay muchos registros, se muestran por páginas (normalmente 10 por defecto)." },
              { label: "Acciones por fila", text: "en cada registro suele haber un menú de acciones (ver, editar, eliminar)." },
              { label: "Reset de página", text: "cuando cambias búsqueda/filtros, el sistema suele volver a la página 1 para evitar “páginas vacías”." },
            ],
            glossary: [
              { label: "Ingreso", text: "dinero que entra a una cuenta (ej. salario)." },
              { label: "Gasto", text: "dinero que sale de una cuenta (ej. comida)." },
              { label: "Transferencia", text: "movimiento interno entre dos cuentas (no usa categoría)." },
              { label: "Presupuesto mensual", text: "período por mes y año (ej. Marzo 2026) usado para analítica y presupuestos por categoría." },
              { label: "Presupuesto por categoría", text: "monto planeado para gastar en una categoría dentro de un presupuesto mensual." },
              { label: "Rango de fechas", text: "filtro “inicio/fin” para limitar datos a un período." },
              { label: "Acciones", text: "botones/menús para operar sobre un registro: ver, editar, eliminar (y en algunos módulos reactivar)." },
            ],
          }

  const DOC_LINKS = copy.links
  return (
    <PageContainer>
      <PageHeader
        title={copy.pageTitle}
        description={copy.pageDesc}
        actions={
          <Link
            href="/dashboard"
            className={cn(
              "inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm",
              "hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <BookOpen className="h-4 w-4" />
            {copy.goDashboard}
          </Link>
        }
      />

      <DocImagePlaceholder
        title={copy.placeholderNavTitle}
        description={copy.placeholderNavDesc}
      />

      <Card>
        <CardHeader>
          <CardTitle>{copy.indexTitle}</CardTitle>
          <CardDescription>{copy.indexDesc}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {DOC_LINKS.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group rounded-lg border p-4 transition-colors",
                  "hover:bg-accent/50"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="rounded-md border bg-background p-2">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium group-hover:underline underline-offset-4">
                      {item.title}
                    </div>
                    <div className="text-sm text-muted-foreground">{item.description}</div>
                  </div>
                </div>
              </Link>
            )
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{copy.conventionsTitle}</CardTitle>
          <CardDescription>{copy.conventionsDesc}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <ul className="list-disc pl-5 space-y-2">
            {copy.conventions.map((item) => (
              <li key={item.label}>
                <b>{item.label}</b>: {item.text}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{copy.glossaryTitle}</CardTitle>
          <CardDescription>{copy.glossaryDesc}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <ul className="list-disc pl-5 space-y-2">
            {copy.glossary.map((item) => (
              <li key={item.label}>
                <b>{item.label}</b>: {item.text}
              </li>
            ))}
          </ul>
          <DocImagePlaceholder
            title={copy.placeholderExamplesTitle}
            description={copy.placeholderExamplesDesc}
          />
        </CardContent>
      </Card>
    </PageContainer>
  )
}

