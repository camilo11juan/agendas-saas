const db = require('../config/db');

const login = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        // Buscamos el usuario por email y password
        // OJO: Para este tutorial usamos texto plano. En un proyecto real usa bcrypt para encriptar.
        const [rows] = await db.query(
            'SELECT id, name, email, business_id, role FROM users WHERE email = ? AND password = ?', 
            [email, password]
        );

        if (rows.length === 0) {
            return res.status(401).json({ message: "Credenciales incorrectas" });
        }

        // Devolvemos los datos del usuario para que el Frontend sepa quién es
        res.json({ success: true, user: rows[0] });

    } catch (err) {
        console.error(err);
        res.status(500).send("Error en login");
    }
};

module.exports = { login };