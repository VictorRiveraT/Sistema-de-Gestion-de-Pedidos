import { useState, useEffect } from "react";
import { ServerStatus } from "./ServerStatus";
import { JsonViewer } from "./JsonViewer";
import { InventoryPanel } from "./InventoryPanel";
import { StaffPanel } from "./StaffPanel";
import { Eye, CreditCard, DollarSign, Package, Users, ClipboardList } from "lucide-react";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  items: OrderItem[];
  total: number;
  status: string;
  paymentStatus?: string;
  date: string;
  deliveryPerson?: string;
}

type TabType = 'orders' | 'inventory' | 'staff';

export function AdminView() {
  const [activeTab, setActiveTab] = useState<TabType>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("Todos");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const deliveryPeople = ["Sin asignar", "Repartidor 1", "Repartidor 2", "Repartidor 3"];
  const statuses = ["Todos", "Pendiente", "En Preparación", "En Camino", "Entregado", "Cancelado"];

  const loadOrders = () => {
    const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    const validOrders = storedOrders.filter((order: any) => order.items && Array.isArray(order.items));
    setOrders(validOrders);
  };

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 1000);
    return () => clearInterval(interval);
  }, []);

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    const updatedOrders = orders.map((order) =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
    setOrders(updatedOrders);
  };

  const assignDeliveryPerson = (orderId: string, deliveryPerson: string) => {
    const updatedOrders = orders.map((order) =>
      order.id === orderId ? { ...order, deliveryPerson: deliveryPerson === "Sin asignar" ? undefined : deliveryPerson } : order
    );
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
    setOrders(updatedOrders);
  };

  const deleteOrder = (orderId: string) => {
    const updatedOrders = orders.filter((order) => order.id !== orderId);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
    setOrders(updatedOrders);
  };

  // Filtrar pedidos según el estado seleccionado
  const filteredOrders = filterStatus === "Todos"
    ? orders
    : orders.filter(order => order.status === filterStatus);

  // Estadísticas
  const stats = {
    total: orders.length,
    pendientes: orders.filter(o => o.status === "Pendiente").length,
    enCamino: orders.filter(o => o.status === "En Camino").length,
    entregados: orders.filter(o => o.status === "Entregado").length,
  };

  return (
    <div className="h-full overflow-y-auto">
      {/* Tabs de navegación */}
      <div className="sticky top-0 z-10 bg-white border-b border-[#CBD5E0] shadow-sm">
        <div className="flex overflow-x-auto">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-6 py-4 border-b-2 text-sm md:text-base whitespace-nowrap transition-colors ${
              activeTab === 'orders'
                ? 'border-[#003366] font-medium text-[#003366] bg-blue-50'
                : 'border-transparent hover:bg-gray-50 text-[#4A5568]'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            Gestión de Pedidos
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center gap-2 px-6 py-4 border-b-2 text-sm md:text-base whitespace-nowrap transition-colors ${
              activeTab === 'inventory'
                ? 'border-[#003366] font-medium text-[#003366] bg-blue-50'
                : 'border-transparent hover:bg-gray-50 text-[#4A5568]'
            }`}
          >
            <Package className="w-4 h-4" />
            Inventario
          </button>
          <button
            onClick={() => setActiveTab('staff')}
            className={`flex items-center gap-2 px-6 py-4 border-b-2 text-sm md:text-base whitespace-nowrap transition-colors ${
              activeTab === 'staff'
                ? 'border-[#003366] font-medium text-[#003366] bg-blue-50'
                : 'border-transparent hover:bg-gray-50 text-[#4A5568]'
            }`}
          >
            <Users className="w-4 h-4" />
            Personal
          </button>
        </div>
      </div>

      {/* Contenido de las pestañas */}
      {activeTab === 'orders' && (
        <div className="p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6 md:mb-8">
              <h1 className="mb-4 text-[#003366]">Panel de Administración</h1>

              {/* Widget de estado del servidor */}
              <div className="mb-6">
                <ServerStatus />
              </div>

              {/* Estadísticas */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
                <div className="border border-gray-300 rounded p-3 md:p-4">
                  <p className="text-sm text-gray-500 mb-1">Total de pedidos</p>
                  <p className="text-2xl font-medium">{stats.total}</p>
                </div>
                <div className="border border-gray-300 rounded p-3 md:p-4">
                  <p className="text-sm text-gray-500 mb-1">Pendientes</p>
                  <p className="text-2xl font-medium text-orange-600">{stats.pendientes}</p>
                </div>
                <div className="border border-gray-300 rounded p-3 md:p-4">
                  <p className="text-sm text-gray-500 mb-1">En Camino</p>
                  <p className="text-2xl font-medium text-blue-600">{stats.enCamino}</p>
                </div>
                <div className="border border-gray-300 rounded p-3 md:p-4">
                  <p className="text-sm text-gray-500 mb-1">Entregados</p>
                  <p className="text-2xl font-medium text-green-600">{stats.entregados}</p>
                </div>
              </div>

              {/* Filtros y acciones */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">Filtrar por estado:</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded"
                  >
                    {statuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                {orders.length > 0 && (
                  <button
                    onClick={() => {
                      localStorage.setItem("orders", "[]");
                      setOrders([]);
                    }}
                    className="px-4 py-2 border border-red-600 text-red-600 rounded hover:bg-red-50"
                  >
                    Limpiar Todos
                  </button>
                )}
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="text-center py-20 border-2 border-dashed border-gray-300 rounded">
                <p className="text-gray-500">
                  {filterStatus === "Todos" ? "No hay pedidos todavía" : `No hay pedidos con estado "${filterStatus}"`}
                </p>
                <p className="text-sm text-gray-400 mt-2">Los pedidos confirmados aparecerán aquí</p>
              </div>
            ) : (
              <>
                {/* Tabla versión desktop */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full border border-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left border-b border-gray-300 text-sm">ID</th>
                        <th className="px-4 py-3 text-left border-b border-gray-300 text-sm">Cliente</th>
                        <th className="px-4 py-3 text-left border-b border-gray-300 text-sm">Producto(s)</th>
                        <th className="px-4 py-3 text-left border-b border-gray-300 text-sm">Total</th>
                        <th className="px-4 py-3 text-left border-b border-gray-300 text-sm">Estado</th>
                        <th className="px-4 py-3 text-left border-b border-gray-300 text-sm">Asignar</th>
                        <th className="px-4 py-3 text-left border-b border-gray-300 text-sm">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((order) => (
                        <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm">#{order.id}</td>
                          <td className="px-4 py-3">
                            <div className="text-sm">
                              <div className="font-medium">{order.name}</div>
                              <div className="text-gray-500 text-xs">{order.phone}</div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm">
                              {order.items.slice(0, 2).map((item, idx) => (
                                <div key={idx} className="text-xs">
                                  {item.name} x{item.quantity}
                                </div>
                              ))}
                              {order.items.length > 2 && (
                                <div className="text-xs text-gray-500">+{order.items.length - 2} más</div>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-medium">S/. {order.total.toFixed(2)}</div>
                            <div className="mt-1">
                              {order.paymentStatus === 'Pagado' ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                  <CreditCard className="w-3 h-3" />
                                  Pagado
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                                  <DollarSign className="w-3 h-3" />
                                  Pendiente
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                              className="px-2 py-1 border border-gray-300 rounded text-sm"
                            >
                              <option value="Pendiente">Pendiente</option>
                              <option value="En Preparación">En Preparación</option>
                              <option value="En Camino">En Camino</option>
                              <option value="Entregado">Entregado</option>
                              <option value="Cancelado">Cancelado</option>
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={order.deliveryPerson || "Sin asignar"}
                              onChange={(e) => assignDeliveryPerson(order.id, e.target.value)}
                              className="px-2 py-1 border border-gray-300 rounded text-sm"
                            >
                              {deliveryPeople.map((person) => (
                                <option key={person} value={person}>{person}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() => setSelectedOrder(order)}
                                className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 flex items-center gap-1"
                              >
                                <Eye className="w-4 h-4" />
                                JSON
                              </button>
                              <button
                                onClick={() => deleteOrder(order.id)}
                                className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
                              >
                                Eliminar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Tarjetas versión móvil/tablet */}
                <div className="lg:hidden space-y-4">
                  {filteredOrders.map((order) => (
                    <div
                      key={order.id}
                      className="border border-gray-300 rounded p-4 bg-white"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-sm font-medium">Pedido #{order.id}</h3>
                          <p className="text-xs text-gray-500 mt-1">{order.date}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100 flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" />
                            JSON
                          </button>
                          <button
                            onClick={() => deleteOrder(order.id)}
                            className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2 mb-3 pb-3 border-b border-gray-200">
                        <div>
                          <p className="text-xs text-gray-500">Cliente</p>
                          <p className="text-sm font-medium">{order.name}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Productos</p>
                          {order.items.map((item) => (
                            <p key={item.id} className="text-sm">{item.name} x {item.quantity}</p>
                          ))}
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Total</p>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium">S/. {order.total.toFixed(2)}</p>
                            {order.paymentStatus === 'Pagado' ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                <CreditCard className="w-3 h-3" />
                                Pagado
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                                <DollarSign className="w-3 h-3" />
                                Pendiente
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <label className="text-xs text-gray-500 w-20">Estado:</label>
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                          >
                            <option value="Pendiente">Pendiente</option>
                            <option value="En Preparación">En Preparación</option>
                            <option value="En Camino">En Camino</option>
                            <option value="Entregado">Entregado</option>
                            <option value="Cancelado">Cancelado</option>
                          </select>
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-xs text-gray-500 w-20">Asignar a:</label>
                          <select
                            value={order.deliveryPerson || "Sin asignar"}
                            onChange={(e) => assignDeliveryPerson(order.id, e.target.value)}
                            className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                          >
                            {deliveryPeople.map((person) => (
                              <option key={person} value={person}>{person}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Modal JSON Viewer */}
            {selectedOrder && (
              <JsonViewer order={selectedOrder} onClose={() => setSelectedOrder(null)} />
            )}
          </div>
        </div>
      )}

      {activeTab === 'inventory' && <InventoryPanel />}
      {activeTab === 'staff' && <StaffPanel />}
    </div>
  );
}