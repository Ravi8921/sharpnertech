const Attendance = require('../models/attendance'); // Import Attendance model
const Student = require('../models/student'); // Import Student model
const { Op } = require("sequelize");

// Create attendance record
const createAttendance = async (req, res) => {
  try {
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

    const date = attendanceData[0] ? attendanceData[0].date : undefined;

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

// Get monthly attendance report
const getMonthlyAttendanceReport = async (req, res) => {
  try {
    const { month } = req.query; // Expect month in 'YYYY-MM' format
    if (!month) {
      return res.status(400).json({ message: "Month is required." });
    }

    // Calculate start and end dates for the given month
    const startDate = new Date(`${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    // Fetch attendance records for the given month
    const attendanceRecords = await Attendance.findAll({
      where: {
        date: { [Op.gte]: startDate, [Op.lt]: endDate },
      },
      include: [{ model: Student, attributes: ["name"] }], // Include student names
    });

    if (attendanceRecords.length === 0) {
      return res.status(404).json({ message: "No records found for the given month." });
    }

    // Aggregate the data
    const totalStudents = await Student.count(); // Total students
    const totalPresent = attendanceRecords.filter((rec) => rec.status === "present").length;
    const totalAbsent = attendanceRecords.filter((rec) => rec.status === "absent").length;

    const dailyReport = attendanceRecords.reduce((report, record) => {
      const date = record.date.toISOString().slice(0, 10); // Format date as 'YYYY-MM-DD'
      if (!report[date]) {
        report[date] = { date, present: 0, absent: 0 };
      }
      report[date][record.status]++;
      return report;
    }, {});

    const studentAttendance = await Student.findAll(); // Fetch all students to report per student
    const studentDetails = studentAttendance.map((student) => {
      const studentAttendanceData = attendanceRecords.filter((rec) => rec.studentId === student.id);

      return {
        studentName: student.name,
        totalPresent: studentAttendanceData.filter((rec) => rec.status === "present").length,
        totalAbsent: studentAttendanceData.filter((rec) => rec.status === "absent").length,
      };
    });

    res.json({
      totalStudents,
      totalPresent,
      totalAbsent,
      dailyReport: Object.values(dailyReport),
      studentAttendance: studentDetails,
    });
  } catch (error) {
    console.error("Error fetching attendance report:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  createAttendance,
  getAttendance,
  updateAttendance,
  deleteAttendance,
  getMonthlyAttendanceReport,
};
