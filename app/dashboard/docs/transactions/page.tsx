import Link from "next/link"

import { PageContainer } from "@/components/display/containers/page-container"
import { PageHeader } from "@/components/display/page-header/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DocImagePlaceholder } from "@/components/docs/doc-image-placeholder"

export default function DocsTransactionsPage() {
  return (
    <PageContainer>
      <PageHeader
        backTo={{ href: "/dashboard/docs", label: "Regresar a Documentación" }}
        title="Módulo: Transacciones"
        description="Registro y control de movimientos: ingresos y gastos. Incluye filtros, búsqueda y acciones."
      />

      <DocImagePlaceholder title="[IMAGEN / GIF] Lista de transacciones (vista general)" />

      <Card>
        <CardHeader>
          <CardTitle>Propósito</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            Las transacciones registran movimientos de dinero asociados a una cuenta y una categoría.
            Existen transacciones de <b>Ingreso</b> y de <b>Gasto</b>.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Vistas disponibles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <b>Transacciones</b>: vista consolidada (ingresos y gastos juntos).
            </li>
            <li>
              <b>Ingresos</b>: vista con solo ingresos.
            </li>
            <li>
              <b>Gastos</b>: vista con solo gastos.
            </li>
          </ul>
          <DocImagePlaceholder title="[IMAGEN / GIF] Navegación entre Transacciones / Ingresos / Gastos" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pantalla de lista</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <b>Búsqueda</b>: filtra por texto (por ejemplo descripción).
            </li>
            <li>
              <b>Filtros</b>: rango de fechas y filtros adicionales (cuenta/categoría según pantalla).
            </li>
            <li>
              <b>Ordenamiento</b>: por monto, fecha de transacción y/o fecha de actualización.
            </li>
            <li>
              <b>Acciones por fila</b>: ver detalle, editar, eliminar.
            </li>
            <li>
              <b>Montos con signo</b>: en la vista consolidada se muestran con + (ingreso) o - (gasto).
            </li>
          </ul>
          <DocImagePlaceholder title="[IMAGEN / GIF] Barra de búsqueda + filtros + menú de acciones" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Filtros (detalle)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>
            El panel de filtros te ayuda a “acotar” resultados sin perder contexto:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <b>Rango de fechas</b>: útil para ver un mes específico o un rango personalizado.
            </li>
            <li>
              <b>Cuenta</b>: (si está disponible) para ver movimientos de una cuenta concreta.
            </li>
            <li>
              <b>Categoría</b>: (si está disponible) para analizar una categoría específica.
            </li>
          </ul>
          <DocImagePlaceholder title="[IMAGEN / GIF] Panel de filtros abierto (Sheet)" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Crear / editar transacción</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>
            Para crear, normalmente hay un botón <b>Nueva</b> en la pantalla correspondiente (Ingresos o Gastos).
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <b>Monto</b>: monto de la transacción.
            </li>
            <li>
              <b>Descripción</b>: detalle del movimiento.
            </li>
            <li>
              <b>Categoría</b>: ingreso o gasto (según el tipo).
            </li>
            <li>
              <b>Cuenta</b>: cuenta afectada.
            </li>
            <li>
              <b>Fecha</b>: fecha de la transacción.
            </li>
            <li>
              <b>Validaciones comunes</b>: monto mayor a 0, campos requeridos y longitudes de texto.
            </li>
          </ul>
          <DocImagePlaceholder title="[IMAGEN / GIF] Formulario de transacción (crear/editar)" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Acciones por transacción</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <b>Ver detalle</b>: muestra toda la información y timestamps.
            </li>
            <li>
              <b>Editar</b>: ajusta monto, descripción, cuenta/categoría/fecha (según permisos/reglas).
            </li>
            <li>
              <b>Eliminar</b>: elimina (o desactiva) el registro; puede pedir confirmación.
            </li>
          </ul>
          <DocImagePlaceholder title="[IMAGEN / GIF] Menú de acciones de una transacción" />
        </CardContent>
      </Card>

      <div className="text-sm text-muted-foreground">
        Tip: para movimientos entre cuentas sin categoría, revisa{" "}
        <Link className="underline underline-offset-4" href="/dashboard/docs/transfers">
          Transferencias
        </Link>
        .
      </div>
    </PageContainer>
  )
}

