import { ConfirmEmailRequestClient } from "./confirm-email-request-client"

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export default async function ConfirmEmailRequestPage({ searchParams }: Props) {
  const resolved = (await searchParams) ?? {}
  const emailRaw = resolved.email
  const defaultEmail = typeof emailRaw === "string" ? emailRaw : ""

  return <ConfirmEmailRequestClient defaultEmail={defaultEmail} />
}

