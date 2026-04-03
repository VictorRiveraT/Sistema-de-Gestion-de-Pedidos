import { useState, useEffect } from 'react';
import { Package, Plus, Edit, Trash2, AlertCircle, Search } from 'lucide-react';
import { ProductModal } from './ProductModal';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Product {
  id: string;
  name: string;
  price: number;
  discountPrice?: number;
  category: string;
  stock: number;
  imageUrl: string;
  minStock?: number;
}

export function InventoryPanel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      // Inicializar con productos de ejemplo
      const defaultProducts: Product[] = [
        { id: '1', name: 'Refrigeradora', price: 1299, discountPrice: 999, category: 'Electrodomésticos', stock: 15, imageUrl: 'https://images.unsplash.com/photo-1758488438758-5e2eedf769ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWZyaWdlcmF0b3IlMjBraXRjaGVuJTIwYXBwbGlhbmNlfGVufDF8fHx8MTc3NDkwMjI5N3ww&ixlib=rb-4.1.0&q=80&w=1080', minStock: 5 },
        { id: '2', name: 'Lavadora', price: 899, category: 'Electrodomésticos', stock: 12, imageUrl: 'https://images.unsplash.com/photo-1754732693535-7ffb5e1a51d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXNoaW5nJTIwbWFjaGluZSUyMGxhdW5kcnklMjBhcHBsaWFuY2V8ZW58MXx8fHwxNzc0OTM3MzY4fDA&ixlib=rb-4.1.0&q=80&w=1080', minStock: 5 },
        { id: '3', name: 'Cocina', price: 649, discountPrice: 499, category: 'Electrodomésticos', stock: 8, imageUrl: 'https://images.unsplash.com/photo-1773177930183-2c5fb2884171?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraXRjaGVuJTIwc3RvdmUlMjBvdmVuJTIwYXBwbGlhbmNlfGVufDF8fHx8MTc3NDkzNzM2OHww&ixlib=rb-4.1.0&q=80&w=1080', minStock: 3 },
        { id: '4', name: 'Microondas', price: 249, category: 'Electrodomésticos', stock: 20, imageUrl: 'https://images.unsplash.com/photo-1608384156808-418b5c079968?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaWNyb3dhdmUlMjBvdmVuJTIwa2l0Y2hlbnxlbnwxfHx8fDE3NzQ4MTIzODB8MA&ixlib=rb-4.1.0&q=80&w=1080', minStock: 10 },
        { id: '5', name: 'Licuadora', price: 89, category: 'Pequeños', stock: 3, imageUrl: 'https://images.unsplash.com/photo-1761953881694-b98b238f87bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGVuZGVyJTIwa2l0Y2hlbiUyMGFwcGxpYW5jZXxlbnwxfHx8fDE3NzQ4NzQ0NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080', minStock: 5 },
        { id: '6', name: 'Televisor 55"', price: 1599, discountPrice: 1299, category: 'Electrónica', stock: 7, imageUrl: 'https://images.unsplash.com/photo-1656432975530-f05d496096f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWxldmlzaW9uJTIwc2NyZWVuJTIwbW9kZXJufGVufDF8fHx8MTc3NDg5MzM0NHww&ixlib=rb-4.1.0&q=80&w=1080', minStock: 3 },
        { id: '7', name: 'Aspiradora', price: 299, category: 'Limpieza', stock: 14, imageUrl: 'https://images.unsplash.com/photo-1765970101654-337b573142fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2YWN1dW0lMjBjbGVhbmVyJTIwYXBwbGlhbmNlfGVufDF8fHx8MTc3NDkzNzM3MHww&ixlib=rb-4.1.0&q=80&w=1080', minStock: 5 },
        { id: '8', name: 'Ventilador', price: 119, category: 'Climatización', stock: 25, imageUrl: 'https://images.unsplash.com/photo-1754818046542-d2a352bfff09?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMGZhbiUyMHZlbnRpbGF0b3J8ZW58MXx8fHwxNzc0OTM3MzcwfDA&ixlib=rb-4.1.0&q=80&w=1080', minStock: 10 },
      ];
      localStorage.setItem('products', JSON.stringify(defaultProducts));
      setProducts(defaultProducts);
    }
  };

  const handleSaveProduct = (product: Product) => {
    let updatedProducts: Product[];
    
    if (editingProduct) {
      // Editar producto existente
      updatedProducts = products.map(p => p.id === product.id ? product : p);
    } else {
      // Añadir nuevo producto
      const newProduct = { ...product, id: Date.now().toString() };
      updatedProducts = [...products, newProduct];
    }
    
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    setProducts(updatedProducts);
    setShowModal(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      const updatedProducts = products.filter(p => p.id !== productId);
      localStorage.setItem('products', JSON.stringify(updatedProducts));
      setProducts(updatedProducts);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockProducts = products.filter(p => p.minStock && p.stock <= p.minStock);

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-[#003366] flex items-center gap-2">
                <Package className="w-6 h-6" />
                Gestión de Inventario
              </h2>
              <p className="text-sm text-[#718096] mt-1">
                Administra el catálogo de productos y controla el stock
              </p>
            </div>
            <button
              onClick={() => {
                setEditingProduct(null);
                setShowModal(true);
              }}
              className="flex items-center gap-2 px-6 py-3 bg-[#003366] text-white rounded-lg hover:bg-[#002244] transition-colors shadow-md hover:shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Añadir Producto
            </button>
          </div>

          {/* Alertas de stock bajo */}
          {lowStockProducts.length > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-orange-800 mb-1">
                    Alerta de Stock Bajo
                  </p>
                  <p className="text-sm text-orange-700">
                    {lowStockProducts.length} producto(s) con stock por debajo del mínimo:
                  </p>
                  <ul className="text-sm text-orange-700 mt-2 space-y-1">
                    {lowStockProducts.map(p => (
                      <li key={p.id}>
                        • {p.name}: {p.stock} unidades (mínimo: {p.minStock})
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Búsqueda */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#718096]" />
            <input
              type="text"
              placeholder="Buscar productos por nombre o categoría..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-[#CBD5E0] rounded-lg focus:outline-none focus:border-[#003366] focus:ring-2 focus:ring-[#003366]/20"
            />
          </div>
        </div>

        {/* Tabla Desktop */}
        <div className="hidden lg:block overflow-x-auto bg-white rounded-lg border border-[#CBD5E0] shadow-sm">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-[#003366] to-[#004D99] text-white">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">Producto</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Categoría</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Precio / Oferta</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Stock Actual</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Stock Mínimo</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Estado</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, index) => {
                const isLowStock = product.minStock && product.stock <= product.minStock;
                return (
                  <tr key={product.id} className={`border-b border-[#E2E8F0] hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                          <ImageWithFallback
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="font-medium text-[#1A202C]">{product.name}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#4A5568]">{product.category}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className={`font-medium ${product.discountPrice ? 'text-[#718096] line-through text-sm' : 'text-[#003366]'}`}>
                          S/. {product.price.toFixed(2)}
                        </span>
                        {product.discountPrice && (
                          <span className="font-medium text-[#DC2626]">
                            S/. {product.discountPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-medium ${isLowStock ? 'text-orange-600' : 'text-[#1A202C]'}`}>
                        {product.stock} unidades
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#718096]">
                      {product.minStock || '-'} unidades
                    </td>
                    <td className="px-4 py-3">
                      {isLowStock ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                          <AlertCircle className="w-3 h-3" />
                          Stock Bajo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          ✓ Normal
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="p-2 text-[#003366] hover:bg-blue-50 rounded transition-colors"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Cards Móvil */}
        <div className="lg:hidden space-y-4">
          {filteredProducts.map((product) => {
            const isLowStock = product.minStock && product.stock <= product.minStock;
            return (
              <div key={product.id} className="bg-white border border-[#CBD5E0] rounded-lg p-4 shadow-sm">
                <div className="flex gap-4 mb-4">
                  <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                    <ImageWithFallback
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-[#1A202C] mb-1">{product.name}</h3>
                    <p className="text-sm text-[#718096] mb-2">{product.category}</p>
                    <div className="flex flex-col">
                      <span className={`${product.discountPrice ? 'text-sm text-[#718096] line-through' : 'font-medium text-[#003366]'}`}>
                        S/. {product.price.toFixed(2)}
                      </span>
                      {product.discountPrice && (
                        <span className="font-medium text-[#DC2626]">
                          S/. {product.discountPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <p className="text-xs text-[#718096] mb-1">Stock Actual</p>
                    <p className={`font-medium ${isLowStock ? 'text-orange-600' : 'text-[#1A202C]'}`}>
                      {product.stock} unidades
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#718096] mb-1">Stock Mínimo</p>
                    <p className="font-medium text-[#4A5568]">{product.minStock || '-'} unidades</p>
                  </div>
                </div>

                {isLowStock && (
                  <div className="bg-orange-50 border border-orange-200 rounded p-2 mb-3">
                    <p className="text-xs text-orange-700 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Stock por debajo del mínimo
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-[#003366] text-[#003366] rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Eliminar
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed border-[#CBD5E0] rounded-lg bg-white">
            <Package className="w-16 h-16 text-[#CBD5E0] mx-auto mb-4" />
            <p className="text-[#718096]">No se encontraron productos</p>
            <p className="text-sm text-[#A0AEC0] mt-2">
              {searchTerm ? 'Intente con otra búsqueda' : 'Agregue su primer producto para comenzar'}
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <ProductModal
          product={editingProduct}
          onSave={handleSaveProduct}
          onClose={() => {
            setShowModal(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
}
