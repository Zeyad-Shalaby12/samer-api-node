const CourseModel = require('../models/courseModel');

class CourseController {
    async getAllCourses(req, res) {
        try {
            const courses = await CourseModel.getAllCourses();
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

    async getCourseById(req, res) {
        try {
            const course = await CourseModel.getCourseById(req.params.id);
            if (!course) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Course not found'
                });
            }
            res.json({
                status: 'success',
                data: course
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }

    async createCourse(req, res) {
        try {
            const { name, month } = req.body;
            if (!name || !month) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Course name and month are required'
                });
            }

            const newCourse = await CourseModel.createCourse({ name, month });
            res.status(201).json({
                status: 'success',
                data: newCourse
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }

    async addLesson(req, res) {
        try {
            const { type, ...lessonData } = req.body;
            if (!type || (type !== 'video' && type !== 'exam')) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Invalid lesson type. Must be either "video" or "exam"'
                });
            }

            if (type === 'video') {
                if (!lessonData.name || !lessonData.videoUrl) {
                    return res.status(400).json({
                        status: 'error',
                        message: 'Video lesson requires name and videoUrl'
                    });
                }
            } else if (type === 'exam') {
                if (!lessonData.name || !lessonData.duration || !lessonData.totalMarks || !lessonData.questions) {
                    return res.status(400).json({
                        status: 'error',
                        message: 'Exam requires name, duration, totalMarks, and questions'
                    });
                }
            }

            const newLesson = await CourseModel.addLesson(req.params.courseId, { type, ...lessonData });
            if (!newLesson) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Course not found'
                });
            }

            res.status(201).json({
                status: 'success',
                data: newLesson
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }

    async updateCourse(req, res) {
        try {
            const updatedCourse = await CourseModel.updateCourse(req.params.id, req.body);
            if (!updatedCourse) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Course not found'
                });
            }
            res.json({
                status: 'success',
                data: updatedCourse
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }

    async updateLesson(req, res) {
        try {
            const updatedLesson = await CourseModel.updateLesson(
                req.params.courseId,
                req.params.lessonId,
                req.body
            );
            if (!updatedLesson) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Course or lesson not found'
                });
            }
            res.json({
                status: 'success',
                data: updatedLesson
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }

    async deleteCourse(req, res) {
        try {
            const deleted = await CourseModel.deleteCourse(req.params.id);
            if (!deleted) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Course not found'
                });
            }
            res.json({
                status: 'success',
                message: 'Course deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }

    async deleteLesson(req, res) {
        try {
            const deleted = await CourseModel.deleteLesson(
                req.params.courseId,
                req.params.lessonId
            );
            if (!deleted) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Course or lesson not found'
                });
            }
            res.json({
                status: 'success',
                message: 'Lesson deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }

    async getLessonById(req, res) {
        try {
            const lesson = await CourseModel.getLessonById(
                req.params.courseId,
                req.params.lessonId
            );
            if (!lesson) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Course or lesson not found'
                });
            }
            res.json({
                status: 'success',
                data: lesson
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }
}

module.exports = new CourseController();
