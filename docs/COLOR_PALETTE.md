# Paleta de Colores - Personal Finance Dashboard

## 🎨 Sistema de Colores en Modo Oscuro Ultra Oscuro

Paleta de colores ultra oscura inspirada en Resend y Notion en modo oscuro. Diseñada para uso prolongado con fondos casi negros y máximo contraste.

---

## 📐 Colores Principales

### Fondo Principal
- **Variable CSS**: `--background`
- **Valor HSL**: `hsl(0, 0%, 3%)`
- **Hex**: `#080808`
- **Uso**: Fondo principal de la aplicación
- **Descripción**: Casi negro con sutil calidez, similar a Resend y Notion

### Tarjetas / Superficies
- **Variable CSS**: `--card`
- **Valor HSL**: `hsl(0, 0%, 5%)`
- **Hex**: `#0d0d0d`
- **Uso**: Superficies de tarjetas, modales, popovers
- **Descripción**: Muy oscuro, ligeramente más claro que el fondo para crear profundidad

---

## 🎯 Acciones

### Acción Primaria
- **Variable CSS**: `--primary`
- **Valor HSL**: `hsl(217, 91%, 60%)`
- **Hex**: `#3b82f6`
- **Uso**: Botones principales, enlaces importantes, elementos interactivos clave
- **Descripción**: Azul vibrante que destaca sobre el fondo ultra oscuro

### Acción Secundaria
- **Variable CSS**: `--secondary`
- **Valor HSL**: `hsl(0, 0%, 8%)`
- **Hex**: `#141414`
- **Uso**: Botones secundarios, elementos menos prominentes
- **Descripción**: Gris muy oscuro, sutil y elegante sobre el fondo casi negro

---

## ✅❌ Estados

### Éxito (Ingresos)
- **Variable CSS**: `--success`**
- **Valor HSL**: `hsl(142, 76%, 36%)`
- **Hex**: `#10b981`
- **Uso**: Indicadores de ingresos, transacciones positivas, estados exitosos
- **Descripción**: Verde suave, no demasiado brillante, cómodo para la vista

### Error / Advertencia (Gastos)
- **Variable CSS**: `--destructive`
- **Valor HSL**: `hsl(0, 72%, 51%)`
- **Hex**: `#ef4444`
- **Uso**: Indicadores de gastos, transacciones negativas, errores
- **Descripción**: Rojo suave, no demasiado brillante, claro pero no agresivo

---

## 📝 Texto

### Texto Principal
- **Variable CSS**: `--foreground`
- **Valor HSL**: `hsl(0, 0%, 98%)`
- **Hex**: `#fafafa`
- **Uso**: Texto principal, títulos, contenido importante
- **Descripción**: Casi blanco, máximo contraste y legibilidad

### Texto Secundario
- **Variable CSS**: `--muted-foreground`
- **Valor HSL**: `hsl(0, 0%, 65%)`
- **Hex**: `#a6a6a6`
- **Uso**: Texto secundario, descripciones, información menos importante
- **Descripción**: Gris medio, suficiente contraste sin ser intrusivo

---

## 🎨 Colores Adicionales

### Muted (Fondo para texto secundario)
- **Variable CSS**: `--muted`
- **Valor HSL**: `hsl(0, 0%, 8%)`
- **Hex**: `#141414`
- **Uso**: Fondos sutiles, áreas de información secundaria

### Accent (Resaltado sutil)
- **Variable CSS**: `--accent`
- **Valor HSL**: `hsl(0, 0%, 8%)`
- **Hex**: `#141414`
- **Uso**: Hover states, elementos destacados sutilmente

### Border / Input
- **Variable CSS**: `--border` / `--input`
- **Valor HSL**: `hsl(0, 0%, 12%)`
- **Hex**: `#1f1f1f`
- **Uso**: Bordes de tarjetas, inputs, separadores
- **Descripción**: Bordes muy sutiles, casi imperceptibles pero funcionales

### Ring (Focus)
- **Variable CSS**: `--ring`
- **Valor HSL**: `hsl(217, 91%, 60%)`
- **Hex**: `#3b82f6`
- **Uso**: Anillos de foco en inputs y elementos interactivos
- **Descripción**: Coincide con el color primario

---

## 💡 Recomendaciones de Uso

### Para Datos Financieros

1. **Ingresos**: Usa `text-success` o `bg-success/10` con `border-success/20`
2. **Gastos**: Usa `text-destructive` o `bg-destructive/10` con `border-destructive/20`
3. **Balances**: Usa `text-foreground` para valores neutros
4. **Tarjetas de resumen**: Usa `bg-card` con `border-border`

### Para Interacciones

1. **Botones principales**: `bg-primary` con `text-primary-foreground`
2. **Botones secundarios**: `bg-secondary` con `text-secondary-foreground`
3. **Botones de éxito**: `bg-success` con `text-success-foreground`
4. **Botones destructivos**: `bg-destructive` con `text-destructive-foreground`

### Para Jerarquía Visual

1. **Títulos principales**: `text-foreground` con `font-bold`
2. **Subtítulos**: `text-foreground` con `font-semibold`
3. **Descripciones**: `text-muted-foreground`
4. **Labels**: `text-muted-foreground` con `text-sm`

---

## 🎯 Inspiración

Esta paleta está inspirada en:
- **Resend Dark Mode**: Fondos ultra oscuros, casi negros
- **Notion Dark Mode**: Minimalismo extremo y elegancia
- **Modo oscuro moderno**: Máximo contraste con fondos casi negros

Todos los colores están diseñados para:
- ✅ Reducir fatiga visual con fondos ultra oscuros
- ✅ Mantener máximo contraste para legibilidad
- ✅ Ser apropiados para visualización de datos financieros
- ✅ Transmitir modernidad, minimalismo y profesionalismo
- ✅ Crear una experiencia visual limpia y elegante

---

## 📊 Ejemplo de Uso en Código

```tsx
// Tarjeta de ingreso
<Card className="bg-card border-success/20">
  <CardContent>
    <div className="text-success font-bold">+$1,500.00</div>
    <p className="text-muted-foreground">Ingresos este mes</p>
  </CardContent>
</Card>

// Tarjeta de gasto
<Card className="bg-card border-destructive/20">
  <CardContent>
    <div className="text-destructive font-bold">-$850.00</div>
    <p className="text-muted-foreground">Gastos este mes</p>
  </CardContent>
</Card>

// Botón primario
<Button className="bg-primary text-primary-foreground">
  Agregar Transacción
</Button>
```

