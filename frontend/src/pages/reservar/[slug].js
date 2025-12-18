import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { fetchAvailableSlots, createAppointment, fetchBusinessInfo, fetchServices } from '../../services/api';
import DatePicker from '../../components/DatePicker';
import SlotGrid from '../../components/SlotGrid';
import BookingForm from '../../components/BookingForm';

export default function BookingPage() {
  const router = useRouter();
  const { slug } = router.query;

  // Estados de datos
  const [business, setBusiness] = useState(null);
  const [services, setServices] = useState([]);
  
  // Estados de selección del usuario
  const [selectedService, setSelectedService] = useState(null);
  const [date, setDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  
  // Estados de carga e interfaz
  const [loadingBusiness, setLoadingBusiness] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // 1. CARGAR NEGOCIO Y SUS SERVICIOS
  useEffect(() => {
    if (slug) {
      fetchBusinessInfo(slug)
        .then(data => {
            if(data) {
                setBusiness(data);
                // Una vez tenemos el negocio, buscamos sus servicios
                fetchServices(data.id).then(srvs => setServices(srvs));
            }
        })
        .finally(() => setLoadingBusiness(false));
    }
  }, [slug]);

  // 2. BUSCAR HORAS DISPONIBLES (Cuando cambia fecha o servicio)
  useEffect(() => {
    if (date && selectedService && business) {
      setLoadingSlots(true);
      setSlots([]); // Limpiar anteriores
      setSelectedSlot(null);
      
      fetchAvailableSlots(business.id, date, selectedService.id)
        .then(data => setSlots(data.availableSlots))
        .catch(err => console.error(err))
        .finally(() => setLoadingSlots(false));
    }
  }, [date, selectedService]);

  // 3. ENVIAR RESERVA
  const handleBookingSubmit = async (userData) => {
    if (!selectedSlot || !selectedService) return;
    try {
      const payload = {
        businessId: business.id,
        serviceId: selectedService.id,
        customerName: userData.name,
        phone: userData.phone,
        startTime: `${date}T${selectedSlot}:00`
      };
      await createAppointment(payload);
      setBookingSuccess(true);
    } catch (error) {
      alert('Error al crear la cita. Intenta nuevamente.');
    }
  };

  if (loadingBusiness) return <div className="min-h-screen flex items-center justify-center text-gray-500">Cargando perfil...</div>;
  if (!business) return <div className="min-h-screen flex items-center justify-center text-red-500">Negocio no encontrado</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <div 
        className="bg-white max-w-md w-full rounded-xl shadow-2xl overflow-hidden border-t-8 transition-all"
        style={{ borderColor: business.color_scheme || '#333' }}
      >
        
        {/* CABECERA DINÁMICA */}
        <div className="p-8 text-center text-white" style={{ backgroundColor: business.color_scheme || '#333' }}>
          <h1 className="text-3xl font-bold uppercase tracking-wide">{business.name}</h1>
          <p className="text-white/80 text-sm mt-2">Reserva tu cita online</p>
        </div>

        <div className="p-6">
          {!bookingSuccess ? (
            <>
              {/* PASO 1: SERVICIOS */}
              <div className="mb-6">
                <label className="block text-gray-700 font-bold mb-2">1. Elige el servicio</label>
                <div className="space-y-2">
                    {services.map(srv => (
                        <div 
                            key={srv.id}
                            onClick={() => setSelectedService(srv)}
                            className={`
                                p-4 border rounded-lg cursor-pointer flex justify-between items-center transition-colors
                                ${selectedService?.id === srv.id 
                                    ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' 
                                    : 'hover:bg-gray-50 border-gray-200'}
                            `}
                        >
                            <span className="font-semibold text-gray-700">{srv.name}</span>
                            <span className="text-gray-500 bg-gray-100 px-2 py-1 rounded text-sm">${srv.price}</span>
                        </div>
                    ))}
                </div>
              </div>

              {/* PASO 2: FECHA (Solo si hay servicio) */}
              {selectedService && (
                  <DatePicker selectedDate={date} onChange={setDate} />
              )}

              {/* PASO 3: HORAS (Solo si hay fecha) */}
              {date && selectedService && (
                  <SlotGrid 
                    slots={slots} 
                    loading={loadingSlots} 
                    selectedSlot={selectedSlot} 
                    onSelectSlot={setSelectedSlot}
                  />
              )}

              {/* PASO 4: FORMULARIO */}
              {selectedSlot && (
                  <BookingForm onSubmit={handleBookingSubmit} />
              )}
            </>
          ) : (
            // PANTALLA DE ÉXITO
            <div className="text-center py-10 animate-fade-in">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🎉</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Reserva Confirmada!</h2>
              <p className="text-gray-600 mb-1">Te esperamos el <strong>{date}</strong> a las <strong>{selectedSlot}</strong></p>
              <p className="text-gray-500 text-sm">Servicio: {selectedService?.name}</p>
              
              <button 
                onClick={() => window.location.reload()}
                className="mt-8 text-blue-600 font-medium hover:underline"
              >
                Hacer otra reserva
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}