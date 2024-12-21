const Appointment = require("../models/appointmentModel");

// Display the main appointments page with a list of appointments
const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll();
    res.render('appointments/index', {
      appointments,
      pageTitle: 'Appointments',
      path: '/appointments',
    });
  } catch (err) {
    console.error(err);
    res.render('error', {
      message: "An error occurred while fetching appointments.",
      error: err,
      pageTitle: 'Error',
      path: '/error',
    });
  }
};

// Render a form for creating a new appointment
const renderCreateAppointmentForm = (req, res) => {
  res.render('appointments/add-appointment', {
    pageTitle: 'Create Appointment',
    path: '/appointments/add-appointment',
  });
};

// Create a new appointment and redirect to the appointments list
const createAppointment = async (req, res) => {
  try {
    const { fullName, email, phone, appointmentDate } = req.body;

    if (!fullName || fullName.trim() === '') {
      return res.render('appointments/add-appointment', {
        pageTitle: 'Create Appointment',
        path: '/appointments/add-appointment',
        errorMessage: 'Please enter a valid full name',
      });
    }

    await Appointment.create({ fullName, email, phone, appointmentDate });
    res.redirect('/appointments');
  } catch (err) {
    console.error(err);
    res.render('error', {
      message: "An error occurred while creating the appointment.",
      error: err,
      pageTitle: 'Error',
      path: '/error',
    });
  }
};

// Render the form for editing an existing appointment
const getAppointmentForm = async (req, res) => {
  const appointmentId = req.params.appointmentId;

  try {
    const appointment = await Appointment.findByPk(appointmentId);
    const editMode = appointment ? true : false;

    res.render('appointments/edit-appointment', {
      pageTitle: 'Edit Appointment',
      path: '/appointments/edit-appointment',
      appointment: appointment,
      editing: editMode,
    });
  } catch (err) {
    console.error(err);
    res.render('error', {
      message: "An error occurred while fetching the appointment.",
      error: err,
      pageTitle: 'Error',
      path: '/error',
    });
  }
};

// Update an existing appointment
const updateAppointment = async (req, res) => {
  const { appointmentId } = req.params;
  const { fullName, email, phone, appointmentDate } = req.body;

  try {
    const appointment = await Appointment.findByPk(appointmentId);

    if (!appointment) {
      return res.render('error', {
        message: "Appointment not found.",
        pageTitle: 'Error',
        path: '/error',
      });
    }

    appointment.fullName = fullName;
    appointment.email = email;
    appointment.phone = phone;
    appointment.appointmentDate = appointmentDate;

    await appointment.save();
    res.redirect('/appointments');
  } catch (err) {
    console.error(err);
    res.render('error', {
      message: "An error occurred while updating the appointment.",
      error: err,
      pageTitle: 'Error',
      path: '/error',
    });
  }
};

// Delete an appointment by ID
const deleteAppointmentById = async (req, res) => {
  const { id } = req.params;

  try {
    const appointment = await Appointment.findByPk(id);

    if (!appointment) {
      return res.status(404).json({ status: false, message: "Appointment not found" });
    }

    await appointment.destroy();
    res.status(200).json({ status: true, message: "Appointment deleted successfully" });
  } catch (err) {
    res.status(500).json({ status: false, error: err.message });
  }
};


module.exports = {
  getAppointments,
  renderCreateAppointmentForm,
  createAppointment,
  deleteAppointmentById,
  getAppointmentForm,
  updateAppointment
};
