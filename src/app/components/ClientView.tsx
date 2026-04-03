import { useState } from 'react';
import { Catalog } from './Catalog';
import { OrderTracker } from './OrderTracker';
import { ShoppingBag, Package } from 'lucide-react';

export function ClientView() {
  const [activeTab, setActiveTab] = useState<'catalog' | 'orders'>('catalog');

  return (
    <div className="h-full flex flex-col">
      {/* Tabs */}
      <div className="border-b border-[#CBD5E0] bg-white">
        <div className="flex">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors ${
              activeTab === 'catalog'
                ? 'border-[#003366] font-medium text-[#003366] bg-blue-50'
                : 'border-transparent hover:bg-gray-50 text-[#4A5568]'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            Catálogo
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors ${
              activeTab === 'orders'
                ? 'border-[#003366] font-medium text-[#003366] bg-blue-50'
                : 'border-transparent hover:bg-gray-50 text-[#4A5568]'
            }`}
          >
            <Package className="w-4 h-4" />
            Mis Pedidos
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'catalog' ? <Catalog /> : <OrderTracker />}
      </div>
    </div>
  );
}