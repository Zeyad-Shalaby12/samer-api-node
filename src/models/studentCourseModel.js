const JsonDb = require('../utils/jsonDb');
const StudentModel = require('./studentModel');
const CourseModel = require('./courseModel');
const { v4: uuidv4 } = require('uuid');

class StudentCourseModel {
    constructor() {
        this.db = new JsonDb('student-courses.json');
    }

    async enrollStudentInCourse(studentId, courseId) {
        // Check if student and course exist
        const student = await StudentModel.getStudentById(studentId);
        const course = await CourseModel.getCourseById(courseId);

        if (!student || !course) {
            return null;
        }

        const enrollments = await this.db.readData();
        
        // Check if already enrolled
        const existing = enrollments.find(e => 
            e.studentId === studentId && e.courseId === courseId
        );

        if (existing) {
            return existing;
        }

        // Create new enrollment
        const newEnrollment = {
            id: uuidv4(),
            studentId,
            courseId,
            enrolledAt: new Date().toISOString()
        };

        enrollments.push(newEnrollment);
        await this.db.writeData(enrollments);
        return newEnrollment;
    }

    async getStudentCourses(studentId) {
        const enrollments = await this.db.readData();
        const studentEnrollments = enrollments.filter(e => e.studentId === studentId);
        
        // Get all courses details
        const courses = await Promise.all(
            studentEnrollments.map(async (enrollment) => {
                const course = await CourseModel.getCourseById(enrollment.courseId);
                return {
                    ...course,
                    enrolledAt: enrollment.enrolledAt
                };
            })
        );

        return courses;
    }

    async getStudentWithCourses(studentId) {
        const student = await StudentModel.getStudentById(studentId);
        if (!student) return null;

        const courses = await this.getStudentCourses(studentId);
        return {
            ...student,
            courses
        };
    }

    async unenrollStudentFromCourse(studentId, courseId) {
        const enrollments = await this.db.readData();
        const index = enrollments.findIndex(e => 
            e.studentId === studentId && e.courseId === courseId
        );

        if (index === -1) return false;

        enrollments.splice(index, 1);
        await this.db.writeData(enrollments);
        return true;
    }
}

module.exports = new StudentCourseModel();
