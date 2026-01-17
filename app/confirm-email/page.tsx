import { ConfirmEmailClient } from "./confirm-email-client"

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export default async function ConfirmEmailPage({ searchParams }: Props) {
  const resolvedSearchParams = (await searchParams) ?? {}
  const tokenRaw = resolvedSearchParams.token
  const token = typeof tokenRaw === "string" ? tokenRaw : ""

  return <ConfirmEmailClient token={token} />
}

