import { useState, useEffect } from 'react';
import { CheckoutForm } from './CheckoutForm';
import { ShoppingCart, Plus, Minus, Trash2, Zap, TrendingDown } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Product {
  id: string;
  name: string;
  price: number;
  discountPrice?: number;
  category: string;
  imageUrl: string;
}

interface CartItem extends Product {
  quantity: number;
}

export function Catalog() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  // Cargar productos desde localStorage
  useEffect(() => {
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    }
  }, []);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  // Calcular total considerando precios de oferta
  const total = cart.reduce((sum, item) => {
    const price = item.discountPrice || item.price;
    return sum + price * item.quantity;
  }, 0);

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Obtener productos destacados (con descuento)
  const featuredProducts = products.filter(p => p.discountPrice);
  const mainFeatured = featuredProducts[0];

  return (
    <div className="flex flex-col lg:flex-row h-full">
      {/* Catálogo de productos */}
      <div className={`flex-1 overflow-y-auto ${showCheckout ? 'lg:pr-0' : ''}`}>
        {/* Hero Banner */}
        {mainFeatured && (
          <div className="bg-gradient-to-r from-[#003366] via-[#004080] to-[#003366] text-white">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
              <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 bg-[#DC2626] px-4 py-2 rounded-full mb-4">
                    <Zap className="w-5 h-5" />
                    <span className="font-medium">Oferta del Mes</span>
                  </div>
                  <h1 className="text-white mb-3 text-3xl md:text-4xl">{mainFeatured.name}</h1>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-2xl md:text-3xl line-through text-blue-200">
                      S/. {mainFeatured.price.toFixed(2)}
                    </span>
                    <span className="text-4xl md:text-5xl font-bold">
                      S/. {mainFeatured.discountPrice?.toFixed(2)}
                    </span>
                    <span className="bg-yellow-400 text-[#003366] px-3 py-1 rounded-lg font-medium text-lg">
                      -{Math.round((1 - (mainFeatured.discountPrice! / mainFeatured.price)) * 100)}%
                    </span>
                  </div>
                  <p className="text-blue-100 mb-6">
                    Aproveche esta oferta exclusiva y ahorre hasta S/. {(mainFeatured.price - mainFeatured.discountPrice!).toFixed(2)} en su compra.
                  </p>
                  <button
                    onClick={() => addToCart(mainFeatured)}
                    className="flex items-center gap-2 px-6 py-3 bg-white text-[#003366] rounded-lg hover:bg-blue-50 transition-colors shadow-lg hover:shadow-xl font-medium"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Agregar al Carrito
                  </button>
                </div>
                <div className="w-full md:w-80 h-64 md:h-80 bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border-2 border-white/20">
                  <ImageWithFallback
                    src={mainFeatured.imageUrl}
                    alt={mainFeatured.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6 md:mb-8">
              <h2 className="mb-2 text-[#003366]">Catálogo de Productos</h2>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <p className="text-gray-600">Descubre nuestra selección de electrodomésticos</p>
                {itemCount > 0 && !showCheckout && (
                  <button
                    onClick={() => setShowCheckout(true)}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-[#003366] text-white rounded-lg hover:bg-[#002244] shadow-md hover:shadow-lg w-full sm:w-auto transition-all"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>{itemCount} producto(s) · S/. {total.toFixed(2)}</span>
                  </button>
                )}
              </div>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-20 border-2 border-dashed border-[#CBD5E0] rounded-lg">
                <p className="text-[#718096]">No hay productos disponibles</p>
                <p className="text-sm text-[#A0AEC0] mt-2">El administrador debe agregar productos al inventario</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {products.map(product => {
                  const cartItem = cart.find(item => item.id === product.id);
                  const hasDiscount = !!product.discountPrice;
                  const discountPercent = hasDiscount
                    ? Math.round((1 - product.discountPrice! / product.price) * 100)
                    : 0;

                  return (
                    <div
                      key={product.id}
                      className="border border-[#CBD5E0] rounded-lg p-4 flex flex-col bg-white hover:shadow-lg transition-all relative"
                    >
                      {/* Badge de descuento */}
                      {hasDiscount && (
                        <div className="absolute top-2 right-2 z-10">
                          <div className="bg-[#DC2626] text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 shadow-lg">
                            <TrendingDown className="w-4 h-4" />
                            -{discountPercent}%
                          </div>
                        </div>
                      )}

                      {/* Imagen real del producto */}
                      <div className="w-full aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
                        <ImageWithFallback
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Información del producto */}
                      <div className="flex-1">
                        <p className="text-xs text-[#718096] mb-1">{product.category}</p>
                        <h3 className="mb-2 text-[#1A202C]">{product.name}</h3>

                        {/* Precios */}
                        {hasDiscount ? (
                          <div className="mb-3">
                            <p className="text-sm text-[#718096] line-through mb-1">
                              S/. {product.price.toFixed(2)}
                            </p>
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-xl text-[#DC2626]">
                                S/. {product.discountPrice?.toFixed(2)}
                              </p>
                              <span className="text-xs text-green-600 font-medium">
                                Ahorra S/. {(product.price - product.discountPrice!).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <p className="mb-3 font-medium text-[#003366]">
                            S/. {product.price.toFixed(2)}
                          </p>
                        )}
                      </div>

                      {/* Botón añadir al carrito */}
                      {cartItem ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(product.id, cartItem.quantity - 1)}
                            className="w-10 h-10 border border-[#CBD5E0] rounded-lg hover:bg-[#E2E8F0] flex items-center justify-center transition-colors"
                          >
                            <Minus className="w-4 h-4 text-[#4A5568]" />
                          </button>
                          <span className="flex-1 text-center font-medium text-[#1A202C]">{cartItem.quantity}</span>
                          <button
                            onClick={() => updateQuantity(product.id, cartItem.quantity + 1)}
                            className="w-10 h-10 border border-[#CBD5E0] rounded-lg hover:bg-[#E2E8F0] flex items-center justify-center transition-colors"
                          >
                            <Plus className="w-4 h-4 text-[#4A5568]" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(product)}
                          className="w-full px-4 py-2 bg-[#003366] text-white rounded-lg hover:bg-[#002244] flex items-center justify-center gap-2 transition-colors shadow-md hover:shadow-lg"
                        >
                          <Plus className="w-4 h-4" />
                          Añadir
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Panel de checkout - responsive */}
      {showCheckout && (
        <>
          {/* Overlay para móvil */}
          <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowCheckout(false)}
          />

          {/* Panel */}
          <div className="fixed lg:relative inset-x-0 bottom-0 lg:inset-auto lg:w-[420px] border-l-0 lg:border-l border-gray-300 bg-white overflow-y-auto z-50 max-h-[90vh] lg:max-h-full rounded-t-2xl lg:rounded-none shadow-2xl lg:shadow-none">
            <div className="sticky top-0 bg-white border-b border-gray-300 p-4 z-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Carrito de Compras
                </h2>
                <button
                  onClick={() => setShowCheckout(false)}
                  className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-4">
              {/* Resumen del carrito */}
              <div className="mb-6">
                <h3 className="mb-3">Resumen del Pedido</h3>
                <div className="space-y-3">
                  {cart.map(item => {
                    const price = item.discountPrice || item.price;
                    return (
                      <div key={item.id} className="flex gap-3 py-3 border-b border-gray-200">
                        <div className="w-16 h-16 bg-gray-100 rounded flex-shrink-0 overflow-hidden">
                          <ImageWithFallback
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{item.name}</div>
                          <div className="text-sm text-gray-600 mt-1">
                            S/. {price.toFixed(2)} × {item.quantity}
                          </div>
                          {item.discountPrice && (
                            <div className="text-xs text-green-600 mt-0.5">
                              ¡Oferta aplicada!
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col items-end justify-between">
                          <div className="font-medium text-sm">
                            S/. {(price * item.quantity).toFixed(2)}
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-600 hover:text-red-700 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between items-center pt-4 mt-4 border-t-2 border-gray-300">
                  <span className="font-medium">Total:</span>
                  <span className="font-medium text-xl">S/. {total.toFixed(2)}</span>
                </div>
              </div>

              {/* Formulario de pedido */}
              <CheckoutForm cart={cart} total={total} onSuccess={() => {
                setCart([]);
                setShowCheckout(false);
              }} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}