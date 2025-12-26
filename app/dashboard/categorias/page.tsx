import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function CategoriasPage() {
  return (
    <div className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Categorías</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona tus categorías de gastos e ingresos
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Categorías</CardTitle>
            <CardDescription>
              Aquí podrás ver y gestionar todas tus categorías
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Próximamente: Lista de categorías y opciones para crear, editar y eliminar.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

