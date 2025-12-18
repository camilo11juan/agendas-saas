import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { createBusiness } from '../../services/api';

export default function SuperDashboard() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    slug: '',
    color: '#000000',
    ownerName: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    // Protección simple: Solo entra si el rol es 'superadmin'
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
        router.push('/admin/login');
        return;
    }
    const user = JSON.parse(storedUser);
    if (user.role !== 'superadmin') {
        alert("Acceso denegado");
        router.push('/admin/dashboard');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!confirm('¿Crear este nuevo negocio?')) return;

    const res = await createBusiness(form);
    if (res.success) {
        alert('¡Negocio Creado! Ahora puedes entrar a /reservar/' + form.slug);
        setForm({ name: '', slug: '', color: '#000000', ownerName: '', email: '', password: '' });
    } else {
        alert('Error: ' + res.message); // Posiblemente el slug o email ya existen
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Panel Super Admin 🚀</h1>
        <p className="text-slate-400 mb-8">Fábrica de Barberías</p>

        <form onSubmit={handleSubmit} className="bg-slate-800 p-8 rounded-xl shadow-2xl space-y-4 border border-slate-700">
            <h2 className="text-xl font-semibold text-green-400 border-b border-slate-700 pb-2 mb-4">1. Datos del Negocio</h2>
            
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm mb-1">Nombre Comercial</label>
                    <input required type="text" className="w-full bg-slate-900 border border-slate-600 rounded p-2" 
                        placeholder="Ej: Salón Lulú"
                        value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                </div>
                <div>
                    <label className="block text-sm mb-1">URL (Slug)</label>
                    <input required type="text" className="w-full bg-slate-900 border border-slate-600 rounded p-2" 
                        placeholder="salon-lulu"
                        value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} />
                </div>
            </div>

            <div>
                <label className="block text-sm mb-1">Color de Marca</label>
                <div className="flex gap-2">
                    <input type="color" className="h-10 w-20 cursor-pointer" 
                        value={form.color} onChange={e => setForm({...form, color: e.target.value})} />
                    <span className="self-center text-slate-400">{form.color}</span>
                </div>
            </div>

            <h2 className="text-xl font-semibold text-blue-400 border-b border-slate-700 pb-2 mb-4 mt-6">2. Datos del Dueño</h2>
            
            <div>
                <label className="block text-sm mb-1">Nombre del Dueño</label>
                <input required type="text" className="w-full bg-slate-900 border border-slate-600 rounded p-2" 
                    value={form.ownerName} onChange={e => setForm({...form, ownerName: e.target.value})} />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm mb-1">Email (Usuario)</label>
                    <input required type="email" className="w-full bg-slate-900 border border-slate-600 rounded p-2" 
                        value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                </div>
                <div>
                    <label className="block text-sm mb-1">Contraseña Inicial</label>
                    <input required type="text" className="w-full bg-slate-900 border border-slate-600 rounded p-2" 
                        value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
                </div>
            </div>

            <button type="submit" className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded mt-6 transition">
                CREAR NEGOCIO
            </button>
        </form>
      </div>
    </div>
  );
}