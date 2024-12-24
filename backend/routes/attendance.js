const express = require('express');
const attendanceController = require('../controllers/attendanceController');
const router = express.Router();


// Route to create attendance record
router.post('/attendance', attendanceController.createAttendance);

// Route to get attendance for a specific date
router.get('/attendance', attendanceController.getAttendance);

// Route to update attendance record
router.put('/attendance', attendanceController.updateAttendance);

// Route to delete attendance record
router.delete('/attendance', attendanceController.deleteAttendance);

module.exports = router;
