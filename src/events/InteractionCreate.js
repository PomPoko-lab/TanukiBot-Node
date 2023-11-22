const { Events } = require('discord.js');

const clientLogger = require('../utils/classes/ClientLogger');

/**
 * Action to attach
 * @param {import('discord.js').BaseInteraction} interaction
 * @returns
 */
const callbackAction = async (interaction) => {
	// Check whether the interaction is a command
	// If not, return

	// Match the interaction string to the name of the command
	/** @type {import('../classes/utils/ExtendedClient')} */
	// @ts-ignore
	const client = interaction.client;

	switch (true) {
		case interaction.isChatInputCommand():
			if (!interaction.isChatInputCommand()) return;

			/** @type {import('../Interface/ICommand').ICommand} */
			const command = client.commands.get(interaction.commandName);

			if (!command)
				return clientLogger.error(`Couldn't find a matching command`);

			// Execute the command async
			try {
				clientLogger.log(
					`Executing command for ${interaction.user.username}#${interaction.user.discriminator}: '${interaction.commandName}'`
				);
				await command.function(
					interaction,
					global.client,
					global.distube,
					global.db
				);
			} catch (e) {
				clientLogger.error(
					`Something went wrong executing command: '${interaction.commandName}'`
				);
			}
			break;

		case interaction.isStringSelectMenu():
			if (!interaction.isStringSelectMenu()) return;

		// /**
		//  * @type {string}
		//  */
		// // @ts-ignore
		// const commandName = interaction.message.interaction?.commandName;
		// const componentID = interaction.customId;

		// const commandClass = require(`../classes/commands/${commandName}`);
		// /**
		//  * @type {import('../classes/commands/basecommand')}
		//  */
		// const commandInstance = new commandClass();
		// commandInstance.parseComponentAction(interaction, componentID);

		default:
			break;
	}
};

module.exports = {
	name: Events.InteractionCreate,
	function: callbackAction,
};
