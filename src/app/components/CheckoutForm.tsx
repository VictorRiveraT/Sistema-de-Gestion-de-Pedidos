import { useState } from 'react';
import { useNavigate } from 'react-router';
import { AlertCircle, CheckCircle2, CreditCard, Lock, Banknote } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CheckoutFormProps {
  cart: CartItem[];
  total: number;
  onSuccess: () => void;
}

interface ValidationErrors {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  cardNumber?: string;
  cardName?: string;
  cardExpiry?: string;
  cardCvv?: string;
}

export function CheckoutForm({ cart, total, onSuccess }: CheckoutFormProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvv: '',
    paymentMethod: 'card', // 'card' o 'cash'
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'El nombre es requerido';
        if (value.trim().length < 3) return 'El nombre debe tener al menos 3 caracteres';
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) return 'El nombre solo puede contener letras';
        return undefined;
      case 'email':
        if (!value.trim()) return 'El email es requerido';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Email inválido';
        return undefined;
      case 'phone':
        if (!value.trim()) return 'El teléfono es requerido';
        if (!/^\d{9}$/.test(value.replace(/\s/g, ''))) return 'El teléfono debe tener 9 dígitos';
        return undefined;
      case 'address':
        if (!value.trim()) return 'La dirección es requerida';
        if (value.trim().length < 10) return 'La dirección debe ser más específica';
        return undefined;
      case 'cardNumber':
        if (formData.paymentMethod === 'card') {
          if (!value.trim()) return 'El número de tarjeta es requerido';
          const cleanNumber = value.replace(/\s/g, '');
          if (!/^\d{16}$/.test(cleanNumber)) return 'El número debe tener 16 dígitos';
        }
        return undefined;
      case 'cardName':
        if (formData.paymentMethod === 'card') {
          if (!value.trim()) return 'El nombre en la tarjeta es requerido';
          if (!/^[a-zA-Z\s]+$/.test(value)) return 'Solo letras permitidas';
        }
        return undefined;
      case 'cardExpiry':
        if (formData.paymentMethod === 'card') {
          if (!value.trim()) return 'La fecha de expiración es requerida';
          if (!/^\d{2}\/\d{2}$/.test(value)) return 'Formato: MM/AA';
        }
        return undefined;
      case 'cardCvv':
        if (formData.paymentMethod === 'card') {
          if (!value.trim()) return 'El CVV es requerido';
          if (!/^\d{3,4}$/.test(value)) return 'CVV inválido (3-4 dígitos)';
        }
        return undefined;
      default:
        return undefined;
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newErrors: ValidationErrors = {};
    Object.keys(formData).forEach((key) => {
      if (key !== 'paymentMethod') {
        const error = validateField(key, formData[key as keyof typeof formData]);
        if (error) newErrors[key as keyof ValidationErrors] = error;
      }
    });

    setErrors(newErrors);
    const touchedFields = { 
      name: true, 
      email: true, 
      phone: true, 
      address: true,
      cardNumber: true,
      cardName: true,
      cardExpiry: true,
      cardCvv: true,
    };
    setTouched(touchedFields);

    if (Object.keys(newErrors).length === 0) {
      const order = {
        id: Date.now().toString(),
        ...formData,
        items: cart,
        total,
        status: 'Pendiente',
        paymentStatus: formData.paymentMethod === 'card' ? 'Pagado' : 'Pendiente de Pago',
        date: new Date().toLocaleString('es-PE'),
      };

      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      orders.push(order);
      localStorage.setItem('orders', JSON.stringify(orders));

      onSuccess();
      setTimeout(() => {
        navigate('/admin');
      }, 100);
    } else {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    let formattedValue = value;
    
    // Formatear número de tarjeta (agregar espacios cada 4 dígitos)
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
    }
    
    // Formatear fecha de expiración (MM/AA)
    if (name === 'cardExpiry') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d{0,2})/, '$1/$2').substring(0, 5);
    }
    
    // Limitar CVV a 4 dígitos
    if (name === 'cardCvv') {
      formattedValue = value.replace(/\D/g, '').substring(0, 4);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: formattedValue,
    }));

    if (touched[name]) {
      const error = validateField(name, formattedValue);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const isFormValid = () => {
    const requiredFields = ['name', 'email', 'phone', 'address'];
    if (formData.paymentMethod === 'card') {
      requiredFields.push('cardNumber', 'cardName', 'cardExpiry', 'cardCvv');
    }
    return requiredFields.every(key => {
      const value = formData[key as keyof typeof formData];
      return value && !validateField(key, value);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="mb-3 text-[#0047AB]">Datos de Envío</h3>

      <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-[#0047AB] mt-0.5 flex-shrink-0" />
          <p className="text-[#0047AB]">
            Completa todos los campos correctamente. Recibirás un email de confirmación.
          </p>
        </div>
      </div>

      <div>
        <label className="block text-sm mb-1 text-[#4A5568]">Nombre completo *</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Ej: Juan Pérez"
          className={`w-full px-3 py-2 border rounded focus:outline-none focus:border-[#0047AB] focus:ring-2 focus:ring-[#0047AB]/20 transition-colors ${
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

      <div>
        <label className="block text-sm mb-1 text-[#4A5568]">Email *</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="ejemplo@correo.com"
          className={`w-full px-3 py-2 border rounded focus:outline-none focus:border-[#0047AB] focus:ring-2 focus:ring-[#0047AB]/20 transition-colors ${
            touched.email && errors.email ? 'border-red-500' : 'border-[#CBD5E0]'
          }`}
        />
        {touched.email && errors.email && (
          <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.email}
          </p>
        )}
        {touched.email && !errors.email && formData.email && (
          <p className="mt-1 text-xs text-green-600 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Correcto
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm mb-1 text-[#4A5568]">Teléfono *</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="999 999 999"
          maxLength={9}
          className={`w-full px-3 py-2 border rounded focus:outline-none focus:border-[#0047AB] focus:ring-2 focus:ring-[#0047AB]/20 transition-colors ${
            touched.phone && errors.phone ? 'border-red-500' : 'border-[#CBD5E0]'
          }`}
        />
        {touched.phone && errors.phone && (
          <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.phone}
          </p>
        )}
        {touched.phone && !errors.phone && formData.phone && (
          <p className="mt-1 text-xs text-green-600 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Correcto
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm mb-1 text-[#4A5568]">Dirección de envío *</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Av. Principal 123, Distrito, Ciudad"
          className={`w-full px-3 py-2 border rounded focus:outline-none focus:border-[#0047AB] focus:ring-2 focus:ring-[#0047AB]/20 transition-colors ${
            touched.address && errors.address ? 'border-red-500' : 'border-[#CBD5E0]'
          }`}
        />
        {touched.address && errors.address && (
          <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.address}
          </p>
        )}
        {touched.address && !errors.address && formData.address && (
          <p className="mt-1 text-xs text-green-600 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Correcto
          </p>
        )}
      </div>

      {/* Método de Pago */}
      <div className="pt-4 border-t-2 border-[#E2E8F0]">
        <h3 className="mb-3 text-[#0047AB] flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Método de Pago
        </h3>

        <div className="space-y-3 mb-4">
          <label className="flex items-center p-3 border-2 rounded-lg cursor-pointer transition-colors hover:bg-blue-50" 
            style={{ borderColor: formData.paymentMethod === 'card' ? '#0047AB' : '#CBD5E0' }}>
            <input
              type="radio"
              name="paymentMethod"
              value="card"
              checked={formData.paymentMethod === 'card'}
              onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
              className="mr-3"
            />
            <CreditCard className="w-5 h-5 mr-2 text-[#0047AB]" />
            <span className="font-medium text-[#1A202C]">Tarjeta de Crédito/Débito</span>
          </label>
          
          <label className="flex items-center p-3 border-2 rounded-lg cursor-pointer transition-colors hover:bg-blue-50"
            style={{ borderColor: formData.paymentMethod === 'cash' ? '#0047AB' : '#CBD5E0' }}>
            <input
              type="radio"
              name="paymentMethod"
              value="cash"
              checked={formData.paymentMethod === 'cash'}
              onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
              className="mr-3"
            />
            <Banknote className="w-5 h-5 mr-2 text-[#0047AB]" />
            <span className="font-medium text-[#1A202C]">Pago Contra Entrega</span>
          </label>
        </div>

        {formData.paymentMethod === 'card' && (
          <div className="space-y-4 p-4 bg-gradient-to-br from-[#0047AB] to-[#336DB8] rounded-xl shadow-lg">
            <div className="flex items-center gap-2 text-white mb-4">
              <Lock className="w-4 h-4" />
              <span className="text-sm">Pago seguro y encriptado</span>
            </div>

            <div>
              <label className="block text-sm mb-1 text-white">Número de Tarjeta *</label>
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:border-white focus:ring-2 focus:ring-white/50 transition-colors bg-white/90 ${
                  touched.cardNumber && errors.cardNumber ? 'border-red-500' : 'border-white/30'
                }`}
              />
              {touched.cardNumber && errors.cardNumber && (
                <p className="mt-1 text-xs text-red-200 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.cardNumber}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm mb-1 text-white">Nombre en la Tarjeta *</label>
              <input
                type="text"
                name="cardName"
                value={formData.cardName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="JUAN PEREZ"
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:border-white focus:ring-2 focus:ring-white/50 transition-colors bg-white/90 uppercase ${
                  touched.cardName && errors.cardName ? 'border-red-500' : 'border-white/30'
                }`}
              />
              {touched.cardName && errors.cardName && (
                <p className="mt-1 text-xs text-red-200 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.cardName}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1 text-white">Fecha Exp. *</label>
                <input
                  type="text"
                  name="cardExpiry"
                  value={formData.cardExpiry}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="MM/AA"
                  maxLength={5}
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:border-white focus:ring-2 focus:ring-white/50 transition-colors bg-white/90 ${
                    touched.cardExpiry && errors.cardExpiry ? 'border-red-500' : 'border-white/30'
                  }`}
                />
                {touched.cardExpiry && errors.cardExpiry && (
                  <p className="mt-1 text-xs text-red-200 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.cardExpiry}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm mb-1 text-white">CVV *</label>
                <input
                  type="password"
                  name="cardCvv"
                  value={formData.cardCvv}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="123"
                  maxLength={4}
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:border-white focus:ring-2 focus:ring-white/50 transition-colors bg-white/90 ${
                    touched.cardCvv && errors.cardCvv ? 'border-red-500' : 'border-white/30'
                  }`}
                />
                {touched.cardCvv && errors.cardCvv && (
                  <p className="mt-1 text-xs text-red-200 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.cardCvv}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 text-white/80 text-xs pt-2">
              <Lock className="w-3 h-3" />
              <span>Tus datos están protegidos con encriptación SSL</span>
            </div>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={!isFormValid() || isSubmitting}
        className="w-full py-3 bg-[#0047AB] text-white rounded-lg hover:bg-[#003580] disabled:bg-[#CBD5E0] disabled:cursor-not-allowed mt-6 transition-colors shadow-md hover:shadow-lg"
      >
        {isSubmitting ? 'Procesando...' : 'Confirmar Pedido'}
      </button>
    </form>
  );
}