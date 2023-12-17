/**
 * @file ExtendedClient.js
 * @description Extends the Client class from discord.js to include a commands and events collection
 * @module Classes/ExtendedClient
 */

const { Client, Collection } = require('discord.js');

module.exports = class ExtendedClient extends Client {
	/**
	 * @param {import('discord.js').ClientOptions} options
	 */
	constructor(options) {
		super(options);
		this.commands = new Collection();
		this.events = new Collection();
	}
};
