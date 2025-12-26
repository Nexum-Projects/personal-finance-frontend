# Personal Finance Frontend

Frontend de la aplicación de gestión de finanzas personales desarrollado con Next.js, TypeScript, Tailwind CSS y Shadcn UI.

## 🎨 Paleta de Colores

El diseño utiliza un modo oscuro premium inspirado en Stripe, Notion y Linear:

- **Fondo principal**: Deep dark blue-gray (`hsl(222, 47%, 11%)`)
- **Tarjetas/Superficies**: Slightly lighter (`hsl(222, 47%, 13%)`)
- **Acción primaria**: Vibrant blue (`hsl(217, 91%, 60%)`)
- **Acción secundaria**: Muted blue-gray (`hsl(215, 28%, 17%)`)
- **Éxito (Ingresos)**: Soft green (`hsl(142, 76%, 36%)`)
- **Error/Gastos**: Soft red (`hsl(0, 72%, 51%)`)
- **Texto principal**: Light gray-blue (`hsl(213, 31%, 91%)`)
- **Texto secundario**: Muted gray (`hsl(215, 16%, 57%)`)

Ver documentación completa de colores en [`docs/COLOR_PALETTE.md`](docs/COLOR_PALETTE.md)

## 🚀 Inicio Rápido

### Requisitos
- Node.js 18+
- Yarn

### Instalación

```bash
# Instalar dependencias
yarn install

# Ejecutar en desarrollo
yarn dev

# Build para producción
yarn build

# Ejecutar producción
yarn start
```

### Configuración

Crea un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

## 📁 Estructura del Proyecto

```
personal-finance-frontend/
├── app/
│   ├── dashboard/      # Dashboard principal
│   ├── login/          # Página de login
│   ├── globals.css     # Estilos globales y variables CSS
│   ├── layout.tsx      # Layout principal
│   └── page.tsx        # Página de inicio (redirige a login)
├── components/
│   └── ui/             # Componentes de Shadcn UI
├── lib/
│   ├── api.ts          # Configuración de Axios
│   ├── auth.ts         # Servicios de autenticación
│   └── utils.ts        # Utilidades
├── docs/
│   └── COLOR_PALETTE.md # Documentación de colores
└── public/             # Archivos estáticos
```

## 🛠️ Tecnologías

- **Next.js 14** - Framework React
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utility-first
- **Shadcn UI** - Componentes UI
- **React Hook Form** - Manejo de formularios
- **Zod** - Validación de esquemas
- **Axios** - Cliente HTTP
- **Lucide React** - Iconos

## 📝 Scripts Disponibles

- `yarn dev` - Inicia el servidor de desarrollo
- `yarn build` - Construye la aplicación para producción
- `yarn start` - Inicia el servidor de producción
- `yarn lint` - Ejecuta ESLint
- `yarn format` - Formatea el código con Prettier
- `yarn format:check` - Verifica el formato sin modificar

## 🔗 Conexión con la API

El frontend está configurado para conectarse a la API de Spring Boot en `http://localhost:8080/api` por defecto.

Puedes cambiar la URL en el archivo `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://tu-servidor:8080/api
```

## 🎯 Características Implementadas

- ✅ Sistema de autenticación con JWT
- ✅ Página de login con validación
- ✅ Dashboard básico con diseño premium
- ✅ Sistema de colores en modo oscuro
- ✅ Componentes UI con Shadcn
- ✅ Integración con API de Spring Boot
- ✅ Prettier y ESLint configurados

## 🎯 Próximos Pasos

- [ ] Implementar gestión de cuentas
- [ ] Implementar gestión de categorías
- [ ] Implementar gestión de transacciones
- [ ] Implementar gestión de transferencias
- [ ] Implementar gestión de presupuestos mensuales
- [ ] Gráficos y visualizaciones financieras
