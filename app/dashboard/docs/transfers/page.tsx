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
  listBullets: string[]
  placeholderFilters: string
  createTitle: string
  createP1: string
  createBullets: string[]
  placeholderCreate: string
  editTitle: string
  editP1: string
  editBullets: string[]
  placeholderEdit: string
  tipPrefix: string
  tipDashboard: string
  tipSuffix: string
}

export default async function DocsTransfersPage() {
  const { language } = await getServerI18n()

  const copy: Copy =
    language === "EN"
      ? {
          back: "Back to Documentation",
          title: "Module: Transfers",
          desc: "Move money between accounts (from/to) with date and description.",
          placeholderList: "[IMAGE / GIF] Transfers list + date filters",
          purposeTitle: "Purpose",
          purposeP1:
            "A transfer moves balance from one account to another. Use it for internal movements (e.g. Bank → Cash) instead of recording an income/expense.",
          listTitle: "List screen",
          listBullets: [
            "“New transfer” button: create a new transfer.",
            "Search: filter by text (e.g. description).",
            "Filters: date range (start/end).",
            "Sorting: by date, amount and/or last update (depending on columns).",
            "Row actions: view details, edit, delete/deactivate.",
            "Tip: use date filters to reconcile a week/biweekly period.",
          ],
          placeholderFilters: "[IMAGE / GIF] Filter sheet + row actions",
          createTitle: "Create transfer",
          createP1:
            "Use transfers when money moves between your own accounts (not an income/expense).",
          createBullets: [
            "From account: where money leaves.",
            "To account: where money arrives.",
            "Validation: the same account cannot be used as from and to.",
            "Amount and description: movement details.",
            "Date: transfer date.",
            "Insufficient funds: if there is not enough balance, you’ll see a humanized message with current balance and requested amount.",
          ],
          placeholderCreate: "[IMAGE / GIF] Transfer form (create)",
          editTitle: "Edit transfer",
          editP1:
            "Editing usually adjusts amount and/or description (depending on system rules).",
          editBullets: [
            "If you need to change from/to, it’s often better to create a new transfer and delete the old one (depending on your workflow).",
          ],
          placeholderEdit: "[IMAGE / GIF] Transfer form (edit)",
          tipPrefix: "Tip: to see impact in reports, check ",
          tipDashboard: "Dashboard",
          tipSuffix: ".",
        }
      : language === "PT"
        ? {
            back: "Voltar para Documentação",
            title: "Módulo: Transferências",
            desc: "Mova dinheiro entre contas (origem e destino) com data e descrição.",
            placeholderList: "[IMAGEM / GIF] Lista de transferências + filtros de data",
            purposeTitle: "Propósito",
            purposeP1:
              "Uma transferência move saldo de uma conta para outra. É útil para movimentos internos (ex.: Banco → Dinheiro) e não deve ser registrada como receita/despesa.",
            listTitle: "Tela de lista",
            listBullets: [
              "Botão “Nova transferência”: cria uma transferência.",
              "Busca: filtra por texto (ex.: descrição).",
              "Filtros: intervalo de datas (início/fim).",
              "Ordenação: por data, valor e/ou atualização.",
              "Ações por linha: ver detalhe, editar, excluir/desativar.",
              "Dica: use o filtro de datas para conciliar uma semana ou quinzena.",
            ],
            placeholderFilters: "[IMAGEM / GIF] Painel de filtros + ações por linha",
            createTitle: "Criar transferência",
            createP1:
              "Use transferências quando o dinheiro se move entre contas próprias (não é receita/despesa).",
            createBullets: [
              "Conta de origem: de onde sai o dinheiro.",
              "Conta de destino: para onde entra o dinheiro.",
              "Validação: não permite usar a mesma conta como origem e destino.",
              "Valor e descrição: dados do movimento.",
              "Data: data da transferência.",
              "Saldo insuficiente: se não houver saldo, o sistema mostra mensagem com saldo atual e valor solicitado.",
            ],
            placeholderCreate: "[IMAGEM / GIF] Formulário de transferência (criar)",
            editTitle: "Editar transferência",
            editP1:
              "Na edição normalmente se ajusta o valor e/ou descrição (conforme regras do sistema).",
            editBullets: [
              "Se precisar mudar origem/destino, normalmente é melhor criar uma nova e excluir a anterior (conforme seu fluxo).",
            ],
            placeholderEdit: "[IMAGEM / GIF] Formulário de transferência (editar)",
            tipPrefix: "Dica: para ver o impacto em relatórios, veja ",
            tipDashboard: "Painel",
            tipSuffix: ".",
          }
        : {
            back: "Regresar a Documentación",
            title: "Módulo: Transferencias",
            desc: "Mueve dinero entre cuentas (origen y destino) con fecha y descripción.",
            placeholderList: "[IMAGEN / GIF] Lista de transferencias + filtros de fecha",
            purposeTitle: "Propósito",
            purposeP1:
              "Una transferencia mueve saldo de una cuenta a otra. Es útil cuando el movimiento no es un ingreso/gasto sino un traspaso interno (por ejemplo, de Banco a Efectivo).",
            listTitle: "Pantalla de lista",
            listBullets: [
              "Botón “Nueva transferencia”: crea una transferencia nueva.",
              "Búsqueda: filtra por texto (ej. descripción).",
              "Filtros: rango de fechas (inicio/fin).",
              "Ordenamiento: por fecha, monto y/o actualización (según columnas).",
              "Acciones por fila: ver detalle, editar, eliminar.",
              "Consejo: usa el filtro de fechas para conciliar movimientos de una semana o quincena.",
            ],
            placeholderFilters: "[IMAGEN / GIF] Sheet/Panel de filtros + acciones por fila",
            createTitle: "Crear transferencia",
            createP1:
              "Las transferencias se usan cuando el dinero se mueve entre cuentas propias (no es un gasto/ingreso).",
            createBullets: [
              "Cuenta de Origen: de dónde sale el dinero.",
              "Cuenta de Destino: a dónde entra el dinero.",
              "Validación: no se permite usar la misma cuenta como origen y destino.",
              "Monto y descripción: datos del movimiento.",
              "Fecha: fecha de la transferencia.",
              "Fondos insuficientes: si no hay saldo, el sistema mostrará un mensaje humanizado indicando saldo y monto.",
            ],
            placeholderCreate: "[IMAGEN / GIF] Formulario de transferencia (crear)",
            editTitle: "Editar transferencia",
            editP1:
              "En la edición normalmente se ajusta el monto y/o descripción (según reglas del sistema).",
            editBullets: [
              "Si necesitas cambiar origen/destino, lo recomendado es crear una nueva transferencia y eliminar la anterior (según tu flujo).",
            ],
            placeholderEdit: "[IMAGEN / GIF] Formulario de transferencia (editar)",
            tipPrefix: "Tip: para ver el impacto en reportes, revisa ",
            tipDashboard: "Dashboard",
            tipSuffix: ".",
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
          <ul className="list-disc pl-5 space-y-2">
            {copy.listBullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          <DocImagePlaceholder title={copy.placeholderFilters} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{copy.createTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>{copy.createP1}</p>
          <ul className="list-disc pl-5 space-y-2">
            {copy.createBullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          <DocImagePlaceholder title={copy.placeholderCreate} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{copy.editTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>{copy.editP1}</p>
          <ul className="list-disc pl-5 space-y-2">
            {copy.editBullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          <DocImagePlaceholder title={copy.placeholderEdit} />
        </CardContent>
      </Card>

      <div className="text-sm text-muted-foreground">
        {copy.tipPrefix}
        <Link className="underline underline-offset-4" href="/dashboard/docs/dashboard">
          {copy.tipDashboard}
        </Link>
        {copy.tipSuffix}
      </div>
    </PageContainer>
  )
}

