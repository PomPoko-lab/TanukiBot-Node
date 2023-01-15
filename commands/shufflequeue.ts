import {
	ChatInputCommandInteraction,
	EmbedBuilder,
	GuildMember,
	SlashCommandBuilder,
} from 'discord.js';

import { userInChannel, hasQueue } from '../utils/ValidateChannel';

import DisTube, { GuildIdResolvable } from 'distube';
import { IExtendedClient } from '../Interface/IExtendedClient';

module.exports = {
	name: new SlashCommandBuilder()
		.setName('shufflequeue')
		.setDescription('Shuffles the current queue'),
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

				if (queueList.length > 1) {
					const shuffledQueue = await songQueue.shuffle();
					const shuffledList = shuffledQueue.songs;

					const list = shuffledList.slice(1, 9).map((song, i) => {
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
						.addFields([
							{
								name: '\u200B',
								value: '\u200B',
							},
							{
								name: 'Current Song:',
								value: `1. [${queueList[0].name}](${queueList[0].url}) [${queueList[0].formattedDuration}]`,
							},
						]);

					interaction.editReply({ embeds: [songListEmbed] });
				} else {
					interaction.editReply({
						content: 'Playlist shuffle was unsuccessful.',
					});
					setTimeout(() => interaction.deleteReply, 5000);
				}
			} catch (err) {
				clientLogger.error(err);
			}
		}
	},
};
