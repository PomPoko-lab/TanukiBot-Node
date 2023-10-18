/**
 * @file initSequence.js
 * @description Imports all commands and events, and logs the bot in
 * @module Classes/InitSequence
 */

const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const { Collection, GatewayIntentBits } = require('discord.js');
const DisTube = require('distube').default;
const ExtendedClient = require('./ExtendedClient');

const clientLogger = require('../utils/ClientLogger');

/**
 * @typedef {import('../Interface/IEvent').IEvent} IEvent
 * @typedef {import('distube').DisTubeEvents} DisTubeEvents
 */

module.exports = class InitSequence {
	client = new ExtendedClient({
		intents: [
			GatewayIntentBits.Guilds,
			GatewayIntentBits.GuildMessages,
			GatewayIntentBits.MessageContent,
			GatewayIntentBits.GuildVoiceStates,
		],
	});

	constructor() {
		this._initBot();
		this.distube = this._initDisTube();
		this._loadDistubeEventFiles();

		clientLogger.log(`Successfully started.`);
	}

	_initBot() {
		dotenv.config();

		this.client.commands = new Collection();
		this.client.events = new Collection();
		clientLogger.log(`Starting up the bot..`);

		if (process.env.BOT_TOKEN === undefined) {
			clientLogger.error(`No token found. Please set a token in the .env file.`);
			process.exit(1);
		}
		this.client.login(process.env.BOT_TOKEN);

		clientLogger.log(`Importing commands..`);
		this._loadCommandFiles();

		clientLogger.log(`Importing events..`);
		this._loadEventFiles();
	}

	_initDisTube() {
		return new DisTube(this.client, {
			leaveOnFinish: true,
			leaveOnStop: true,
			leaveOnEmpty: true,
		});
	}

	_loadCommandFiles() {
		const commandsPath = path.join(__dirname, '..', 'commands');
		const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

		commandFiles.forEach((file, index) => {
			const filePath = path.join(commandsPath, file);

			/** @type {import('../Interface/ICommand').ICommand} */
			const command = require(filePath);

			if (!command.enabled) return;

			if (command.name) {
				// Add to commands Collection of each file
				this.client.commands.set(command.name.name, command);
				clientLogger.log(`Successfully loaded command from : '${file}`);
			}
			if (!command.name) {
				clientLogger.error(
					`The command at ${filePath} is missing a required "name" property.`
				);
			}
			if (!command.function) {
				clientLogger.error(
					`The command at ${filePath} is missing a required "function" property.`
				);
			}
		});
	}

	_loadEventFiles() {
		const eventsPath = path.join(__dirname, '..', 'events');
		const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith('.js'));

		eventFiles.forEach((file, index) => {
			const filePath = path.join(eventsPath, file);

			/** @type {IEvent} */
			const event = require(filePath);

			// if event does NOT have once, create an on event
			if (!event.once) {
				// @ts-ignore
				this.client.on(event.name, (...args) => event.function(...args));
				clientLogger.log(`Successfully loaded event from : '${file}'`);
			} else {
				// else do event once
				// @ts-ignore
				this.client.once(event.name, (...args) => event.function(...args));
				clientLogger.log(`Successfully loaded event from : '${file}'`);
			}
		});
	}

	_loadDistubeEventFiles() {
		clientLogger.log('Importing DisTube Events..');
		const eventsPath = path.join(__dirname, '..', 'events', 'distube');
		const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith('.js'));

		eventFiles.forEach((file) => {
			const filePath = path.join(eventsPath, file);

			/** @type {IEvent} */
			const event = require(filePath);

			// if event has does NOT have once, create an on event
			if (event) {
				let eventName = event.name;
				// @ts-ignore
				this.distube.on(eventName, event.function);
				clientLogger.log(`Successfully loaded Distube event from : '${file}'`);
			}
		});
	}
};
