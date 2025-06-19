const JsonDb = require('../utils/jsonDb');
const { v4: uuidv4 } = require('uuid');
const qr = require('qr-image');
const fs = require('fs').promises;
const path = require('path');

class StudentModel {
    constructor() {
        this.db = new JsonDb('students.json');
    }

    async getAllStudents() {
        return await this.db.readData();
    }

    async getStudentById(id) {
        const students = await this.db.readData();
        return students.find(student => student.id === id);
    }

    async createStudent(studentData) {
        const students = await this.db.readData();
        const newStudent = {
            id: uuidv4(),
            ...studentData,
            createdAt: new Date().toISOString()
        };

        // Generate QR code and save it as a file
        const qrCode = qr.imageSync(JSON.stringify({
            id: newStudent.id,
            name: newStudent.name,
            studentNumber: newStudent.studentNumber,
            parentPhone: newStudent.parentPhone
        }), { type: 'svg' });

        const qrCodeFileName = `${newStudent.id}-${newStudent.studentNumber}.svg`;
        const qrCodePath = path.join(__dirname, '..', 'public', 'qrcodes', qrCodeFileName);
        await fs.writeFile(qrCodePath, qrCode);

        newStudent.qrCodePath = `/qrcodes/${qrCodeFileName}`;
        
        students.push(newStudent);
        await this.db.writeData(students);
        return newStudent;
    }

    async updateStudent(id, studentData) {
        const students = await this.db.readData();
        const index = students.findIndex(student => student.id === id);
        if (index === -1) return null;

        const updatedStudent = {
            ...students[index],
            ...studentData,
            updatedAt: new Date().toISOString()
        };

        // Regenerate QR code and save it as a file
        const qrCode = qr.imageSync(JSON.stringify({
            id: updatedStudent.id,
            name: updatedStudent.name,
            studentNumber: updatedStudent.studentNumber,
            parentPhone: updatedStudent.parentPhone
        }), { type: 'svg' });

        const qrCodeFileName = `${updatedStudent.id}-${updatedStudent.studentNumber}.svg`;
        const qrCodePath = path.join(__dirname, '..', 'public', 'qrcodes', qrCodeFileName);
        await fs.writeFile(qrCodePath, qrCode);

        updatedStudent.qrCodePath = `/qrcodes/${qrCodeFileName}`;

        students[index] = updatedStudent;
        await this.db.writeData(students);
        return updatedStudent;
    }

    async deleteStudent(id) {
        const students = await this.db.readData();
        const index = students.findIndex(student => student.id === id);
        if (index === -1) return false;

        // Delete QR code file if it exists
        const student = students[index];
        if (student.qrCodePath) {
            const qrCodePath = path.join(__dirname, '..', 'public', student.qrCodePath);
            try {
                await fs.unlink(qrCodePath);
            } catch (error) {
                console.error('Error deleting QR code file:', error);
            }
        }

        students.splice(index, 1);
        await this.db.writeData(students);
        return true;
    }

    async getStudentQRCode(id) {
        const student = await this.getStudentById(id);
        if (!student || !student.qrCodePath) return null;
        
        const qrCodePath = path.join(__dirname, '..', 'public', student.qrCodePath);
        try {
            const qrCode = await fs.readFile(qrCodePath, 'utf8');
            return qrCode;
        } catch (error) {
            console.error('Error reading QR code file:', error);
            return null;
        }
    }

    async getStudentByQRData(qrData) {
        try {
            const data = JSON.parse(qrData);
            return await this.getStudentById(data.id);
        } catch (error) {
            console.error('Error parsing QR data:', error);
            return null;
        }
    }
}

module.exports = new StudentModel();
