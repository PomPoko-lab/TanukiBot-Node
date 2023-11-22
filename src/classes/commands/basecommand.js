/**
 * Type def/imports
 * @typedef {import('discord.js').BaseInteraction} BaseInteraction
 */

/**
 * @class
 * @classdesc Holds base commands functionality
 */
class BaseCommand {
	constructor() {
		/**
		 * @type {import('pocketbase').default}
		 * @private
		 */
		// @ts-ignore
		this.db = global.db;

		/**
		 * @type {import('../utils/ExtendedClient')}
		 * @private
		 */
		// @ts-ignore
		this.client = global.client;
	}
	/**
	 * Parse a component action and execute it depending on the component's 'customid'.
	 * @param {import('discord.js').StringSelectMenuInteraction} interaction
	 * @param {string} componentId
	 */
	parseComponentAction(interaction, componentId) {}
}

module.exports = BaseCommand;
