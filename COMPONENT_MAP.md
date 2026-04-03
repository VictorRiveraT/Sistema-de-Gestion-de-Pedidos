# Mapa de Componentes - Sistema de Gestión de Pedidos

## 🗺️ Árbol de Componentes

```
App (RouterProvider)
│
└── Layout
    ├── Header (Título + Navegación)
    │   ├── ShoppingBag Icon
    │   ├── UserCog Icon
    │   └── Truck Icon
    │
    └── Outlet (Router)
        │
        ├── ClientView (/)
        │   ├── Tabs (Catálogo | Mis Pedidos)
        │   ├── Catalog
        │   │   ├── Product Grid
        │   │   │   └── Product Card (×8)
        │   │   │       ├── Image Placeholder
        │   │   │       ├── Product Info
        │   │   │       └── Add to Cart Button
        │   │   │
        │   │   └── Checkout Panel (Sidebar)
        │   │       ├── Cart Summary
        │   │       └── CheckoutForm
        │   │           ├── Validation (Real-time)
        │   │           ├── Name Input ✓
        │   │           ├── Email Input ✓
        │   │           ├── Phone Input ✓
        │   │           ├── Address Input ✓
        │   │           └── Submit Button
        │   │
        │   └── OrderTracker
        │       ├── Email Search Form
        │       └── Order List
        │           └── Order Card
        │               ├── Order Info
        │               ├── Stepper Component
        │               │   ├── Step 1: Pendiente
        │               │   ├── Step 2: En Preparación
        │               │   ├── Step 3: En Camino
        │               │   └── Step 4: Entregado
        │               └── Product Details
        │
        ├── AdminView (/admin)
        │   ├── ServerStatus Widget
        │   │   ├── Server Icon
        │   │   ├── Online Indicator
        │   │   ├── Uptime Counter
        │   │   └── Platform Info
        │   │
        │   ├── Statistics Cards
        │   │   ├── Total Orders
        │   │   ├── Pending Orders
        │   │   ├── In Transit Orders
        │   │   └── Delivered Orders
        │   │
        │   ├── Filter Controls
        │   │   ├── Status Filter
        │   │   └── Clear All Button
        │   │
        │   ├── Orders Table (Desktop)
        │   │   ├── Table Header
        │   │   └── Table Row (×N)
        │   │       ├── Order ID
        │   │       ├── Customer Info
        │   │       ├── Products
        │   │       ├── Total
        │   │       ├── Status Dropdown
        │   │       ├── Delivery Assignment
        │   │       └── Actions
        │   │           ├── JSON Viewer Button
        │   │           └── Delete Button
        │   │
        │   ├── Orders Cards (Mobile)
        │   │   └── Order Card (×N)
        │   │       ├── Order Header
        │   │       ├── Customer Details
        │   │       ├── Products List
        │   │       ├── Status Control
        │   │       ├── Assignment Control
        │   │       └── Actions
        │   │
        │   └── JsonViewer Modal
        │       ├── Modal Overlay
        │       └── Modal Content
        │           ├── Header (Code Icon)
        │           ├── Info Banner
        │           ├── JSON Code Block
        │           │   └── Copy Button
        │           ├── Schema Explanation
        │           └── Close Button
        │
        └── DeliveryView (/repartidor)
            ├── Delivery Person Selector
            ├── Assigned Orders Count
            └── Orders List
                └── Order Card (×N)
                    ├── Order Header
                    │   ├── Order ID
                    │   ├── Status Badge
                    │   └── Date
                    │
                    ├── Customer Info
                    │   ├── Name
                    │   ├── Phone
                    │   └── Delivery Address
                    │
                    ├── Products List
                    │   └── Product Item (×N)
                    │       ├── Name × Quantity
                    │       └── Subtotal
                    │
                    └── Action Buttons (Large)
                        ├── "Iniciar Entrega" (Truck Icon)
                        ├── "En Camino" (Truck Icon)
                        ├── "Marcar Entregado" (Check Icon)
                        └── "Cancelar" (X Icon)
```

## 🔄 Flujo de Datos

### Estado Global (LocalStorage)

```
┌─────────────────────────────────────┐
│      LocalStorage (orders[])        │
│  ┌───────────────────────────────┐  │
│  │  Order Object                 │  │
│  │  - id                         │  │
│  │  - cliente                    │  │
│  │  - items[]                    │  │
│  │  - status                     │  │
│  │  - deliveryPerson             │  │
│  │  - ...                        │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
         ↕️ Sync (1-2s)
┌─────────────────────────────────────┐
│    React Components (useState)      │
│  ┌───────────────────────────────┐  │
│  │  ClientView                   │  │
│  │  AdminView      ←→  Polling   │  │
│  │  DeliveryView                 │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

### Ciclo de Vida de un Pedido

```
1. Cliente
   ├─→ Navega Catálogo
   ├─→ Añade Productos al Carrito
   ├─→ Completa Formulario (con validación)
   └─→ Confirma Pedido
       └─→ [SAVE to LocalStorage]

