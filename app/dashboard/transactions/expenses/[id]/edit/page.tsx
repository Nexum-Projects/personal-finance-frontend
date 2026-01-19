import { Metadata } from "next"
import { notFound } from "next/navigation"
import { findTransaction } from "@/app/actions/transactions"
import { findManyCategories } from "@/app/actions/categories"
import { findManyAccounts } from "@/app/actions/accounts"
import { EditTransactionForm } from "../../../../expenses/components/edit-transaction-form"
import { PageContainer } from "@/components/display/containers/page-container"
import { PageHeader } from "@/components/display/page-header/page-header"
import { getServerI18n } from "@/utils/i18n/server"

type Props = {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { id } = await props.params
  const { t } = await getServerI18n()

  const transaction = await findTransaction(id)

  if (transaction.status === "error" || !transaction.data) {
    return {
      title: t("transactions.detail.notFound"),
    }
  }

  return {
    title: t("transactions.editTitle", { description: transaction.data.description }),
  }
}

const BACK_TO_HREF = "/dashboard/transactions/expenses"

export default async function EditTransactionExpensePage(props: Props) {
  const { id } = await props.params
  const { t } = await getServerI18n()

  const transaction = await findTransaction(id)

  if (transaction.status === "error" || !transaction.data) {
    return notFound()
  }

  const trans = transaction.data

  // Cargar categorías del mismo tipo
  const categoriesResult = await findManyCategories({
    page: 1,
    limit: 5,
    categoryType: trans.category.categoryType,
    pagination: false,
  })

  // Cargar cuentas
  const accountsResult = await findManyAccounts({ page: 1, limit: 5, pagination: false })

  const categories = categoriesResult.status === "success" ? categoriesResult.data.data : []
  const accounts = accountsResult.status === "success" ? accountsResult.data.data : []

  return (
    <PageContainer>
      <PageHeader
        backTo={{
          href: `${BACK_TO_HREF}/${id}`,
          label: t("transactions.backToDetail"),
        }}
        title={t("transactions.editTitle", { description: trans.description })}
      />
      <EditTransactionForm
        transaction={trans}
        backToHref={`${BACK_TO_HREF}/${id}`}
        categories={categories}
        accounts={accounts}
        categoryType="EXPENSE"
      />
    </PageContainer>
  )
}

