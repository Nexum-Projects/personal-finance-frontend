import { findManyCategories } from "@/app/actions/categories"
import findManyAccounts from "@/app/actions/accounts/find-many"
import { NewTransactionForm } from "../../../expenses/components/new-transaction-form"
import { PageContainer } from "@/components/display/containers/page-container"
import { PageHeader } from "@/components/display/page-header/page-header"
import { getServerI18n } from "@/utils/i18n/server"

const BACK_TO_HREF = "/dashboard/transactions/expenses"

export default async function NewTransactionExpensePage() {
  const { t } = await getServerI18n()
  // Cargar categorías de tipo EXPENSE
  const categoriesResult = await findManyCategories({
    page: 1,
    limit: 100,
    categoryType: "EXPENSE",
    pagination: false,
  })

  // Cargar cuentas
  const accountsResult = await findManyAccounts()

  const categories = categoriesResult.status === "success" ? categoriesResult.data.data : []
  const accounts = accountsResult.status === "success" ? accountsResult.data.data : []

  return (
    <PageContainer>
      <PageHeader
        backTo={{
          href: BACK_TO_HREF,
          label: t("transactions.backToExpenses"),
        }}
        title={t("transactions.newExpenseTitle")}
      />
      <NewTransactionForm
        backToHref={BACK_TO_HREF}
        categories={Array.isArray(categories) ? categories : []}
        accounts={accounts}
        categoryType="EXPENSE"
      />
    </PageContainer>
  )
}

