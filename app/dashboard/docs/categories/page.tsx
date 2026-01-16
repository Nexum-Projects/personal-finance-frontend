import Link from "next/link"

import { PageContainer } from "@/components/display/containers/page-container"
import { PageHeader } from "@/components/display/page-header/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DocImagePlaceholder } from "@/components/docs/doc-image-placeholder"

export default function DocsCategoriesPage() {
  return (
    <PageContainer>
      <PageHeader
        backTo={{ href: "/dashboard/docs", label: "Regresar a Documentación" }}
        title="Módulo: Categorías"
        description="Define y administra categorías de ingresos y gastos para clasificar transacciones y presupuestos."
      />

      <DocImagePlaceholder title="[IMAGEN / GIF] Lista de categorías (tabla) + filtro por tipo" />

      <Card>
        <CardHeader>
          <CardTitle>Propósito</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            Las categorías se usan para clasificar transacciones (ingresos/gastos) y para crear
            presupuestos mensuales por categoría (principalmente para gastos).
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pantalla de lista</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <b>Botón “Nueva categoría”</b>: crea una categoría nueva.
            </li>
            <li>
              <b>Búsqueda</b>: filtra por nombre.
            </li>
            <li>
              <b>Filtro por tipo</b>: permite elegir entre <b>Gasto</b> e <b>Ingreso</b>.
            </li>
            <li>
              <b>Filtros por fecha</b>: rango de fechas (si aplica al listado).
            </li>
            <li>
              <b>Acciones por fila</b>: ver detalle, editar, eliminar.
            </li>
            <li>
              <b>Buenas prácticas</b>: usa nombres consistentes (ej. “Comida”, “Transporte”, “Servicios”).
            </li>
          </ul>
          <DocImagePlaceholder title="[IMAGEN / GIF] Sheet/Panel de filtros + combobox de tipo" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Crear / editar categoría</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>
            Para crear una categoría, haz clic en <b>Nueva categoría</b>. Para editar, entra al menú de acciones de una fila.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <b>Nombre</b>: nombre de la categoría (ej. “Comida”, “Salario”).
            </li>
            <li>
              <b>Tipo</b>: INCOME (Ingreso) o EXPENSE (Gasto).
            </li>
            <li>
              <b>Impacto</b>: el tipo define dónde se utiliza; por ejemplo, presupuestos mensuales suelen usar categorías de gasto.
            </li>
          </ul>
          <DocImagePlaceholder title="[IMAGEN / GIF] Formulario de categoría" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Acciones y filtros (detalle)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <b>Filtro por tipo</b>: selecciona <b>Gasto</b> si estás creando presupuestos mensuales o analizando gastos.
            </li>
            <li>
              <b>Eliminar</b>: úsalo si una categoría ya no se utiliza; si está referenciada por transacciones, el backend puede impedirlo.
            </li>
          </ul>
          <DocImagePlaceholder title="[IMAGEN / GIF] Estado al eliminar (confirmación / error si está en uso)" />
        </CardContent>
      </Card>

      <div className="text-sm text-muted-foreground">
        Tip: para ver cómo se usan categorías en analítica, revisa{" "}
        <Link className="underline underline-offset-4" href="/dashboard/docs/dashboard">
          Dashboard
        </Link>{" "}
        y{" "}
        <Link className="underline underline-offset-4" href="/dashboard/docs/monthly-budgets">
          Presupuestos mensuales
        </Link>
        .
      </div>
    </PageContainer>
  )
}

