const { userInChannel, hasQueue } = require('../utils/ValidateChannel');
const { SlashCommandBuilder } = require('discord.js');
const { commands } = require('../commandDescriptions.json');

/**
 * Action to attach
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 * @param {import('../classes/ExtendedClient')} client
 * @param {import('distube').DisTube} distube
 * @returns
 */
const callbackAction = async (interaction, client, distube) => {
	// @ts-ignore
	const songQueue = distube.getQueue(interaction.guildId);
	const playingChannel = songQueue?.voiceChannel;
	/** @type {import('discord.js').VoiceBasedChannel} */
	// @ts-ignore
	const memberChannel = interaction?.member?.voice.channel;

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
			global.clientLogger.error(err);
		}
	}
};

const {
	'DisTube - Stop Song': { name: commandName, description: commandDesc, devOnly, enabled },
} = commands;

module.exports = {
	name: new SlashCommandBuilder().setName(commandName).setDescription(commandDesc),
	devOnly,
	enabled,
	function: callbackAction,
};
