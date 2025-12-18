import { useState } from 'react';
import { useRouter } from 'next/router';
import { loginUser } from '../../services/api';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(form);
      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // --- AQUÍ ESTÁ LA MAGIA ---
        if (data.user.role === 'superadmin') {
            router.push('/superadmin/dashboard'); // Si es el jefe, a la baticueva
        } else {
            router.push('/admin/dashboard'); // Si es mortal, a su barbería
        }
        // --------------------------

      }
    } catch (err) {
      setError('Correo o contraseña incorrectos');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Acceso Negocios</h1>
        
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input 
              type="email" 
              className="w-full p-2 border rounded mt-1"
              onChange={(e) => setForm({...form, email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input 
              type="password" 
              className="w-full p-2 border rounded mt-1"
              onChange={(e) => setForm({...form, password: e.target.value})}
            />
          </div>
          <button type="submit" className="w-full bg-slate-800 text-white py-2 rounded hover:bg-slate-700 transition">
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}