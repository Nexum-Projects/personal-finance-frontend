import Link from "next/link"

import { PageContainer } from "@/components/display/containers/page-container"
import { PageHeader } from "@/components/display/page-header/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DocsGettingStartedPage() {
  return (
    <PageContainer>
      <PageHeader
        backTo={{ href: "/dashboard/docs", label: "Regresar a Documentación" }}
        title="Primeros pasos"
        description="Guía rápida de qué crear primero para empezar a usar el sistema sin fricción."
      />

      <Card>
        <CardHeader>
          <CardTitle>1) Configura tu perfil (recomendado)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            Antes de registrar datos, revisa tu <b>Moneda preferida</b> y <b>Zona horaria</b> en{" "}
            <Link className="underline underline-offset-4" href="/dashboard/profile/edit">
              Editar usuario
            </Link>
            .
          </p>
          <p className="text-muted-foreground">
            Nota: al guardar cambios de moneda/zona horaria, se cerrará sesión para aplicar los cambios.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>2) Crea tus cuentas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            Ve a{" "}
            <Link className="underline underline-offset-4" href="/dashboard/accounts">
              Cuentas
            </Link>{" "}
            y crea al menos una cuenta.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Crea cuentas como: <b>Banco</b>, <b>Efectivo</b>, <b>Tarjeta de crédito</b>, etc.
            </li>
            <li>
              Si aplica, ingresa un <b>balance inicial</b> para empezar con un saldo real.
            </li>
            <li>
              Elige el <b>tipo de cuenta</b> correcto: Banco, Efectivo, Cuenta corriente, Ahorro,
              Tarjeta de crédito, Inversión, Préstamo u Otro.
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>3) Crea tus categorías</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            Ve a{" "}
            <Link className="underline underline-offset-4" href="/dashboard/categories">
              Categorías
            </Link>{" "}
            y crea categorías de <b>Gasto</b> e <b>Ingreso</b>.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Ejemplos de <b>Gasto</b>: Comida, Transporte, Servicios, Renta.
            </li>
            <li>
              Ejemplos de <b>Ingreso</b>: Salario, Ventas, Intereses.
            </li>
            <li>
              Consejo: mantén nombres consistentes para facilitar filtros y reportes.
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>4) (Opcional) Crea tu presupuesto mensual</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            Si quieres planificar tus gastos por mes, ve a{" "}
            <Link className="underline underline-offset-4" href="/dashboard/monthly-periods">
              Presupuestos mensuales
            </Link>{" "}
            y crea el período del mes actual (o el mes que deseas controlar).
          </p>
          <p>
            Luego, dentro del período, crea presupuestos por categoría (normalmente categorías de <b>Gasto</b>):
            cuánto planeas gastar y cuánto llevas.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>5) Registra transacciones (Ingresos y Gastos)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            Con cuentas y categorías listas, registra tus movimientos en{" "}
            <Link className="underline underline-offset-4" href="/dashboard/transactions">
              Transacciones
            </Link>
            .
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Un <b>Ingreso</b> incrementa el saldo de la cuenta.
            </li>
            <li>
              Un <b>Gasto</b> disminuye el saldo de la cuenta.
            </li>
            <li>
              Usa <b>filtros por fecha</b> para revisar semanas/meses específicos.
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>6) Usa transferencias para mover dinero entre cuentas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            Si mueves dinero entre tus cuentas (ej. Banco → Efectivo), usa{" "}
            <Link className="underline underline-offset-4" href="/dashboard/transfers">
              Transferencias
            </Link>{" "}
            en lugar de crear un gasto/ingreso.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              El sistema valida que origen y destino no sean la misma cuenta.
            </li>
            <li>
              Si no hay saldo suficiente, verás un mensaje con saldo actual y monto solicitado.
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Checklist mínimo para “empezar a ver el dashboard con sentido”</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <ul className="list-disc pl-5 space-y-2">
            <li>Al menos 1 cuenta creada</li>
            <li>Al menos 1 categoría de gasto y 1 de ingreso</li>
            <li>Al menos 1 transacción de ingreso y 1 de gasto</li>
            <li>(Opcional) 1 presupuesto mensual con 2–5 presupuestos por categoría</li>
          </ul>
        </CardContent>
      </Card>
    </PageContainer>
  )
}

