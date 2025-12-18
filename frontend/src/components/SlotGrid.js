export default function SlotGrid({ slots, onSelectSlot, selectedSlot, loading }) {
  if (loading) return <div className="text-center py-4 text-gray-500">Buscando espacios...</div>;
  if (!slots || slots.length === 0) return <div className="text-center text-gray-400 py-2">No hay citas disponibles para este día.</div>;

  return (
    <div className="mb-6 animate-fade-in">
      <h3 className="block text-gray-700 font-bold mb-2">3. Elige la hora</h3>
      <div className="grid grid-cols-3 gap-3">
        {slots.map((time, index) => (
          <button
            key={index}
            onClick={() => onSelectSlot(time)}
            className={`
              p-2 rounded-lg text-sm font-medium transition-all
              ${selectedSlot === time 
                ? 'bg-blue-600 text-white shadow-lg scale-105 ring-2 ring-blue-300' 
                : 'bg-white border border-gray-200 text-gray-700 hover:border-blue-500 hover:text-blue-500'}
            `}
          >
            {time}
          </button>
        ))}
      </div>
    </div>
  );
}