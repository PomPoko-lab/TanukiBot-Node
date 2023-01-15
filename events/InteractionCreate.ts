import { BaseInteraction, Events } from 'discord.js';
import { IExtendedClient } from '../Interface/IExtendedClient';
import { ICommand } from '../Interface/ICommand';
import { logEvent } from '../utils/Logger';
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

		if (!command) return console.log(`Couldn't find a matching command`);

		// Execute the command async
		try {
			console.log(
				`${logEvent()}Executing command for ${
					interaction.user.username
				}#${interaction.user.discriminator}: '${
					interaction.commandName
				}'`
			);
			await command.function(
				interaction,
				globalThis.client,
				globalThis.distube
			);
		} catch (e) {
			console.log(
				`${logEvent()}[ERROR] Something went wrong executing command: '${
					interaction.commandName
				}'`
			);
		}
	},
};
