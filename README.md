# Nexum Finanzas Personales — Frontend

Frontend de **Nexum Finanzas Personales**, una aplicación de gestión de finanzas personales (cuentas, categorías, transacciones, transferencias y presupuestos mensuales), desarrollada con **Next.js (App Router)**, **TypeScript**, **Tailwind CSS** y **shadcn/ui**.

Incluye:
- **Autenticación** (login/registro), confirmación de email y recuperación de contraseña.
- **Dashboard** con gráficas (Recharts) y analítica por períodos/presupuestos.
- **Preferencias de usuario** (moneda, zona horaria, idioma ES/EN/PT).
- **i18n** en la UI (progresivamente aplicado en módulos clave).
- **Documentación interna** para usuarios dentro del dashboard.

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

## 🚀 Inicio rápido (desarrollo)

### Requisitos
- **Node.js 18+**
- **Yarn**
- Backend/API corriendo (Spring Boot)

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

### Configuración (.env.local)

Crea un archivo `.env.local` en la raíz del proyecto con **las variables definidas en `utils/env.ts`**:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_SITE_NAME="Nexum Finanzas Personales"
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> Nota: este proyecto usa **Next.js App Router** (carpeta `app/`) y Server Actions para comunicarse con la API.

### Flujo recomendado para probar el sistema
- **1) Registrar usuario** en `/register`
- **2) Confirmar email** desde el link recibido (página `/confirm-email?token=...`)
- **3) Iniciar sesión** en `/login`
- **4) (Opcional) Ajustar preferencias** en `/dashboard/profile/edit`:
  - **Moneda**, **zona horaria** e **idioma**
  - Al guardar, el sistema **cierra sesión automáticamente** para aplicar los cambios del token.
- **5) Crear datos base**:
  - **Cuentas** → `/dashboard/accounts`
  - **Categorías** → `/dashboard/categories`
  - **Transacciones** → `/dashboard/transactions`
  - **Transferencias** → `/dashboard/transfers`
  - **Presupuestos mensuales** → `/dashboard/monthly-periods`

## 📁 Estructura del proyecto (resumen)

```
personal-finance-frontend/
├── app/
│   ├── actions/        # Server Actions (API calls, auth, módulos)
│   ├── dashboard/      # App interna (módulos + docs)
│   ├── login/          # Login
│   ├── register/       # Registro
│   ├── confirm-email/  # Confirmación email + reenvío
│   ├── reset-password/ # Reset de contraseña
│   ├── globals.css     # Estilos globales (incl. fixes iOS)
│   ├── layout.tsx      # Layout principal + i18n provider
│   └── page.tsx        # Landing / redirects
├── components/
│   ├── ui/             # Componentes shadcn/ui
│   ├── filters/        # Filtros (Sheets, date-range, etc.)
│   ├── inputs/         # Inputs RHF (incl. searchable select / password toggle)
│   └── preferences/    # Contexto de preferencias (moneda/zona/idioma)
├── lib/
│   └── utils.ts        # Utilidades compartidas
├── utils/
│   ├── helpers/        # Format/humanize/parse errors, etc.
│   └── i18n/           # Mensajes ES/EN/PT + helpers server/client
├── docs/
│   └── COLOR_PALETTE.md # Documentación de colores
└── public/             # Archivos estáticos
```

## 🛠️ Tecnologías

- **Next.js (App Router)** - Framework React
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utility-first
- **shadcn/ui** - Componentes UI
- **React Hook Form** - Manejo de formularios
- **Zod** - Validación de esquemas
- **Axios** - Cliente HTTP
- **Lucide React** - Iconos
- **Recharts** - Gráficas

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
- ✅ Login / Registro / Confirmación de email / Reset de contraseña
- ✅ Dashboard con métricas, gráficas y analítica
- ✅ Preferencias de usuario (moneda, zona horaria, idioma)
- ✅ i18n (ES/EN/PT) aplicado en módulos principales
- ✅ Documentación interna (manual de uso) dentro del dashboard
- ✅ Diseño premium modo oscuro + fixes responsive (iPhone)
- ✅ Componentes UI con shadcn/ui
- ✅ Integración con API de Spring Boot
- ✅ Prettier y ESLint configurados

## 🧭 ¿En qué consiste el proyecto?

Este frontend se encarga de:
- Proveer una **UI moderna** para administrar finanzas personales.
- Consumir la API del backend mediante **Server Actions** (Axios).
- Centralizar **humanización de errores** (mensajes amigables).
- Aplicar **preferencias** del usuario para formateo (moneda, zona horaria) e idioma.

Rutas relevantes:
- **Públicas**: `/login`, `/register`, `/confirm-email`, `/confirm-email/request`, `/reset-password`
- **Privadas (dashboard)**: `/dashboard/*`

