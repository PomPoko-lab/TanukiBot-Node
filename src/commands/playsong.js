const { userInChannel, isValidUrl } = require('../utils/ValidateChannel');
const { SlashCommandBuilder } = require('discord.js');
const { commands } = require('../commandDescriptions.json');

const {
	'DisTube - Play Song': { name: commandName, description: commandDesc, devOnly, enabled },
} = commands;

/**
 * Action to attach
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 * @param {import('../classes/ExtendedClient')} client
 * @param {import('distube').DisTube} distube
 * @returns
 */
const callbackAction = async (interaction, client, distube) => {
	/** @type {import('discord.js').VoiceBasedChannel} */
	// @ts-ignore
	const voiceChannel = interaction?.member?.voice.channel;
	const url = interaction.options.getString('url');

	if (!userInChannel(voiceChannel, interaction) && !isValidUrl(url, interaction)) {
		return;
	}

	if (voiceChannel && url) {
		try {
			await interaction.deferReply();
			await distube.play(voiceChannel, url, {
				/** @type {import('discord.js').GuildMember} */
				// @ts-ignore
				member: interaction.member,
				/** @type {import('discord.js').GuildTextBasedChannel} */
				// @ts-ignore
				textChannel: interaction.channel,
			});

			interaction.deleteReply();
		} catch (err) {
			interaction.editReply(`Couldn't play the song. Something went wrong.`);
			global.clientLogger.error(err);
		}
	}
};

module.exports = {
	name: new SlashCommandBuilder()
		.setName(commandName)
		.setDescription(commandDesc)
		.addStringOption((option) => option.setName('url').setDescription('url of song from')),
	devOnly,
	enabled,
	function: callbackAction,
};
