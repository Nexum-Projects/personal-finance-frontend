import { PageContainer } from "@/components/display/containers/page-container"
import { PageHeader } from "@/components/display/page-header/page-header"
import { NewAccountForm } from "../components/new-account-form"

const BACK_TO_HREF = "/dashboard/accounts"

export default function NewAccountPage() {
  return (
    <PageContainer>
      <PageHeader
        backTo={{
          href: BACK_TO_HREF,
          label: "Regresar a cuentas",
        }}
        title="Nueva cuenta"
      />
      <NewAccountForm backToHref={BACK_TO_HREF} />
    </PageContainer>
  )
}


