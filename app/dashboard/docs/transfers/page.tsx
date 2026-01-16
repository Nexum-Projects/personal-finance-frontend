import Link from "next/link"

import { PageContainer } from "@/components/display/containers/page-container"
import { PageHeader } from "@/components/display/page-header/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DocImagePlaceholder } from "@/components/docs/doc-image-placeholder"

export default function DocsTransfersPage() {
  return (
    <PageContainer>
      <PageHeader
        backTo={{ href: "/dashboard/docs", label: "Regresar a Documentación" }}
        title="Módulo: Transferencias"
        description="Mueve dinero entre cuentas (origen y destino) con fecha y descripción."
      />

      <DocImagePlaceholder title="[IMAGEN / GIF] Lista de transferencias + filtros de fecha" />

      <Card>
        <CardHeader>
          <CardTitle>Propósito</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            Una transferencia mueve saldo de una cuenta a otra. Es útil cuando el movimiento no es
            un ingreso/gasto sino un traspaso interno (por ejemplo, de Banco a Efectivo).
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
              <b>Botón “Nueva transferencia”</b>: crea una transferencia nueva.
            </li>
            <li>
              <b>Búsqueda</b>: filtra por texto (ej. descripción).
            </li>
            <li>
              <b>Filtros</b>: rango de fechas (inicio/fin).
            </li>
            <li>
              <b>Ordenamiento</b>: por fecha, monto y/o actualización (según columnas).
            </li>
            <li>
              <b>Acciones por fila</b>: ver detalle, editar, eliminar.
            </li>
            <li>
              <b>Consejo</b>: usa el filtro de fechas para conciliar movimientos de una semana o quincena.
            </li>
          </ul>
          <DocImagePlaceholder title="[IMAGEN / GIF] Sheet/Panel de filtros + acciones por fila" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Crear transferencia</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>
            Las transferencias se usan cuando el dinero se mueve entre cuentas propias (no es un gasto/ingreso).
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <b>Cuenta de Origen</b>: de dónde sale el dinero.
            </li>
            <li>
              <b>Cuenta de Destino</b>: a dónde entra el dinero.
            </li>
            <li>
              <b>Validación</b>: no se permite usar la misma cuenta como origen y destino.
            </li>
            <li>
              <b>Monto</b> y <b>Descripción</b>: datos del movimiento.
            </li>
            <li>
              <b>Fecha</b>: fecha de la transferencia.
            </li>
            <li>
              <b>Fondos insuficientes</b>: si no hay saldo, el sistema mostrará un mensaje humanizado indicando saldo y monto.
            </li>
          </ul>
          <DocImagePlaceholder title="[IMAGEN / GIF] Formulario de transferencia (crear)" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Editar transferencia</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            En la edición normalmente se ajusta el monto y/o descripción (según reglas del sistema),
            manteniendo cuentas y fecha según corresponda.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Si necesitas cambiar origen/destino, lo recomendado es crear una nueva transferencia y eliminar la anterior (según tu flujo).
            </li>
          </ul>
          <DocImagePlaceholder title="[IMAGEN / GIF] Formulario de transferencia (editar)" />
        </CardContent>
      </Card>

      <div className="text-sm text-muted-foreground">
        Tip: para ver el impacto en reportes, revisa{" "}
        <Link className="underline underline-offset-4" href="/dashboard/docs/dashboard">
          Dashboard
        </Link>
        .
      </div>
    </PageContainer>
  )
}

