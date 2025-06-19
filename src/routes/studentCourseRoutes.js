const express = require('express');
const router = express.Router();
const studentCourseController = require('../controllers/studentCourseController');

/**
 * @swagger
 * tags:
 *   name: Enrollments
 *   description: إدارة تسجيل الطلاب في الكورسات
 */

/**
 * @swagger
 * /api/enrollments/enroll:
 *   post:
 *     summary: تسجيل طالب في كورس
 *     tags: [Enrollments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - studentId
 *               - courseId
 *             properties:
 *               studentId:
 *                 type: string
 *                 format: uuid
 *                 description: معرف الطالب
 *               courseId:
 *                 type: string
 *                 format: uuid
 *                 description: معرف الكورس
 *     responses:
 *       201:
 *         description: تم تسجيل الطالب بنجاح
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     studentId:
 *                       type: string
 *                       format: uuid
 *                     courseId:
 *                       type: string
 *                       format: uuid
 *                     enrolledAt:
 *                       type: string
 *                       format: date-time
 * 
 * /api/enrollments/scan-qr:
 *   post:
 *     summary: مسح QR code للحصول على بيانات الطالب وكورساته
 *     tags: [Enrollments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - qrData
 *             properties:
 *               qrData:
 *                 type: string
 *                 description: البيانات المقروءة من QR code
 *     responses:
 *       200:
 *         description: تم العثور على بيانات الطالب
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     student:
 *                       $ref: '#/components/schemas/Student'
 *                     courses:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Course'
 * 
 * /api/enrollments/student/{studentId}/courses:
 *   get:
 *     summary: الحصول على كورسات طالب معين
 *     tags: [Enrollments]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: معرف الطالب
 *     responses:
 *       200:
 *         description: قائمة كورسات الطالب
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Course'
 */

// Enroll student in course
router.post('/enroll', studentCourseController.enrollStudentInCourse);

// Get student's courses
router.get('/student/:studentId/courses', studentCourseController.getStudentCourses);

// Unenroll student from course
router.delete('/student/:studentId/course/:courseId', studentCourseController.unenrollStudentFromCourse);

// Get student data with courses by QR code
router.post('/scan-qr', studentCourseController.getStudentByQRCode);

module.exports = router;
