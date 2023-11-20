/**
 * @file deploy-commands.js
 * @description Deploys all commands to the Discord API
 * @module deploy-commands
 */

const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

const dotenv = require('dotenv');
const clientLogger = require('./utils/classes/ClientLogger');

/**
 * @typedef {import('./Interface/ICommand').ICommand} ICommand
 * @typedef {import('discord.js').RESTPostAPIApplicationCommandsJSONBody} RESTPostAPIApplicationCommandsJSONBody
 */

const commandsPath = path.join(__dirname, 'commands');

/** @type ICommand | RESTPostAPIApplicationCommandsJSONBody[] */
const devCommands = [];
/** @type ICommand | RESTPostAPIApplicationCommandsJSONBody[] */
const commands = [];

// Grab all the command files from the commands directory you created earlier
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
	/** @type ICommand */
	const command = require(`./commands/${file}`);

	if (!command.enabled) continue;

	if (command.devOnly) {
		devCommands.push(command.name.toJSON());
		continue;
	}
	commands.push(command.name.toJSON());
}

dotenv.config();
if (!process.env.BOT_TOKEN) {
	clientLogger.error('No bot token provided.');
	process.exit(1);
}
// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

// and deploy your commands!
(async () => {
	try {
		clientLogger.log(`Started refreshing ${commands.length} application (/) commands.`);

		if (!process.env.CLIENT_ID || !process.env.DEV_GUILD_ID) {
			clientLogger.error('No client ID provided.');
			process.exit(1);
		}

		// The put method is used to fully refresh all commands in the guild with the current set
		const devCommandsLoaded = await rest.put(
			Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.DEV_GUILD_ID),
			{ body: devCommands }
		);
		clientLogger.log(
			//@ts-ignore
			`Successfully reloaded ${devCommandsLoaded.length} developer application (/) commands.`
		);
		const commandsLoaded = await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
			body: commands,
		});
		clientLogger.log(
			//@ts-ignore
			`Successfully reloaded ${commandsLoaded.length} application (/) commands.`
		);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		clientLogger.error(error);
	}
})();
