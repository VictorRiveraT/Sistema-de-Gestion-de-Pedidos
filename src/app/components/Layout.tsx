import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { ShoppingBag, UserCog, Truck, LogOut, Zap } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Definir navegación basada en el rol del usuario
  const getNavItemsForRole = () => {
    if (!user) return [];

    switch (user.role) {
      case 'cliente':
        return [
          { path: "/", label: "Portal de Compras", icon: ShoppingBag }
        ];
      case 'admin':
        return [
          { path: "/admin", label: "Panel de Administración", icon: UserCog }
        ];
      case 'repartidor':
        return [
          { path: "/repartidor", label: "Gestión de Entregas", icon: Truck }
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItemsForRole();

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-[#CBD5E0] bg-white shadow-sm">
        <div className="px-4 md:px-8 py-4 bg-gradient-to-r from-[#003366] to-[#004D99]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-white">
                <Zap className="w-6 h-6" />
                ElectroNova
              </h2>
              <p className="text-sm text-blue-100 mt-0.5">
                {user?.role === 'admin' && 'Panel de Gestión Empresarial'}
                {user?.role === 'cliente' && 'Plataforma de Electrodomésticos'}
                {user?.role === 'repartidor' && 'Sistema de Entregas'}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-white text-sm font-medium">{user?.name}</span>
                <span className="text-blue-200 text-xs capitalize">{user?.role}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation - Solo se muestra si hay elementos de navegación */}
        {navItems.length > 0 && (
          <nav className="border-t border-[#CBD5E0] overflow-x-auto bg-white">
            <div className="flex min-w-max">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 md:px-6 py-3 border-b-2 text-sm md:text-base whitespace-nowrap transition-colors ${
                      isActive
                        ? "border-[#003366] font-medium bg-blue-50 text-[#003366]"
                        : "border-transparent hover:bg-gray-50 text-[#4A5568]"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </nav>
        )}
      </header>

      <main className="flex-1 overflow-hidden bg-[#F7FAFC]">
        <Outlet />
      </main>
    </div>
  );
}