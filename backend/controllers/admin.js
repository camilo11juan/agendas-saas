const db = require('../config/db');

const getAppointments = async (req, res) => {
    const { businessId } = req.query;

    try {
        // Traemos las citas uniendo tablas para saber el nombre del servicio
        const [rows] = await db.query(`
            SELECT a.id, a.customer_name, a.customer_phone, a.start_time, a.status, s.name as service_name
            FROM appointments a
            JOIN services s ON a.service_id = s.id
            WHERE a.business_id = ?
            ORDER BY a.start_time DESC
        `, [businessId]);

        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error obteniendo citas");
    }
};

const createBusiness = async (req, res) => {
    const { name, slug, color, ownerName, email, password } = req.body;
    
    // Usamos una conexión dedicada para poder hacer ROLLBACK si algo falla
    const connection = await db.getConnection();
    
    try {
        await connection.beginTransaction(); // Empezamos la "transacción"

        // 1. Crear Negocio
        const [busRes] = await connection.query(
            'INSERT INTO businesses (name, slug, color_scheme, active) VALUES (?, ?, ?, 1)',
            [name, slug, color]
        );
        const businessId = busRes.insertId;

        // 2. Crear Horarios (Lunes a Sábado 9am-6pm, Domingo cerrado)
        for (let i = 0; i <= 6; i++) {
            await connection.query(
                `INSERT INTO business_settings (business_id, day_of_week, open_time, close_time, is_closed) 
                 VALUES (?, ?, '09:00', '18:00', ?)`,
                [businessId, i, i === 0 ? 1 : 0] // Si es Domingo (0), is_closed = 1
            );
        }

        // 3. Crear Dueño
        await connection.query(
            'INSERT INTO users (business_id, name, email, password, role) VALUES (?, ?, ?, ?, "admin")',
            [businessId, ownerName, email, password]
        );

        await connection.commit(); // Confirmamos que todo salió bien
        res.json({ success: true, message: "Negocio creado exitosamente" });

    } catch (err) {
        await connection.rollback(); // ¡ALERTA! Algo falló, borramos todo lo que intentamos crear
        console.error(err);
        res.status(500).send("Error: " + err.message);
    } finally {
        connection.release(); // Liberamos la conexión
    }
};

// ¡Agrégala al export!
module.exports = { getAppointments, createBusiness };