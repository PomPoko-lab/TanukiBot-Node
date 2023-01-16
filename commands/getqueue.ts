import {
	ChatInputCommandInteraction,
	EmbedBuilder,
	GuildMember,
	SlashCommandBuilder,
} from 'discord.js';

import { userInChannel, hasQueue } from '../utils/ValidateChannel';

import DisTube, { GuildIdResolvable } from 'distube';
import { IExtendedClient } from '../Interface/IExtendedClient';
import { ICommand } from '../Interface/ICommand';

module.exports = {
	name: new SlashCommandBuilder()
		.setName('getqueue')
		.setDescription('Gets the current queue'),
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
				const queueList = songQueue?.songs;

				const list = queueList.slice(1, 9).map((song, i) => {
					return `${i + 2}. [${song.name}](${song.url}) [${
						song.formattedDuration
					}]\n`;
				});

				const songListEmbed = new EmbedBuilder()
					.setColor('#dfa290')
					.setTitle('Playlist')
					.setDescription(
						`${
							list.length !== 0
								? list.join(' ')
								: 'No additional songs to display'
						}\n`
					)
					.addFields(
						{
							name: '\u200B',
							value: '\u200B',
						},
						{
							name: 'Current Song:',
							value: `1. [${queueList[0].name}](${queueList[0].url}) [${queueList[0].formattedDuration}]`,
						},
						{
							name: 'Songs in queue:',
							value: `${queueList.length}`,
							inline: true,
						},
						{
							name: 'Queue duration:',
							value: `${songQueue.formattedDuration}`,
							inline: true,
						}
					);

				interaction.editReply({ embeds: [songListEmbed] });
			} catch (err) {
				clientLogger.error(err);
			}
		}
	},
} as ICommand;
