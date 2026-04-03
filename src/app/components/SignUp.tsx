import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { UserPlus, Mail, Lock, User, Phone, MapPin, AlertCircle, CheckCircle2, ShoppingBag } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface ValidationErrors {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
}

export function SignUp() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

        // Verificar si el email ya existe (case-insensitive)
        const normalizedEmail = value.toLowerCase().trim();
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        if (users.some((u: { email: string }) => u.email.toLowerCase() === normalizedEmail)) {
          return 'Este email ya está registrado';
        }
        return undefined;
      case 'phone':
        if (!value.trim()) return 'El teléfono es requerido';
        if (!/^\d{9}$/.test(value.replace(/\s/g, ''))) return 'Debe tener 9 dígitos';
        return undefined;
      case 'address':
        if (!value.trim()) return 'La dirección es requerida';
        if (value.trim().length < 10) return 'La dirección debe ser más específica';
        return undefined;
      case 'username':
        if (!value.trim()) return 'El usuario es requerido';
        if (value.trim().length < 4) return 'Mínimo 4 caracteres';
        if (!/^[a-zA-Z0-9_]+$/.test(value)) return 'Solo letras, números y guión bajo';
        return undefined;
      case 'password':
        if (!value.trim()) return 'La contraseña es requerida';
        if (value.length < 6) return 'Mínimo 6 caracteres';
        return undefined;
      case 'confirmPassword':
        if (!value.trim()) return 'Confirma la contraseña';
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
      setErrors(prev => ({ ...prev, [name]: error }));
    }

    if (name === 'password' && touched.confirmPassword) {
      const confirmError = validateField('confirmPassword', formData.confirmPassword);
      setErrors(prev => ({ ...prev, confirmPassword: confirmError }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newErrors: ValidationErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key as keyof typeof formData]);
      if (error) newErrors[key as keyof ValidationErrors] = error;
    });

    setErrors(newErrors);
    setTouched({
      name: true,
      email: true,
      phone: true,
      address: true,
      username: true,
      password: true,
      confirmPassword: true,
    });

    if (Object.keys(newErrors).length === 0) {
      // Guardar usuario en localStorage con email normalizado
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const normalizedEmail = formData.email.toLowerCase().trim();
      const newUser = {
        id: Date.now().toString(),
        name: formData.name.trim(),
        email: normalizedEmail,
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        username: formData.username.trim(),
        password: formData.password,
        role: 'cliente',
        createdAt: new Date().toISOString(),
      };
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));

      // Iniciar sesión automáticamente usando el AuthContext
      const loginResult = await login(normalizedEmail, formData.password);

      if (loginResult.success) {
        // Redirigir al catálogo
        setTimeout(() => {
          navigate('/');
        }, 500);
      } else {
        setIsSubmitting(false);
        setErrors({ email: 'Error al iniciar sesión automática' });
      }
    } else {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    return Object.keys(formData).every(key => {
      const value = formData[key as keyof typeof formData];
      return value && !validateField(key, value);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0047AB] via-[#336DB8] to-[#4A5568] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4 shadow-lg">
            <ShoppingBag className="w-8 h-8 text-[#0047AB]" />
          </div>
          <h1 className="text-white mb-2">ElectroNova</h1>
          <p className="text-blue-100">Portal Comercial de Electrodomésticos</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-8 md:p-10">
            <div className="text-center mb-8">
              <h2 className="text-[#0047AB] flex items-center justify-center gap-2">
                <UserPlus className="w-6 h-6" />
                Crear Cuenta
              </h2>
              <p className="text-sm text-[#718096] mt-2">
                Complete los datos de registro para acceder a la plataforma
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nombre Completo */}
              <div>
                <label className="block text-sm text-[#4A5568] mb-2">Nombre Completo *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#718096]" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Ej: Juan Pérez"
                    className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:border-[#0047AB] focus:ring-2 focus:ring-[#0047AB]/20 transition-colors ${
                      touched.name && errors.name ? 'border-red-500' : 'border-[#CBD5E0]'
                    }`}
                  />
                </div>
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
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#718096]" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="tu@email.com"
                      className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:border-[#0047AB] focus:ring-2 focus:ring-[#0047AB]/20 transition-colors ${
                        touched.email && errors.email ? 'border-red-500' : 'border-[#CBD5E0]'
                      }`}
                    />
                  </div>
                  {touched.email && errors.email && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-[#4A5568] mb-2">Teléfono *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#718096]" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="999 999 999"
                      maxLength={9}
                      className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:border-[#0047AB] focus:ring-2 focus:ring-[#0047AB]/20 transition-colors ${
                        touched.phone && errors.phone ? 'border-red-500' : 'border-[#CBD5E0]'
                      }`}
                    />
                  </div>
                  {touched.phone && errors.phone && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Dirección */}
              <div>
                <label className="block text-sm text-[#4A5568] mb-2">Dirección de Envío *</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#718096]" />
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Av. Principal 123, Distrito, Ciudad"
                    className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:border-[#0047AB] focus:ring-2 focus:ring-[#0047AB]/20 transition-colors ${
                      touched.address && errors.address ? 'border-red-500' : 'border-[#CBD5E0]'
                    }`}
                  />
                </div>
                {touched.address && errors.address && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.address}
                  </p>
                )}
              </div>

              {/* Usuario */}
              <div className="pt-4 border-t-2 border-[#E2E8F0]">
                <h3 className="text-sm font-medium text-[#0047AB] mb-4">Datos de Acceso</h3>
                <div>
                  <label className="block text-sm text-[#4A5568] mb-2">Nombre de Usuario *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#718096]" />
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="usuario123"
                      className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:border-[#0047AB] focus:ring-2 focus:ring-[#0047AB]/20 transition-colors ${
                        touched.username && errors.username ? 'border-red-500' : 'border-[#CBD5E0]'
                      }`}
                    />
                  </div>
                  {touched.username && errors.username && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.username}
                    </p>
                  )}
                </div>
              </div>

              {/* Contraseñas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[#4A5568] mb-2">Contraseña *</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#718096]" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Mínimo 6 caracteres"
                      className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:border-[#0047AB] focus:ring-2 focus:ring-[#0047AB]/20 transition-colors ${
                        touched.password && errors.password ? 'border-red-500' : 'border-[#CBD5E0]'
                      }`}
                    />
                  </div>
                  {touched.password && errors.password && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.password}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-[#4A5568] mb-2">Confirmar Contraseña *</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#718096]" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Repetir contraseña"
                      className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:border-[#0047AB] focus:ring-2 focus:ring-[#0047AB]/20 transition-colors ${
                        touched.confirmPassword && errors.confirmPassword ? 'border-red-500' : 'border-[#CBD5E0]'
                      }`}
                    />
                  </div>
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

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!isFormValid() || isSubmitting}
                className="w-full py-4 bg-[#0047AB] text-white rounded-lg hover:bg-[#003580] disabled:bg-[#CBD5E0] disabled:cursor-not-allowed transition-colors shadow-md hover:shadow-lg mt-6"
              >
                {isSubmitting ? 'Creando cuenta...' : 'Crear Cuenta'}
              </button>

              {/* Login Link */}
              <div className="text-center pt-4">
                <p className="text-sm text-[#718096]">
                  ¿Ya tienes una cuenta?{' '}
                  <Link to="/login" className="text-[#0047AB] font-medium hover:underline">
                    Inicia Sesión
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-blue-100 text-sm">
          <p>ElectroNova © 2026 · Plataforma Comercial Profesional</p>
        </div>
      </div>
    </div>
  );
}
