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
  formTitle: string
  formP1: string
  formBullets: string[]
  placeholderForm: string
  actionsTitle: string
  actionsBullets: string[]
  placeholderDelete: string
  tipPrefix: string
  tipDashboard: string
  tipAnd: string
  tipMonthly: string
  tipSuffix: string
}

export default async function DocsCategoriesPage() {
  const { language } = await getServerI18n()

  const copy: Copy =
    language === "EN"
      ? {
          back: "Back to Documentation",
          title: "Module: Categories",
          desc:
            "Define and manage income/expense categories used to classify transactions and budgets.",
          placeholderList: "[IMAGE / GIF] Categories list (table) + type filter",
          purposeTitle: "Purpose",
          purposeP1:
            "Categories are used to classify transactions (income/expenses) and to create monthly category budgets (usually for expenses).",
          listTitle: "List screen",
          listBullets: [
            "“New category” button: create a new category.",
            "Search: filter by name.",
            "Type filter: choose between Expense and Income.",
            "Date filters: date range (if available in the list).",
            "Row actions: view details, edit, deactivate/delete.",
            "Best practice: use consistent names (e.g. “Food”, “Transport”, “Utilities”).",
          ],
          placeholderFilters: "[IMAGE / GIF] Filter sheet + type selector",
          formTitle: "Create / edit category",
          formP1:
            "To create, click “New category”. To edit, use the row actions menu.",
          formBullets: [
            "Name: category name (e.g. “Food”, “Salary”).",
            "Type: INCOME or EXPENSE.",
            "Impact: type defines where it’s used; monthly budgets usually use Expense categories.",
          ],
          placeholderForm: "[IMAGE / GIF] Category form",
          actionsTitle: "Actions and filters (details)",
          actionsBullets: [
            "Type filter: pick Expense when building monthly budgets or analyzing expenses.",
            "Deactivate/Delete: if a category is referenced by transactions, the backend may block deletion.",
          ],
          placeholderDelete: "[IMAGE / GIF] Delete state (confirmation / error if in use)",
          tipPrefix: "Tip: to see how categories are used in analytics, check ",
          tipDashboard: "Dashboard",
          tipAnd: " and ",
          tipMonthly: "Monthly budgets",
          tipSuffix: ".",
        }
      : language === "PT"
        ? {
            back: "Voltar para Documentação",
            title: "Módulo: Categorias",
            desc:
              "Defina e administre categorias de receitas e despesas para classificar transações e orçamentos.",
            placeholderList: "[IMAGEM / GIF] Lista de categorias (tabela) + filtro por tipo",
            purposeTitle: "Propósito",
            purposeP1:
              "As categorias são usadas para classificar transações (receitas/despesas) e para criar orçamentos mensais por categoria (principalmente despesas).",
            listTitle: "Tela de lista",
            listBullets: [
              "Botão “Nova categoria”: cria uma categoria.",
              "Busca: filtra por nome.",
              "Filtro por tipo: Despesa ou Receita.",
              "Filtros por data: intervalo de datas (se aplicável).",
              "Ações por linha: ver detalhe, editar, desativar/excluir.",
              "Boas práticas: nomes consistentes (ex.: “Alimentação”, “Transporte”, “Serviços”).",
            ],
            placeholderFilters: "[IMAGEM / GIF] Painel de filtros + seletor de tipo",
            formTitle: "Criar / editar categoria",
            formP1:
              "Para criar, clique em “Nova categoria”. Para editar, use o menu de ações da linha.",
            formBullets: [
              "Nome: nome da categoria (ex.: “Alimentação”, “Salário”).",
              "Tipo: INCOME (Receita) ou EXPENSE (Despesa).",
              "Impacto: o tipo define o uso; orçamentos mensais normalmente usam categorias de Despesa.",
            ],
            placeholderForm: "[IMAGEM / GIF] Formulário de categoria",
            actionsTitle: "Ações e filtros (detalhe)",
            actionsBullets: [
              "Filtro por tipo: selecione Despesa ao criar orçamentos mensais.",
              "Desativar/Excluir: se estiver em uso por transações, o backend pode impedir a exclusão.",
            ],
            placeholderDelete: "[IMAGEM / GIF] Estado ao excluir (confirmação / erro se estiver em uso)",
            tipPrefix: "Dica: para ver como categorias são usadas na análise, veja ",
            tipDashboard: "Painel",
            tipAnd: " e ",
            tipMonthly: "Orçamentos mensais",
            tipSuffix: ".",
          }
        : {
            back: "Regresar a Documentación",
            title: "Módulo: Categorías",
            desc:
              "Define y administra categorías de ingresos y gastos para clasificar transacciones y presupuestos.",
            placeholderList: "[IMAGEN / GIF] Lista de categorías (tabla) + filtro por tipo",
            purposeTitle: "Propósito",
            purposeP1:
              "Las categorías se usan para clasificar transacciones (ingresos/gastos) y para crear presupuestos mensuales por categoría (principalmente para gastos).",
            listTitle: "Pantalla de lista",
            listBullets: [
              "Botón “Nueva categoría”: crea una categoría nueva.",
              "Búsqueda: filtra por nombre.",
              "Filtro por tipo: permite elegir entre Gasto e Ingreso.",
              "Filtros por fecha: rango de fechas (si aplica al listado).",
              "Acciones por fila: ver detalle, editar, eliminar.",
              "Buenas prácticas: usa nombres consistentes (ej. “Comida”, “Transporte”, “Servicios”).",
            ],
            placeholderFilters: "[IMAGEN / GIF] Sheet/Panel de filtros + combobox de tipo",
            formTitle: "Crear / editar categoría",
            formP1:
              "Para crear una categoría, haz clic en Nueva categoría. Para editar, entra al menú de acciones de una fila.",
            formBullets: [
              "Nombre: nombre de la categoría (ej. “Comida”, “Salario”).",
              "Tipo: INCOME (Ingreso) o EXPENSE (Gasto).",
              "Impacto: el tipo define dónde se utiliza; presupuestos mensuales suelen usar categorías de gasto.",
            ],
            placeholderForm: "[IMAGEN / GIF] Formulario de categoría",
            actionsTitle: "Acciones y filtros (detalle)",
            actionsBullets: [
              "Filtro por tipo: selecciona Gasto si estás creando presupuestos mensuales o analizando gastos.",
              "Eliminar: si una categoría está referenciada por transacciones, el backend puede impedirlo.",
            ],
            placeholderDelete: "[IMAGEN / GIF] Estado al eliminar (confirmación / error si está en uso)",
            tipPrefix: "Tip: para ver cómo se usan categorías en analítica, revisa ",
            tipDashboard: "Dashboard",
            tipAnd: " y ",
            tipMonthly: "Presupuestos mensuales",
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
          <DocImagePlaceholder title={copy.placeholderDelete} />
        </CardContent>
      </Card>

      <div className="text-sm text-muted-foreground">
        {copy.tipPrefix}
        <Link className="underline underline-offset-4" href="/dashboard/docs/dashboard">
          {copy.tipDashboard}
        </Link>
        {copy.tipAnd}
        <Link className="underline underline-offset-4" href="/dashboard/docs/monthly-budgets">
          {copy.tipMonthly}
        </Link>
        {copy.tipSuffix}
      </div>
    </PageContainer>
  )
}

