import Link from "next/link"

import { PageContainer } from "@/components/display/containers/page-container"
import { PageHeader } from "@/components/display/page-header/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getServerI18n } from "@/utils/i18n/server"

type Copy = {
  backLabel: string
  title: string
  description: string
  profileTitle: string
  profileP1Prefix: string
  profileCurrencyLabel: string
  profileAnd: string
  profileTimeZoneLabel: string
  profileIn: string
  profileLinkText: string
  profileP1Suffix: string
  profileNote: string
  accountsTitle: string
  accountsP1Prefix: string
  accountsLinkText: string
  accountsP1Suffix: string
  accountsBullets: string[]
  categoriesTitle: string
  categoriesP1Prefix: string
  categoriesLinkText: string
  categoriesP1Suffix: string
  categoriesBullets: string[]
  monthlyTitle: string
  monthlyP1Prefix: string
  monthlyLinkText: string
  monthlyP1Suffix: string
  monthlyP2: string
  txTitle: string
  txP1Prefix: string
  txLinkText: string
  txP1Suffix: string
  txBullets: string[]
  transfersTitle: string
  transfersP1Prefix: string
  transfersLinkText: string
  transfersP1Suffix: string
  transfersBullets: string[]
  checklistTitle: string
  checklistBullets: string[]
}

