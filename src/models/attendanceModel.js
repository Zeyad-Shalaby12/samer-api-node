const JsonDb = require('../utils/jsonDb');
const { v4: uuidv4 } = require('uuid');
const SessionModel = require('./sessionModel');
const StudentModel = require('./studentModel');

class AttendanceModel {
    constructor() {
        this.db = new JsonDb('attendance.json');
    }

    async markAttendance(sessionId, studentId) {
        const attendance = await this.db.readData();
        
        // Check if already marked
        const existing = attendance.find(a => 
            a.sessionId === sessionId && a.studentId === studentId
        );

        if (existing) {
            return existing;
        }

        // Create new attendance record
        const newAttendance = {
            id: uuidv4(),
            sessionId,
            studentId,
            status: 'present',
            attendedAt: new Date().toISOString()
        };

        attendance.push(newAttendance);
        await this.db.writeData(attendance);
        return newAttendance;
    }

    async getSessionAttendance(sessionId) {
        const attendance = await this.db.readData();
        const sessionAttendance = attendance.filter(a => a.sessionId === sessionId);

        // Get student details for each attendance record
        const detailedAttendance = await Promise.all(
            sessionAttendance.map(async (record) => {
                const student = await StudentModel.getStudentById(record.studentId);
                return {
                    ...record,
                    student: {
                        id: student.id,
                        name: student.name,
                        studentNumber: student.studentNumber
                    }
                };
            })
        );

        return detailedAttendance;
    }

    async getStudentAttendance(studentId) {
        const attendance = await this.db.readData();
        const studentAttendance = attendance.filter(a => a.studentId === studentId);

        // Get session details for each attendance record
        const detailedAttendance = await Promise.all(
            studentAttendance.map(async (record) => {
                const session = await SessionModel.getSessionById(record.sessionId);
                return {
                    ...record,
                    session
                };
            })
        );

        return detailedAttendance;
    }

    async getSessionReport(sessionId) {
        const session = await SessionModel.getSessionById(sessionId);
        if (!session) return null;

        const attendance = await this.getSessionAttendance(sessionId);
        
        return {
            session,
            totalAttendees: attendance.length,
            attendanceDetails: attendance,
            report: {
                date: session.date,
                sessionName: session.name,
                attendanceTime: attendance.map(a => ({
                    studentName: a.student.name,
                    studentNumber: a.student.studentNumber,
                    attendedAt: a.attendedAt
                }))
            }
        };
    }
}

module.exports = new AttendanceModel();
