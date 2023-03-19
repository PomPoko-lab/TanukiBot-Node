import path from 'node:path';
import fs from 'node:fs';
import dotenv from 'dotenv';
import { DisTube, DisTubeEvents } from 'distube';

import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { ClientLogger } from './ClientLogger';
import { IEvent } from '../Interface/IEvent';
import { ICommand } from '../Interface/ICommand';
import { IExtendedClient } from '../Interface/IExtendedClient';

export class InitSequence {
	public clientLogger: ClientLogger;
	public distube: DisTube;
	public client!: IExtendedClient;
	constructor() {
		this.clientLogger = new ClientLogger();
		this.initBot();
		this.distube = this.initDisTube();
		this.loadDistubeEventFiles();
	}

	private initBot() {
		this.client = new Client({
			intents: [
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.MessageContent,
				GatewayIntentBits.GuildVoiceStates,
			],
		}) as IExtendedClient;
		dotenv.config();

		this.client.commands = new Collection();
		this.client.events = new Collection();
		this.clientLogger.log(`Starting up the bot..`);

		this.clientLogger.log(`Importing commands..`);
		this.loadCommandFiles();

		this.clientLogger.log(`Importing events..`);
		this.loadEventFiles();

		this.client.login(process.env.BOT_TOKEN);
	}

	private initDisTube() {
		return new DisTube(this.client, {
			leaveOnFinish: true,
			leaveOnStop: true,
			leaveOnEmpty: true,
		});
	}

	private loadCommandFiles() {
		const commandsPath = path.join(__dirname, '..', 'commands');
		const commandFiles = fs
			.readdirSync(commandsPath)
			.filter((file: string) => file.endsWith('.ts'));

		commandFiles.forEach((file: string, index: number) => {
			const filePath = path.join(commandsPath, file);
			const command = require(filePath) as ICommand;

			if (!command.enabled) return;

			if (command.name && command.function!) {
				// Add to commands Collection of each file
				this.client.commands!.set(command.name.name, command);
				this.clientLogger.log(
					`Successfully loaded command from : '${file}`
				);
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

	private loadEventFiles() {
		const eventsPath = path.join(__dirname, '..', 'events');
		const eventFiles = fs
			.readdirSync(eventsPath)
			.filter((file) => file.endsWith('.ts'));

		eventFiles.forEach((file, index) => {
			const filePath = path.join(eventsPath, file);
			const event = require(filePath) as IEvent;

			// if event has does NOT have once, create an on event
			if (!event.once) {
				this.client.on(event.name, (...args) =>
					event.function(...args)
				);
				this.clientLogger.log(
					`Successfully loaded event from : '${file}'`
				);
			} else {
				// else do event once
				this.client.once(event.name, (...args) =>
					event.function(...args)
				);
				this.clientLogger.log(
					`Successfully loaded event from : '${file}'`
				);
			}
		});
	}

	private loadDistubeEventFiles() {
		this.clientLogger.log('Importing DisTube Events..');
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
				this.clientLogger.log(
					`Successfully loaded Distube event from : '${file}'`
				);
			}
		});
	}
}
