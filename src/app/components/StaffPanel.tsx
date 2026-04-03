import { useState, useEffect } from 'react';
import { Users, Plus, Edit, Trash2, Truck, Phone, Mail, MapPin } from 'lucide-react';
import { DeliveryPersonModal } from './DeliveryPersonModal';

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

export function StaffPanel() {
  const [staff, setStaff] = useState<DeliveryPerson[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPerson, setEditingPerson] = useState<DeliveryPerson | null>(null);

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = () => {
    const storedStaff = localStorage.getItem('deliveryStaff');
    if (storedStaff) {
      setStaff(JSON.parse(storedStaff));
    } else {
      // Inicializar con repartidores de ejemplo
      const defaultStaff: DeliveryPerson[] = [
        {
          id: '1',
          name: 'Carlos Mendoza',
          email: 'carlos@electronova.com',
          phone: '987654321',
          username: 'repartidor1',
          zone: 'Lima Centro',
          status: 'Activo',
          ordersCompleted: 156,
          createdAt: new Date(2024, 0, 15).toISOString(),
        },
        {
          id: '2',
          name: 'María Torres',
          email: 'maria@electronova.com',
          phone: '987654322',
          username: 'repartidor2',
          zone: 'San Isidro - Miraflores',
          status: 'Activo',
          ordersCompleted: 203,
          createdAt: new Date(2024, 1, 10).toISOString(),
        },
        {
          id: '3',
          name: 'Jorge Ramírez',
          email: 'jorge@electronova.com',
          phone: '987654323',
          username: 'repartidor3',
          zone: 'Callao - Ventanilla',
          status: 'Activo',
          ordersCompleted: 89,
          createdAt: new Date(2024, 2, 5).toISOString(),
        },
      ];
      localStorage.setItem('deliveryStaff', JSON.stringify(defaultStaff));
      setStaff(defaultStaff);
    }
  };

  const handleSavePerson = (person: DeliveryPerson) => {
    let updatedStaff: DeliveryPerson[];
    
    if (editingPerson) {
      updatedStaff = staff.map(p => p.id === person.id ? person : p);
    } else {
      const newPerson = {
        ...person,
        id: Date.now().toString(),
        ordersCompleted: 0,
        createdAt: new Date().toISOString(),
      };
      updatedStaff = [...staff, newPerson];
    }
    
    localStorage.setItem('deliveryStaff', JSON.stringify(updatedStaff));
    setStaff(updatedStaff);
    setShowModal(false);
    setEditingPerson(null);
  };

  const handleDeletePerson = (personId: string) => {
    if (confirm('¿Estás seguro de eliminar esta cuenta de repartidor?')) {
      const updatedStaff = staff.filter(p => p.id !== personId);
      localStorage.setItem('deliveryStaff', JSON.stringify(updatedStaff));
      setStaff(updatedStaff);
    }
  };

  const handleEditPerson = (person: DeliveryPerson) => {
    setEditingPerson(person);
    setShowModal(true);
  };

  const toggleStatus = (personId: string) => {
    const updatedStaff = staff.map(p =>
      p.id === personId
        ? { ...p, status: (p.status === 'Activo' ? 'Inactivo' : 'Activo') as 'Activo' | 'Inactivo' }
        : p
    );
    localStorage.setItem('deliveryStaff', JSON.stringify(updatedStaff));
    setStaff(updatedStaff);
  };

  const activeStaff = staff.filter(p => p.status === 'Activo').length;
  const totalDeliveries = staff.reduce((sum, p) => sum + p.ordersCompleted, 0);

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-[#0047AB] flex items-center gap-2">
                <Users className="w-6 h-6" />
                Gestión de Personal
              </h2>
              <p className="text-sm text-[#718096] mt-1">
                Administra las cuentas de repartidores y su información
              </p>
            </div>
            <button
              onClick={() => {
                setEditingPerson(null);
                setShowModal(true);
              }}
              className="flex items-center gap-2 px-6 py-3 bg-[#0047AB] text-white rounded-lg hover:bg-[#003580] transition-colors shadow-md hover:shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Crear Cuenta de Repartidor
            </button>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white border border-[#CBD5E0] rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-[#0047AB]" />
                </div>
                <div>
                  <p className="text-sm text-[#718096]">Total Personal</p>
                  <p className="text-2xl font-medium text-[#1A202C]">{staff.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#CBD5E0] rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Truck className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-[#718096]">Repartidores Activos</p>
                  <p className="text-2xl font-medium text-green-600">{activeStaff}</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#CBD5E0] rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#4A5568] rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-[#718096]">Entregas Totales</p>
                  <p className="text-2xl font-medium text-[#1A202C]">{totalDeliveries}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabla Desktop */}
        <div className="hidden lg:block overflow-x-auto bg-white rounded-lg border border-[#CBD5E0] shadow-sm">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-[#0047AB] to-[#336DB8] text-white">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">Repartidor</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Usuario</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Zona</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Contacto</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Entregas</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Estado</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((person, index) => (
                <tr key={person.id} className={`border-b border-[#E2E8F0] hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-medium text-[#1A202C]">{person.name}</div>
                      <div className="text-xs text-[#718096]">
                        Desde {new Date(person.createdAt).toLocaleDateString('es-PE')}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <code className="px-2 py-1 bg-gray-100 rounded text-sm text-[#4A5568]">
                      {person.username}
                    </code>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-[#4A5568]">
                      <MapPin className="w-4 h-4" />
                      {person.zone}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm space-y-1">
                      <div className="flex items-center gap-1 text-[#718096]">
                        <Phone className="w-3 h-3" />
                        {person.phone}
                      </div>
                      <div className="flex items-center gap-1 text-[#718096]">
                        <Mail className="w-3 h-3" />
                        {person.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-[#0047AB]">
                      {person.ordersCompleted}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleStatus(person.id)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        person.status === 'Activo'
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {person.status}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditPerson(person)}
                        className="p-2 text-[#0047AB] hover:bg-blue-50 rounded transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePerson(person.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cards Móvil */}
        <div className="lg:hidden space-y-4">
          {staff.map((person) => (
            <div key={person.id} className="bg-white border border-[#CBD5E0] rounded-lg p-4 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-medium text-[#1A202C] mb-1">{person.name}</h3>
                  <code className="text-xs px-2 py-1 bg-gray-100 rounded text-[#4A5568]">
                    {person.username}
                  </code>
                </div>
                <button
                  onClick={() => toggleStatus(person.id)}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    person.status === 'Activo'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {person.status}
                </button>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-[#4A5568]">
                  <MapPin className="w-4 h-4" />
                  {person.zone}
                </div>
                <div className="flex items-center gap-2 text-sm text-[#718096]">
                  <Phone className="w-4 h-4" />
                  {person.phone}
                </div>
                <div className="flex items-center gap-2 text-sm text-[#718096]">
                  <Mail className="w-4 h-4" />
                  {person.email}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Truck className="w-4 h-4 text-[#0047AB]" />
                  <span className="font-medium text-[#0047AB]">{person.ordersCompleted} entregas</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEditPerson(person)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-[#0047AB] text-[#0047AB] rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Editar
                </button>
                <button
                  onClick={() => handleDeletePerson(person.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        {staff.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed border-[#CBD5E0] rounded-lg bg-white">
            <Users className="w-16 h-16 text-[#CBD5E0] mx-auto mb-4" />
            <p className="text-[#718096]">No hay repartidores registrados</p>
            <p className="text-sm text-[#A0AEC0] mt-2">
              Crea la primera cuenta de repartidor para comenzar
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <DeliveryPersonModal
          person={editingPerson}
          onSave={handleSavePerson}
          onClose={() => {
            setShowModal(false);
            setEditingPerson(null);
          }}
        />
      )}
    </div>
  );
}

// Import Package icon properly
import { Package } from 'lucide-react';
