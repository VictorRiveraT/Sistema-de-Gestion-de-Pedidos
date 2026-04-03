import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router';

export type UserRole = 'cliente' | 'admin' | 'repartidor';

interface User {
  email: string;
  role: UserRole;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Credenciales válidas para el sistema
const VALID_CREDENTIALS = {
  'admin@admin.com': { password: 'admin123', role: 'admin' as UserRole, name: 'Administrador' },
  'cliente@correo.com': { password: 'cliente123', role: 'cliente' as UserRole, name: 'Cliente' },
  'repartidor@delivery.com': { password: 'repartidor123', role: 'repartidor' as UserRole, name: 'Repartidor' },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Recuperar sesión del localStorage al cargar
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simular delay de autenticación
    await new Promise(resolve => setTimeout(resolve, 800));

    // Normalizar email a minúsculas para comparación case-insensitive
    const normalizedEmail = email.toLowerCase().trim();

    // Primero, verificar credenciales del sistema (admin y repartidor)
    const systemCredentials = VALID_CREDENTIALS[normalizedEmail as keyof typeof VALID_CREDENTIALS];

    if (systemCredentials) {
      if (systemCredentials.password !== password) {
        return { success: false, error: 'Contraseña incorrecta' };
      }

      const userData: User = {
        email: normalizedEmail,
        role: systemCredentials.role,
        name: systemCredentials.name,
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return { success: true };
    }

    // Si no es usuario del sistema, buscar en la base de datos local de usuarios registrados
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const registeredUser = users.find((u: { email: string; password: string }) =>
      u.email.toLowerCase() === normalizedEmail
    );

    if (!registeredUser) {
      return { success: false, error: 'Correo electrónico no registrado' };
    }

    if (registeredUser.password !== password) {
      return { success: false, error: 'Contraseña incorrecta' };
    }

    // Usuario registrado encontrado y contraseña correcta
    const userData: User = {
      email: normalizedEmail,
      role: registeredUser.role || 'cliente',
      name: registeredUser.name,
    };

    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#003366] via-[#004080] to-[#4A5568]">
        <div className="text-white text-center">
          <div className="animate-spin w-12 h-12 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Cargando ElectroNova...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
}
