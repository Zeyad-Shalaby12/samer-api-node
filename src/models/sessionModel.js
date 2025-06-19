const JsonDb = require('../utils/jsonDb');
const { v4: uuidv4 } = require('uuid');

class SessionModel {
    constructor() {
        this.db = new JsonDb('sessions.json');
    }

    async createSession(courseId, sessionData) {
        const sessions = await this.db.readData();
        const newSession = {
            id: uuidv4(),
            courseId,
            name: sessionData.name,
            date: sessionData.date,
            startTime: sessionData.startTime,
            endTime: sessionData.endTime,
            createdAt: new Date().toISOString()
        };

        sessions.push(newSession);
        await this.db.writeData(sessions);
        return newSession;
    }

    async getSessionById(id) {
        const sessions = await this.db.readData();
        return sessions.find(session => session.id === id);
    }

    async getSessionsByCourse(courseId) {
        const sessions = await this.db.readData();
        return sessions.filter(session => session.courseId === courseId);
    }

    async updateSession(id, sessionData) {
        const sessions = await this.db.readData();
        const index = sessions.findIndex(session => session.id === id);
        if (index === -1) return null;

        const updatedSession = {
            ...sessions[index],
            ...sessionData,
            updatedAt: new Date().toISOString()
        };

        sessions[index] = updatedSession;
        await this.db.writeData(sessions);
        return updatedSession;
    }

    async deleteSession(id) {
        const sessions = await this.db.readData();
        const index = sessions.findIndex(session => session.id === id);
        if (index === -1) return false;

        sessions.splice(index, 1);
        await this.db.writeData(sessions);
        return true;
    }
}

module.exports = new SessionModel();
