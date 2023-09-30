const { Events } = require('discord.js');

/**
 * Action to attach
 * @param {import('discord.js').BaseInteraction} interaction
 * @returns
 */
const callbackAction = async (interaction) => {
	// Check whether the interaction is a command
	// If not, return
	if (!interaction.isChatInputCommand()) return;

	// Match the interaction string to the name of the command
	/** @type {import('../classes/ExtendedClient')} */
	// @ts-ignore
	const client = interaction.client;

	/** @type {import('../Interface/ICommand').ICommand} */
	const command = client.commands.get(interaction.commandName);

	if (!command) return global.clientLogger.error(`Couldn't find a matching command`);

	// Execute the command async
	try {
		global.clientLogger.log(
			`Executing command for ${interaction.user.username}#${interaction.user.discriminator}: '${interaction.commandName}'`
		);
		await command.function(interaction, globalThis.client, globalThis.distube);
	} catch (e) {
		global.clientLogger.error(
			`Something went wrong executing command: '${interaction.commandName}'`
		);
	}
};

module.exports = {
	name: Events.InteractionCreate,
	function: callbackAction,
};
