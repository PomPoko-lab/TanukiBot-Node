import { Events, ActivityType } from 'discord.js';
import { IExtendedClient } from '../Interface/IExtendedClient';

module.exports = {
	name: Events.ClientReady,
	once: true,
	function: (client: IExtendedClient) => {
		client.user?.setPresence({
			status: 'dnd',
			activities: [
				{
					name: 'with node.js',
					type: ActivityType.Playing,
				},
			],
		});
		clientLogger.log(`Successfully logged in as ${client.user?.tag}\n`);
	},
};
