const { userInChannel, hasQueue } = require('../utils/ValidateChannel.js');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { commands } = require('../commandDescriptions.json');

const {
	'DisTube - Shuffle Queue': { name: commandName, description: commandDesc, devOnly, enabled },
} = commands;

/**
 * Action to attach
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 * @param {import('../classes/ExtendedClient')} client
 * @param {import('distube').DisTube} distube
 * @returns
 */
const callbackAction = async (interaction, client, distube) => {
	const member = interaction.member;
	const guild = interaction.guild;

	if (!member || !guild) return;

	const songQueue = distube.getQueue(guild);
	const playingChannel = songQueue?.voiceChannel;

	/** @type {import('discord.js').VoiceBasedChannel} */
	// @ts-ignore
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
					return `${i + 2}. [${song.name}](${song.url}) [${song.formattedDuration}]\n`;
				});

				const songListEmbed = new EmbedBuilder()
					.setColor('#dfa290')
					.setTitle('Playlist')
					.setDescription(
						`${list.length !== 0 ? list.join(' ') : 'No additional songs to display'}\n`
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
			global.clientLogger.error(err);
		}
	}
};

module.exports = {
	name: new SlashCommandBuilder().setName(commandName).setDescription(commandDesc),
	devOnly,
	enabled,
	function: callbackAction,
};
