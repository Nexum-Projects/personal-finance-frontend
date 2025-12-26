import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function GastosPage() {
  return (
    <div className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Gastos</h1>
          <p className="text-muted-foreground mt-1">
            Registra y gestiona tus gastos
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Registro de Gastos</CardTitle>
            <CardDescription>
              Aquí podrás registrar y ver todos tus gastos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Próximamente: Formulario para registrar gastos y tabla con el historial.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

