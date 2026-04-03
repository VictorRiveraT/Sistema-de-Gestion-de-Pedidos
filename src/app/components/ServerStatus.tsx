import { useState, useEffect } from 'react';
import { Server, Activity } from 'lucide-react';

export function ServerStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setUptime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  return (
    <div className="border border-gray-300 rounded p-4 bg-white">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Server className="w-5 h-5 text-gray-600" />
          <h4>Estado del Servidor</h4>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm font-medium">{isOnline ? 'Online' : 'Offline'}</span>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Estado:</span>
          <span className="font-medium text-green-600">Operativo 24/7</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Tiempo activo:</span>
          <span className="font-mono text-xs">{formatUptime(uptime)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Plataforma:</span>
          <span className="font-medium">Render</span>
        </div>
        <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
          <Activity className="w-4 h-4 text-green-600" />
          <span className="text-xs text-gray-600">Sincronización en tiempo real activa</span>
        </div>
      </div>
    </div>
  );
}
