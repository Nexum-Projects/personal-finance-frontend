import Link from "next/link"

import { PageContainer } from "@/components/display/containers/page-container"
import { PageHeader } from "@/components/display/page-header/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DocImagePlaceholder } from "@/components/docs/doc-image-placeholder"

export default function DocsMonthlyBudgetsPage() {
  return (
    <PageContainer>
      <PageHeader
        backTo={{ href: "/dashboard/docs", label: "Regresar a Documentación" }}
        title="Módulo: Presupuestos mensuales"
        description="Gestiona presupuestos por mes (períodos) y presupuestos por categoría, con analítica."
      />

      <DocImagePlaceholder title="[IMAGEN / GIF] Lista de presupuestos mensuales (períodos)" />

      <Card>
        <CardHeader>
          <CardTitle>Propósito</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            Este módulo te permite organizar tus finanzas por mes, definiendo un “presupuesto mensual”
            y sus presupuestos por categoría (principalmente para gastos), además de consultar analíticas.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pantalla de lista (presupuestos mensuales)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>
            Aquí administras los “presupuestos mensuales” (períodos). Cada período representa un mes/año
            y sirve como contenedor para presupuestos por categoría y analítica.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <b>Botón “Nuevo presupuesto mensual”</b>: crea un nuevo período mensual.
            </li>
            <li>
              <b>Búsqueda</b>: filtra por texto (si aplica).
            </li>
            <li>
              <b>Filtros</b>: rango de fechas (si aplica al listado).
            </li>
            <li>
              <b>Acciones por fila</b>: ver detalle, editar, eliminar/reactivar (según disponibilidad).
            </li>
            <li>
              <b>Reactivar</b>: si un período fue desactivado, puede existir la acción de reactivarlo.
            </li>
          </ul>
          <DocImagePlaceholder title="[IMAGEN / GIF] Barra de búsqueda + filtros + menú de acciones" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Detalle de un presupuesto mensual</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>
            Al entrar al detalle de un presupuesto mensual, se muestran pestañas (tabs) como:
            <b> General</b> y <b>Presupuestos</b>.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <b>General</b>: muestra datos del período (año, mes, ahorro inicial, estado, fechas).
            </li>
            <li>
              <b>Presupuestos</b>: lista de presupuestos por categoría ligados a ese período.
            </li>
          </ul>
          <DocImagePlaceholder title="[IMAGEN / GIF] Vista de detalle + pestañas General/Presupuestos" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Presupuestos por categoría</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Se crean presupuestos por categoría ligados al presupuesto mensual.
            </li>
            <li>
              Al crear un presupuesto, el selector de categorías está enfocado a <b>categorías de gasto</b>.
            </li>
            <li>
              Cada presupuesto por categoría maneja: <b>presupuestado</b>, <b>gastado</b> y <b>restante</b>.
            </li>
            <li>
              <b>Interpretación</b>: si “restante” es negativo, significa que ya se excedió el presupuesto.
            </li>
          </ul>
          <DocImagePlaceholder title="[IMAGEN / GIF] Formulario de presupuesto por categoría" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Analítica mensual (desde el Dashboard)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>
            En el Dashboard existe una tabla de analítica por mes con una columna <b>Total</b> que suma
            cada fila a través de todos los meses. También permite abrir un diálogo con presupuestos por
            categoría al hacer clic en el encabezado de un mes.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              La columna <b>Total</b> ayuda a ver acumulados anuales por fila (ahorro inicial, ingresos, gastos, etc.).
            </li>
            <li>
              El diálogo por mes muestra, por categoría: <b>presupuestado</b>, <b>gastado</b> y <b>restante</b>.
            </li>
          </ul>
          <DocImagePlaceholder title="[IMAGEN / GIF] Tabla analítica + diálogo por mes" />
          <div className="text-sm text-muted-foreground">
            Ver más en{" "}
            <Link className="underline underline-offset-4" href="/dashboard/docs/dashboard">
              Dashboard
            </Link>
            .
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  )
}

