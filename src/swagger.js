const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'نظام إدارة المدرسة API',
            version: '1.0.0',
            description: 'واجهة برمجة التطبيقات لنظام إدارة المدرسة مع إدارة الطلاب والكورسات والحضور',
            contact: {
                name: 'API Support',
                email: 'support@example.com'
            }
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Development server'
            }
        ],
        components: {
            schemas: {
                Student: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        name: { type: 'string' },
                        studentNumber: { type: 'string' },
                        parentPhone: { type: 'string' },
                        qrCodePath: { type: 'string' },
                        createdAt: { type: 'string', format: 'date-time' }
                    }
                },
                Course: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        name: { type: 'string' },
                        month: { type: 'string' },
                        lessons: {
                            type: 'array',
                            items: {
                                oneOf: [
                                    { $ref: '#/components/schemas/VideoLesson' },
                                    { $ref: '#/components/schemas/ExamLesson' }
                                ]
                            }
                        }
                    }
                },
                VideoLesson: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        type: { type: 'string', enum: ['video'] },
                        name: { type: 'string' },
                        videoUrl: { type: 'string' }
                    }
                },
                ExamLesson: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        type: { type: 'string', enum: ['exam'] },
                        name: { type: 'string' },
                        duration: { type: 'number' },
                        totalMarks: { type: 'number' },
                        questions: {
                            type: 'array',
                            items: {
                                oneOf: [
                                    { $ref: '#/components/schemas/TrueFalseQuestion' },
                                    { $ref: '#/components/schemas/MultiChoiceQuestion' }
                                ]
                            }
                        }
                    }
                },
                Session: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        courseId: { type: 'string', format: 'uuid' },
                        name: { type: 'string' },
                        date: { type: 'string', format: 'date' },
                        startTime: { type: 'string' },
                        endTime: { type: 'string' },
                        createdAt: { type: 'string', format: 'date-time' }
                    }
                },
                Attendance: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        sessionId: { type: 'string', format: 'uuid' },
                        studentId: { type: 'string', format: 'uuid' },
                        status: { type: 'string', enum: ['present'] },
                        attendedAt: { type: 'string', format: 'date-time' }
                    }
                }
            },
            responses: {
                Error: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', example: 'error' },
                        message: { type: 'string' }
                    }
                }
            }
        }
    },
    apis: ['./src/routes/*.js'] // سيتم إضافة التوثيق في ملفات المسارات
};

const specs = swaggerJsdoc(options);
module.exports = specs;