2. Administrador
   ├─→ Ve Pedido en Tabla
   ├─→ Asigna Repartidor
   └─→ Actualiza Estado
       └─→ [UPDATE in LocalStorage]

3. Repartidor
   ├─→ Ve Pedidos Asignados
   ├─→ Marca "En Camino"
   └─→ Marca "Entregado"
       └─→ [UPDATE in LocalStorage]

4. Cliente (Tracking)
   └─→ Ve Actualización en Tiempo Real
       └─→ [READ from LocalStorage]
```

## 📊 Diagrama de Sincronización

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   Cliente    │         │    Admin     │         │  Repartidor  │
│   Browser    │         │   Browser    │         │   Browser    │
└──────┬───────┘         └──────┬───────┘         └──────┬───────┘
       │                        │                        │
       │ POST Order             │                        │
       ├────────────────────────┼────────────────────────┤
       │                        │                        │
       │           LocalStorage (Shared State)          │
       │                        │                        │
       │                        │ GET Orders             │
       │                        │◄───────────────────────┤
       │                        │                        │
       │                        │ Assign Delivery        │
       │                        ├────────────────────────►
       │                        │                        │
       │ Polling (2s)           │ Polling (1s)           │ Polling (1s)
       │◄───────────────────────┼────────────────────────┼───────────►
       │                        │                        │
       │                        │                        │ Update Status
       │◄───────────────────────┼────────────────────────┤
       │                        │                        │
```

## 🎨 Capas de la Aplicación

```
┌─────────────────────────────────────────────────────────┐
│                  Presentation Layer                     │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐       │
│  │  Client UI │  │  Admin UI  │  │ Delivery UI│       │
│  └────────────┘  └────────────┘  └────────────┘       │
└─────────────────────────────────────────────────────────┘
                          ↕️
┌─────────────────────────────────────────────────────────┐
│                   Business Logic                        │
│  ┌────────────────────────────────────────────────┐    │
│  │  Order Management  │  Validation  │  Routing   │    │
│  └────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
                          ↕️
┌─────────────────────────────────────────────────────────┐
│                   Data Layer (Mock)                     │
│  ┌────────────────────────────────────────────────┐    │
│  │         LocalStorage (Simulated Backend)       │    │
│  │  - orders[]                                     │    │
│  │  - Polling mechanism                            │    │
│  │  - CRUD operations                              │    │
│  └────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

## 🔍 Componentes Clave

### 1. OrderTracker (Cliente)
**Características:**
- Búsqueda por email
- Stepper visual de estados
- Actualización en tiempo real (2s polling)
- Responsive design

### 2. ServerStatus (Admin)
**Características:**
- Indicador online/offline
- Contador de uptime
- Info de plataforma (Render)
- Estado de sincronización

### 3. JsonViewer (Admin)
**Características:**
- Modal overlay
- Código JSON formateado
- Botón de copiar
- Esquema documentado
- Orientado a GitHub

### 4. CheckoutForm (Cliente)
**Características:**
- Validación en tiempo real
- Feedback visual (✓/✗)
- Mensajes de error específicos
- Reglas de validación estrictas

### 5. DeliveryView (Repartidor)
**Características:**
- Botones grandes (touch-optimized)
- Filtro por repartidor
- Estados de pedido claros
- Confirmaciones visuales

## 🚀 Optimizaciones Implementadas

1. **Performance**
   - Polling controlado (1-2s)
   - Renderizado condicional
   - Lazy state updates

2. **UX/UI**
   - Mobile-first design
   - Transiciones suaves
   - Estados de carga
   - Feedback inmediato

3. **Code Quality**
   - TypeScript strict
   - Componentes reutilizables
   - Props bien tipadas
   - Utils centralizados

## 📱 Responsive Breakpoints

```
Mobile:    < 640px   (sm)
Tablet:    640-1024px (md-lg)
Desktop:   > 1024px   (xl)

Grid Layouts:
- Catalog: 1 → 2 → 3 → 4 columns
- Stats:   2 → 4 columns
- Tables:  Cards → Table
```

---

**Sistema diseñado con arquitectura modular, optimización de carga y sincronización en tiempo real**
