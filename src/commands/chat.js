const { SlashCommandBuilder } = require('discord.js');
const OpenAI = require('../classes/OpenAI');
const { commands } = require('../commandDescriptions.json');

const clientLogger = require('../utils/classes/ClientLogger');

const {
	'OpenAI - Chat': { name: commandName, description: commandDesc, devOnly, enabled },
} = commands;

/**
 * Action to attach
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 * @param {import('../classes/ExtendedClient')} client
 * @param {import('distube').DisTube} distube
 * @returns
 */
const callbackAction = async (interaction, client, distube) => {
	const openai = new OpenAI();
	const prompt = interaction.options.getString('prompt');

	if (!prompt) {
		return interaction.reply('No prompt specifed.');
	}

	try {
		clientLogger.log(`${interaction.user.username} sent a prompt to openAI. Prompt: ${prompt}`);
		await interaction.reply("Processing your prompt.. You'll be notified when it is ready.");

		const response = await openai.getLanguageResponse(prompt);

		if (!response) {
			clientLogger.error('OpenAI response was undefined.');
			return await interaction.channel?.send({
				content: `<@${interaction.user.id}>, something went wrong processing your prompt for: ${prompt}`,
			});
		}

		let notificationMessage = await interaction.channel?.send({
			content: `<@${interaction.user.id}>, your AI response is ready for prompt: ${prompt}.`,
		});

		if (notificationMessage) {
			await notificationMessage.reply(response);
		}
	} catch (err) {
		clientLogger.error(err);
	}
};

module.exports = {
	name: new SlashCommandBuilder()
		.setName(commandName)
		.setDescription(commandDesc)
		.addStringOption((option) =>
			option.setName('prompt').setDescription('Input prompt').setRequired(true)
		),
	devOnly,
	enabled,
	function: callbackAction,
};
