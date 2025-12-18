import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { fetchAdminAppointments } from '../../services/api';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Verificar si hay usuario logueado
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/admin/login');
      return;
    }
    
    const userData = JSON.parse(storedUser);
    setUser(userData);

    // 2. Cargar las citas de ESTE negocio
    fetchAdminAppointments(userData.business_id)
      .then(data => setAppointments(data))
      .finally(() => setLoading(false));

  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/admin/login');
  };

  if (loading) return <div className="p-10 text-center">Cargando panel...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Barra superior */}
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Panel: {user.name}</h1>
        <button onClick={handleLogout} className="text-red-600 text-sm font-medium hover:underline">
          Cerrar Sesión
        </button>
      </nav>

      {/* Contenido Principal */}
      <main className="p-6 max-w-5xl mx-auto">
        
        {/* --- AQUÍ ESTÁ EL CAMBIO --- */}
        {/* Antes solo había un título h2, ahora es un div con el título y el botón */}
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-700">Agenda de Citas</h2>
            
            {/* Este es el botón nuevo que te lleva a servicios */}
            <button 
                onClick={() => router.push('/admin/services')}
                className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition flex items-center gap-2 font-medium"
            >
                ⚙️ Gestionar Servicios
            </button>
        </div>

        <div className="flex gap-2"> {/* Envuelve los botones en un div con gap */}
    
    <button 
        onClick={() => router.push('/admin/settings')}
        className="bg-slate-600 text-white px-4 py-2 rounded shadow hover:bg-slate-700 transition flex items-center gap-2 font-medium"
    >
        🕒 Horarios
    </button>

    <button 
        onClick={() => router.push('/admin/services')}
        className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition flex items-center gap-2 font-medium"
    >
        ⚙️ Servicios
    </button>

</div>

        {/* --------------------------- */}
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-4 text-sm font-semibold text-gray-600">Fecha y Hora</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Cliente</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Servicio</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Teléfono</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Estado</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => (
                <tr key={appt.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    {new Date(appt.start_time).toLocaleString('es-CO')}
                  </td>
                  <td className="p-4 font-medium">{appt.customer_name}</td>
                  <td className="p-4 text-blue-600">{appt.service_name}</td>
                  <td className="p-4 text-gray-500">{appt.customer_phone}</td>
                  <td className="p-4">
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full uppercase font-bold">
                      {appt.status}
                    </span>
                  </td>
                </tr>
              ))}
              
              {appointments.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">
                    No hay citas registradas aún.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}