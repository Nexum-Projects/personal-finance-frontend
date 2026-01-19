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
  placeholderDashboard: string
  purposeTitle: string
  purposeP1: string
  purposeP2: string
  controlsTitle: string
  controls: string[]
  cardsTitle: string
  cards: string[]
  placeholderCardsTitle: string
  placeholderCardsDesc: string
  chartsTitle: string
  trendsTitle: string
  trendsBullets: string[]
  placeholderTrendsTitle: string
  piesTitle: string
  piesBullets: string[]
  placeholderPieTitle: string
  balanceByAccountTitle: string
  balanceByAccountBullets: string[]
  placeholderBalanceTitle: string
  monthlyAnalyticsTitle: string
  monthlyAnalyticsBullets: string[]
  placeholderMonthlyTitle: string
  tipPrefix: string
  tipLinkText: string
  tipSuffix: string
}

export default async function DocsDashboardPage() {
  const { language } = await getServerI18n()

  const copy: Copy =
    language === "EN"
      ? {
          back: "Back to Documentation",
          title: "Module: Dashboard",
          desc: "Financial overview with metrics, charts and monthly budget analytics.",
          placeholderDashboard: "[IMAGE / GIF] Full dashboard",
          purposeTitle: "Purpose",
          purposeP1:
            "The Dashboard gives you a high-level view of your finances for a date range: total balance, income, expenses, savings, trends and distribution by categories/accounts.",
          purposeP2:
            "Use it to answer questions quickly: “How much did I spend this month?”, “Which categories consumed most money?”, “How is my balance distributed across accounts?” and “How has my net changed over time?”",
          controlsTitle: "Main controls",
          controls: [
            "Date range: affects all metrics and charts.",
            "Group by (trends): day, week, month or year.",
            "Currency and time zone: used to format amounts and dates based on your preferences.",
            "Auto refresh: when you change range or grouping, data updates automatically.",
          ],
          cardsTitle: "Cards (metrics)",
          cards: [
            "Total balance: sum of account balances (based on backend data).",
            "Income: total income in the selected range.",
            "Expenses: total expenses in the selected range.",
            "Accounts: number of active accounts.",
            "Savings: net indicator (income − expenses). If negative, it is shown in red.",
          ],
          placeholderCardsTitle: "[IMAGE / GIF] Dashboard cards",
          placeholderCardsDesc: "Suggestion: capture focused on the top metric cards.",
          chartsTitle: "Charts",
          trendsTitle: "Financial trends",
          trendsBullets: [
            "Income (green line)",
            "Expenses (red line)",
            "Net (blue line)",
            "Savings (orange line)",
            "Tooltip: hover to see exact values in your preferred currency.",
            "Tip: use “Month” to see a full year; use “Day” to see behavior within a month.",
          ],
          placeholderTrendsTitle: "[IMAGE / GIF] Tooltip and grouping selector",
          piesTitle: "Expenses by category / Income by category",
          piesBullets: [
            "Distribution by category (percentage and total amount)",
            "Transaction count per category",
            "Side list with scroll when there are many categories",
          ],
          placeholderPieTitle: "[IMAGE / GIF] Pie chart and scrollable list",
          balanceByAccountTitle: "Balance by account",
          balanceByAccountBullets: [
            "Distribution of total balance by account",
            "Shows account type in the tooltip",
            "Useful to spot accounts that have the biggest weight in your total balance",
          ],
          placeholderBalanceTitle: "[IMAGE / GIF] Balance by account tooltip",
          monthlyAnalyticsTitle: "Monthly Budget Analytics (table)",
          monthlyAnalyticsBullets: [
            "Year filter: changes the year shown in the table.",
            "Columns per month and a final Total column that sums the whole year.",
            "Click on a month: opens a dialog with category budgets for that monthly period.",
            "Interpretation: “Remaining” shows how much room is left to spend (or how much you exceeded).",
          ],
          placeholderMonthlyTitle: "[IMAGE / GIF] Table + category budgets dialog",
          tipPrefix: "Tip: if you want to go deeper into monthly budgets, see ",
          tipLinkText: "Monthly budgets",
          tipSuffix: ".",
        }
      : language === "PT"
        ? {
            back: "Voltar para Documentação",
            title: "Módulo: Painel",
            desc: "Resumo financeiro com métricas, gráficos e análise de orçamentos mensais.",
            placeholderDashboard: "[IMAGEM / GIF] Painel completo",
            purposeTitle: "Propósito",
            purposeP1:
              "O Painel te dá uma visão geral das suas finanças em um intervalo de datas: saldo total, receitas, despesas, poupança, tendências e distribuição por categorias/contas.",
            purposeP2:
              "Use para responder rápido: “Quanto gastei este mês?”, “Em quais categorias foi o dinheiro?”, “Como meu saldo se distribui entre contas?” e “Como meu líquido mudou ao longo do tempo?”",
            controlsTitle: "Controles principais",
            controls: [
              "Intervalo de datas: afeta todas as métricas e gráficos.",
              "Agrupar por (tendências): dia, semana, mês ou ano.",
              "Moeda e fuso horário: usados para formatar valores e datas conforme suas preferências.",
              "Atualização automática: ao mudar intervalo ou agrupamento, os dados são atualizados.",
            ],
            cardsTitle: "Cartões (métricas)",
            cards: [
              "Saldo total: soma dos saldos das contas (dados do backend).",
              "Receitas: total de receitas no intervalo selecionado.",
              "Despesas: total de despesas no intervalo selecionado.",
              "Contas: quantidade de contas ativas.",
              "Poupança: indicador líquido (receitas − despesas). Se negativo, aparece em vermelho.",
            ],
            placeholderCardsTitle: "[IMAGEM / GIF] Cartões do painel",
            placeholderCardsDesc: "Sugestão: captura focada nos cartões superiores.",
            chartsTitle: "Gráficos",
            trendsTitle: "Tendências financeiras",
            trendsBullets: [
              "Receitas (linha verde)",
              "Despesas (linha vermelha)",
              "Líquido (linha azul)",
              "Poupança (linha laranja)",
              "Tooltip: ao passar o mouse mostra valores exatos na moeda preferida.",
              "Dica: use “Mês” para ver um ano completo; use “Dia” para ver o comportamento dentro de um mês.",
            ],
            placeholderTrendsTitle: "[IMAGEM / GIF] Tooltip e seletor de agrupamento",
            piesTitle: "Despesas por categoria / Receitas por categoria",
            piesBullets: [
              "Distribuição por categoria (percentual e valor total)",
              "Quantidade de transações por categoria",
              "Lista lateral com scroll quando há muitas categorias",
            ],
            placeholderPieTitle: "[IMAGEM / GIF] Gráfico de pizza e lista com scroll",
            balanceByAccountTitle: "Saldo por conta",
            balanceByAccountBullets: [
              "Distribuição do saldo total por conta",
              "Mostra o tipo de conta no tooltip",
              "Útil para detectar quais contas pesam mais no saldo total",
            ],
            placeholderBalanceTitle: "[IMAGEM / GIF] Tooltip de saldo por conta",
            monthlyAnalyticsTitle: "Análise de Orçamento Mensal (tabela)",
            monthlyAnalyticsBullets: [
              "Filtro de ano: muda o ano mostrado na tabela.",
              "Colunas por mês e uma coluna final Total que soma o ano inteiro.",
              "Clique em um mês: abre um diálogo com orçamentos por categoria do período mensal.",
              "Interpretação: “Restante” mostra quanto ainda pode gastar (ou quanto excedeu).",
            ],
            placeholderMonthlyTitle: "[IMAGEM / GIF] Tabela + diálogo de orçamentos por categoria",
            tipPrefix: "Dica: para aprofundar em orçamentos mensais, veja ",
            tipLinkText: "Orçamentos mensais",
            tipSuffix: ".",
          }
        : {
            back: "Regresar a Documentación",
            title: "Módulo: Dashboard",
            desc: "Resumen financiero con métricas, gráficas y analítica de presupuestos mensuales.",
            placeholderDashboard: "[IMAGEN / GIF] Dashboard completo",
            purposeTitle: "Propósito",
            purposeP1:
              "El Dashboard te da una vista general de tus finanzas en un rango de fechas: balance total, ingresos, gastos, ahorros, tendencias y distribución por categorías/cuentas.",
            purposeP2:
              "Úsalo para responder rápidamente: “¿Cuánto gasté este mes?”, “¿En qué categorías se fue el dinero?”, “¿Cómo se distribuye mi balance entre cuentas?” y “¿Cómo ha cambiado mi neto en el tiempo?”.",
            controlsTitle: "Controles principales",
            controls: [
              "Rango de fechas: afecta todas las métricas y gráficas del dashboard.",
              "Agrupar por (tendencias): día, semana, mes o año.",
              "Moneda y zona horaria: se usan para formatear montos y fechas según tus preferencias.",
              "Actualización automática: al cambiar rango o agrupación, se recarga la información.",
            ],
            cardsTitle: "Tarjetas (métricas)",
            cards: [
              "Balance total: suma de balances de tus cuentas (según datos del backend).",
              "Ingresos: total de ingresos en el rango seleccionado.",
              "Gastos: total de gastos en el rango seleccionado.",
              "Cuentas: cantidad de cuentas activas.",
              "Ahorros: indicador neto (ingresos − gastos). Si es negativo, se muestra en rojo.",
            ],
            placeholderCardsTitle: "[IMAGEN / GIF] Tarjetas del dashboard",
            placeholderCardsDesc:
              "Sugerencia: captura enfocada en las tarjetas de métricas superiores.",
            chartsTitle: "Gráficas",
            trendsTitle: "Tendencias financieras",
            trendsBullets: [
              "Ingresos (línea verde)",
              "Gastos (línea roja)",
              "Neto (línea azul)",
              "Ahorros (línea naranja)",
              "Tooltip: al pasar el cursor muestra valores exactos en la moneda preferida.",
              "Recomendación: usa “Mes” para ver un año completo; usa “Día” para ver el comportamiento dentro de un mes.",
            ],
            placeholderTrendsTitle: "[IMAGEN / GIF] Tooltip y selector de agrupación",
            piesTitle: "Gastos por categoría / Ingresos por categoría",
            piesBullets: [
              "Distribución por categoría (porcentaje y monto total)",
              "Conteo de transacciones por categoría",
              "Lista lateral con scroll cuando hay muchas categorías",
            ],
            placeholderPieTitle: "[IMAGEN / GIF] Gráfica de pastel y lista con scroll",
            balanceByAccountTitle: "Balance por cuenta",
            balanceByAccountBullets: [
              "Distribución del balance total por cuenta",
              "Muestra el tipo de cuenta en el tooltip",
              "Útil para detectar cuentas con mayor peso en tu balance total",
            ],
            placeholderBalanceTitle: "[IMAGEN / GIF] Tooltip de balance por cuenta",
            monthlyAnalyticsTitle: "Analítica de Presupuesto Mensual (tabla)",
            monthlyAnalyticsBullets: [
              "Filtro de año: cambia el año mostrado en la tabla.",
              "Columnas por mes y una columna final Total que suma el año completo.",
              "Click en un mes: abre un diálogo con presupuestos por categoría del período mensual.",
              "Interpretación: “Restante” indica cuánto margen queda por gastar (o cuánto se excedió).",
            ],
            placeholderMonthlyTitle: "[IMAGEN / GIF] Tabla + diálogo de presupuestos por categoría",
            tipPrefix:
              "Tip: si quieres profundizar en presupuestos mensuales, revisa ",
            tipLinkText: "Presupuestos mensuales",
            tipSuffix: ".",
          }

  return (
    <PageContainer>
      <PageHeader
        backTo={{ href: "/dashboard/docs", label: copy.back }}
        title={copy.title}
        description={copy.desc}
      />

      <DocImagePlaceholder title={copy.placeholderDashboard} />

      <Card>
        <CardHeader>
          <CardTitle>{copy.purposeTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>{copy.purposeP1}</p>
          <p>{copy.purposeP2}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{copy.controlsTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <ul className="list-disc pl-5 space-y-2">
            {copy.controls.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{copy.cardsTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <ul className="list-disc pl-5 space-y-2">
            {copy.cards.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
          <DocImagePlaceholder
            title={copy.placeholderCardsTitle}
            description={copy.placeholderCardsDesc}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{copy.chartsTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <b>{copy.trendsTitle}</b>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              {copy.trendsBullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            <DocImagePlaceholder className="mt-3" title={copy.placeholderTrendsTitle} />
          </div>

          <div>
            <b>{copy.piesTitle}</b>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              {copy.piesBullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            <DocImagePlaceholder className="mt-3" title={copy.placeholderPieTitle} />
          </div>

          <div>
            <b>{copy.balanceByAccountTitle}</b>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              {copy.balanceByAccountBullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            <DocImagePlaceholder className="mt-3" title={copy.placeholderBalanceTitle} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{copy.monthlyAnalyticsTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <ul className="list-disc pl-5 space-y-2">
            {copy.monthlyAnalyticsBullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          <DocImagePlaceholder title={copy.placeholderMonthlyTitle} />
        </CardContent>
      </Card>

      <div className="text-sm text-muted-foreground">
        {copy.tipPrefix}
        <Link className="underline underline-offset-4" href="/dashboard/docs/monthly-budgets">
          {copy.tipLinkText}
        </Link>
        {copy.tipSuffix}
      </div>
    </PageContainer>
  )
}

