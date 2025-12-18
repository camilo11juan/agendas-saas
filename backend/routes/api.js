const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking');
const businessController = require('../controllers/business');

const authController = require('../controllers/auth'); // <--- NUEVO
const adminController = require('../controllers/admin'); // <--- NUEVO

router.get('/slots', bookingController.getAvailableSlots);
router.post('/appointment', bookingController.createAppointment);
router.get('/business/:slug', businessController.getBusinessBySlug);

// --- AGREGA ESTA LÍNEA EXACTA: ---
router.get('/services', businessController.getServices); 

router.post('/login', authController.login);
router.get('/admin/appointments', adminController.getAppointments);

router.get('/services', businessController.getServices);

// --- NUEVAS RUTAS ---
router.post('/services', businessController.createService);
router.delete('/services/:id', businessController.deleteService);

router.get('/schedule', businessController.getSchedule);
router.put('/schedule', businessController.updateSchedule); // PUT se usa para actualizar

router.post('/superadmin/business', adminController.createBusiness);

module.exports = router;