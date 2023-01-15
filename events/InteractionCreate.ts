import { BaseInteraction, Events } from 'discord.js';
import { IExtendedClient } from '../Interface/IExtendedClient';
import { ICommand } from '../Interface/ICommand';
import DisTube from 'distube';

declare global {
	var client: IExtendedClient;
	var distube: DisTube;
}

module.exports = {
	name: Events.InteractionCreate,
	function: async (interaction: BaseInteraction) => {
		// Check whether the interaction is a command
		// If not, return
		if (!interaction.isChatInputCommand()) return;

		// Match the interaction string to the name of the command
		const client = interaction.client as IExtendedClient;
		const command = client.commands!.get(
			interaction.commandName
		) as ICommand;

		if (!command)
			return clientLogger.error(`Couldn't find a matching command`);

		// Execute the command async
		try {
			clientLogger.log(
				`Executing command for ${interaction.user.username}#${interaction.user.discriminator}: '${interaction.commandName}'`
			);
			await command.function(
				interaction,
				globalThis.client,
				globalThis.distube
			);
		} catch (e) {
			clientLogger.error(
				`Something went wrong executing command: '${interaction.commandName}'`
			);
		}
	},
};
