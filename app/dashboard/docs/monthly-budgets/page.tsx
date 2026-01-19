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
  placeholderList: string
  purposeTitle: string
  purposeP1: string
  listTitle: string
  listP1: string
  listBullets: string[]
  placeholderControls: string
  detailTitle: string
  detailP1: string
  detailBullets: string[]
  placeholderDetail: string
  categoryTitle: string
  categoryBullets: string[]
  placeholderCategory: string
  analyticsTitle: string
  analyticsP1: string
  analyticsBullets: string[]
  placeholderAnalytics: string
  seeMorePrefix: string
  seeMoreLink: string
  seeMoreSuffix: string
}

export default async function DocsMonthlyBudgetsPage() {
  const { language } = await getServerI18n()

  const copy: Copy =
    language === "EN"
      ? {
          back: "Back to Documentation",
          title: "Module: Monthly budgets",
          desc:
            "Manage monthly periods and category budgets, plus analytics.",
          placeholderList: "[IMAGE / GIF] Monthly periods list",
          purposeTitle: "Purpose",
          purposeP1:
            "This module helps you organize your finances by month, defining a monthly period and its category budgets (usually expenses), and then consuming them through analytics.",
          listTitle: "List screen (monthly periods)",
          listP1:
            "Here you manage the monthly periods. Each period represents a month/year and is the container for category budgets and analytics.",
          listBullets: [
            "“New monthly budget” button: create a new monthly period.",
            "Search: filter by text (if enabled).",
            "Filters: date range (if enabled).",
            "Row actions: view details, edit, deactivate/reactivate (if available).",
            "Reactivate: if a period is inactive, you may see an option to reactivate it.",
          ],
          placeholderControls: "[IMAGE / GIF] Search + filters + row actions menu",
          detailTitle: "Monthly period details",
          detailP1:
            "In a monthly period detail you will typically see tabs like General and Budgets.",
          detailBullets: [
            "General: shows year, month, initial savings, status and timestamps.",
            "Budgets: list of category budgets linked to that period.",
          ],
          placeholderDetail: "[IMAGE / GIF] Detail view + General/Budgets tabs",
          categoryTitle: "Category budgets",
          categoryBullets: [
            "Category budgets are created inside a monthly period.",
            "When creating a budget, the category selector is focused on Expense categories.",
            "Each category budget tracks: budgeted, spent and remaining.",
            "If remaining is negative, it means you already exceeded the budget.",
          ],
          placeholderCategory: "[IMAGE / GIF] Category budget form",
          analyticsTitle: "Monthly analytics (from Dashboard)",
          analyticsP1:
            "On the Dashboard, there is a monthly analytics table with a Total column that sums each row across months, and it can open a dialog with category budgets when you click a month header.",
          analyticsBullets: [
            "The Total column shows yearly totals per row (initial savings, income, expenses, etc.).",
            "The month dialog shows, per category: budgeted, spent and remaining.",
          ],
          placeholderAnalytics: "[IMAGE / GIF] Analytics table + month dialog",
          seeMorePrefix: "See more in ",
          seeMoreLink: "Dashboard",
          seeMoreSuffix: ".",
        }
      : language === "PT"
        ? {
            back: "Voltar para Documentação",
            title: "Módulo: Orçamentos mensais",
            desc:
              "Gerencie períodos mensais e orçamentos por categoria, com análises.",
            placeholderList: "[IMAGEM / GIF] Lista de orçamentos mensais (períodos)",
            purposeTitle: "Propósito",
            purposeP1:
              "Este módulo permite organizar finanças por mês, definindo um “orçamento mensal” (período) e seus orçamentos por categoria (principalmente despesas), além de consultar análises.",
            listTitle: "Tela de lista (períodos mensais)",
            listP1:
              "Aqui você administra os períodos mensais. Cada período representa mês/ano e serve como contêiner para orçamentos por categoria e análise.",
            listBullets: [
              "Botão “Novo orçamento mensal”: cria um novo período.",
              "Busca: filtra por texto (se habilitado).",
              "Filtros: intervalo de datas (se habilitado).",
              "Ações por linha: ver detalhe, editar, desativar/reativar (se disponível).",
              "Reativar: se um período estiver inativo, pode existir a ação de reativação.",
            ],
            placeholderControls: "[IMAGEM / GIF] Busca + filtros + menu de ações",
            detailTitle: "Detalhe de um orçamento mensal",
            detailP1:
              "No detalhe você verá abas como Geral e Orçamentos.",
            detailBullets: [
              "Geral: ano, mês, poupança inicial, status e datas.",
              "Orçamentos: lista de orçamentos por categoria do período.",
            ],
            placeholderDetail: "[IMAGEM / GIF] Detalhe + abas Geral/Orçamentos",
            categoryTitle: "Orçamentos por categoria",
            categoryBullets: [
              "Criados dentro do período mensal.",
              "Ao criar, o seletor foca em categorias de Despesa.",
              "Cada orçamento acompanha: orçado, gasto e restante.",
              "Se restante for negativo, significa que o orçamento foi excedido.",
            ],
            placeholderCategory: "[IMAGEM / GIF] Formulário de orçamento por categoria",
            analyticsTitle: "Análise mensal (no Painel)",
            analyticsP1:
              "No Painel existe uma tabela analítica mensal com coluna Total e um diálogo por mês para ver orçamentos por categoria.",
            analyticsBullets: [
              "A coluna Total ajuda a ver acumulados anuais por linha.",
              "O diálogo do mês mostra por categoria: orçado, gasto e restante.",
            ],
            placeholderAnalytics: "[IMAGEM / GIF] Tabela analítica + diálogo por mês",
            seeMorePrefix: "Ver mais em ",
            seeMoreLink: "Painel",
            seeMoreSuffix: ".",
          }
        : {
            back: "Regresar a Documentación",
            title: "Módulo: Presupuestos mensuales",
            desc:
              "Gestiona presupuestos por mes (períodos) y presupuestos por categoría, con analítica.",
            placeholderList: "[IMAGEN / GIF] Lista de presupuestos mensuales (períodos)",
            purposeTitle: "Propósito",
            purposeP1:
              "Este módulo te permite organizar tus finanzas por mes, definiendo un “presupuesto mensual” y sus presupuestos por categoría (principalmente para gastos), además de consultar analíticas.",
            listTitle: "Pantalla de lista (presupuestos mensuales)",
            listP1:
              "Aquí administras los presupuestos mensuales (períodos). Cada período representa un mes/año y sirve como contenedor para presupuestos por categoría y analítica.",
            listBullets: [
              "Botón “Nuevo presupuesto mensual”: crea un nuevo período mensual.",
              "Búsqueda: filtra por texto (si aplica).",
              "Filtros: rango de fechas (si aplica al listado).",
              "Acciones por fila: ver detalle, editar, eliminar/reactivar (según disponibilidad).",
              "Reactivar: si un período fue desactivado, puede existir la acción de reactivarlo.",
            ],
            placeholderControls: "[IMAGEN / GIF] Barra de búsqueda + filtros + menú de acciones",
            detailTitle: "Detalle de un presupuesto mensual",
            detailP1:
              "Al entrar al detalle de un presupuesto mensual, se muestran pestañas como General y Presupuestos.",
            detailBullets: [
              "General: muestra datos del período (año, mes, ahorro inicial, estado, fechas).",
              "Presupuestos: lista de presupuestos por categoría ligados a ese período.",
            ],
            placeholderDetail: "[IMAGEN / GIF] Vista de detalle + pestañas General/Presupuestos",
            categoryTitle: "Presupuestos por categoría",
            categoryBullets: [
              "Se crean presupuestos por categoría ligados al presupuesto mensual.",
              "Al crear un presupuesto, el selector de categorías está enfocado a categorías de gasto.",
              "Cada presupuesto por categoría maneja: presupuestado, gastado y restante.",
              "Si restante es negativo, significa que ya se excedió el presupuesto.",
            ],
            placeholderCategory: "[IMAGEN / GIF] Formulario de presupuesto por categoría",
            analyticsTitle: "Analítica mensual (desde el Dashboard)",
            analyticsP1:
              "En el Dashboard existe una tabla de analítica por mes con una columna Total y un diálogo por mes para ver presupuestos por categoría.",
            analyticsBullets: [
              "La columna Total ayuda a ver acumulados anuales por fila (ahorro inicial, ingresos, gastos, etc.).",
              "El diálogo por mes muestra, por categoría: presupuestado, gastado y restante.",
            ],
            placeholderAnalytics: "[IMAGEN / GIF] Tabla analítica + diálogo por mes",
            seeMorePrefix: "Ver más en ",
            seeMoreLink: "Dashboard",
            seeMoreSuffix: ".",
          }

  return (
    <PageContainer>
      <PageHeader
        backTo={{ href: "/dashboard/docs", label: copy.back }}
        title={copy.title}
        description={copy.desc}
      />

      <DocImagePlaceholder title={copy.placeholderList} />

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
          <CardTitle>{copy.listTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>{copy.listP1}</p>
          <ul className="list-disc pl-5 space-y-2">
            {copy.listBullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          <DocImagePlaceholder title={copy.placeholderControls} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{copy.detailTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>{copy.detailP1}</p>
          <ul className="list-disc pl-5 space-y-2">
            {copy.detailBullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          <DocImagePlaceholder title={copy.placeholderDetail} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{copy.categoryTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <ul className="list-disc pl-5 space-y-2">
            {copy.categoryBullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          <DocImagePlaceholder title={copy.placeholderCategory} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{copy.analyticsTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>{copy.analyticsP1}</p>
          <ul className="list-disc pl-5 space-y-2">
            {copy.analyticsBullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          <DocImagePlaceholder title={copy.placeholderAnalytics} />
          <div className="text-sm text-muted-foreground">
            {copy.seeMorePrefix}
            <Link className="underline underline-offset-4" href="/dashboard/docs/dashboard">
              {copy.seeMoreLink}
            </Link>
            {copy.seeMoreSuffix}
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  )
}

