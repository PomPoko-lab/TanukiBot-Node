export class ClientLogger {
	private prefix: string;
	private errorPrefix: string;

	constructor() {
		this.prefix = new Date().toLocaleString('en-US');
		this.errorPrefix = '[ERROR]';
	}

	public log(message: string) {
		console.log(`[${this.prefix}] ${message}`);
	}

	public error(errorMessage: string | unknown) {
		console.log(`[${this.prefix}] ${this.errorPrefix} ${errorMessage}`);
	}
}
