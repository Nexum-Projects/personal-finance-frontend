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
  placeholderListControls: string
  createTitle: string
  createP1: string
  createBullets: Array<{ label: string; text: string }>
  typesTitle: string
  types: Array<{ label: string; code: string }>
  placeholderCreate: string
  editTitle: string
  editP1: string
  editBullets: string[]
  placeholderEdit: string
  actionsTitle: string
  actionsP1: string
  actionsBullets: string[]
  placeholderActions: string
  tipPrefix: string
  tipTx: string
  tipAnd: string
  tipTransfers: string
  tipSuffix: string
}

export default async function DocsAccountsPage() {
  const { language } = await getServerI18n()

  const copy: Copy =
    language === "EN"
      ? {
          back: "Back to Documentation",
          title: "Module: Accounts",
          desc:
            "Manage your accounts (bank, cash, savings, credit card, investment, etc.) and view balances.",
          placeholderList: "[IMAGE / GIF] Accounts list (table)",
          purposeTitle: "Purpose",
          purposeP1:
            "The Accounts module lets you register and organize where your money lives. Current balance updates with your transactions and transfers.",
          listTitle: "List screen",
          listBullets: [
            "“New account” button: create a new account.",
            "Search: filter by name (and other fields depending on backend).",
            "Filters: date range (if applicable) and other available filters.",
            "Sorting: by name, account type, balance and/or dates (depending on columns).",
            "Actions: row menu to view details, edit or deactivate/delete.",
            "Balance column is shown using the user's preferred currency.",
          ],
          placeholderListControls:
            "[IMAGE / GIF] Search bar, filters and row actions",
          createTitle: "Create account",
          createP1:
            "Go to Accounts and click “New account”. Fill in the fields below:",
          createBullets: [
            { label: "Name", text: 'Account name (e.g. “Bank”, “Cash”, “Card”).' },
            { label: "Type", text: "Pick the type that best represents the account." },
            { label: "Initial balance (optional)", text: "Used as starting balance (negative values not allowed)." },
          ],
          typesTitle: "Account types (humanized)",
          types: [
            { label: "Bank", code: "BANK" },
            { label: "Cash", code: "CASH" },
            { label: "Checking", code: "CHECKING" },
            { label: "Savings", code: "SAVINGS" },
            { label: "Credit card", code: "CREDIT_CARD" },
            { label: "Investment", code: "INVESTMENT" },
            { label: "Loan", code: "LOAN" },
            { label: "Other", code: "OTHER" },
          ],
          placeholderCreate: "[IMAGE / GIF] Create account form",
          editTitle: "Edit account",
          editP1:
            "Editing updates general fields (like name and type). Initial balance is not edited to avoid historical inconsistencies.",
          editBullets: [
            "Tip: update the name to make it clearer (e.g. “Bank - Payroll”).",
            "If you need to “reset” an account, it’s usually better to create a new one than to change history.",
          ],
          placeholderEdit: "[IMAGE / GIF] Edit account form",
          actionsTitle: "Row actions (menu)",
          actionsP1:
            "In the list, each row has an actions menu. Depending on state, you may see:",
          actionsBullets: [
            "View details: shows full account information.",
            "Edit: update name/type.",
            "Deactivate/Delete: removes or deactivates the account depending on backend rules.",
          ],
          placeholderActions: "[IMAGE / GIF] Account row actions menu",
          tipPrefix:
            "Tip: to understand how transactions and transfers affect balances, see ",
          tipTx: "Transactions",
          tipAnd: " and ",
          tipTransfers: "Transfers",
          tipSuffix: ".",
        }
      : language === "PT"
        ? {
            back: "Voltar para Documentação",
            title: "Módulo: Contas",
            desc:
              "Administre suas contas (banco, dinheiro, poupança, cartão, investimento, etc.) e visualize saldos.",
            placeholderList: "[IMAGEM / GIF] Lista de contas (tabela)",
            purposeTitle: "Propósito",
            purposeP1:
              "O módulo de Contas permite registrar e organizar suas fontes de dinheiro. O saldo atual é atualizado com transações e transferências.",
            listTitle: "Tela de lista",
            listBullets: [
              "Botão “Nova conta”: cria uma conta nova.",
              "Busca: filtra por nome (e outros campos conforme o backend).",
              "Filtros: intervalo de datas (se aplicável) e outros filtros disponíveis.",
              "Ordenação: por nome, tipo, saldo e/ou datas (dependendo das colunas).",
              "Ações: menu por linha para ver detalhes, editar ou desativar/excluir.",
              "Coluna de saldo aparece na moeda preferida do usuário.",
            ],
            placeholderListControls:
              "[IMAGEM / GIF] Busca, filtros e ações por linha",
            createTitle: "Criar conta",
            createP1:
              "Vá para Contas e clique em “Nova conta”. Preencha os campos abaixo:",
            createBullets: [
              { label: "Nome", text: 'Nome da conta (ex.: “Banco”, “Dinheiro”, “Cartão”).' },
              { label: "Tipo", text: "Escolha o tipo que melhor representa a conta." },
              { label: "Saldo inicial (opcional)", text: "Saldo inicial (não permite negativos)." },
            ],
            typesTitle: "Tipos de conta (humanizados)",
            types: [
              { label: "Banco", code: "BANK" },
              { label: "Dinheiro", code: "CASH" },
              { label: "Conta corrente", code: "CHECKING" },
              { label: "Poupança", code: "SAVINGS" },
              { label: "Cartão de crédito", code: "CREDIT_CARD" },
              { label: "Investimento", code: "INVESTMENT" },
              { label: "Empréstimo", code: "LOAN" },
              { label: "Outro", code: "OTHER" },
            ],
            placeholderCreate: "[IMAGEM / GIF] Formulário de criação de conta",
            editTitle: "Editar conta",
            editP1:
              "Na edição, você atualiza dados gerais (nome e tipo). O saldo inicial não é editado para evitar inconsistências históricas.",
            editBullets: [
              "Dica: atualize o nome para identificar melhor (ex.: “Banco - Folha”).",
              "Se precisar “reiniciar” uma conta, normalmente é melhor criar uma nova do que alterar históricos.",
            ],
            placeholderEdit: "[IMAGEM / GIF] Formulário de edição de conta",
            actionsTitle: "Ações por conta (menu)",
            actionsP1:
              "Na lista, cada linha tem um menu de ações. Dependendo do estado, você pode ver:",
            actionsBullets: ["Ver detalhe", "Editar", "Desativar/Excluir"],
            placeholderActions: "[IMAGEM / GIF] Menu de ações de uma conta",
            tipPrefix:
              "Dica: para entender o efeito de transações e transferências nas contas, veja ",
            tipTx: "Transações",
            tipAnd: " e ",
            tipTransfers: "Transferências",
            tipSuffix: ".",
          }
        : {
            back: "Regresar a Documentación",
            title: "Módulo: Cuentas",
            desc:
              "Administra tus cuentas (banco, efectivo, ahorro, tarjeta, inversión, etc.) y visualiza balances.",
            placeholderList: "[IMAGEN / GIF] Lista de cuentas (tabla)",
            purposeTitle: "Propósito",
            purposeP1:
              "El módulo de cuentas te permite registrar y organizar tus fuentes de dinero. El balance actual se actualiza con tus transacciones y transferencias.",
            listTitle: "Pantalla de lista",
            listBullets: [
              "Botón “Nueva cuenta”: crea una cuenta nueva.",
              "Búsqueda: filtra por nombre (y otros campos según el backend).",
              "Filtros: rango de fechas (si aplica al listado) y otros filtros disponibles.",
              "Ordenamiento: por nombre, tipo de cuenta, balance y/o fechas (según columnas).",
              "Acciones: menú por fila para ver detalle, editar o desactivar/eliminar.",
              "Columna de balance: se muestra en la moneda preferida del usuario.",
            ],
            placeholderListControls:
              "[IMAGEN / GIF] Barra de búsqueda, filtros y acciones por fila",
            createTitle: "Crear cuenta",
            createP1:
              "Para crear una cuenta, entra a Cuentas y haz clic en “Nueva cuenta”.",
            createBullets: [
              { label: "Nombre", text: "Nombre de la cuenta (ej. “Banco”, “Efectivo”, “Tarjeta”)." },
              { label: "Tipo", text: "Selecciona el tipo correcto para que el sistema lo interprete bien." },
              { label: "Balance inicial (opcional)", text: "Se usa para iniciar la cuenta (no permite negativos)." },
            ],
            typesTitle: "Tipos de cuenta (humanizados)",
            types: [
              { label: "Banco", code: "BANK" },
              { label: "Efectivo", code: "CASH" },
              { label: "Cuenta corriente", code: "CHECKING" },
              { label: "Ahorro", code: "SAVINGS" },
              { label: "Tarjeta de crédito", code: "CREDIT_CARD" },
              { label: "Inversión", code: "INVESTMENT" },
              { label: "Préstamo", code: "LOAN" },
              { label: "Otro", code: "OTHER" },
            ],
            placeholderCreate: "[IMAGEN / GIF] Formulario de creación de cuenta",
            editTitle: "Editar cuenta",
            editP1:
              "En la edición se actualizan datos generales (por ejemplo nombre y tipo). El balance inicial no se edita para evitar inconsistencias históricas.",
            editBullets: [
              "Recomendación: cambia el nombre para identificar mejor la cuenta (ej. “Banco - Nómina”).",
              "Si necesitas “reiniciar” una cuenta, es preferible crear una nueva en lugar de modificar históricos.",
            ],
            placeholderEdit: "[IMAGEN / GIF] Formulario de edición de cuenta",
            actionsTitle: "Acciones por cuenta (menú)",
            actionsP1:
              "En la lista, cada fila tiene un menú de acciones. Dependiendo del estado del registro, puedes ver:",
            actionsBullets: ["Ver detalle", "Editar", "Eliminar/Desactivar"],
            placeholderActions: "[IMAGEN / GIF] Menú de acciones de una cuenta",
            tipPrefix:
              "Tip: para entender el efecto de transferencias y transacciones sobre cuentas, revisa ",
            tipTx: "Transacciones",
            tipAnd: " y ",
            tipTransfers: "Transferencias",
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
          <DocImagePlaceholder title={copy.placeholderListControls} />
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
              <li key={b.label}>
                <b>{b.label}</b>: {b.text}
              </li>
            ))}
            <li>
              <b>{copy.typesTitle}</b>:
              <ul className="list-disc pl-5 mt-2 space-y-1">
                {copy.types.map((t) => (
                  <li key={t.code}>
                    <b>{t.label}</b> ({t.code})
                  </li>
                ))}
              </ul>
            </li>
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

      <Card>
        <CardHeader>
          <CardTitle>{copy.actionsTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>{copy.actionsP1}</p>
          <ul className="list-disc pl-5 space-y-2">
            {copy.actionsBullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          <DocImagePlaceholder title={copy.placeholderActions} />
        </CardContent>
      </Card>

      <div className="text-sm text-muted-foreground">
        {copy.tipPrefix}
        <Link className="underline underline-offset-4" href="/dashboard/docs/transactions">
          {copy.tipTx}
        </Link>
        {copy.tipAnd}
        <Link className="underline underline-offset-4" href="/dashboard/docs/transfers">
          {copy.tipTransfers}
        </Link>
        {copy.tipSuffix}
      </div>
    </PageContainer>
  )
}

