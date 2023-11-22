const exec = require("child_process").exec;
const find = require("find-process");

module.exports = class ServerHandler {
    /**
     * 
     * @param {string} processName 
     * @param {string} filePath 
     * @param {string} fileExe 
     */
    constructor(processName, filePath, fileExe) {
        this.processName = processName;
        this.filePath = filePath;
        this.fileExe = fileExe;
    }

    getServerinfo() {
        return {
            processName: this.processName,
            filePath: this.filePath,
            fileExe: this.fileExe,
        };
    }

    async executeFile() {
        const active = await this.checkProcess(this.processName);

        if (active) return false;

        exec(`"${this.filePath}${this.fileExe}"`);
        return true;
    }

    // Can be used to check if any process is running or the current server's process
    /**
     * 
     * @param {string} processName 
     * @returns 
     */
    async checkProcess(processName) {
        const results = await find("name", processName || this.processName);
        const exists = results.length > 0;

        return exists;
    }
}
