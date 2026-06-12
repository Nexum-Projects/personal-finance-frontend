import Image, { type StaticImageData } from "next/image"
import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import {
  ArrowRight,
  BarChart3,
  CalendarCheck,
  Check,
  CheckCircle2,
  Download,
  Layers3,
  LockKeyhole,
  PieChart,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  WalletCards,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import budgetScreenshot from "@/utils/images/budget-2.png"
import categoriesScreenshot from "@/utils/images/categories-1.png"
import dashboardScreenshot from "@/utils/images/dashboard-4.png"
import dashboardDetailScreenshot from "@/utils/images/dashboard-1.png"
import dashboardAnalyticsScreenshot from "@/utils/images/dashboard-3.png"
import transactionsScreenshot from "@/utils/images/transactions-1.png"
import { ExpandableProductScreenshot } from "@/components/landing/expandable-product-screenshot"
import {
  buildLandingMetadata,
  buildLandingStructuredData,
  siteName,
} from "@/utils/seo"

export const metadata = buildLandingMetadata()

const heroBenefits = [
  "Presupuestos mensuales",
  "Categorías personalizadas",
  "Transferencias entre cuentas",
  "Reportes y exportación de datos",
]

const problems = [
  "No sabes cuánto gastaste este mes",
  "Manejas varias cuentas y pierdes el control",
  "Los presupuestos nunca se cumplen",
  "Dependes de hojas de cálculo",
  "No identificas fugas de dinero",
]

const solutions = [
  "Centraliza todas tus cuentas",
  "Organiza movimientos por categorías",
  "Controla presupuestos mensuales",
  "Analiza tendencias automáticamente",
  "Toma decisiones con información clara",
]

const featuredBenefits = [
  "Define límites por categoría y periodo.",
  "Compara lo planificado contra el gasto real.",
  "Detecta desviaciones antes de fin de mes.",
]

const featureCards: Array<{
  icon: LucideIcon
  title: string
  description: string
}> = [
  {
    icon: WalletCards,
    title: "Gestión de cuentas",
    description:
      "Agrupa efectivo, bancos y tarjetas para ver saldos y movimientos sin cambiar de herramienta.",
  },
  {
    icon: PieChart,
    title: "Categorías inteligentes",
    description:
      "Clasifica ingresos y gastos para entender hábitos, prioridades y oportunidades de ahorro.",
  },
  {
    icon: Layers3,
    title: "Transferencias",
    description:
      "Registra movimientos entre cuentas sin duplicar gastos ni perder trazabilidad.",
  },
  {
    icon: Download,
    title: "Exportación de datos",
    description:
      "Descarga tu historial cuando necesites analizar, respaldar o compartir información.",
  },
]

const productBlocks = [
  {
    title: "Dashboard principal",
    text: "Visualiza balances, ingresos y gastos desde un único lugar.",
    image: dashboardDetailScreenshot,
    alt: "Dashboard principal de Personal Finance con balances, ingresos y gastos",
  },
  {
    title: "Análisis visual",
    text: "Consulta gráficos de gastos, ingresos y balance distribuido por categoría y cuenta.",
    image: dashboardAnalyticsScreenshot,
    alt: "Gráficos de gastos por categoría, ingresos por categoría y balance por cuenta",
  },
  {
    title: "Lista de transacciones",
    text: "Registra movimientos rápidamente y mantén tu historial organizado.",
    image: transactionsScreenshot,
    alt: "Lista de transacciones organizada por fecha, categoría y monto",
  },
  {
    title: "Presupuestos",
    text: "Compara lo planificado contra el gasto real.",
    image: budgetScreenshot,
    alt: "Módulo de presupuestos mensuales comparando planificación y gasto real",
  },
  {
    title: "Categorías",
    text: "Identifica patrones y oportunidades de ahorro.",
    image: categoriesScreenshot,
    alt: "Módulo de categorías financieras para analizar patrones de gasto",
  },
] as const

const beforeItems = [
  "Hojas de cálculo",
  "Aplicaciones separadas",
  "Información dispersa",
  "Seguimiento manual",
]

const afterItems = [
  "Todo centralizado",
  "Presupuestos claros",
  "Reportes automáticos",
  "Historial completo",
]

const mainBenefits: Array<{
  icon: LucideIcon
  title: string
}> = [
  { icon: ReceiptText, title: "Comprende tus hábitos de gasto" },
  { icon: Target, title: "Controla tus presupuestos" },
  { icon: WalletCards, title: "Organiza múltiples cuentas" },
  { icon: ShieldCheck, title: "Detecta gastos innecesarios" },
  { icon: TrendingUp, title: "Visualiza tendencias mensuales" },
  { icon: Download, title: "Exporta información cuando lo necesites" },
]

const structuredData = buildLandingStructuredData()

function BrowserFrame({
  title,
  children,
  compact = false,
}: {
  title: string
  children: React.ReactNode
  compact?: boolean
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/80 bg-card/95 shadow-2xl shadow-primary/10">
      <div className="flex items-center justify-between border-b border-border/80 bg-muted/30 px-4 py-3">
        <div className="flex items-center gap-2" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-destructive/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-success/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-primary/80" />
        </div>
        <span className="text-xs font-medium text-muted-foreground">
          {title}
        </span>
        <span className="h-2 w-10 rounded-full bg-muted-foreground/20" />
      </div>
      <div className={compact ? "p-4" : "p-4 sm:p-6"}>{children}</div>
    </div>
  )
}

function ProductScreenshot({
  title,
  image,
  alt,
  priority = false,
  compact = false,
  unoptimized = false,
  expandLabel,
  description,
}: {
  title: string
  image: StaticImageData
  alt: string
  priority?: boolean
  compact?: boolean
  unoptimized?: boolean
  expandLabel?: string
  description?: string
}) {
  return (
    <BrowserFrame title={title} compact={compact}>
      <ExpandableProductScreenshot
        title={title}
        image={image}
        alt={alt}
        priority={priority}
        unoptimized={unoptimized}
        expandLabel={expandLabel}
        description={description}
      />
    </BrowserFrame>
  )
}

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-xl">
        <nav
          className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
          aria-label="Navegación principal"
        >
          <Link
            href="/"
            className="flex items-center gap-3"
            aria-label={siteName}
          >
            <Image
              src="/images/logo_1.png"
              alt=""
              width={42}
              height={42}
              priority
              className="h-10 w-10 rounded-md"
            />
            <span className="hidden text-sm font-semibold text-foreground sm:block">
              {siteName}
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" className="hidden sm:inline-flex">
              <Link href="/login" prefetch>
                Iniciar sesión
              </Link>
            </Button>
            <Button asChild>
              <Link href="/register" prefetch>
                Crear cuenta
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </nav>
      </header>

      <section className="relative overflow-hidden border-b border-border">
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.22),transparent_34%),radial-gradient(circle_at_80%_20%,hsl(var(--success)/0.12),transparent_28%)]"
          aria-hidden="true"
        />
        <div
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"
          aria-hidden="true"
        />

        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8 lg:py-24">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm text-primary">
              <ShieldCheck className="h-4 w-4" />
              Finanzas personales claras, privadas y accionables
            </div>

            <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Controla tu dinero sin hojas de cálculo
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              Visualiza ingresos, gastos, presupuestos y tendencias desde un
              único panel diseñado para ayudarte a tomar mejores decisiones
              financieras.
            </p>

            <ul className="mt-8 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
              {heroBenefits.map((benefit) => (
                <li key={benefit} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 flex-none text-success" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-12">
                <Link href="/register" prefetch>
                  Comenzar gratis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 border-primary/20 bg-background/70"
              >
                <Link href="#producto">Ver demostración</Link>
              </Button>
            </div>
          </div>

          <div className="relative">
            <div
              className="absolute -inset-4 rounded-[2rem] bg-primary/10 blur-3xl"
              aria-hidden="true"
            />
            <ProductScreenshot
              title="Dashboard financiero"
              image={dashboardScreenshot}
              alt="Dashboard financiero real de Personal Finance con balances, ingresos, gastos, presupuestos y tendencias"
              priority
            />
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-card/30 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-medium text-primary">
              Del caos al control
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              ¿Te resulta difícil saber a dónde va tu dinero?
            </h2>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-destructive">
                Antes
              </p>
              <div className="mt-6 space-y-4">
                {problems.map((problem) => (
                  <div
                    key={problem}
                    className="flex gap-3 rounded-xl border border-border/70 bg-background/70 p-4 text-sm text-muted-foreground"
                  >
                    <X className="mt-0.5 h-5 w-5 flex-none text-destructive" />
                    <span>{problem}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-success/20 bg-success/5 p-6 sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-success">
                Después
              </p>
              <div className="mt-6 space-y-4">
                {solutions.map((solution) => (
                  <div
                    key={solution}
                    className="flex gap-3 rounded-xl border border-border/70 bg-background/70 p-4 text-sm text-muted-foreground"
                  >
                    <Check className="mt-0.5 h-5 w-5 flex-none text-success" />
                    <span>{solution}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-medium text-primary">
              Funcionalidades destacadas
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Diseñado para administrar el mes, no solo registrar datos
            </h2>
            <p className="mt-4 text-muted-foreground">
              Prioriza lo que más impacta tus decisiones: presupuestos claros,
              cuentas ordenadas y movimientos fáciles de analizar.
            </p>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-4">
            <article className="group overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/15 via-card to-card p-5 shadow-2xl shadow-primary/10 transition duration-300 hover:-translate-y-1 hover:border-primary/40 lg:col-span-2 lg:row-span-2">
              <ProductScreenshot
                title="Presupuestos"
                image={budgetScreenshot}
                alt="Captura real del módulo de presupuestos mensuales de Personal Finance"
                compact
              />
              <div className="mt-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <CalendarCheck className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-2xl font-semibold text-foreground">
                  Presupuestos mensuales
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Planifica cada periodo, asigna límites por categoría y revisa
                  tu avance antes de que el mes se salga de control.
                </p>
                <ul className="mt-5 space-y-3">
                  {featuredBenefits.map((benefit) => (
                    <li
                      key={benefit}
                      className="flex gap-3 text-sm text-muted-foreground"
                    >
                      <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-success" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>

            {featureCards.map((feature) => {
              const Icon = feature.icon

              return (
                <article
                  key={feature.title}
                  className="group rounded-2xl border border-border/80 bg-card p-6 shadow-lg shadow-black/20 transition duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-primary/5 hover:shadow-primary/10"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {feature.description}
                  </p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section
        id="producto"
        className="border-b border-border bg-card/30 py-16 sm:py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-medium text-primary">
              Producto en acción
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Todo lo que necesitas para administrar tus finanzas
            </h2>
          </div>

          <div className="mt-12 space-y-12">
            {productBlocks.map((block, index) => (
              <div
                key={block.title}
                className="grid gap-8 lg:grid-cols-2 lg:items-center"
              >
                <div className={index % 2 === 1 ? "lg:order-2" : undefined}>
                  <ProductScreenshot
                    title={block.title}
                    image={block.image}
                    alt={block.alt}
                    compact
                  />
                </div>
                <div className="max-w-xl">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Sparkles className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-2xl font-semibold text-foreground">
                    {block.title}
                  </h3>
                  <p className="mt-4 text-lg leading-8 text-muted-foreground">
                    {block.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-medium text-primary">Antes vs después</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Cambia seguimiento manual por claridad diaria
            </h2>
          </div>

          <div className="mt-10 grid overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-black/30 lg:grid-cols-2">
            <div className="border-b border-border bg-muted/20 p-6 sm:p-8 lg:border-b-0 lg:border-r">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Antes
              </p>
              <div className="mt-6 space-y-4">
                {beforeItems.map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                      <X className="h-4 w-4" />
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary/10 via-card to-success/5 p-6 sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                Después
              </p>
              <div className="mt-6 space-y-4">
                {afterItems.map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-success/10 text-success">
                      <Check className="h-4 w-4" />
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-card/30 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-medium text-primary">
              Beneficios principales
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Toma mejores decisiones financieras
            </h2>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mainBenefits.map((benefit) => {
              const Icon = benefit.icon

              return (
                <article
                  key={benefit.title}
                  className="rounded-2xl border border-border/80 bg-background/80 p-6 transition duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-primary/5"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-base font-semibold text-foreground">
                    {benefit.title}
                  </h3>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-16 sm:py-20">
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,hsl(var(--primary)/0.24),transparent_34%),linear-gradient(135deg,hsl(var(--primary)/0.08),transparent_45%,hsl(var(--success)/0.08))]"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl rounded-3xl border border-primary/20 bg-card/80 p-8 text-center shadow-2xl shadow-primary/10 backdrop-blur sm:p-12">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <BarChart3 className="h-7 w-7" />
            </div>
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
              Toma el control de tus finanzas hoy
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
              Deja de preguntarte a dónde se fue tu dinero. Visualiza ingresos,
              gastos y presupuestos en segundos.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-12">
                <Link href="/register" prefetch>
                  Crear cuenta gratuita
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary" className="h-12">
                <Link href="/login" prefetch>
                  <LockKeyhole className="mr-2 h-4 w-4" />
                  Iniciar sesión
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Image
              src="/images/logo_1.png"
              alt=""
              width={28}
              height={28}
              className="rounded"
            />
            <span>{siteName}</span>
          </div>
          <p>
            Finanzas personales con datos claros y decisiones más tranquilas.
          </p>
        </div>
      </footer>
    </main>
  )
}
