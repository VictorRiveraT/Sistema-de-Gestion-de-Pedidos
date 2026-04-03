/**
 * Utilidades para el Sistema de Gestión de Pedidos
 */

export interface Order {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  date: string;
  deliveryPerson?: string;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export type OrderStatus =
  | 'Pendiente'
  | 'En Preparación'
  | 'En Camino'
  | 'Entregado'
  | 'Cancelado';

/**
 * Obtiene todos los pedidos del localStorage
 */
export function getAllOrders(): Order[] {
  try {
    const ordersJson = localStorage.getItem('orders');
    if (!ordersJson) return [];
    const orders = JSON.parse(ordersJson);
    return orders.filter((order: any) => order.items && Array.isArray(order.items));
  } catch (error) {
    console.error('Error loading orders:', error);
    return [];
  }
}

/**
 * Guarda pedidos en localStorage
 */
export function saveOrders(orders: Order[]): void {
  try {
    localStorage.setItem('orders', JSON.stringify(orders));
  } catch (error) {
    console.error('Error saving orders:', error);
  }
}

/**
 * Actualiza el estado de un pedido
 */
export function updateOrderStatus(orderId: string, newStatus: OrderStatus): void {
  const orders = getAllOrders();
  const updatedOrders = orders.map(order =>
    order.id === orderId ? { ...order, status: newStatus } : order
  );
  saveOrders(updatedOrders);
}

/**
 * Asigna un repartidor a un pedido
 */
export function assignDeliveryPerson(orderId: string, deliveryPerson: string): void {
  const orders = getAllOrders();
  const updatedOrders = orders.map(order =>
    order.id === orderId
      ? { ...order, deliveryPerson: deliveryPerson === 'Sin asignar' ? undefined : deliveryPerson }
      : order
  );
  saveOrders(updatedOrders);
}

/**
 * Obtiene estadísticas de pedidos
 */
export function getOrderStatistics() {
  const orders = getAllOrders();
  return {
    total: orders.length,
    pendientes: orders.filter(o => o.status === 'Pendiente').length,
    enPreparacion: orders.filter(o => o.status === 'En Preparación').length,
    enCamino: orders.filter(o => o.status === 'En Camino').length,
    entregados: orders.filter(o => o.status === 'Entregado').length,
    cancelados: orders.filter(o => o.status === 'Cancelado').length,
  };
}

/**
 * Formatea un número como precio en soles peruanos
 */
export function formatPrice(amount: number): string {
  return `S/. ${amount.toFixed(2)}`;
}

/**
 * Formatea una fecha
 */
export function formatDate(date: string | Date): string {
  if (typeof date === 'string') return date;
  return date.toLocaleString('es-PE');
}

/**
 * Valida un email
 */
export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Valida un teléfono peruano (9 dígitos)
 */
export function validatePhone(phone: string): boolean {
  return /^\d{9}$/.test(phone.replace(/\s/g, ''));
}

/**
 * Genera un ID único para pedidos
 */
export function generateOrderId(): string {
  return Date.now().toString();
}

/**
 * Obtiene el color de estado para un pedido
 */
export function getStatusColor(status: OrderStatus): string {
  switch (status) {
    case 'Pendiente':
      return 'text-orange-600 bg-orange-50 border-orange-200';
    case 'En Preparación':
      return 'text-blue-600 bg-blue-50 border-blue-200';
    case 'En Camino':
      return 'text-purple-600 bg-purple-50 border-purple-200';
    case 'Entregado':
      return 'text-green-600 bg-green-50 border-green-200';
    case 'Cancelado':
      return 'text-red-600 bg-red-50 border-red-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
}

/**
 * Convierte un objeto Order a formato JSON para GitHub
 */
export function orderToJson(order: Order) {
  return {
    id_pedido: order.id,
    id_cliente: order.email,
    cliente: {
      nombre: order.name,
      email: order.email,
      telefono: order.phone,
      direccion: order.address,
    },
    items: order.items.map(item => ({
      id_producto: item.id,
      nombre: item.name,
      precio_unitario: item.price,
      cantidad: item.quantity,
      subtotal: item.price * item.quantity,
    })),
    total: order.total,
    estado: order.status,
    repartidor_asignado: order.deliveryPerson || null,
    fecha_creacion: order.date,
    metadata: {
      plataforma: 'Sistema de Gestión de Pedidos',
      version: '1.0.0',
      sincronizacion_tiempo_real: true,
      servidor: 'Render (24/7)',
    },
  };
}
