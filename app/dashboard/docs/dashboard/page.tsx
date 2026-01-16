import Link from "next/link"

import { PageContainer } from "@/components/display/containers/page-container"
import { PageHeader } from "@/components/display/page-header/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DocImagePlaceholder } from "@/components/docs/doc-image-placeholder"

export default function DocsDashboardPage() {
  return (
    <PageContainer>
      <PageHeader
        backTo={{ href: "/dashboard/docs", label: "Regresar a Documentación" }}
        title="Módulo: Dashboard"
        description="Resumen financiero con métricas, gráficas y analítica de presupuestos mensuales."
      />

      <DocImagePlaceholder title="[IMAGEN / GIF] Dashboard completo" />

      <Card>
        <CardHeader>
          <CardTitle>Propósito</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            El Dashboard te da una vista general de tus finanzas en un rango de fechas: balance total,
            ingresos, gastos, ahorros, tendencias y distribución por categorías/cuentas.
          </p>
          <p>
            Úsalo para responder rápidamente preguntas como: “¿Cuánto gasté este mes?”, “¿En qué categorías se fue el dinero?”,
            “¿Cómo se distribuye mi balance entre cuentas?” y “¿Cómo ha cambiado mi neto en el tiempo?”.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Controles principales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <b>Rango de fechas</b>: afecta todas las métricas y gráficas del dashboard.
            </li>
            <li>
              <b>Agrupar por</b> (tendencias): día, semana, mes o año.
            </li>
            <li>
              <b>Moneda y zona horaria</b>: se usan para formatear montos y fechas según tus preferencias.
            </li>
            <li>
              <b>Actualización automática</b>: al cambiar rango o agrupación, se recarga la información.
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tarjetas (métricas)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <b>Balance total</b>: suma de balances de tus cuentas (según datos del backend).
            </li>
            <li>
              <b>Ingresos</b>: total de ingresos en el rango seleccionado.
            </li>
            <li>
              <b>Gastos</b>: total de gastos en el rango seleccionado.
            </li>
            <li>
              <b>Cuentas</b>: cantidad de cuentas activas.
            </li>
            <li>
              <b>Ahorros</b>: indicador neto (ingresos - gastos). Si es negativo, se muestra en rojo.
            </li>
          </ul>
          <DocImagePlaceholder
            title="[IMAGEN / GIF] Tarjetas del dashboard"
            description="Sugerencia: captura enfocada en las tarjetas de métricas superiores."
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gráficas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <b>Tendencias financieras</b>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Ingresos (línea verde)</li>
              <li>Gastos (línea roja)</li>
              <li>Neto (línea azul)</li>
              <li>Ahorros (línea naranja)</li>
              <li>
                Tooltip: al pasar el cursor muestra valores exactos en la moneda preferida.
              </li>
              <li>
                Recomendación: usa “Mes” para ver un año completo; usa “Día” para ver el comportamiento dentro de un mes.
              </li>
            </ul>
            <DocImagePlaceholder
              className="mt-3"
              title="[IMAGEN / GIF] Tooltip y selector de agrupación"
            />
          </div>

          <div>
            <b>Gastos por categoría</b> / <b>Ingresos por categoría</b>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Distribución por categoría (porcentaje y monto total)</li>
              <li>Conteo de transacciones por categoría</li>
              <li>Lista lateral con scroll cuando hay muchas categorías</li>
            </ul>
            <DocImagePlaceholder
              className="mt-3"
              title="[IMAGEN / GIF] Gráfica de pastel y lista con scroll"
            />
          </div>

          <div>
            <b>Balance por cuenta</b>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Distribución del balance total por cuenta</li>
              <li>Muestra el tipo de cuenta en el tooltip</li>
              <li>Útil para detectar cuentas con mayor peso en tu balance total</li>
            </ul>
            <DocImagePlaceholder className="mt-3" title="[IMAGEN / GIF] Tooltip de balance por cuenta" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Analítica de Presupuesto Mensual (tabla)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <b>Filtro de año</b>: cambia el año mostrado en la tabla.
            </li>
            <li>
              <b>Columnas por mes</b> y una columna final <b>Total</b> que suma el año completo.
            </li>
            <li>
              <b>Click en un mes</b>: abre un diálogo con presupuestos por categoría del período mensual.
            </li>
            <li>
              <b>Interpretación</b>: “Restante” indica cuánto margen queda por gastar (o cuánto se excedió).
            </li>
          </ul>
          <DocImagePlaceholder title="[IMAGEN / GIF] Tabla + diálogo de presupuestos por categoría" />
        </CardContent>
      </Card>

      <div className="text-sm text-muted-foreground">
        Tip: si quieres profundizar en presupuestos mensuales, revisa{" "}
        <Link className="underline underline-offset-4" href="/dashboard/docs/monthly-budgets">
          Presupuestos mensuales
        </Link>
        .
      </div>
    </PageContainer>
  )
}

