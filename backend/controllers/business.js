const db = require('../config/db');

const getBusinessBySlug = async (req, res) => {
    const { slug } = req.params;
    try {
        const [rows] = await db.query(
            'SELECT id, name, phone, logo_url, color_scheme FROM businesses WHERE slug = ?',
            [slug]
        );
        if (rows.length === 0) return res.status(404).json({ message: "No existe" });
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error");
    }
};

// --- ESTA ES LA FUNCIÓN QUE TE FALTA O ESTÁ FALLANDO ---
const getServices = async (req, res) => {
    const { businessId } = req.query; // Recibe el ID del negocio
    try {
        // Busca servicios que coincidan con ese ID
        const [rows] = await db.query(
            'SELECT id, name, duration_min, price FROM services WHERE business_id = ?',
            [businessId]
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error");
    }
};


// 3. Crear nuevo servicio
const createService = async (req, res) => {
    const { businessId, name, duration, price } = req.body;
    try {
        await db.query(
            'INSERT INTO services (business_id, name, duration_min, price) VALUES (?, ?, ?, ?)',
            [businessId, name, duration, price]
        );
        res.json({ success: true, message: "Servicio creado" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al crear servicio");
    }
};

// 4. Eliminar servicio
const deleteService = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM services WHERE id = ?', [id]);
        res.json({ success: true, message: "Servicio eliminado" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al eliminar");
    }
};


// 5. Obtener Horarios
const getSchedule = async (req, res) => {
    const { businessId } = req.query;
    try {
        const [rows] = await db.query(
            'SELECT day_of_week, open_time, close_time, is_closed FROM business_settings WHERE business_id = ? ORDER BY day_of_week',
            [businessId]
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error obteniendo horario");
    }
};

// 6. Actualizar Horarios (Recibe un array de días)
const updateSchedule = async (req, res) => {
    const { businessId, schedule } = req.body; // schedule es una lista de 7 días
    
    try {
        // Recorremos cada día y actualizamos
        for (let day of schedule) {
            await db.query(
                `UPDATE business_settings 
                 SET open_time = ?, close_time = ?, is_closed = ? 
                 WHERE business_id = ? AND day_of_week = ?`,
                [day.open_time, day.close_time, day.is_closed, businessId, day.day_of_week]
            );
        }
        res.json({ success: true, message: "Horario actualizado" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error actualizando horario");
    }
};

// ¡NO OLVIDES AGREGARLAS AQUÍ!
module.exports = { 
    getBusinessBySlug, 
    getServices, 
    createService, 
    deleteService, 
    getSchedule,    // <--- Nueva
    updateSchedule  // <--- Nueva
};