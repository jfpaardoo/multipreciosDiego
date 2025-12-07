# Multiprecios Diego

Sistema de gestión de comercio electrónico desarrollado con React, TypeScript y Supabase. Plataforma completa para gestión de productos, pedidos, usuarios e incidencias con panel administrativo integrado.

![Logo Multiprecios Diego](public/logo.png)

## Características Principales

### Para Clientes
- **Catálogo de Productos**: Navegación intuitiva con búsqueda y filtros por categorías
- **Carrito de Compras**: Gestión de productos con cantidades y cálculo automático de totales
- **Gestión de Pedidos**: Seguimiento en tiempo real del estado de pedidos
- **Sistema de Reservas**: Reserva de productos con códigos únicos
- **Reportar Incidencias**: Sistema de tickets para problemas con pedidos
- **Perfil de Usuario**: Gestión de datos personales y foto de perfil
- **Múltiples Métodos de Pago**: Tarjeta, efectivo, Bizum
- **Opciones de Entrega**: A domicilio o recogida en tienda

### Para Administradores
- **Panel de Control**: Dashboard completo con estadísticas en tiempo real
- **Gestión de Usuarios**: Administración de roles (Cliente, Encargado, Admin)
- **Gestión de Productos**: CRUD completo con imágenes, stock y precios
- **Gestión de Pedidos**: Actualización de estados y seguimiento
- **Gestión de Incidencias**: Resolución y seguimiento de problemas
- **Gestión de Reservas**: Control de reservas de clientes
- **Categorías**: Organización de productos por categorías

## Tecnologías Utilizadas

- **Frontend Framework**: React 18 con TypeScript
- **Enrutamiento**: React Router DOM v6
- **Estilos**: Tailwind CSS con componentes personalizados
- **UI Components**: Radix UI + Shadcn/ui
- **Backend**: Supabase (PostgreSQL + Authentication + Storage)
- **Iconos**: Lucide React
- **Build Tool**: Vite
- **Gestión de Estado**: React Context API

## Instalación

### Requisitos Previos
- Node.js 18+ instalado
- Cuenta de Supabase configurada
- Git

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/jfpaardoo/multipreciosDiego.git
cd multipreciosDiego
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar Variables de Entorno**

Crea un archivo `.env` en la raíz del proyecto con:

```env
VITE_SUPABASE_URL=tu_supabase_url
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key
```

4. **Configurar Base de Datos**

Ejecuta los siguientes scripts SQL en tu proyecto de Supabase:

```bash
# 1. Ejecutar schema principal
supabase_schema.sql

# 2. Configurar storage para avatares
supabase_storage_avatars.sql
```

5. **Iniciar servidor de desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:5173](http://localhost:5173)

## Estructura del Proyecto

```
multipreciosDiego/
├── public/              # Archivos estáticos (logo, imágenes)
├── src/
│   ├── components/      # Componentes reutilizables
│   │   ├── ui/         # Componentes de UI (buttons, cards, inputs)
│   │   ├── Layout.tsx  # Layout principal con navegación
│   │   ├── ProductCard.tsx
│   │   └── ProtectedRoute.tsx
│   ├── context/        # Contextos de React
│   │   ├── AuthContext.tsx      # Autenticación y usuario
│   │   └── CartContext.tsx      # Estado del carrito
│   ├── lib/           # Utilidades y configuración
│   │   ├── supabase.ts         # Cliente de Supabase
│   │   └── utils.ts            # Funciones auxiliares
│   ├── pages/         # Páginas de la aplicación
│   │   ├── Home.tsx            # Catálogo de productos
│   │   ├── Checkout.tsx        # Proceso de compra
│   │   ├── Profile.tsx         # Perfil de usuario
│   │   ├── ProductDetails.tsx  # Detalles del producto
│   │   ├── Login.tsx / Register.tsx
│   │   └── admin/              # Páginas administrativas
│   │       ├── AdminPanel.tsx  # Dashboard principal
│   │       ├── AdminUsers.tsx
│   │       ├── AdminProducts.tsx
│   │       ├── AdminOrders.tsx
│   │       └── AdminIssues.tsx
│   ├── types/         # Definiciones de TypeScript
│   │   └── index.ts
│   ├── App.tsx        # Componente raíz
│   └── main.tsx       # Punto de entrada
├── supabase_schema.sql          # Schema de base de datos
├── supabase_storage_avatars.sql # Configuración de storage
└── package.json
```

## Modelo de Datos

### Tablas Principales

- **profiles**: Información de usuarios (con avatar)
- **productos**: Catálogo de productos
- **categorias**: Categorías de productos
- **pedidos_cliente**: Pedidos realizados
- **lineas_pedido**: Detalle de productos por pedido
- **incidencias**: Tickets de soporte
- **reservas**: Reservas de productos
- **proveedores**: Gestión de proveedores
- **servicios_reparto**: Servicios de entrega

### Storage Buckets

- **avatars**: Fotos de perfil de usuarios (público)

## Roles de Usuario

1. **CLIENTE**: Usuarios regulares con acceso al catálogo y compras
2. **ENCARGADO**: Permisos de administración limitados
3. **ADMIN**: Acceso completo al panel administrativo

## Seguridad

- Autenticación mediante Supabase Auth
- Row Level Security (RLS) en todas las tablas
- Rutas protegidas con ProtectedRoute
- Políticas de storage para avatares por usuario
- Validación de roles en frontend y backend

## Características de UI/UX

- Diseño responsive (móvil, tablet, desktop)
- Tema consistente con Tailwind CSS
- Componentes reutilizables con Shadcn/ui
- Iconografía moderna con Lucide
- Fotos de perfil con fallback a iniciales
- Feedback visual en todas las acciones
- Validación de formularios

## Scripts Disponibles

```bash
npm run dev      # Inicia servidor de desarrollo
npm run build    # Construye para producción
npm run preview  # Previsualiza build de producción
```

## Despliegue

### Build de Producción

```bash
npm run build
```

Los archivos optimizados se generarán en la carpeta `dist/`.

### Plataformas Recomendadas

- **Vercel**: Despliegue automático desde GitHub
- **Netlify**: CI/CD integrado
- **Cloudflare Pages**: Edge deployment

## Contribución

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT.

## Autores

- **Equipo de Desarrollo** - [jfpaardoo](https://github.com/jfpaardoo)

## Agradecimientos

- Shadcn/ui por los componentes de UI
- Supabase por el backend as a service
- Lucide por los iconos
- La comunidad de React y TypeScript

---

**Multiprecios Diego** - Sistema de E-Commerce © 2025
