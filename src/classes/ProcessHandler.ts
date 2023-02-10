import {exec} from 'child_process';
import find from 'find-process';

export class ProcessHandler {

	constructor() {
	}

	public async executeFile(filePath: string, fileExe: string, args:string) {
        return new Promise((resolve, reject) => {
            exec(`"${filePath}${fileExe}" ${args}`,(err, stdout)=>{
                if (err)
                    reject(err);
                resolve(stdout);
            });
        })
	}

	public async checkProcess(processName: string) {
		return await find('name', processName);
	}
}
