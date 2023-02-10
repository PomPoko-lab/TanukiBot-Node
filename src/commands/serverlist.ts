import dotenv from 'dotenv';
import { ChatInputCommandInteraction, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, EmbedBuilder, Events, ButtonStyle, MessageComponentInteraction, CollectorFilter, Collection, Message, ButtonInteraction } from 'discord.js';
import DisTube from 'distube';
import { ProcessHandler } from '../classes/ProcessHandler';
import { IExtendedClient } from '../Interface/IExtendedClient';
import { ICommand } from '../Interface/ICommand';

import { commands } from '../commandDescriptions.json';

const {
	'GameServer - Server List': {
		name: commandName,
		description: commandDesc,
	},
} = commands;

module.exports = {
	name: new SlashCommandBuilder()
		.setName(commandName)
		.setDescription(commandDesc),
	devOnly: false,
	function: async (
		interaction: ChatInputCommandInteraction,
		client: IExtendedClient,
		distube: DisTube
	) => {
		interaction.deferReply();
		try {
			dotenv.config();
			const handler = new ProcessHandler();
			const filePath = process.env.GAMESERVER_DIR_CONAN_EXILE!;
			const fileExe = process.env.GAMESERVER_EXE_CONAN_EXILE!;
			const fileArgs = process.env.ARGS_CONAN_EXILE!;
			const results = await handler.checkProcess(fileExe);
			
			const filter = (buttonInteraction: any) => {
				return buttonInteraction.customId === 'confirm' && buttonInteraction.user.id === interaction.user.id;
			}
			const collector = interaction.channel?.createMessageComponentCollector({
				filter: filter,
				time: 15000,
			})

			console.log(results);

			if (results.length > 0) {
				return interaction.editReply(`${fileExe} is already up.`);
			}

			const row = new ActionRowBuilder<ButtonBuilder>()
			.addComponents(
				new ButtonBuilder()
				.setCustomId('confirm')
				.setLabel('Start it')
				.setStyle(ButtonStyle.Primary),
			);

			interaction.editReply({
				content:`${fileExe} is not currently active.`,
				components: [row],
			});

			collector?.on('collect', async (buttonInteraction) => {
				if (buttonInteraction.customId === 'confirm') {
					await buttonInteraction.deferReply();
					let results = await handler.executeFile(filePath, fileExe, fileArgs);
					console.log(results);
					await buttonInteraction.editReply('Started the server');
				}
			})
		} catch (err){
			clientLogger.error(err);
			interaction.editReply('Something went wrong.');
		}
	},
} as ICommand;
