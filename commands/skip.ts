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
	'DisTube - Skip Song': { name: commandName, description: commandDesc },
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
		const member = interaction.member as GuildMember;
		const guild = interaction.guild as GuildIdResolvable;

		const songQueue = distube.getQueue(guild);
		const playingChannel = songQueue?.voiceChannel;
		const memberChannel = member.voice.channel;

		// Checks if member is in a voice channel
		if (!userInChannel(memberChannel, interaction)) return;

		// Checks if currently playing
		if (!userInChannel(playingChannel, interaction)) return;

		// Checks if queue is valid
		if (!hasQueue(songQueue, interaction)) return;

		if (memberChannel === playingChannel && songQueue) {
			await interaction.deferReply();
			try {
				await songQueue?.skip();
				interaction.editReply({
					content: 'Playing next song..',
				});

				setTimeout(() => {
					interaction.deleteReply();
				}, 5000);
			} catch (err) {
				await songQueue.stop();
				interaction.editReply({
					content: 'No next song in queue, stopping player now..',
				});
			}
		}
	},
} as ICommand;
