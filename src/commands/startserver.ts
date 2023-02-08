import dotenv from 'dotenv';
import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import DisTube from 'distube';
import find from 'find-process';
import { IExtendedClient } from '../Interface/IExtendedClient';
import { ICommand } from '../Interface/ICommand';

import { commands } from '../commandDescriptions.json';

const {
	'GameServer - Start Server': {
		name: commandName,
		description: commandDesc,
	},
} = commands;

module.exports = {
	name: new SlashCommandBuilder()
		.setName(commandName)
		.setDescription(commandDesc),
	devOnly: true,
	function: async (
		interaction: ChatInputCommandInteraction,
		client: IExtendedClient,
		distube: DisTube
	) => {
		dotenv.config();
		// const processName = process.env.GAMESERVER_EXE_CONAN_EXILE!;
		const processName = 'notepad';

		find('name', processName).then((results) => {
			console.log(results);
		});
	},
} as ICommand;
