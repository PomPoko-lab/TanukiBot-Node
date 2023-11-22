const { SlashCommandBuilder } = require('discord.js');
const { userInChannel, hasQueue } = require('../utils/classes/ValidateChannel');
const { commands } = require('../commandDescriptions.json');

const {
	'DisTube - Toggle AutoPlay': { name: commandName, description: commandDesc, devOnly, enabled },
} = commands;

/**
 *
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 * @param {import('../classes/ExtendedClient')} client
 * @param {import('distube').DisTube} distube
 * @returns
 */
const callbackAction = async (interaction, client, distube) => {
	// @ts-ignore
	const voiceChannel = interaction.member.voice.channel;
	const guild = interaction.guild;

	if (!voiceChannel || !guild) return;

	const songQueue = distube.getQueue(guild);
	const playingChannel = songQueue?.voiceChannel;

	// Checks if member is in a voice channel
	if (!userInChannel(voiceChannel, interaction)) return;

	// Checks if currently playing
	if (!userInChannel(playingChannel, interaction)) return;

	// Checks if queue is valid
	if (!hasQueue(songQueue, interaction)) return;

	const results = distube.toggleAutoplay(guild);

	interaction.reply(`Auto play mode has been set to ${results ? 'ON' : 'OFF'}`);
};

module.exports = {
	name: new SlashCommandBuilder().setName(commandName).setDescription(commandDesc),
	devOnly,
	enabled,
	function: callbackAction,
};
