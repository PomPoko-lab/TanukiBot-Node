const clientLogger = require('utils/classes/ClientLogger');
/**
 * @typedef {import('@/classes/utils/ExtendedClient')} ExtendedClient
 */

/**
 * @class BaseCommand
 */
class BaseCommand {
	/**
	 * @param {ExtendedClient} discordJSClient
	 */
	constructor(discordJSClient) {
		this.client = discordJSClient;
		this.logger = clientLogger;
	}
}

module.exports = BaseCommand;
