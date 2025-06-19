const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

/**
 * @swagger
 * /api/students:
 *   get:
 *     summary: الحصول على جميع الطلاب
 *     tags: [Students]
 *     responses:
 *       200:
 *         description: قائمة الطلاب
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
 *                     $ref: '#/components/schemas/Student'
 *   post:
 *     summary: إنشاء طالب جديد
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - studentNumber
 *               - parentPhone
 *             properties:
 *               name:
 *                 type: string
 *               studentNumber:
 *                 type: string
 *               parentPhone:
 *                 type: string
 *     responses:
 *       201:
 *         description: تم إنشاء الطالب بنجاح
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Student'
 */

// GET all students
router.get('/', studentController.getAllStudents);

// GET single student by ID
router.get('/:id', studentController.getStudentById);

// GET student's QR code
router.get('/:id/qr', studentController.getStudentQRCode);

// POST create new student
router.post('/', studentController.createStudent);

// PUT update student
router.put('/:id', studentController.updateStudent);

// DELETE student
router.delete('/:id', studentController.deleteStudent);

module.exports = router;
