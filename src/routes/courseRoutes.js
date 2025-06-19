const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: إدارة الكورسات والدروس
 */

/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: الحصول على جميع الكورسات
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: قائمة الكورسات
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
 *   post:
 *     summary: إنشاء كورس جديد
 *     tags: [Courses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - month
 *             properties:
 *               name:
 *                 type: string
 *                 description: اسم الكورس
 *               month:
 *                 type: string
 *                 description: الشهر الدراسي
 *     responses:
 *       201:
 *         description: تم إنشاء الكورس بنجاح
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Course'
 * 
 * /api/courses/{id}:
 *   get:
 *     summary: الحصول على كورس معين
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: معرف الكورس
 *     responses:
 *       200:
 *         description: تم العثور على الكورس
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Course'
 * 
 * /api/courses/{courseId}/lessons:
 *   post:
 *     summary: إضافة درس جديد للكورس
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         schema:
 *           type: string
 *         required: true
 *         description: معرف الكورس
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - name
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [video, exam]
 *                 description: نوع الدرس (فيديو أو امتحان)
 *               name:
 *                 type: string
 *                 description: اسم الدرس
 *               videoUrl:
 *                 type: string
 *                 description: رابط الفيديو (مطلوب إذا كان النوع فيديو)
 *               duration:
 *                 type: number
 *                 description: مدة الامتحان بالدقائق (مطلوب إذا كان النوع امتحان)
 *               totalMarks:
 *                 type: number
 *                 description: الدرجة الكلية للامتحان (مطلوب إذا كان النوع امتحان)
 *               questions:
 *                 type: array
 *                 description: أسئلة الامتحان (مطلوب إذا كان النوع امتحان)
 *                 items:
 *                   oneOf:
 *                     - $ref: '#/components/schemas/TrueFalseQuestion'
 *                     - $ref: '#/components/schemas/MultiChoiceQuestion'
 *     responses:
 *       201:
 *         description: تم إضافة الدرس بنجاح
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   oneOf:
 *                     - $ref: '#/components/schemas/VideoLesson'
 *                     - $ref: '#/components/schemas/ExamLesson'
 */

/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: إدارة الكورسات والدروس
 */

/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: الحصول على جميع الكورسات
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: قائمة الكورسات
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
 *   post:
 *     summary: إنشاء كورس جديد
 *     tags: [Courses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - month
 *             properties:
 *               name:
 *                 type: string
 *                 description: اسم الكورس
 *               month:
 *                 type: string
 *                 description: الشهر الدراسي
 *     responses:
 *       201:
 *         description: تم إنشاء الكورس بنجاح
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Course'
 */

// Course routes
router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);
router.post('/', courseController.createCourse);
router.put('/:id', courseController.updateCourse);
router.delete('/:id', courseController.deleteCourse);

// Lesson routes
router.post('/:courseId/lessons', courseController.addLesson);
router.get('/:courseId/lessons/:lessonId', courseController.getLessonById);
router.put('/:courseId/lessons/:lessonId', courseController.updateLesson);
router.delete('/:courseId/lessons/:lessonId', courseController.deleteLesson);

module.exports = router;
