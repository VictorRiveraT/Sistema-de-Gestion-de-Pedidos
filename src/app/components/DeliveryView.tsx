import { useState, useEffect } from "react";
import { Truck, CheckCircle2, XCircle, Package } from "lucide-react";

interface Order {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  items: { id: string; name: string; price: number; quantity: number }[];
  total: number;
  status: string;
  date: string;
  deliveryPerson?: string;
}

export function DeliveryView() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedDeliveryPerson, setSelectedDeliveryPerson] = useState("Repartidor 1");

  const deliveryPeople = ["Repartidor 1", "Repartidor 2", "Repartidor 3"];

  const loadOrders = () => {
    const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    const validOrders = storedOrders.filter((order: any) => order.items && Array.isArray(order.items));

    // Filtrar solo pedidos asignados al repartidor seleccionado
    const assignedOrders = validOrders.filter(
      (order: Order) => order.deliveryPerson === selectedDeliveryPerson &&
      order.status !== "Entregado" &&
      order.status !== "Cancelado"
    );
    setOrders(assignedOrders);
  };

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 1000);
    return () => clearInterval(interval);
  }, [selectedDeliveryPerson]);

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    const allOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    const updatedOrders = allOrders.map((order: Order) =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
    loadOrders();
  };

  return (
    <div className="h-full overflow-y-auto p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 md:mb-8">
          <h1 className="mb-2 md:mb-4">Panel de Repartidor</h1>

          {/* Selector de repartidor */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
            <label className="text-sm text-gray-600">Repartidor:</label>
            <select
              value={selectedDeliveryPerson}
              onChange={(e) => setSelectedDeliveryPerson(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded max-w-xs"
            >
              {deliveryPeople.map((person) => (
                <option key={person} value={person}>
                  {person}
                </option>
              ))}
            </select>
          </div>

          <p className="text-gray-600">
            Pedidos asignados: {orders.length}
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-gray-300 rounded">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No hay pedidos asignados</p>
            <p className="text-sm text-gray-400 mt-2">Los pedidos asignados a {selectedDeliveryPerson} aparecerán aquí</p>
          </div>
        ) : (
          <div className="space-y-4 md:space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="border border-gray-300 rounded p-4 md:p-6 bg-white"
              >
                {/* Encabezado del pedido */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4 pb-4 border-b border-gray-200">
                  <div>
                    <h3 className="mb-1">Pedido #{order.id}</h3>
                    <div className="inline-block px-3 py-1 bg-gray-100 rounded text-sm mt-2">
                      {order.status}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">{order.date}</div>
                </div>

                {/* Información del cliente */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Cliente</p>
                    <p className="font-medium">{order.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Teléfono</p>
                    <p className="font-medium">{order.phone}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-sm text-gray-500 mb-1">Dirección de entrega</p>
                    <p className="font-medium">{order.address}</p>
                  </div>
                </div>

                {/* Productos del pedido */}
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-2">Productos</p>
                  <div className="bg-gray-50 rounded p-3 space-y-1">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>{item.name} x {item.quantity}</span>
                        <span>S/. {(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between pt-2 mt-2 border-t border-gray-300 font-medium">
                      <span>Total a cobrar</span>
                      <span>S/. {order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Botones de acción - Optimizados para móvil */}
                <div className="flex flex-col gap-3">
                  {order.status === "Pendiente" && (
                    <button
                      onClick={() => updateOrderStatus(order.id, "En Camino")}
                      className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-3 shadow-md active:scale-95 transition-transform"
                    >
                      <Truck className="w-6 h-6" />
                      <span className="font-medium">Iniciar Entrega</span>
                    </button>
                  )}
                  {order.status === "En Preparación" && (
                    <button
                      onClick={() => updateOrderStatus(order.id, "En Camino")}
                      className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-3 shadow-md active:scale-95 transition-transform"
                    >
                      <Truck className="w-6 h-6" />
                      <span className="font-medium">Marcar "En Camino"</span>
                    </button>
                  )}
                  {order.status === "En Camino" && (
                    <button
                      onClick={() => updateOrderStatus(order.id, "Entregado")}
                      className="w-full px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-3 shadow-md active:scale-95 transition-transform"
                    >
                      <CheckCircle2 className="w-6 h-6" />
                      <span className="font-medium">Marcar como Entregado</span>
                    </button>
                  )}
                  {(order.status === "Pendiente" || order.status === "En Preparación" || order.status === "En Camino") && (
                    <button
                      onClick={() => updateOrderStatus(order.id, "Cancelado")}
                      className="w-full px-6 py-4 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-50 flex items-center justify-center gap-3 active:scale-95 transition-transform"
                    >
                      <XCircle className="w-5 h-5" />
                      <span className="font-medium">Cancelar Entrega</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
