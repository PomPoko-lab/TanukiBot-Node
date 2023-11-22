const { SlashCommandBuilder } = require('discord.js');
const { userInChannel, hasQueue } = require('../utils/classes/ValidateChannel');
const { commands } = require('../commandDescriptions.json');

const {
	'DisTube - Pause Queue': { name: commandName, description: commandDesc, devOnly, enabled },
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
			songQueue?.pause();
			interaction.editReply({
				content: 'Successfully paused the queue',
			});

			setTimeout(() => {
				interaction.deleteReply();
			}, 5000);
		} catch (err) {
			await songQueue.stop();
			interaction.editReply({
				content: 'Something went wrong..',
			});
		}
	}
};

module.exports = {
	name: new SlashCommandBuilder().setName(commandName).setDescription(commandDesc),
	devOnly,
	enabled,
	function: callbackAction,
};
