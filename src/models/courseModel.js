const JsonDb = require('../utils/jsonDb');
const { v4: uuidv4 } = require('uuid');

class CourseModel {
    constructor() {
        this.db = new JsonDb('courses.json');
    }

    async getAllCourses() {
        return await this.db.readData();
    }

    async getCourseById(id) {
        const courses = await this.db.readData();
        return courses.find(course => course.id === id);
    }

    async createCourse(courseData) {
        const courses = await this.db.readData();
        const newCourse = {
            id: uuidv4(),
            name: courseData.name,
            month: courseData.month,
            lessons: [],
            createdAt: new Date().toISOString()
        };
        
        courses.push(newCourse);
        await this.db.writeData(courses);
        return newCourse;
    }

    async addLesson(courseId, lessonData) {
        const courses = await this.db.readData();
        const courseIndex = courses.findIndex(course => course.id === courseId);
        
        if (courseIndex === -1) return null;

        const newLesson = {
            id: uuidv4(),
            type: lessonData.type, // 'video' or 'exam'
            ...lessonData,
            createdAt: new Date().toISOString()
        };

        if (lessonData.type === 'exam') {
            newLesson.questions = lessonData.questions.map(q => ({
                id: uuidv4(),
                ...q,
                type: q.type // 'truefalse' or 'multichoice'
            }));
        }

        courses[courseIndex].lessons.push(newLesson);
        await this.db.writeData(courses);
        return newLesson;
    }

    async updateCourse(id, courseData) {
        const courses = await this.db.readData();
        const index = courses.findIndex(course => course.id === id);
        if (index === -1) return null;

        const updatedCourse = {
            ...courses[index],
            ...courseData,
            updatedAt: new Date().toISOString()
        };

        courses[index] = updatedCourse;
        await this.db.writeData(courses);
        return updatedCourse;
    }

    async updateLesson(courseId, lessonId, lessonData) {
        const courses = await this.db.readData();
        const courseIndex = courses.findIndex(course => course.id === courseId);
        if (courseIndex === -1) return null;

        const lessonIndex = courses[courseIndex].lessons.findIndex(
            lesson => lesson.id === lessonId
        );
        if (lessonIndex === -1) return null;

        const updatedLesson = {
            ...courses[courseIndex].lessons[lessonIndex],
            ...lessonData,
            updatedAt: new Date().toISOString()
        };

        courses[courseIndex].lessons[lessonIndex] = updatedLesson;
        await this.db.writeData(courses);
        return updatedLesson;
    }

    async deleteCourse(id) {
        const courses = await this.db.readData();
        const index = courses.findIndex(course => course.id === id);
        if (index === -1) return false;

        courses.splice(index, 1);
        await this.db.writeData(courses);
        return true;
    }

    async deleteLesson(courseId, lessonId) {
        const courses = await this.db.readData();
        const courseIndex = courses.findIndex(course => course.id === courseId);
        if (courseIndex === -1) return false;

        const lessonIndex = courses[courseIndex].lessons.findIndex(
            lesson => lesson.id === lessonId
        );
        if (lessonIndex === -1) return false;

        courses[courseIndex].lessons.splice(lessonIndex, 1);
        await this.db.writeData(courses);
        return true;
    }

    async getLessonById(courseId, lessonId) {
        const course = await this.getCourseById(courseId);
        if (!course) return null;
        return course.lessons.find(lesson => lesson.id === lessonId);
    }
}

module.exports = new CourseModel();
