import {
	REST,
	RESTPostAPIApplicationCommandsJSONBody,
	Routes,
} from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';
import { logEvent } from './utils/Logger';

import dotenv from 'dotenv';
import { ICommand } from './Interface/ICommand';
dotenv.config();

const commandsPath = path.join(__dirname, 'commands');
const commands: RESTPostAPIApplicationCommandsJSONBody[] = [];
// Grab all the command files from the commands directory you created earlier
const commandFiles = fs
	.readdirSync(commandsPath)
	.filter((file) => file.endsWith('.ts'));

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
	const command = require(`./commands/${file}`) as ICommand;
	commands.push(command.name.toJSON());
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN!);

// and deploy your commands!
(async () => {
	try {
		console.log(
			`${logEvent()}Started refreshing ${
				commands.length
			} application (/) commands.`
		);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = (await rest.put(
			Routes.applicationGuildCommands(
				process.env.CLIENT_ID!,
				process.env.DEV_GUILD_ID!
			),
			{ body: commands }
		)) as [];

		console.log(
			`${logEvent()}Successfully reloaded ${
				data.length
			} application (/) commands.`
		);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();
