import { useState } from 'react';
import { Code, Copy, Check, X } from 'lucide-react';

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

interface JsonViewerProps {
  order: Order;
  onClose: () => void;
}

export function JsonViewer({ order, onClose }: JsonViewerProps) {
  const [copied, setCopied] = useState(false);

  const orderObject = {
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

  const jsonString = JSON.stringify(orderObject, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-300 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-gray-600" />
            <h3>Estructura JSON del Pedido #{order.id}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm">
            <p className="text-blue-800">
              <strong>Orientado a GitHub:</strong> Esta estructura representa el objeto de pedido
              que podría almacenarse en una base de datos o enviarse a una API REST.
            </p>
          </div>

          <div className="relative">
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 p-2 bg-gray-800 text-white rounded hover:bg-gray-700 flex items-center gap-2 text-sm z-10"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copiado
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copiar
                </>
              )}
            </button>

            <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-x-auto font-mono text-sm">
              <code>{jsonString}</code>
            </pre>
          </div>

          {/* Schema explanation */}
          <div className="mt-4 border border-gray-300 rounded p-4">
            <h4 className="mb-2 flex items-center gap-2">
              <Code className="w-4 h-4" />
              Campos clave del esquema
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex gap-2">
                <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-xs">id_pedido</span>
                <span className="text-gray-600">Identificador único del pedido</span>
              </div>
              <div className="flex gap-2">
                <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-xs">id_cliente</span>
                <span className="text-gray-600">Email del cliente (identificador único)</span>
              </div>
              <div className="flex gap-2">
                <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-xs">estado</span>
                <span className="text-gray-600">Estado actual del pedido (flujo de negocio)</span>
              </div>
              <div className="flex gap-2">
                <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-xs">repartidor_asignado</span>
                <span className="text-gray-600">Repartidor responsable de la entrega</span>
              </div>
              <div className="flex gap-2">
                <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-xs">metadata</span>
                <span className="text-gray-600">Información técnica del sistema</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-300 p-4 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
