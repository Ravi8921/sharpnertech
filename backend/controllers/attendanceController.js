// controllers/attendanceController.js
const Attendance = require('../models/attendance'); // Import Attendance model

// Create attendance record
// controllers/attendanceController.js
const createAttendance = async (req, res) => {
  try {
    // console.log(req.body);  
    const { attendanceData } = req.body;

    if (!attendanceData) {
      return res.status(400).json({ error: "attendanceData is required" });
    }

    // Use Sequelize's bulkCreate to insert multiple attendance records at once
    const createdAttendance = await Attendance.bulkCreate(attendanceData);

    res.status(201).json({ message: "Attendance submitted successfully!", data: createdAttendance });
  } catch (error) {
    console.error("Error:", error);  // Log error details
    res.status(500).json({ error: error.message });
  }
};



// Get attendance records for a specific date
const getAttendance = async (req, res) => {
  try {
    const { date } = req.query;  // Date should be passed as a query parameter
    const attendanceRecords = await Attendance.findAll({
      where: { date },
    });
    res.status(200).json(attendanceRecords);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update attendance record for a specific student on a specific date
const updateAttendance = async (req, res) => {
  try {
    const { attendanceData } = req.body;

    // Validate the incoming attendance data
    if (!attendanceData || !Array.isArray(attendanceData)) {
      return res.status(400).json({ error: "attendanceData is required and should be an array" });
    }

    const date = attendanceData[0]?.date; // Get the date from the first record (assuming all records have the same date)

    // Iterate through attendance data and update records for the selected date
    const updatedRecords = await Promise.all(attendanceData.map(async (record) => {
      const existingRecord = await Attendance.findOne({
        where: {
          studentId: record.studentId,
          date: date
        }
      });

      if (existingRecord) {
        // If record exists, update it
        return await existingRecord.update({ status: record.status });
      } else {
        // If record doesn't exist, create it
        return await Attendance.create(record);
      }
    }));

    res.status(200).json({ message: "Attendance updated successfully", data: updatedRecords });
  } catch (error) {
    console.error("Error updating attendance", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete attendance record for a specific student on a specific date
const deleteAttendance = async (req, res) => {
  try {
    const { studentId, date } = req.body;
    const attendance = await Attendance.findOne({
      where: { studentId, date },
    });

    if (attendance) {
      await attendance.destroy();
      res.status(200).json({ message: 'Attendance deleted successfully' });
    } else {
      res.status(404).json({ message: 'Attendance record not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createAttendance,
  getAttendance,
  updateAttendance,
  deleteAttendance,
};
