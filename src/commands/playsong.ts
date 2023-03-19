import {
	ChatInputCommandInteraction,
	GuildMember,
	GuildTextBasedChannel,
	SlashCommandBuilder,
} from 'discord.js';

import { userInChannel, isValidUrl } from '../utils/ValidateChannel';

import DisTube from 'distube';
import { IExtendedClient } from '../Interface/IExtendedClient';
import { ICommand } from '../Interface/ICommand';

import { commands } from '../commandDescriptions.json';

const {
	'DisTube - Play Song': {
		name: commandName,
		description: commandDesc,
		devOnly,
		enabled,
	},
} = commands;

module.exports = {
	name: new SlashCommandBuilder()
		.setName(commandName)
		.setDescription(commandDesc)
		.addStringOption((option) =>
			option.setName('url').setDescription('url of song from')
		),
	devOnly,
	enabled,
	function: async (
		interaction: ChatInputCommandInteraction,
		client: IExtendedClient,
		distube: DisTube
	) => {
		const voiceChannel = (interaction.member as GuildMember).voice.channel;
		const url = interaction.options.getString('url');

		// Checks if member is in a voice channel
		if (!userInChannel(voiceChannel, interaction)) return;

		// Checks if url is valid,
		// but already validated through required front-end input
		if (!isValidUrl(url, interaction)) return;

		if (voiceChannel && url) {
			try {
				await interaction.deferReply();
				await distube.play(voiceChannel, url, {
					member: interaction.member as GuildMember,
					textChannel: interaction.channel as GuildTextBasedChannel,
				});

				interaction.deleteReply();
			} catch (err) {
				interaction.editReply(
					`Couldn't play the song. Something went wrong.`
				);
				clientLogger.error(err);
			}
		}
	},
} as ICommand;
