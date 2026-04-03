import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';

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

export function OrderTracker() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [userEmail, setUserEmail] = useState('');
  const [searchEmail, setSearchEmail] = useState('');

  const loadOrders = () => {
    const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const userOrders = storedOrders.filter((order: Order) =>
      order.email.toLowerCase() === searchEmail.toLowerCase()
    );
    setOrders(userOrders);
  };

  useEffect(() => {
    if (searchEmail) {
      loadOrders();
      const interval = setInterval(loadOrders, 2000);
      return () => clearInterval(interval);
    }
  }, [searchEmail]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (userEmail.trim()) {
      setSearchEmail(userEmail);
    }
  };

  const getStatusStep = (status: string): number => {
    switch (status) {
      case 'Pendiente': return 1;
      case 'En Preparación': return 2;
      case 'En Camino': return 3;
      case 'Entregado': return 4;
      default: return 0;
    }
  };

  const steps = [
    { step: 1, label: 'Pendiente', description: 'Pedido recibido' },
    { step: 2, label: 'En Preparación', description: 'Procesando' },
    { step: 3, label: 'En Camino', description: 'En ruta' },
    { step: 4, label: 'Entregado', description: 'Completado' },
  ];

  return (
    <div className="h-full overflow-y-auto p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="mb-6">Seguimiento de Pedidos</h1>

        {!searchEmail ? (
          <div className="max-w-md mx-auto">
            <div className="border border-gray-300 rounded p-6 bg-white">
              <h3 className="mb-4">Buscar mis pedidos</h3>
              <form onSubmit={handleSearch} className="space-y-4">
                <div>
                  <label className="block text-sm mb-1">Email de registro</label>
                  <input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="ejemplo@correo.com"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-black text-white rounded hover:bg-gray-800"
                >
                  Buscar Pedidos
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                Mostrando pedidos para: <span className="font-medium">{searchEmail}</span>
              </p>
              <button
                onClick={() => {
                  setSearchEmail('');
                  setUserEmail('');
                  setOrders([]);
                }}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
              >
                Cambiar Email
              </button>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-20 border-2 border-dashed border-gray-300 rounded">
                <p className="text-gray-500">No se encontraron pedidos</p>
                <p className="text-sm text-gray-400 mt-2">Verifica el email ingresado</p>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => {
                  const currentStep = getStatusStep(order.status);
                  const isCancelled = order.status === 'Cancelado';

                  return (
                    <div
                      key={order.id}
                      className="border border-gray-300 rounded p-6 bg-white"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
                        <div>
                          <h3 className="mb-1">Pedido #{order.id}</h3>
                          <p className="text-sm text-gray-600">{order.date}</p>
                          {order.deliveryPerson && (
                            <p className="text-sm text-gray-600 mt-1">
                              Repartidor: <span className="font-medium">{order.deliveryPerson}</span>
                            </p>
                          )}
                        </div>
                        <div className="inline-block px-3 py-1 bg-gray-100 rounded">
                          {order.status}
                        </div>
                      </div>

                      {isCancelled ? (
                        <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
                          <p className="text-red-800">Este pedido ha sido cancelado</p>
                        </div>
                      ) : (
                        <div className="mb-6">
                          <div className="relative">
                            {/* Línea de progreso */}
                            <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200" style={{ left: '5%', right: '5%' }} />
                            <div
                              className="absolute top-5 left-0 h-0.5 bg-green-600 transition-all duration-500"
                              style={{
                                left: '5%',
                                width: `${((currentStep - 1) / (steps.length - 1)) * 90}%`
                              }}
                            />

                            {/* Steps */}
                            <div className="relative grid grid-cols-4 gap-2">
                              {steps.map((step) => {
                                const isCompleted = currentStep >= step.step;
                                const isCurrent = currentStep === step.step;

                                return (
                                  <div key={step.step} className="flex flex-col items-center">
                                    <div
                                      className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all ${
                                        isCompleted
                                          ? 'bg-green-600 text-white'
                                          : 'bg-gray-200 text-gray-400'
                                      } ${isCurrent ? 'ring-4 ring-green-200' : ''}`}
                                    >
                                      {isCompleted ? (
                                        <Check className="w-5 h-5" />
                                      ) : (
                                        <span>{step.step}</span>
                                      )}
                                    </div>
                                    <p className="text-xs font-medium text-center">{step.label}</p>
                                    <p className="text-xs text-gray-500 text-center mt-0.5">
                                      {step.description}
                                    </p>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Detalles del pedido */}
                      <div className="border-t border-gray-200 pt-4">
                        <p className="text-sm text-gray-500 mb-2">Productos</p>
                        <div className="space-y-1">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex justify-between text-sm">
                              <span>{item.name} x {item.quantity}</span>
                              <span>S/. {(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                          <div className="flex justify-between pt-2 mt-2 border-t border-gray-300 font-medium">
                            <span>Total</span>
                            <span>S/. {order.total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
