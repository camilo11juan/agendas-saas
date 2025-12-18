const express = require('express');
const cors = require('cors'); // Importante para que el frontend pueda conectarse
const app = express();
const apiRoutes = require('./routes/api');

app.use(cors()); 
app.use(express.json());
app.use('/api', apiRoutes);

const PORT = 4000; // Usaremos el puerto 4000 para el backend
app.listen(PORT, () => {
    console.log(`Backend corriendo en puerto ${PORT}`);
});