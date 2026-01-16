import Link from "next/link"

import { PageContainer } from "@/components/display/containers/page-container"
import { PageHeader } from "@/components/display/page-header/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DocImagePlaceholder } from "@/components/docs/doc-image-placeholder"

export default function DocsAccountsPage() {
  return (
    <PageContainer>
      <PageHeader
        backTo={{ href: "/dashboard/docs", label: "Regresar a Documentación" }}
        title="Módulo: Cuentas"
        description="Administra tus cuentas (banco, efectivo, ahorro, tarjeta, inversión, etc.) y visualiza balances."
      />

      <DocImagePlaceholder title="[IMAGEN / GIF] Lista de cuentas (tabla)" />

      <Card>
        <CardHeader>
          <CardTitle>Propósito</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            El módulo de cuentas te permite registrar y organizar tus fuentes de dinero. El balance
            actual se actualiza con tus transacciones y transferencias.
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
              <b>Botón “Nueva cuenta”</b>: crea una cuenta nueva.
            </li>
            <li>
              <b>Búsqueda</b>: filtra por nombre (y otros campos según el backend).
            </li>
            <li>
              <b>Filtros</b>: rango de fechas (si aplica al listado) y otros filtros disponibles.
            </li>
            <li>
              <b>Ordenamiento</b>: por nombre, tipo de cuenta, balance y/o fechas (según columnas).
            </li>
            <li>
              <b>Acciones</b>: menú por fila para ver detalle, editar o eliminar.
            </li>
            <li>
              <b>Columna de balance</b>: se muestra en la moneda preferida del usuario.
            </li>
          </ul>
          <DocImagePlaceholder title="[IMAGEN / GIF] Barra de búsqueda, filtros y acciones por fila" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Crear cuenta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>
            Para crear una cuenta, entra a <b>Cuentas</b> y haz clic en <b>Nueva cuenta</b>.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <b>Nombre</b>: nombre de la cuenta (ej. “Banco”, “Efectivo”, “Tarjeta”).
            </li>
            <li>
              <b>Tipo</b> (para que el usuario lo entienda):
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>
                  <b>Banco</b> (BANK)
                </li>
                <li>
                  <b>Efectivo</b> (CASH)
                </li>
                <li>
                  <b>Cuenta corriente</b> (CHECKING)
                </li>
                <li>
                  <b>Ahorro</b> (SAVINGS)
                </li>
                <li>
                  <b>Tarjeta de crédito</b> (CREDIT_CARD)
                </li>
                <li>
                  <b>Inversión</b> (INVESTMENT)
                </li>
                <li>
                  <b>Préstamo</b> (LOAN)
                </li>
                <li>
                  <b>Otro</b> (OTHER)
                </li>
              </ul>
            </li>
            <li>
              <b>Balance inicial</b> (opcional): se usa para iniciar la cuenta (no permite negativos).
            </li>
          </ul>
          <DocImagePlaceholder title="[IMAGEN / GIF] Formulario de creación de cuenta" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Editar cuenta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            En la edición se actualizan datos generales (por ejemplo nombre y tipo). El balance
            inicial no se edita para evitar inconsistencias históricas.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Recomendación: cambia el <b>nombre</b> para identificar mejor la cuenta (ej. “Banco - Nómina”).
            </li>
            <li>
              Si necesitas “reiniciar” una cuenta, es preferible crear una nueva en lugar de modificar históricos.
            </li>
          </ul>
          <DocImagePlaceholder title="[IMAGEN / GIF] Formulario de edición de cuenta" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Acciones por cuenta (menú)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>
            En la lista, cada fila tiene un menú de acciones. Dependiendo del estado del registro, puedes ver:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <b>Ver detalle</b>: muestra información completa de la cuenta.
            </li>
            <li>
              <b>Editar</b>: actualiza nombre y tipo.
            </li>
            <li>
              <b>Eliminar</b>: elimina (o desactiva) la cuenta según reglas del backend.
            </li>
          </ul>
          <DocImagePlaceholder title="[IMAGEN / GIF] Menú de acciones de una cuenta" />
        </CardContent>
      </Card>

      <div className="text-sm text-muted-foreground">
        Tip: para entender el efecto de transferencias y transacciones sobre cuentas, revisa{" "}
        <Link className="underline underline-offset-4" href="/dashboard/docs/transactions">
          Transacciones
        </Link>{" "}
        y{" "}
        <Link className="underline underline-offset-4" href="/dashboard/docs/transfers">
          Transferencias
        </Link>
        .
      </div>
    </PageContainer>
  )
}

