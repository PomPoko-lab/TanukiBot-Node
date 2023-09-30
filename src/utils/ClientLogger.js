/**
 * @file ClientLogger.js
 * @description Logs messages to the console with a timestamp
 * @module Classes/ClientLogger
 */

module.exports = class ClientLogger {
	#prefix;
	#errorPrefix;

	constructor() {
		this.#prefix = new Date().toLocaleString('en-US');
		this.#errorPrefix = '[ERROR]';
	}

	/**
	 * Logs a message to the console with a timestamp
	 * @param {any} message - The message to log
	 * @returns {void}
	 */
	log(message) {
		if (typeof message !== 'string') {
			console.log(`[${this.#prefix}]`);
			console.log(message);
			return;
		} else {
			console.log(`[${this.#prefix}] ${message}`);
		}
	}

	/**
	 * Logs an error message to the console with a timestamp and error prefix
	 * @param {any} errorMessage - The error message to log
	 * @returns {void}
	 */
	error(errorMessage) {
		console.log(`[${this.#prefix}] ${this.#errorPrefix} ${errorMessage}`);
	}
};
