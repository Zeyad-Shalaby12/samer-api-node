const JsonDb = require('../utils/jsonDb');
const { v4: uuidv4 } = require('uuid');
const qr = require('qr-image');

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

        students[index] = updatedStudent;
        await this.db.writeData(students);
        return updatedStudent;
    }

    async deleteStudent(id) {
        const students = await this.db.readData();
        const index = students.findIndex(student => student.id === id);
        if (index === -1) return false;

        students.splice(index, 1);
        await this.db.writeData(students);
        return true;
    }

    async getStudentQRCode(id) {
        const student = await this.getStudentById(id);
        if (!student) return null;

        const qrData = JSON.stringify({
            id: student.id,
            name: student.name,
            studentNumber: student.studentNumber,
            parentPhone: student.parentPhone
        });

        const qrCode = qr.imageSync(qrData, { type: 'svg' });
        return qrCode.toString(); // return SVG as string
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
