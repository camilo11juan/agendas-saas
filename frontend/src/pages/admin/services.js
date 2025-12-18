import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { fetchServices, createService, deleteService } from '../../services/api';

export default function ServicesPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [services, setServices] = useState([]);
  
  // Estado para el formulario nuevo
  const [form, setForm] = useState({ name: '', price: '', duration: 30 });

  useEffect(() => {
    // 1. Verificar seguridad (igual que en Dashboard)
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/admin/login');
      return;
    }
    const userData = JSON.parse(storedUser);
    setUser(userData);

    // 2. Cargar servicios
    loadServices(userData.business_id);
  }, []);

  const loadServices = (businessId) => {
    fetchServices(businessId).then(data => setServices(data));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price) return;

    await createService({
        businessId: user.business_id,
        name: form.name,
        price: form.price,
        duration: form.duration
    });

    // Limpiar form y recargar lista
    setForm({ name: '', price: '', duration: 30 });
    loadServices(user.business_id);
  };

  const handleDelete = async (id) => {
    if (confirm('¿Seguro que quieres borrar este servicio?')) {
        await deleteService(id);
        loadServices(user.business_id);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Encabezado con botón de volver */}
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Gestionar Servicios</h1>
            <button onClick={() => router.push('/admin/dashboard')} className="text-blue-600 hover:underline">
                ← Volver al Dashboard
            </button>
        </div>

        {/* Formulario de Creación */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">Agregar Nuevo Servicio</h2>
            <form onSubmit={handleCreate} className="flex gap-4 items-end">
                <div className="flex-1">
                    <label className="block text-sm text-gray-600 mb-1">Nombre</label>
                    <input 
                        type="text" 
                        placeholder="Ej: Corte + Barba" 
                        className="w-full p-2 border rounded"
                        value={form.name}
                        onChange={e => setForm({...form, name: e.target.value})}
                    />
                </div>
                <div className="w-24">
                    <label className="block text-sm text-gray-600 mb-1">Precio ($)</label>
                    <input 
                        type="number" 
                        placeholder="0" 
                        className="w-full p-2 border rounded"
                        value={form.price}
                        onChange={e => setForm({...form, price: e.target.value})}
                    />
                </div>
                <div className="w-32">
                    <label className="block text-sm text-gray-600 mb-1">Duración (min)</label>
                    <select 
                        className="w-full p-2 border rounded"
                        value={form.duration}
                        onChange={e => setForm({...form, duration: e.target.value})}
                    >
                        <option value="15">15 min</option>
                        <option value="30">30 min</option>
                        <option value="45">45 min</option>
                        <option value="60">60 min</option>
                    </select>
                </div>
                <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded font-medium hover:bg-green-700">
                    Agregar
                </button>
            </form>
        </div>

        {/* Lista de Servicios */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-gray-100 border-b">
                    <tr>
                        <th className="p-4 text-gray-600">Nombre</th>
                        <th className="p-4 text-gray-600">Duración</th>
                        <th className="p-4 text-gray-600">Precio</th>
                        <th className="p-4 text-gray-600 text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {services.map(srv => (
                        <tr key={srv.id} className="border-b hover:bg-gray-50">
                            <td className="p-4 font-medium">{srv.name}</td>
                            <td className="p-4 text-gray-500">{srv.duration_min} min</td>
                            <td className="p-4 text-green-600 font-bold">${srv.price}</td>
                            <td className="p-4 text-right">
                                <button 
                                    onClick={() => handleDelete(srv.id)}
                                    className="text-red-500 hover:text-red-700 font-medium text-sm border border-red-200 px-3 py-1 rounded hover:bg-red-50"
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

      </div>
    </div>
  );
}