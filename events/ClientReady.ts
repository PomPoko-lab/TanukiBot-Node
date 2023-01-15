import { Events, ActivityType } from 'discord.js';
import { IExtendedClient } from '../Interface/IExtendedClient';
import { logEvent } from '../utils/Logger';

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
		console.log(
			`\n${logEvent()}Successfully logged in as ${client.user?.tag}\n`
		);
	},
};
