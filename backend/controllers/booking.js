const db = require('../config/db');
const { addMinutes, checkOverlap } = require('../utils/timeHelpers');

const getAvailableSlots = async (req, res) => {
    const { businessId, date, serviceId } = req.query;
    
    try {
        // 1. Obtener duración del servicio
        const [serviceRows] = await db.query('SELECT duration_min FROM services WHERE id = ?', [serviceId]);
        if (serviceRows.length === 0) return res.status(400).json({message: "Servicio no encontrado"});
        const serviceDuration = serviceRows[0].duration_min;

        // 2. ARREGLO DEL DESFASE DE DÍAS
        // "YYYY-MM-DD" se interpreta como UTC. Usamos getUTCDay() para obtener el día exacto sin restar la zona horaria.
        const dayOfWeek = new Date(date).getUTCDay(); // <--- ARREGLO 1: Usar UTC

        // 3. Obtener horario del negocio
        const [scheduleRows] = await db.query(
            'SELECT open_time, close_time, is_closed FROM business_settings WHERE business_id = ? AND day_of_week = ?', 
            [businessId, dayOfWeek]
        );
        
        // Si no hay configuración para ese día, asumimos cerrado
        if (scheduleRows.length === 0) return res.json({ availableSlots: [] });

        const { open_time, close_time, is_closed } = scheduleRows[0];

        // 4. ARREGLO DEL DÍA CERRADO
        // Si la base de datos dice is_closed = 1 (true), devolvemos lista vacía inmediatamente.
        if (is_closed) {  // <--- ARREGLO 2: Verificar si está cerrado
             return res.json({ availableSlots: [] });
        }

        // 5. Obtener citas existentes
        const [bookedSlots] = await db.query(
            `SELECT start_time, end_time FROM appointments 
             WHERE business_id = ? AND DATE(start_time) = ?`, 
            [businessId, date]
        );

        // 6. Calcular disponibilidad
        let availableSlots = [];
        // Creamos las fechas combinando la fecha seleccionada (date) con la hora de apertura/cierre
        let currentTime = new Date(`${date}T${open_time}`);
        const closingTime = new Date(`${date}T${close_time}`);

        while (addMinutes(currentTime, serviceDuration) <= closingTime) {
            let slotStart = currentTime;
            let slotEnd = addMinutes(currentTime, serviceDuration);
            let isBusy = false;

            for (let booking of bookedSlots) {
                let bookStart = new Date(booking.start_time);
                let bookEnd = new Date(booking.end_time);
                
                if (checkOverlap(slotStart, slotEnd, bookStart, bookEnd)) {
                    isBusy = true; 
                    break;
                }
            }

            if (!isBusy) {
                // Formateamos la hora para enviarla limpia al frontend (HH:MM)
                // Usamos toTimeString() y cortamos los primeros 5 caracteres
                availableSlots.push(slotStart.toTimeString().substring(0,5));
            }
            
            currentTime = addMinutes(currentTime, 30); 
        }

        res.json({ availableSlots });

    } catch (err) {
        console.error(err);
        res.status(500).send("Error en servidor");
    }
};

const createAppointment = async (req, res) => {
    const { businessId, serviceId, customerName, phone, startTime } = req.body;
    
    try {
        const [serviceRows] = await db.query('SELECT duration_min FROM services WHERE id = ?', [serviceId]);
        const duration = serviceRows[0].duration_min;
        
        const start = new Date(startTime);
        const end = addMinutes(start, duration);

        await db.query(
            `INSERT INTO appointments (business_id, service_id, customer_name, customer_phone, start_time, end_time)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [businessId, serviceId, customerName, phone, start, end]
        );

        res.json({ success: true });

    } catch (err) {
        console.error(err);
        res.status(500).send("Error creando cita");
    }
};

module.exports = { getAvailableSlots, createAppointment };