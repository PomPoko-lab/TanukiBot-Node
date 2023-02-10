import { exec } from "child_process";
import find from "find-process";

export class ServerHandler {
    private processName: string;
    private filePath: string;
    private fileExe: string;

    constructor(processName: string, filePath: string, fileExe: string) {
        this.processName = processName;
        this.filePath = filePath;
        this.fileExe = fileExe;
    }

    public getServerinfo() {
        return {
            processName: this.processName,
            filePath: this.filePath,
            fileExe: this.fileExe,
        };
    }

    public async executeFile() {
        const active = await this.checkProcess(this.processName);

        if (active) return false;

        exec(`"${this.filePath}${this.fileExe}"`);
        return true;
    }

    // Can be used to check if any process is running or the current server's process
    public async checkProcess(processName: string) {
        const results = await find("name", processName || this.processName);
        const exists = results.length > 0;

        return exists;
    }
}
