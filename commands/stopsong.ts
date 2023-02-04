import {
	ChatInputCommandInteraction,
	GuildMember,
	SlashCommandBuilder,
} from 'discord.js';

import { userInChannel, hasQueue } from '../utils/ValidateChannel';

import DisTube, { GuildIdResolvable } from 'distube';
import { IExtendedClient } from '../Interface/IExtendedClient';
import { ICommand } from '../Interface/ICommand';

import { commands } from '../commandDescriptions.json';

const {
	'DisTube - Stop Song': { name: commandName, description: commandDesc },
} = commands;

module.exports = {
	name: new SlashCommandBuilder()
		.setName(commandName)
		.setDescription(commandDesc),
	function: async (
		interaction: ChatInputCommandInteraction,
		client: IExtendedClient,
		distube: DisTube
	) => {
		const songQueue = distube.getQueue(
			interaction.guildId as GuildIdResolvable
		);
		const playingChannel = songQueue?.voiceChannel;
		const memberChannel = (interaction.member as GuildMember).voice.channel;

		// Checks if member is in a voice channel
		if (!userInChannel(memberChannel, interaction)) return;

		// Checks if currently playing
		if (!userInChannel(playingChannel, interaction)) return;

		// Checks if queue is valid
		if (!hasQueue(songQueue, interaction)) return;

		if (memberChannel === playingChannel && songQueue) {
			try {
				await songQueue.stop();

				interaction.reply({
					content: 'Successfully stopped the music player.',
				});
			} catch (err) {
				clientLogger.error(err);
			}
		}
	},
} as ICommand;
