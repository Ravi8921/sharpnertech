const express = require('express');
const appointmentController = require('../controllers/appointment');

const router = express.Router();

// Route to display the form for adding a new appointment
router.get('/add-appointment', appointmentController.renderCreateAppointmentForm);

// Route to handle submission of the form to create a new appointment
router.post('/add-appointment', appointmentController.createAppointment);

// Route to list all appointments
router.get('/appointments', appointmentController.getAppointments);

// Route to handle form submission for updating an appointment
router.post('/edit-appointment/:appointmentId', appointmentController.updateAppointment);

// Route to display the form for editing an existing appointment
router.get('/edit-appointment/:appointmentId', appointmentController.getAppointmentForm);

// Route to delete an appointment
router.delete('/delete-appointment/:id', appointmentController.deleteAppointmentById);

module.exports = router;
