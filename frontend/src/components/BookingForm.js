import { useState } from 'react';

export default function BookingForm({ onSubmit }) {
  const [formData, setFormData] = useState({ name: '', phone: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg border border-gray-200 animate-slide-up">
      <h3 className="text-lg font-semibold mb-3 text-gray-800">Completa tus datos</h3>
      
      <div className="mb-3">
        <input
          type="text"
          placeholder="Tu Nombre"
          required
          className="w-full p-3 border rounded-md focus:outline-none focus:border-blue-500"
          onChange={(e) => setFormData({...formData, name: e.target.value})}
        />
      </div>
      
      <div className="mb-4">
        <input
          type="tel"
          placeholder="Tu Teléfono"
          required
          className="w-full p-3 border rounded-md focus:outline-none focus:border-blue-500"
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition shadow-md"
      >
        Confirmar Reserva
      </button>
    </form>
  );
}