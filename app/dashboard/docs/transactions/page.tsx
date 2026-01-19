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
  viewsTitle: string
  views: string[]
  placeholderTabs: string
  listTitle: string
  listBullets: string[]
  placeholderControls: string
  filtersTitle: string
  filtersP1: string
  filtersBullets: string[]
  placeholderFilters: string
  formTitle: string
  formP1: string
  formBullets: string[]
  placeholderForm: string
  actionsTitle: string
  actionsBullets: string[]
  placeholderActions: string
  tipPrefix: string
  tipTransfers: string
  tipSuffix: string
}

export default async function DocsTransactionsPage() {
  const { language } = await getServerI18n()

  const copy: Copy =
    language === "EN"
      ? {
          back: "Back to Documentation",
          title: "Module: Transactions",
          desc:
            "Record and manage movements: income and expenses. Includes search, filters and row actions.",
          placeholderList: "[IMAGE / GIF] Transactions list (overview)",
          purposeTitle: "Purpose",
          purposeP1:
            "Transactions record money movements associated with an account and a category. There are Income and Expense transactions.",
          viewsTitle: "Available views",
          views: [
            "Transactions: consolidated view (income + expenses together).",
            "Income: income-only view.",
            "Expenses: expense-only view.",
          ],
          placeholderTabs: "[IMAGE / GIF] Navigation between Transactions / Income / Expenses",
          listTitle: "List screen",
          listBullets: [
            "Search: filter by text (e.g. description).",
            "Filters: date range and additional filters (account/category depending on the view).",
            "Sorting: by amount, transaction date and/or last update (depending on columns).",
            "Row actions: view details, edit, delete/deactivate.",
            "Signed amounts: consolidated view shows + (income) or - (expense).",
          ],
          placeholderControls: "[IMAGE / GIF] Search + filters + row actions menu",
          filtersTitle: "Filters (details)",
          filtersP1:
            "The filter panel helps you narrow results without losing context:",
          filtersBullets: [
            "Date range: useful to view a specific month or a custom interval.",
            "Account: (if available) to see movements for a specific account.",
            "Category: (if available) to analyze a specific category.",
          ],
          placeholderFilters: "[IMAGE / GIF] Filters panel open (Sheet)",
          formTitle: "Create / edit transaction",
          formP1:
            "To create, there is usually a “New” button in the corresponding view (Income or Expenses).",
          formBullets: [
            "Amount: transaction amount.",
            "Description: movement details.",
            "Category: income or expense (depending on type).",
            "Account: affected account.",
            "Date: transaction date.",
            "Common validations: amount > 0, required fields and text length limits.",
          ],
          placeholderForm: "[IMAGE / GIF] Transaction form (create/edit)",
          actionsTitle: "Transaction actions",
          actionsBullets: [
            "View details: shows full info and timestamps.",
            "Edit: adjust amount, description, account/category/date (depending on rules).",
            "Delete: removes (or deactivates) the record; may ask for confirmation.",
          ],
          placeholderActions: "[IMAGE / GIF] Transaction row actions menu",
          tipPrefix: "Tip: for movements between accounts without category, see ",
          tipTransfers: "Transfers",
          tipSuffix: ".",
        }
      : language === "PT"
        ? {
            back: "Voltar para Documentação",
            title: "Módulo: Transações",
            desc:
              "Registro e controle de movimentos: receitas e despesas. Inclui busca, filtros e ações.",
            placeholderList: "[IMAGEM / GIF] Lista de transações (visão geral)",
            purposeTitle: "Propósito",
            purposeP1:
              "As transações registram movimentos de dinheiro associados a uma conta e uma categoria. Existem transações de Receita e de Despesa.",
            viewsTitle: "Vistas disponíveis",
            views: [
              "Transações: vista consolidada (receitas e despesas juntas).",
              "Receitas: somente receitas.",
              "Despesas: somente despesas.",
            ],
            placeholderTabs:
              "[IMAGEM / GIF] Navegação entre Transações / Receitas / Despesas",
            listTitle: "Tela de lista",
            listBullets: [
              "Busca: filtra por texto (ex.: descrição).",
              "Filtros: intervalo de datas e filtros adicionais (conta/categoria conforme a vista).",
              "Ordenação: por valor, data da transação e/ou atualização.",
              "Ações por linha: ver detalhe, editar, excluir/desativar.",
              "Valores com sinal: na vista consolidada mostra + (receita) ou - (despesa).",
            ],
            placeholderControls: "[IMAGEM / GIF] Busca + filtros + menu de ações",
            filtersTitle: "Filtros (detalhe)",
            filtersP1: "O painel de filtros ajuda a refinar resultados:",
            filtersBullets: [
              "Intervalo de datas: útil para ver um mês específico ou um período personalizado.",
              "Conta: (se disponível) para ver movimentos de uma conta específica.",
              "Categoria: (se disponível) para analisar uma categoria específica.",
            ],
            placeholderFilters: "[IMAGEM / GIF] Painel de filtros aberto (Sheet)",
            formTitle: "Criar / editar transação",
            formP1:
              "Para criar, normalmente existe um botão “Nova” na vista correspondente (Receitas ou Despesas).",
            formBullets: [
              "Valor: valor da transação.",
              "Descrição: detalhes do movimento.",
              "Categoria: receita ou despesa (conforme o tipo).",
              "Conta: conta afetada.",
              "Data: data da transação.",
              "Validações comuns: valor > 0, campos obrigatórios e limites de texto.",
            ],
            placeholderForm: "[IMAGEM / GIF] Formulário de transação (criar/editar)",
            actionsTitle: "Ações por transação",
            actionsBullets: [
              "Ver detalhe: mostra informações e timestamps.",
              "Editar: ajusta valor, descrição, conta/categoria/data (conforme regras).",
              "Excluir: remove (ou desativa) o registro; pode pedir confirmação.",
            ],
            placeholderActions: "[IMAGEM / GIF] Menu de ações de uma transação",
            tipPrefix: "Dica: para movimentos entre contas sem categoria, veja ",
            tipTransfers: "Transferências",
            tipSuffix: ".",
          }
        : {
            back: "Regresar a Documentación",
            title: "Módulo: Transacciones",
            desc:
              "Registro y control de movimientos: ingresos y gastos. Incluye filtros, búsqueda y acciones.",
            placeholderList: "[IMAGEN / GIF] Lista de transacciones (vista general)",
            purposeTitle: "Propósito",
            purposeP1:
              "Las transacciones registran movimientos de dinero asociados a una cuenta y una categoría. Existen transacciones de Ingreso y de Gasto.",
            viewsTitle: "Vistas disponibles",
            views: [
              "Transacciones: vista consolidada (ingresos y gastos juntos).",
              "Ingresos: vista con solo ingresos.",
              "Gastos: vista con solo gastos.",
            ],
            placeholderTabs:
              "[IMAGEN / GIF] Navegación entre Transacciones / Ingresos / Gastos",
            listTitle: "Pantalla de lista",
            listBullets: [
              "Búsqueda: filtra por texto (por ejemplo descripción).",
              "Filtros: rango de fechas y filtros adicionales (cuenta/categoría según pantalla).",
              "Ordenamiento: por monto, fecha de transacción y/o fecha de actualización.",
              "Acciones por fila: ver detalle, editar, eliminar.",
              "Montos con signo: en la vista consolidada se muestran con + (ingreso) o - (gasto).",
            ],
            placeholderControls: "[IMAGEN / GIF] Barra de búsqueda + filtros + menú de acciones",
            filtersTitle: "Filtros (detalle)",
            filtersP1:
              "El panel de filtros te ayuda a acotar resultados sin perder contexto:",
            filtersBullets: [
              "Rango de fechas: útil para ver un mes específico o un rango personalizado.",
              "Cuenta: (si está disponible) para ver movimientos de una cuenta concreta.",
              "Categoría: (si está disponible) para analizar una categoría específica.",
            ],
            placeholderFilters: "[IMAGEN / GIF] Panel de filtros abierto (Sheet)",
            formTitle: "Crear / editar transacción",
            formP1:
              "Para crear, normalmente hay un botón Nueva en la pantalla correspondiente (Ingresos o Gastos).",
            formBullets: [
              "Monto: monto de la transacción.",
              "Descripción: detalle del movimiento.",
              "Categoría: ingreso o gasto (según el tipo).",
              "Cuenta: cuenta afectada.",
              "Fecha: fecha de la transacción.",
              "Validaciones comunes: monto mayor a 0, campos requeridos y longitudes de texto.",
            ],
            placeholderForm: "[IMAGEN / GIF] Formulario de transacción (crear/editar)",
            actionsTitle: "Acciones por transacción",
            actionsBullets: [
              "Ver detalle: muestra toda la información y timestamps.",
              "Editar: ajusta monto, descripción, cuenta/categoría/fecha (según reglas).",
              "Eliminar: elimina (o desactiva) el registro; puede pedir confirmación.",
            ],
            placeholderActions: "[IMAGEN / GIF] Menú de acciones de una transacción",
            tipPrefix: "Tip: para movimientos entre cuentas sin categoría, revisa ",
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
          <CardTitle>{copy.viewsTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <ul className="list-disc pl-5 space-y-2">
            {copy.views.map((v) => (
              <li key={v}>{v}</li>
            ))}
          </ul>
          <DocImagePlaceholder title={copy.placeholderTabs} />
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
          <DocImagePlaceholder title={copy.placeholderControls} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{copy.filtersTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>{copy.filtersP1}</p>
          <ul className="list-disc pl-5 space-y-2">
            {copy.filtersBullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          <DocImagePlaceholder title={copy.placeholderFilters} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{copy.formTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>{copy.formP1}</p>
          <ul className="list-disc pl-5 space-y-2">
            {copy.formBullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          <DocImagePlaceholder title={copy.placeholderForm} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{copy.actionsTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
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
        <Link className="underline underline-offset-4" href="/dashboard/docs/transfers">
          {copy.tipTransfers}
        </Link>
        {copy.tipSuffix}
      </div>
    </PageContainer>
  )
}

