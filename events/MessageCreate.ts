import { Events, Message } from 'discord.js';
import { IExtendedClient } from '../Interface/IExtendedClient';
import { logEvent } from '../utils/Logger';

module.exports = {
	name: Events.MessageCreate,
	function: async (message: Message) => {
		const client = message.client as IExtendedClient;
		const user = message.author;

		// If user is not the bot return
		// TODO:
		//		- Make sure the bot won't reply to the 2nd bot as well
		//		- A Logging function
		// FIXME
		if (user.id === client.user?.id || user.id === '625404504564695072')
			return;

		if (message.content.includes('deez')) {
			try {
				console.log(
					`${logEvent()}Gave ${user.username}#${
						user.discriminator
					} some of deez nuts..`
				);
				await message.reply('nuts');
			} catch (e) {
				console.log(
					`${logEvent()}[ERROR] Something went wrong executing command: 'deez'`
				);
			}
		}
	},
};
