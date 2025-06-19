const SessionModel = require('../models/sessionModel');
const AttendanceModel = require('../models/attendanceModel');
const StudentModel = require('../models/studentModel');

class SessionController {
    async createSession(req, res) {
        try {
            const { courseId, name, date, startTime, endTime } = req.body;
            if (!courseId || !name || !date || !startTime || !endTime) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Course ID, session name, date, start time, and end time are required'
                });
            }

            const newSession = await SessionModel.createSession(courseId, {
                name, date, startTime, endTime
            });

            res.status(201).json({
                status: 'success',
                data: newSession
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }

    async getSessionsByCourse(req, res) {
        try {
            const sessions = await SessionModel.getSessionsByCourse(req.params.courseId);
            res.json({
                status: 'success',
                data: sessions
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }

    async markAttendance(req, res) {
        try {
            const { sessionId } = req.params;
            const { qrData } = req.body;

            if (!qrData) {
                return res.status(400).json({
                    status: 'error',
                    message: 'QR code data is required'
                });
            }

            // Get student from QR code
            const student = await StudentModel.getStudentByQRData(qrData);
            if (!student) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Student not found'
                });
            }

            // Mark attendance
            const attendance = await AttendanceModel.markAttendance(sessionId, student.id);

            res.json({
                status: 'success',
                data: {
                    attendance,
                    student: {
                        name: student.name,
                        studentNumber: student.studentNumber
                    }
                }
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }

    async getSessionReport(req, res) {
        try {
            const report = await AttendanceModel.getSessionReport(req.params.sessionId);
            if (!report) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Session not found'
                });
            }

            res.json({
                status: 'success',
                data: report
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }

    async getStudentAttendance(req, res) {
        try {
            const attendance = await AttendanceModel.getStudentAttendance(req.params.studentId);
            res.json({
                status: 'success',
                data: attendance
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }
}

module.exports = new SessionController();
