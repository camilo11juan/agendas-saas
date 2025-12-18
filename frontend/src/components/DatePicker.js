export default function DatePicker({ selectedDate, onChange }) {
  return (
    <div className="mb-4 animate-fade-in">
      <label className="block text-gray-700 font-bold mb-2">2. Selecciona el día</label>
      <input
        type="date"
        value={selectedDate}
        min={new Date().toISOString().split('T')[0]} // Bloquea fechas pasadas
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
      />
    </div>
  );
}