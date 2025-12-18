import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { fetchSchedule, updateSchedule } from '../../services/api';

const DAYS_MAP = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // 1. Verificar sesión
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/admin/login');
      return;
    }
    const userData = JSON.parse(storedUser);
    setUser(userData);

    // 2. Cargar horario actual
    fetchSchedule(userData.business_id).then(data => {
        // Asegurarnos que vengan los 7 días, si no, habría que manejarlos
        setSchedule(data);
    });
  }, []);

  const handleChange = (index, field, value) => {
    const newSchedule = [...schedule];
    newSchedule[index][field] = value;
    setSchedule(newSchedule);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
        await updateSchedule({ 
            businessId: user.business_id, 
            schedule: schedule 
        });
        alert('Horario guardado correctamente');
    } catch (err) {
        alert('Error al guardar');
    }
    setSaving(false);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        
        {/* Cabecera */}
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Configurar Horarios</h1>
            <button onClick={() => router.push('/admin/dashboard')} className="text-blue-600 hover:underline">
                ← Volver al Dashboard
            </button>
        </div>

        {/* Lista de Días */}
        <div className="bg-white rounded-lg shadow overflow-hidden p-6">
            <div className="space-y-4">
                {schedule.map((day, index) => (
                    <div key={day.day_of_week} className={`flex items-center gap-4 p-3 rounded-lg border ${day.is_closed ? 'bg-gray-100 border-gray-200' : 'bg-white border-blue-100'}`}>
                        
                        {/* Nombre del día */}
                        <div className="w-24 font-bold text-gray-700">
                            {DAYS_MAP[day.day_of_week]}
                        </div>

                        {/* Switch Abierto/Cerrado */}
                        <label className="flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={!day.is_closed} 
                                onChange={(e) => handleChange(index, 'is_closed', !e.target.checked)}
                                className="mr-2 h-5 w-5"
                            />
                            <span className="text-sm">{day.is_closed ? 'CERRADO' : 'ABIERTO'}</span>
                        </label>

                        {/* Inputs de Hora (Solo si está abierto) */}
                        {!day.is_closed && (
                            <div className="flex items-center gap-2 ml-auto">
                                <input 
                                    type="time" 
                                    value={day.open_time.substring(0,5)} 
                                    onChange={(e) => handleChange(index, 'open_time', e.target.value)}
                                    className="border p-1 rounded"
                                />
                                <span className="text-gray-400">-</span>
                                <input 
                                    type="time" 
                                    value={day.close_time.substring(0,5)} 
                                    onChange={(e) => handleChange(index, 'close_time', e.target.value)}
                                    className="border p-1 rounded"
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Botón Guardar */}
            <div className="mt-8 flex justify-end">
                <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-slate-800 text-white px-6 py-3 rounded-lg font-bold hover:bg-slate-700 transition w-full md:w-auto"
                >
                    {saving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
            </div>
        </div>

      </div>
    </div>
  );
}