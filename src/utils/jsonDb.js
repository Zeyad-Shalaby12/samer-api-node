const fs = require('fs').promises;
const path = require('path');

class JsonDb {
    constructor(filename) {
        this.filePath = path.join(__dirname, '..', 'data', filename);
    }

    async readData() {
        try {
            const data = await fs.readFile(this.filePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') {
                // If file doesn't exist, create it with empty array
                await this.writeData([]);
                return [];
            }
            throw error;
        }
    }

    async writeData(data) {
        await fs.writeFile(this.filePath, JSON.stringify(data, null, 2));
    }
}

module.exports = JsonDb;
