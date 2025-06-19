const StudentCourseModel = require('../models/studentCourseModel');
const StudentModel = require('../models/studentModel');

class StudentCourseController {
    async enrollStudentInCourse(req, res) {
        try {
            const { studentId, courseId } = req.body;
            if (!studentId || !courseId) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Student ID and Course ID are required'
                });
            }

            const enrollment = await StudentCourseModel.enrollStudentInCourse(studentId, courseId);
            if (!enrollment) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Student or Course not found'
                });
            }

            res.status(201).json({
                status: 'success',
                data: enrollment
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }

    async getStudentCourses(req, res) {
        try {
            const courses = await StudentCourseModel.getStudentCourses(req.params.studentId);
            res.json({
                status: 'success',
                data: courses
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }

    async unenrollStudentFromCourse(req, res) {
        try {
            const { studentId, courseId } = req.params;
            const success = await StudentCourseModel.unenrollStudentFromCourse(studentId, courseId);
            
            if (!success) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Enrollment not found'
                });
            }

            res.json({
                status: 'success',
                message: 'Student unenrolled from course successfully'
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }

    async getStudentByQRCode(req, res) {
        try {
            const { qrData } = req.body;
            if (!qrData) {
                return res.status(400).json({
                    status: 'error',
                    message: 'QR code data is required'
                });
            }

            const student = await StudentModel.getStudentByQRData(qrData);
            if (!student) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Student not found'
                });
            }

            // Get student's courses
            const studentWithCourses = await StudentCourseModel.getStudentWithCourses(student.id);
            
            res.json({
                status: 'success',
                data: studentWithCourses
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }
}

module.exports = new StudentCourseController();
