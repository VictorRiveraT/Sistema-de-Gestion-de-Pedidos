import { useState, useEffect } from 'react';
import { X, Upload, AlertCircle, CheckCircle2 } from 'lucide-react';

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

interface ProductModalProps {
  product: Product | null;
  onSave: (product: Product) => void;
  onClose: () => void;
}

export function ProductModal({ product, onSave, onClose }: ProductModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    discountPrice: '',
    category: '',
    stock: '',
    minStock: '',
    imageUrl: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price.toString(),
        discountPrice: product.discountPrice?.toString() || '',
        category: product.category,
        stock: product.stock.toString(),
        minStock: product.minStock?.toString() || '',
        imageUrl: product.imageUrl,
      });
    }
  }, [product]);

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'El nombre es requerido';
        if (value.trim().length < 3) return 'Mínimo 3 caracteres';
        return undefined;
      case 'price':
        if (!value.trim()) return 'El precio es requerido';
        const price = parseFloat(value);
        if (isNaN(price) || price <= 0) return 'Precio inválido';
        return undefined;
      case 'discountPrice':
        if (value.trim()) {
          const discountPrice = parseFloat(value);
          if (isNaN(discountPrice) || discountPrice <= 0) return 'Precio de oferta inválido';
          const regularPrice = parseFloat(formData.price);
          if (!isNaN(regularPrice) && discountPrice >= regularPrice) {
            return 'El precio de oferta debe ser menor al precio regular';
          }
        }
        return undefined;
      case 'category':
        if (!value.trim()) return 'La categoría es requerida';
        return undefined;
      case 'stock':
        if (!value.trim()) return 'El stock es requerido';
        const stock = parseInt(value);
        if (isNaN(stock) || stock < 0) return 'Stock inválido';
        return undefined;
      case 'minStock':
        if (value.trim()) {
          const minStock = parseInt(value);
          if (isNaN(minStock) || minStock < 0) return 'Stock mínimo inválido';
        }
        return undefined;
      case 'imageUrl':
        if (!value.trim()) return 'La URL de la imagen es requerida';
        try {
          new URL(value);
          return undefined;
        } catch {
          return 'URL inválida';
        }
      default:
        return undefined;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error || '' }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error || '' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    Object.keys(formData).forEach(key => {
      if (key !== 'minStock') {
        const error = validateField(key, formData[key as keyof typeof formData]);
        if (error) newErrors[key] = error;
      } else if (formData.minStock) {
        const error = validateField(key, formData.minStock);
        if (error) newErrors[key] = error;
      }
    });

    setErrors(newErrors);
    setTouched({
      name: true,
      price: true,
      category: true,
      stock: true,
      minStock: true,
      imageUrl: true,
    });

    if (Object.keys(newErrors).length === 0) {
      const productData: Product = {
        id: product?.id || '',
        name: formData.name.trim(),
        price: parseFloat(formData.price),
        discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : undefined,
        category: formData.category.trim(),
        stock: parseInt(formData.stock),
        minStock: formData.minStock ? parseInt(formData.minStock) : undefined,
        imageUrl: formData.imageUrl.trim(),
      };
      onSave(productData);
    }
  };

  const isFormValid = () => {
    const requiredFields = ['name', 'price', 'category', 'stock', 'imageUrl'];
    return requiredFields.every(key => {
      const value = formData[key as keyof typeof formData];
      return value && !validateField(key, value);
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#003366] to-[#004D99] px-6 py-4 flex items-center justify-between">
          <h2 className="text-white flex items-center gap-2">
            <Upload className="w-5 h-5" />
            {product ? 'Editar Producto' : 'Añadir Nuevo Producto'}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Preview de imagen */}
          {formData.imageUrl && !errors.imageUrl && (
            <div className="mb-4">
              <p className="text-sm text-[#718096] mb-2">Vista previa:</p>
              <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999"%3EImagen%3C/text%3E%3C/svg%3E';
                  }}
                />
              </div>
            </div>
          )}

          {/* Nombre */}
          <div>
            <label className="block text-sm text-[#4A5568] mb-2">Nombre del Producto *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Ej: Refrigeradora Samsung"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-[#0047AB] focus:ring-2 focus:ring-[#0047AB]/20 transition-colors ${
                touched.name && errors.name ? 'border-red-500' : 'border-[#CBD5E0]'
              }`}
            />
            {touched.name && errors.name && (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.name}
              </p>
            )}
            {touched.name && !errors.name && formData.name && (
              <p className="mt-1 text-xs text-green-600 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Correcto
              </p>
            )}
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-sm text-[#4A5568] mb-2">Categoría *</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Ej: Electrodomésticos"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-[#0047AB] focus:ring-2 focus:ring-[#0047AB]/20 transition-colors ${
                touched.category && errors.category ? 'border-red-500' : 'border-[#CBD5E0]'
              }`}
            />
            {touched.category && errors.category && (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.category}
              </p>
            )}
          </div>

          {/* Precio y Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[#4A5568] mb-2">Precio Regular (S/.) *</label>
              <input
                type="number"
                step="0.01"
                name="price"
                value={formData.price}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="0.00"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-[#003366] focus:ring-2 focus:ring-[#003366]/20 transition-colors ${
                  touched.price && errors.price ? 'border-red-500' : 'border-[#CBD5E0]'
                }`}
              />
              {touched.price && errors.price && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.price}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm text-[#4A5568] mb-2">
                Precio de Oferta (S/.)
                <span className="text-xs text-[#718096] ml-2">Opcional</span>
              </label>
              <input
                type="number"
                step="0.01"
                name="discountPrice"
                value={formData.discountPrice}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="0.00"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-[#003366] focus:ring-2 focus:ring-[#003366]/20 transition-colors ${
                  touched.discountPrice && errors.discountPrice ? 'border-red-500' : 'border-[#CBD5E0]'
                }`}
              />
              {touched.discountPrice && errors.discountPrice && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.discountPrice}
                </p>
              )}
              {formData.discountPrice && formData.price && !errors.discountPrice && (
                <p className="mt-1 text-xs text-green-600">
                  Descuento: {Math.round((1 - parseFloat(formData.discountPrice) / parseFloat(formData.price)) * 100)}%
                </p>
              )}
            </div>
          </div>

      {/* Stock */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-[#4A5568] mb-2">Stock Actual *</label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="0"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-[#003366] focus:ring-2 focus:ring-[#003366]/20 transition-colors ${
                        touched.stock && errors.stock ? 'border-red-500' : 'border-[#CBD5E0]'
                      }`}
                    />
                    {touched.stock && errors.stock && (
                      <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.stock}
                      </p>
                    )}
                  </div> {/* <-- CORRECCIÓN AQUÍ: Se cerró el div de la primera columna del grid */}
      
                  {/* Stock Mínimo */}
                  <div>
                    <label className="block text-sm text-[#4A5568] mb-2">
                      Stock Mínimo (opcional)
                      <span className="text-xs text-[#718096] ml-2">Se alertará cuando el stock baje de este nivel</span>
                    </label>
                    <input
                      type="number"
                      name="minStock"
                      value={formData.minStock}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Ej: 5"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-[#003366] focus:ring-2 focus:ring-[#003366]/20 transition-colors ${
                        touched.minStock && errors.minStock ? 'border-red-500' : 'border-[#CBD5E0]'
                      }`}
                    />
                    {touched.minStock && errors.minStock && (
                      <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.minStock}
                      </p>
                    )}
                  </div>
                </div>
      
                {/* URL de Imagen */}
                <div>
                  <label className="block text-sm text-[#4A5568] mb-2">URL de Imagen *</label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="https://ejemplo.com/imagen.jpg"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-[#003366] focus:ring-2 focus:ring-[#003366]/20 transition-colors ${
                      touched.imageUrl && errors.imageUrl ? 'border-red-500' : 'border-[#CBD5E0]'
                    }`}
                  />
                  {touched.imageUrl && errors.imageUrl && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.imageUrl}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-[#718096] flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Nota: Puedes usar imágenes de Unsplash.com para productos de prueba
                  </p>
                </div>
      
                {/* Botones */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-6 py-3 border border-[#CBD5E0] text-[#4A5568] rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={!isFormValid()}
                    className="flex-1 px-6 py-3 bg-[#003366] text-white rounded-lg hover:bg-[#002244] disabled:bg-[#CBD5E0] disabled:cursor-not-allowed transition-colors shadow-md hover:shadow-lg"
                  >
                    {product ? 'Guardar Cambios' : 'Añadir Producto'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      }
