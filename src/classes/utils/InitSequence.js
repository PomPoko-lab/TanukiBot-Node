const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const { Collection, GatewayIntentBits, REST, Routes } = require('discord.js');
const DisTube = require('distube').default;
const ExtendedClient = require('./ExtendedClient');

const clientLogger = require('../../utils/classes/ClientLogger');

/**
 * @typedef {import('../../Interface/IEvent').IEvent} IEvent
 * @typedef {import('../../Interface/ICommand').ICommand} ICommand
 * @typedef {import('distube').DisTubeEvents} DisTubeEvents
 * @typedef {import('discord.js').RESTPostAPIApplicationCommandsJSONBody} RESTPostAPIApplicationCommandsJSONBody
 */

/**
 * @class InitSequence
 */
class InitSequence {
	constructor() {
		dotenv.config();
		this.client = new ExtendedClient({
			intents: [
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.MessageContent,
				GatewayIntentBits.GuildVoiceStates,
			],
		});
		this.loadDiscordJSAssets();

		this.distube = new DisTube(this.client, {
			leaveOnFinish: true,
			leaveOnStop: true,
			leaveOnEmpty: true,
		});
		this.loadDistubeAssets();

		clientLogger.log(`Successfully started.`);
	}

	/**
	 * Logs in the bot and loads all commands and events.
	 * @private
	 */
	loadDiscordJSAssets() {
		this.client.commands = new Collection();
		this.client.events = new Collection();
		clientLogger.log(`Starting up the bot..`);

		this.client.login(process.env.BOT_TOKEN);

		clientLogger.log(`Importing commands..`);
		this.loadDiscordCommandFiles();

		clientLogger.log(`Importing events..`);
		this.loadDiscordEventFiles();

		if (Boolean(process.env.ALWAYS_DEPLOY_COMMANDS)) {
			clientLogger.log(`Deploying commands..`);
			this.deployCommands();
		}
	}

	/**
	 * Loads all command related files.
	 * @private
	 */
	loadDiscordCommandFiles() {
		const commandsPath = path.join(__dirname, '..', '..', 'commands');
		const commandFiles = fs
			.readdirSync(commandsPath)
			.filter((file) => file.endsWith('.js'));

		commandFiles.forEach((file, index) => {
			const filePath = path.join(commandsPath, file);

			/** @type {import('../../Interface/ICommand').ICommand} */
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

	/**
	 * Loads all event related files.
	 * @private
	 */
	loadDiscordEventFiles() {
		const eventsPath = path.join(__dirname, '..', '..', 'events');
		const eventFiles = fs
			.readdirSync(eventsPath)
			.filter((file) => file.endsWith('.js'));

		eventFiles.forEach((file, index) => {
			const filePath = path.join(eventsPath, file);

			/** @type {IEvent} */
			const event = require(filePath);

			// if event does NOT have once, create an on event
			if (!event.once) {
				// @ts-ignore
				this.client.on(event.name, (...args) =>
					event.function(...args)
				);
				clientLogger.log(`Successfully loaded event from : '${file}'`);
			} else {
				// else do event once
				// @ts-ignore
				this.client.once(event.name, (...args) =>
					event.function(...args)
				);
				clientLogger.log(`Successfully loaded event from : '${file}'`);
			}
		});
	}

	/**
	 * Loads all Distube related files.
	 * @private
	 */
	loadDistubeAssets() {
		clientLogger.log('Importing DisTube Events..');
		const eventsPath = path.join(
			__dirname,
			'..',
			'..',
			'events',
			'distube'
		);
		const eventFiles = fs
			.readdirSync(eventsPath)
			.filter((file) => file.endsWith('.js'));

		eventFiles.forEach((file) => {
			const filePath = path.join(eventsPath, file);

			/** @type {IEvent} */
			const event = require(filePath);

			// if event has does NOT have once, create an on event
			if (event) {
				let eventName = event.name;
				// @ts-ignore
				this.distube.on(eventName, event.function);
				clientLogger.log(
					`Successfully loaded Distube event from : '${file}'`
				);
			}
		});
	}

	/**
	 * Deploys all commands to Discord.
	 * @private
	 */
	async deployCommands() {
		const commandsPath = path.join(__dirname, '..', '..', 'commands');
		/** @type ICommand | RESTPostAPIApplicationCommandsJSONBody[] */
		const devCommands = [];
		/** @type ICommand | RESTPostAPIApplicationCommandsJSONBody[] */
		const commands = [];
		const commandFiles = fs.readdirSync(commandsPath).filter((file) => {
			return file.endsWith('.js');
		});

		commandFiles.forEach((file) => {
			const commandFilePath = path.join(commandsPath, file);
			/**
			 * @type {ICommand}
			 */
			const command = require(commandFilePath);

			if (!command.enabled) return;

			if (command.devOnly) {
				devCommands.push(command.name.toJSON());
				return;
			}
			commands.push(command.name.toJSON());
		});

		if (process.env.BOT_TOKEN === undefined) {
			clientLogger.error(
				`No token found. Please set a token in the .env file.`
			);
			process.exit(1);
		}

		const rest = new REST({ version: '10' }).setToken(
			process.env.BOT_TOKEN
		);

		try {
			clientLogger.log(
				`Started refreshing ${commands.length} application (/) commands.`
			);

			if (
				process.env.CLIENT_ID === undefined ||
				process.env.DEV_GUILD_ID === undefined
			) {
				clientLogger.error(`No client ID or dev guild ID provided.`);
				process.exit(1);
			}

			const devCommandsLoaded = await rest.put(
				Routes.applicationGuildCommands(
					process.env.CLIENT_ID,
					process.env.DEV_GUILD_ID
				),
				{ body: devCommands }
			);
			clientLogger.log(
				// @ts-ignore
				`Successfully reloaded ${devCommandsLoaded.length} developer application (/) commands.`
			);

			const commandsLoaded = await rest.put(
				Routes.applicationCommands(process.env.CLIENT_ID),
				{ body: commands }
			);
			clientLogger.log(
				// @ts-ignore
				`Successfully reloaded ${commandsLoaded.length} global application (/) commands.`
			);
		} catch (error) {
			clientLogger.error(error);
		}
	}
}

module.exports = InitSequence;