export default async function DocsGettingStartedPage() {
  const { language } = await getServerI18n()

  const copy: Copy =
    language === "EN"
      ? {
          backLabel: "Back to Documentation",
          title: "Getting started",
          description:
            "Quick guide on what to create first to start using the system smoothly.",
          profileTitle: "1) Configure your profile (recommended)",
          profileP1Prefix: "Before entering data, review your ",
          profileCurrencyLabel: "Preferred currency",
          profileAnd: "and",
          profileTimeZoneLabel: "Time zone",
          profileIn: "in",
          profileLinkText: "Edit user",
          profileP1Suffix: ".",
          profileNote:
            "Note: when you save currency/time zone changes, you'll be signed out to apply them.",
          accountsTitle: "2) Create your accounts",
          accountsP1Prefix: "Go to ",
          accountsLinkText: "Accounts",
          accountsP1Suffix: " and create at least one account.",
          accountsBullets: [
            "Create accounts such as: Bank, Cash, Credit card, etc.",
            "If applicable, enter an initial balance to start with a real amount.",
            "Choose the right account type: Bank, Cash, Checking, Savings, Credit card, Investment, Loan, or Other.",
          ],
          categoriesTitle: "3) Create your categories",
          categoriesP1Prefix: "Go to ",
          categoriesLinkText: "Categories",
          categoriesP1Suffix: " and create Expense and Income categories.",
          categoriesBullets: [
            "Expense examples: Food, Transport, Utilities, Rent.",
            "Income examples: Salary, Sales, Interest.",
            "Tip: keep names consistent to make filters and reports easier.",
          ],
          monthlyTitle: "4) (Optional) Create your monthly budget",
          monthlyP1Prefix: "If you want to plan spending by month, go to ",
          monthlyLinkText: "Monthly budgets",
          monthlyP1Suffix:
            " and create the period for the current month (or the month you want to track).",
          monthlyP2:
            "Then, inside the period, create category budgets (usually Expense categories): how much you plan to spend and how much you've spent so far.",
          txTitle: "5) Record transactions (Income and Expenses)",
          txP1Prefix: "With accounts and categories ready, record your movements in ",
          txLinkText: "Transactions",
          txP1Suffix: ".",
          txBullets: [
            "An Income increases the account balance.",
            "An Expense decreases the account balance.",
            "Use date filters to review specific weeks/months.",
          ],
          transfersTitle: "6) Use transfers to move money between accounts",
          transfersP1Prefix:
            "If you move money between accounts (e.g. Bank → Cash), use ",
          transfersLinkText: "Transfers",
          transfersP1Suffix: " instead of creating an income/expense.",
          transfersBullets: [
            "The system validates that from/to are not the same account.",
            "If there is not enough balance, you'll see a message with current balance and requested amount.",
          ],
          checklistTitle: "Minimal checklist to “start seeing a meaningful dashboard”",
          checklistBullets: [
            "At least 1 account created",
            "At least 1 expense category and 1 income category",
            "At least 1 income transaction and 1 expense transaction",
            "(Optional) 1 monthly budget with 2–5 category budgets",
          ],
        }
      : language === "PT"
        ? {
            backLabel: "Voltar para Documentação",
            title: "Primeiros passos",
            description:
              "Guia rápido do que criar primeiro para começar a usar o sistema sem atrito.",
            profileTitle: "1) Configure seu perfil (recomendado)",
            profileP1Prefix: "Antes de registrar dados, revise sua ",
            profileCurrencyLabel: "Moeda preferida",
            profileAnd: "e",
            profileTimeZoneLabel: "Fuso horário",
            profileIn: "em",
            profileLinkText: "Editar usuário",
            profileP1Suffix: ".",
            profileNote:
              "Nota: ao salvar alterações de moeda/fuso horário, a sessão será encerrada para aplicar as mudanças.",
            accountsTitle: "2) Crie suas contas",
            accountsP1Prefix: "Vá para ",
            accountsLinkText: "Contas",
            accountsP1Suffix: " e crie pelo menos uma conta.",
            accountsBullets: [
              "Crie contas como: Banco, Dinheiro, Cartão de crédito, etc.",
              "Se aplicável, informe um saldo inicial para começar com um valor real.",
              "Escolha o tipo correto: Banco, Dinheiro, Conta corrente, Poupança, Cartão de crédito, Investimento, Empréstimo ou Outro.",
            ],
            categoriesTitle: "3) Crie suas categorias",
            categoriesP1Prefix: "Vá para ",
            categoriesLinkText: "Categorias",
            categoriesP1Suffix: " e crie categorias de Despesa e Receita.",
            categoriesBullets: [
              "Exemplos de Despesa: Alimentação, Transporte, Serviços, Aluguel.",
              "Exemplos de Receita: Salário, Vendas, Juros.",
              "Dica: mantenha nomes consistentes para facilitar filtros e relatórios.",
            ],
            monthlyTitle: "4) (Opcional) Crie seu orçamento mensal",
            monthlyP1Prefix: "Se quiser planejar gastos por mês, vá para ",
            monthlyLinkText: "Orçamentos mensais",
            monthlyP1Suffix:
              " e crie o período do mês atual (ou do mês que deseja controlar).",
            monthlyP2:
              "Depois, dentro do período, crie orçamentos por categoria (normalmente categorias de Despesa): quanto você planeja gastar e quanto já gastou.",
            txTitle: "5) Registre transações (Receitas e Despesas)",
            txP1Prefix: "Com contas e categorias prontas, registre seus movimentos em ",
            txLinkText: "Transações",
            txP1Suffix: ".",
            txBullets: [
              "Uma Receita aumenta o saldo da conta.",
              "Uma Despesa diminui o saldo da conta.",
              "Use filtros por data para revisar semanas/meses específicos.",
            ],
            transfersTitle:
              "6) Use transferências para mover dinheiro entre contas",
            transfersP1Prefix:
              "Se você move dinheiro entre contas (ex.: Banco → Dinheiro), use ",
            transfersLinkText: "Transferências",
            transfersP1Suffix: " em vez de criar uma receita/despesa.",
            transfersBullets: [
              "O sistema valida que origem e destino não sejam a mesma conta.",
              "Se não houver saldo suficiente, você verá uma mensagem com saldo atual e valor solicitado.",
            ],
            checklistTitle:
              "Checklist mínimo para “começar a ver o painel com sentido”",
            checklistBullets: [
              "Pelo menos 1 conta criada",
              "Pelo menos 1 categoria de despesa e 1 de receita",
              "Pelo menos 1 transação de receita e 1 de despesa",
              "(Opcional) 1 orçamento mensal com 2–5 orçamentos por categoria",
            ],
          }
        : {
            backLabel: "Regresar a Documentación",
            title: "Primeros pasos",
            description:
              "Guía rápida de qué crear primero para empezar a usar el sistema sin fricción.",
            profileTitle: "1) Configura tu perfil (recomendado)",
            profileP1Prefix: "Antes de registrar datos, revisa tu ",
            profileCurrencyLabel: "Moneda preferida",
            profileAnd: "y",
            profileTimeZoneLabel: "Zona horaria",
            profileIn: "en",
            profileLinkText: "Editar usuario",
            profileP1Suffix: ".",
            profileNote:
              "Nota: al guardar cambios de moneda/zona horaria, se cerrará sesión para aplicar los cambios.",
            accountsTitle: "2) Crea tus cuentas",
            accountsP1Prefix: "Ve a ",
            accountsLinkText: "Cuentas",
            accountsP1Suffix: " y crea al menos una cuenta.",
            accountsBullets: [
              "Crea cuentas como: Banco, Efectivo, Tarjeta de crédito, etc.",
              "Si aplica, ingresa un balance inicial para empezar con un saldo real.",
              "Elige el tipo de cuenta correcto: Banco, Efectivo, Cuenta corriente, Ahorro, Tarjeta de crédito, Inversión, Préstamo u Otro.",
            ],
            categoriesTitle: "3) Crea tus categorías",
            categoriesP1Prefix: "Ve a ",
            categoriesLinkText: "Categorías",
            categoriesP1Suffix: " y crea categorías de Gasto e Ingreso.",
            categoriesBullets: [
              "Ejemplos de Gasto: Comida, Transporte, Servicios, Renta.",
              "Ejemplos de Ingreso: Salario, Ventas, Intereses.",
              "Consejo: mantén nombres consistentes para facilitar filtros y reportes.",
            ],
            monthlyTitle: "4) (Opcional) Crea tu presupuesto mensual",
            monthlyP1Prefix: "Si quieres planificar tus gastos por mes, ve a ",
            monthlyLinkText: "Presupuestos mensuales",
            monthlyP1Suffix:
              " y crea el período del mes actual (o el mes que deseas controlar).",
            monthlyP2:
              "Luego, dentro del período, crea presupuestos por categoría (normalmente categorías de Gasto): cuánto planeas gastar y cuánto llevas.",
            txTitle: "5) Registra transacciones (Ingresos y Gastos)",
            txP1Prefix: "Con cuentas y categorías listas, registra tus movimientos en ",
            txLinkText: "Transacciones",
            txP1Suffix: ".",
            txBullets: [
              "Un Ingreso incrementa el saldo de la cuenta.",
              "Un Gasto disminuye el saldo de la cuenta.",
              "Usa filtros por fecha para revisar semanas/meses específicos.",
            ],
            transfersTitle: "6) Usa transferencias para mover dinero entre cuentas",
            transfersP1Prefix:
              "Si mueves dinero entre tus cuentas (ej. Banco → Efectivo), usa ",
            transfersLinkText: "Transferencias",
            transfersP1Suffix: " en lugar de crear un gasto/ingreso.",
            transfersBullets: [
              "El sistema valida que origen y destino no sean la misma cuenta.",
              "Si no hay saldo suficiente, verás un mensaje con saldo actual y monto solicitado.",
            ],
            checklistTitle:
              "Checklist mínimo para “empezar a ver el dashboard con sentido”",
            checklistBullets: [
              "Al menos 1 cuenta creada",
              "Al menos 1 categoría de gasto y 1 de ingreso",
              "Al menos 1 transacción de ingreso y 1 de gasto",
              "(Opcional) 1 presupuesto mensual con 2–5 presupuestos por categoría",
            ],
          }

  return (
    <PageContainer>
      <PageHeader
        backTo={{ href: "/dashboard/docs", label: copy.backLabel }}
        title={copy.title}
        description={copy.description}
      />

      <Card>
        <CardHeader>
          <CardTitle>{copy.profileTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            {copy.profileP1Prefix}
            <b>{copy.profileCurrencyLabel}</b> {copy.profileAnd}{" "}
            <b>{copy.profileTimeZoneLabel}</b> {copy.profileIn}{" "}
            <Link className="underline underline-offset-4" href="/dashboard/profile/edit">
              {copy.profileLinkText}
            </Link>
            {copy.profileP1Suffix}
          </p>
          <p className="text-muted-foreground">{copy.profileNote}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{copy.accountsTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            {copy.accountsP1Prefix}
            <Link className="underline underline-offset-4" href="/dashboard/accounts">
              {copy.accountsLinkText}
            </Link>{" "}
            {copy.accountsP1Suffix}
          </p>
          <ul className="list-disc pl-5 space-y-2">
            {copy.accountsBullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{copy.categoriesTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            {copy.categoriesP1Prefix}
            <Link className="underline underline-offset-4" href="/dashboard/categories">
              {copy.categoriesLinkText}
            </Link>{" "}
            {copy.categoriesP1Suffix}
          </p>
          <ul className="list-disc pl-5 space-y-2">
            {copy.categoriesBullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{copy.monthlyTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            {copy.monthlyP1Prefix}
            <Link className="underline underline-offset-4" href="/dashboard/monthly-periods">
              {copy.monthlyLinkText}
            </Link>{" "}
            {copy.monthlyP1Suffix}
          </p>
          <p>{copy.monthlyP2}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{copy.txTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            {copy.txP1Prefix}
            <Link className="underline underline-offset-4" href="/dashboard/transactions">
              {copy.txLinkText}
            </Link>
            {copy.txP1Suffix}
          </p>
          <ul className="list-disc pl-5 space-y-2">
            {copy.txBullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{copy.transfersTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            {copy.transfersP1Prefix}
            <Link className="underline underline-offset-4" href="/dashboard/transfers">
              {copy.transfersLinkText}
            </Link>{" "}
            {copy.transfersP1Suffix}
          </p>
          <ul className="list-disc pl-5 space-y-2">
            {copy.transfersBullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{copy.checklistTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <ul className="list-disc pl-5 space-y-2">
            {copy.checklistBullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </PageContainer>
  )
}

