import { Metadata } from "next"
import {
  TransactionDetail,
  generateTransactionMetadata,
} from "../../components/transaction-detail"

type Props = {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { id } = await props.params
  return generateTransactionMetadata(id)
}

export default async function TransactionExpenseDetailPage(props: Props) {
  const { id } = await props.params
  return <TransactionDetail id={id} categoryType="EXPENSE" />
}
