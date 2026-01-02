import { findManyCategories } from "@/app/actions/categories"
import { findManyAccounts } from "@/app/actions/accounts"
import { NewTransactionForm } from "../../expenses/components/new-transaction-form"
import { PageContainer } from "@/components/display/containers/page-container"
import { PageHeader } from "@/components/display/page-header/page-header"

const BACK_TO_HREF = "/dashboard/income"

export default async function NewIncomePage() {
  // Cargar categorías de tipo INCOME
  const categoriesResult = await findManyCategories({
    page: 1,
    limit: 100,
    categoryType: "INCOME",
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
          label: "Regresar a ingresos",
        }}
        title="Nuevo ingreso"
      />
      <NewTransactionForm
        backToHref={BACK_TO_HREF}
        categories={categories}
        accounts={accounts}
        categoryType="INCOME"
      />
    </PageContainer>
  )
}

