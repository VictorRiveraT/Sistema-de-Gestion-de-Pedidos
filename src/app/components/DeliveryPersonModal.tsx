import { useState, useEffect } from 'react';
import { X, UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';

interface DeliveryPerson {
  id: string;
  name: string;
  email: string;
  phone: string;
  username: string;
  zone: string;
  status: 'Activo' | 'Inactivo';
  ordersCompleted: number;
  createdAt: string;
}

interface DeliveryPersonModalProps {
  person: DeliveryPerson | null;
  onSave: (person: DeliveryPerson) => void;
  onClose: () => void;
}

export function DeliveryPersonModal({ person, onSave, onClose }: DeliveryPersonModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    username: '',
    zone: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (person) {
      setFormData({
        name: person.name,
        email: person.email,
        phone: person.phone,
        username: person.username,
        zone: person.zone,
        password: '',
        confirmPassword: '',
      });
    }
  }, [person]);

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'El nombre es requerido';
        if (value.trim().length < 3) return 'Mínimo 3 caracteres';
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) return 'Solo letras permitidas';
        return undefined;
      case 'email':
        if (!value.trim()) return 'El email es requerido';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Email inválido';
        return undefined;
      case 'phone':
        if (!value.trim()) return 'El teléfono es requerido';
        if (!/^\d{9}$/.test(value.replace(/\s/g, ''))) return 'Debe tener 9 dígitos';
        return undefined;
      case 'username':
        if (!value.trim()) return 'El usuario es requerido';
        if (value.trim().length < 4) return 'Mínimo 4 caracteres';
        if (!/^[a-zA-Z0-9_]+$/.test(value)) return 'Solo letras, números y guión bajo';
        return undefined;
      case 'zone':
        if (!value.trim()) return 'La zona es requerida';
        return undefined;
      case 'password':
        if (!person) { // Solo validar contraseña en creación
          if (!value.trim()) return 'La contraseña es requerida';
          if (value.length < 6) return 'Mínimo 6 caracteres';
        } else if (value && value.length < 6) {
          return 'Mínimo 6 caracteres';
        }
        return undefined;
      case 'confirmPassword':
        if (!person && !value.trim()) return 'Confirma la contraseña';
        if (value !== formData.password) return 'Las contraseñas no coinciden';
        return undefined;
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

    // Validar confirmPassword cuando cambie password
    if (name === 'password' && touched.confirmPassword) {
      const confirmError = validateField('confirmPassword', formData.confirmPassword);
      setErrors(prev => ({ ...prev, confirmPassword: confirmError || '' }));
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
    const fieldsToValidate = ['name', 'email', 'phone', 'username', 'zone'];
    
    if (!person) {
      fieldsToValidate.push('password', 'confirmPassword');
    }

    fieldsToValidate.forEach(key => {
      const error = validateField(key, formData[key as keyof typeof formData]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);
    const touchedFields: Record<string, boolean> = {};
    fieldsToValidate.forEach(key => {
      touchedFields[key] = true;
    });
    setTouched(touchedFields);

    if (Object.keys(newErrors).length === 0) {
      const personData: DeliveryPerson = {
        id: person?.id || '',
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        username: formData.username.trim(),
        zone: formData.zone.trim(),
        status: person?.status || 'Activo',
        ordersCompleted: person?.ordersCompleted || 0,
        createdAt: person?.createdAt || new Date().toISOString(),
      };
      onSave(personData);
    }
  };

  const isFormValid = () => {
    const requiredFields = ['name', 'email', 'phone', 'username', 'zone'];
    if (!person) {
      requiredFields.push('password', 'confirmPassword');
    }
    
    return requiredFields.every(key => {
      const value = formData[key as keyof typeof formData];
      return value && !validateField(key, value);
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#0047AB] to-[#336DB8] px-6 py-4 flex items-center justify-between">
          <h2 className="text-white flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            {person ? 'Editar Repartidor' : 'Crear Cuenta de Repartidor'}
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
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-[#0047AB] mt-0.5 flex-shrink-0" />
            <p className="text-sm text-[#0047AB]">
              {person
                ? 'Los datos de acceso se mantendrán. Para cambiar la contraseña, déjala en blanco.'
                : 'Esta cuenta permitirá al repartidor acceder al sistema de entregas.'
              }
            </p>
          </div>

          {/* Nombre */}
          <div>
            <label className="block text-sm text-[#4A5568] mb-2">Nombre Completo *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Ej: Carlos Mendoza"
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

          {/* Email y Teléfono */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[#4A5568] mb-2">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="ejemplo@correo.com"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-[#0047AB] focus:ring-2 focus:ring-[#0047AB]/20 transition-colors ${
                  touched.email && errors.email ? 'border-red-500' : 'border-[#CBD5E0]'
                }`}
              />
              {touched.email && errors.email && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm text-[#4A5568] mb-2">Teléfono *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="999 999 999"
                maxLength={9}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-[#0047AB] focus:ring-2 focus:ring-[#0047AB]/20 transition-colors ${
                  touched.phone && errors.phone ? 'border-red-500' : 'border-[#CBD5E0]'
                }`}
              />
              {touched.phone && errors.phone && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.phone}
                </p>
              )}
            </div>
          </div>

          {/* Usuario */}
          <div>
            <label className="block text-sm text-[#4A5568] mb-2">Nombre de Usuario *</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="repartidor123"
              disabled={!!person}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-[#0047AB] focus:ring-2 focus:ring-[#0047AB]/20 transition-colors ${
                person ? 'bg-gray-100 cursor-not-allowed' : ''
              } ${touched.username && errors.username ? 'border-red-500' : 'border-[#CBD5E0]'}`}
            />
            {touched.username && errors.username && (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.username}
              </p>
            )}
            {person && (
              <p className="mt-1 text-xs text-[#718096]">
                El nombre de usuario no puede modificarse
              </p>
            )}
          </div>

          {/* Zona */}
          <div>
            <label className="block text-sm text-[#4A5568] mb-2">Zona de Reparto *</label>
            <input
              type="text"
              name="zone"
              value={formData.zone}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Ej: Lima Centro, San Isidro - Miraflores"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-[#0047AB] focus:ring-2 focus:ring-[#0047AB]/20 transition-colors ${
                touched.zone && errors.zone ? 'border-red-500' : 'border-[#CBD5E0]'
              }`}
            />
            {touched.zone && errors.zone && (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.zone}
              </p>
            )}
          </div>

          {/* Contraseña (solo en creación o para cambiarla) */}
          {!person && (
            <>
              <div className="pt-4 border-t-2 border-[#E2E8F0]">
                <h3 className="text-sm font-medium text-[#0047AB] mb-4">Credenciales de Acceso</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-[#4A5568] mb-2">Contraseña *</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Mínimo 6 caracteres"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-[#0047AB] focus:ring-2 focus:ring-[#0047AB]/20 transition-colors ${
                        touched.password && errors.password ? 'border-red-500' : 'border-[#CBD5E0]'
                      }`}
                    />
                    {touched.password && errors.password && (
                      <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm text-[#4A5568] mb-2">Confirmar Contraseña *</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Repetir contraseña"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-[#0047AB] focus:ring-2 focus:ring-[#0047AB]/20 transition-colors ${
                        touched.confirmPassword && errors.confirmPassword ? 'border-red-500' : 'border-[#CBD5E0]'
                      }`}
                    />
                    {touched.confirmPassword && errors.confirmPassword && (
                      <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.confirmPassword}
                      </p>
                    )}
                    {touched.confirmPassword && !errors.confirmPassword && formData.confirmPassword && (
                      <p className="mt-1 text-xs text-green-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Las contraseñas coinciden
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

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
              className="flex-1 px-6 py-3 bg-[#0047AB] text-white rounded-lg hover:bg-[#003580] disabled:bg-[#CBD5E0] disabled:cursor-not-allowed transition-colors shadow-md hover:shadow-lg"
            >
              {person ? 'Guardar Cambios' : 'Crear Cuenta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
