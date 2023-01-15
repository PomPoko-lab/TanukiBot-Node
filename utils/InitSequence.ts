import path from 'node:path';
import fs from 'node:fs';
import dotenv from 'dotenv';
import { DisTube, DisTubeEvents } from 'distube';

import { Collection } from 'discord.js';
import { IEvent } from '../Interface/IEvent';
import { ICommand } from '../Interface/ICommand';
// import { client } from '../index';
import { logEvent } from '../utils/Logger';

export class InitSequence {
	distube!: DisTube;
	constructor() {
		this.initBot();
		this.initDisTube();
	}

	initDisTube() {
		this.distube = new DisTube(client, {
			leaveOnFinish: true,
			leaveOnStop: true,
			leaveOnEmpty: true,
		});
		// Import DisTube Events
		console.log(`\n${logEvent()}Importing Distube events..`);
		this.loadDistubeEventFiles();
	}

	initBot() {
		dotenv.config();

		global.client.commands = new Collection();
		global.client.events = new Collection();
		console.log(`${logEvent()}Starting up the bot..`);

		// Import commands
		console.log(`\n${logEvent()}Importing commands..`);
		this.loadCommandFiles();

		// Import events
		console.log(`\n${logEvent()}Importing events..`);
		this.loadEventFiles();

		global.client.login(process.env.BOT_TOKEN);
	}

	loadCommandFiles() {
		const commandsPath = path.join(__dirname, '..', 'commands');
		const commandFiles = fs
			.readdirSync(commandsPath)
			.filter((file: string) => file.endsWith('.ts'));

		commandFiles.forEach((file: string, index: number) => {
			const filePath = path.join(commandsPath, file);
			const command = require(filePath) as ICommand;

			if (command.name && command.function!) {
				// Add to commands Collection of each file
				global.client.commands!.set(command.name.name, command);
				console.log(
					`${logEvent()}[${++index}/${
						commandFiles.length
					}] Successfully loaded command from : '${file}'`
				);
			}
			if (!command.name) {
				console.log(
					`[WARNING] The command at ${filePath} is missing a required "name" property.`
				);
			}
			if (!command.function) {
				console.log(
					`[WARNING] The command at ${filePath} is missing a required "function" property.`
				);
			}
		});
	}

	loadEventFiles() {
		const eventsPath = path.join(__dirname, '..', 'events');
		const eventFiles = fs
			.readdirSync(eventsPath)
			.filter((file) => file.endsWith('.ts'));

		eventFiles.forEach((file, index) => {
			const filePath = path.join(eventsPath, file);
			const event = require(filePath) as IEvent;

			// if event has does NOT have once, create an on event
			if (!event.once) {
				global.client.on(event.name, (...args) =>
					event.function(...args)
				);
				console.log(
					`${logEvent()}[${++index}/${
						eventFiles.length
					}] Successfully loaded event from : '${file}'`
				);
			} else {
				// else do event once
				global.client.once(event.name, (...args) =>
					event.function(...args)
				);
				console.log(
					`${logEvent()}[${++index}/${
						eventFiles.length
					}] Successfully loaded event from : '${file}'`
				);
			}
		});
	}

	loadDistubeEventFiles() {
		const eventsPath = path.join(__dirname, '..', 'events', 'distube');
		const eventFiles = fs
			.readdirSync(eventsPath)
			.filter((file) => file.endsWith('.ts'));

		eventFiles.forEach((file, index) => {
			const filePath = path.join(eventsPath, file);
			const event = require(filePath) as IEvent;

			// if event has does NOT have once, create an on event
			if (event) {
				this.distube.on(
					event.name as keyof DisTubeEvents,
					event.function
				);
				console.log(
					`${logEvent()}[${++index}/${
						eventFiles.length
					}] Successfully loaded Distube event from : '${file}'`
				);
			}
		});
	}
}
