import { Metadata } from "next"
import { notFound } from "next/navigation"
import { findAccount } from "@/app/actions/accounts"
import { PageContainer } from "@/components/display/containers/page-container"
import { PageHeader } from "@/components/display/page-header/page-header"
import { EditAccountForm } from "../components/edit-account-form"

type Props = {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { id } = await props.params
  const account = await findAccount(id)

  if (account.status === "error" || !account.data) {
    return {
      title: "Cuenta no encontrada",
    }
  }

  return {
    title: `Editar ${account.data.name}`,
  }
}

export default async function EditAccountPage(props: Props) {
  const { id } = await props.params
  const account = await findAccount(id)

  if (account.status === "error" || !account.data) {
    return notFound()
  }

  const BACK_TO_HREF = "/dashboard/accounts"

  return (
    <PageContainer>
      <PageHeader
        backTo={{
          href: BACK_TO_HREF,
          label: "Regresar a cuentas",
        }}
        title={`Editar ${account.data.name}`}
      />
      <EditAccountForm account={account.data} backToHref={BACK_TO_HREF} />
    </PageContainer>
  )
}


