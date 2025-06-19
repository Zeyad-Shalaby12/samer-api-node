const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');

/**
 * @swagger
 * tags:
 *   name: Sessions
 *   description: إدارة الحصص والحضور
 */

/**
 * @swagger
 * /api/sessions:
 *   post:
 *     summary: إنشاء حصة جديدة
 *     tags: [Sessions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseId
 *               - name
 *               - date
 *               - startTime
 *               - endTime
 *             properties:
 *               courseId:
 *                 type: string
 *                 format: uuid
 *                 description: معرف الكورس
 *               name:
 *                 type: string
 *                 description: اسم الحصة
 *               date:
 *                 type: string
 *                 format: date
 *                 description: تاريخ الحصة
 *               startTime:
 *                 type: string
 *                 description: وقت بداية الحصة
 *               endTime:
 *                 type: string
 *                 description: وقت نهاية الحصة
 *     responses:
 *       201:
 *         description: تم إنشاء الحصة بنجاح
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Session'
 * 
 * /api/sessions/{sessionId}/attendance:
 *   post:
 *     summary: تسجيل حضور طالب
 *     tags: [Sessions]
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: معرف الحصة
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
 *         description: تم تسجيل الحضور بنجاح
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
 *                     attendance:
 *                       $ref: '#/components/schemas/Attendance'
 *                     student:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                         studentNumber:
 *                           type: string
 * 
 * /api/sessions/{sessionId}/report:
 *   get:
 *     summary: الحصول على تقرير الحضور للحصة
 *     tags: [Sessions]
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: معرف الحصة
 *     responses:
 *       200:
 *         description: تقرير الحضور
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
 *                     session:
 *                       $ref: '#/components/schemas/Session'
 *                     totalAttendees:
 *                       type: number
 *                     attendanceDetails:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             format: uuid
 *                           status:
 *                             type: string
 *                           attendedAt:
 *                             type: string
 *                             format: date-time
 *                           student:
 *                             type: object
 *                             properties:
 *                               name:
 *                                 type: string
 *                               studentNumber:
 *                                 type: string
 */

// Session routes
router.post('/', sessionController.createSession);
router.get('/course/:courseId', sessionController.getSessionsByCourse);

// Attendance routes
router.post('/:sessionId/attendance', sessionController.markAttendance);
router.get('/:sessionId/report', sessionController.getSessionReport);
router.get('/student/:studentId/attendance', sessionController.getStudentAttendance);

module.exports = router;
