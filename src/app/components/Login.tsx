import { useState } from "react";
import { useNavigate, Link } from "react-router";
import {
  ShoppingBag,
  Lock,
  Mail,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Por favor completa todos los campos");
      return;
    }

    setIsLoading(true);

    // Normalizar email a minúsculas
    const normalizedEmail = email.toLowerCase().trim();
    const result = await login(normalizedEmail, password);

    setIsLoading(false);

    if (result.success) {
      // Redirigir según el rol del usuario
      if (normalizedEmail === "admin@admin.com") {
        navigate("/admin");
      } else if (normalizedEmail === "repartidor@delivery.com") {
        navigate("/repartidor");
      } else {
        navigate("/");
      }
    } else {
      setError(result.error || "Error al iniciar sesión");
    }
  };

  const isFormValid = () => {
    return email.trim() && password.trim();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#003366] via-[#004080] to-[#4A5568] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4 shadow-2xl">
            <ShoppingBag className="w-10 h-10 text-[#003366]" />
          </div>
          <h1 className="text-white mb-2 text-4xl">
            ElectroNova
          </h1>
          <p className="text-blue-100 text-lg">
            Plataforma Comercial de Electrodomésticos
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-8">
            <h2 className="text-center mb-8 text-[#003366]">
              Iniciar Sesión
            </h2>

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm text-[#4A5568] mb-2">
                  Correo Electrónico *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#718096]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ejemplo@correo.com"
                    className="w-full pl-12 pr-4 py-3 border border-[#CBD5E0] rounded-lg focus:outline-none focus:border-[#003366] focus:ring-2 focus:ring-[#003366]/20 transition-colors"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm text-[#4A5568] mb-2">
                  Contraseña *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#718096]" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="Ingrese su contraseña"
                    className="w-full pl-12 pr-4 py-3 border border-[#CBD5E0] rounded-lg focus:outline-none focus:border-[#003366] focus:ring-2 focus:ring-[#003366]/20 transition-colors"
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-red-700">
                    {error}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!isFormValid() || isLoading}
                className="w-full py-4 bg-[#003366] text-white rounded-lg hover:bg-[#002244] disabled:bg-[#CBD5E0] disabled:cursor-not-allowed transition-colors shadow-lg hover:shadow-xl font-medium"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                    Iniciando sesión...
                  </span>
                ) : (
                  "Iniciar Sesión"
                )}
              </button>

              {/* Sign Up Link - Solo para clientes */}
              <div className="text-center pt-4 border-t-2 border-[#E2E8F0] mt-6">
                <p className="text-sm text-[#718096]">
                  ¿Eres un cliente nuevo?{" "}
                  <Link
                    to="/signup"
                    className="text-[#003366] font-medium hover:underline"
                  >
                    Regístrate aquí
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-blue-100 text-sm">
          <p>
            © 2026 ElectroNova · Plataforma Comercial
            Profesional
          </p>
        </div>
      </div>
    </div>
  );
}