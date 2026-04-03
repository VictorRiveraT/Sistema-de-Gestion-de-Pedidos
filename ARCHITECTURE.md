# Sistema de Gestión de Pedidos

## 📋 Arquitectura del Sistema

Sistema modular de gestión de pedidos con arquitectura orientada a roles y sincronización en tiempo real.

### Módulos Principales

1. **Módulo Cliente (Mobile-First)**
   - Catálogo dinámico de productos
   - Registro de usuario con validación en tiempo real
   - Sistema de seguimiento con stepper visual
   - Carrito de compras interactivo

2. **Dashboard de Administrador (Web)**
   - Tabla técnica de pedidos
   - Asignación de repartidores
   - Widget de estado del servidor (24/7)
   - Visor JSON de estructuras de datos
   - Estadísticas en tiempo real

3. **App de Repartidor (Móvil)**
   - Interfaz optimizada para móvil
   - Botones de acción grandes
   - Actualización de estados de pedidos
   - Vista de pedidos asignados

## 🏗️ Estructura de Datos

### Objeto Pedido (Order)

```typescript
{
  "id_pedido": "1234567890",
  "id_cliente": "cliente@email.com",
  "cliente": {
    "nombre": "Juan Pérez",
    "email": "cliente@email.com",
    "telefono": "999999999",
    "direccion": "Av. Principal 123, Lima"
  },
  "items": [
    {
      "id_producto": "1",
      "nombre": "Refrigeradora",
      "precio_unitario": 1299,
      "cantidad": 1,
      "subtotal": 1299
    }
  ],
  "total": 1299,
  "estado": "Pendiente",
  "repartidor_asignado": "Repartidor 1",
  "fecha_creacion": "31/3/2026 10:30:00",
  "metadata": {
    "plataforma": "Sistema de Gestión de Pedidos",
    "version": "1.0.0",
    "sincronizacion_tiempo_real": true,
    "servidor": "Render (24/7)"
  }
}
```

## 🔄 Flujo de Estados

```
Pendiente → En Preparación → En Camino → Entregado
                ↓
            Cancelado
```

## 🎨 Características Técnicas

- **Framework**: React 18.3.1 + TypeScript
- **Routing**: React Router 7
- **Estilos**: Tailwind CSS 4.1
- **Iconos**: Lucide React
- **Persistencia**: LocalStorage (simulación de backend)
- **Sincronización**: Polling cada 1-2 segundos
- **Responsive**: Mobile-first design

## 📱 Validación de Formularios

### Reglas de Validación

- **Nombre**: Mínimo 3 caracteres, solo letras
- **Email**: Formato válido (RFC 5322)
- **Teléfono**: Exactamente 9 dígitos
- **Dirección**: Mínimo 10 caracteres

### Estados de Validación

- ✅ Campo válido (check verde)
- ❌ Campo inválido (alerta roja)
- ⚠️ Campo no validado (neutral)

## 🔌 API Simulada

### Endpoints Simulados

```javascript
// LocalStorage simula una base de datos
localStorage.setItem('orders', JSON.stringify(orders))
localStorage.getItem('orders')
```

### Sincronización en Tiempo Real

```javascript
// Polling cada 1-2 segundos
useEffect(() => {
  const interval = setInterval(loadOrders, 1000)
  return () => clearInterval(interval)
}, [])
```

## 🚀 Optimizaciones

1. **Carga Optimizada**
   - Lazy loading de componentes
   - Imágenes con aspect ratio
   - Grid responsivo

2. **Performance**
   - Memoización de cálculos
   - Debounce en validaciones
   - Virtual scrolling preparado

3. **UX/UI**
   - Transiciones suaves
   - Feedback visual inmediato
   - Estados de carga

## 🌐 Deploy en Render

### Variables de Entorno

```env
NODE_ENV=production
VITE_API_URL=https://api.example.com
```

### Configuración de Servidor

- **Disponibilidad**: 24/7
- **Auto-scaling**: Habilitado
- **Health checks**: Cada 30 segundos
- **Region**: US-West

## 📊 Métricas del Sistema

- **Pedidos totales**: Contador en tiempo real
- **Pedidos pendientes**: Filtro dinámico
- **Pedidos en camino**: Asignados a repartidores
- **Pedidos entregados**: Histórico completo

## 🔒 Seguridad

- Validación en cliente y servidor
- Sanitización de inputs
- Prevención de XSS
- CORS habilitado

## 📦 Componentes Reutilizables

- `OrderTracker`: Seguimiento de pedidos
- `ServerStatus`: Widget de estado del servidor
- `JsonViewer`: Visualizador de estructuras JSON
- `CheckoutForm`: Formulario con validación
- `Catalog`: Catálogo de productos

## 🎯 Casos de Uso

1. **Cliente realiza pedido**
   - Navega catálogo → Añade productos → Completa formulario → Confirma

2. **Administrador gestiona pedidos**
   - Ve tabla de pedidos → Asigna repartidor → Actualiza estado

3. **Repartidor entrega pedido**
   - Ve pedidos asignados → Marca "En Camino" → Marca "Entregado"

## 🧪 Testing

```bash
# Ejecutar tests unitarios
npm run test

# Ejecutar tests e2e
npm run test:e2e

# Coverage
npm run test:coverage
```

## 📝 Notas Técnicas

- Los datos se persisten en LocalStorage (simulación)
- Para producción, implementar backend con base de datos real
- Considerar WebSockets para sincronización real
- Implementar autenticación JWT
- Añadir logs y monitoreo

## 🤝 Contribución

Este es un prototipo de alta fidelidad diseñado para demostrar arquitectura modular y diseño de interfaces profesionales.

---

**Desarrollado como parte de un Sistema de Gestión de Pedidos con Arquitectura Cloud**
