const StudentModel = require('../models/studentModel');

class StudentController {
    async getAllStudents(req, res) {
        try {
            const students = await StudentModel.getAllStudents();
            res.json({
                status: 'success',
                data: students
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }

    async getStudentById(req, res) {
        try {
            const student = await StudentModel.getStudentById(req.params.id);
            if (!student) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Student not found'
                });
            }
            res.json({
                status: 'success',
                data: student
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }

    async createStudent(req, res) {
        try {
            const { name, studentNumber, parentPhone } = req.body;
            if (!name || !studentNumber || !parentPhone) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Name, student number, and parent phone are required'
                });
            }
            
            const newStudent = await StudentModel.createStudent({
                name,
                studentNumber,
                parentPhone
            });

            res.status(201).json({
                status: 'success',
                data: newStudent
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }

    async updateStudent(req, res) {
        try {
            const updatedStudent = await StudentModel.updateStudent(req.params.id, req.body);
            if (!updatedStudent) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Student not found'
                });
            }
            res.json({
                status: 'success',
                data: updatedStudent
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }

    async deleteStudent(req, res) {
        try {
            const deleted = await StudentModel.deleteStudent(req.params.id);
            if (!deleted) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Student not found'
                });
            }
            res.json({
                status: 'success',
                message: 'Student deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }

    async getStudentQRCode(req, res) {
        try {
            const qrCode = await StudentModel.getStudentQRCode(req.params.id);
            if (!qrCode) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Student not found'
                });
            }
            
            res.setHeader('Content-Type', 'image/svg+xml');
            res.send(qrCode);
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }
}

module.exports = new StudentController();
