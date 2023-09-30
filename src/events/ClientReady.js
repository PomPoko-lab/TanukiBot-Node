const { Events, ActivityType } = require('discord.js');

/**
 * Action to attach
 * @param {import('../classes/ExtendedClient')} client
 */
const callbackAction = (client) => {
	client.user?.setPresence({
		status: 'dnd',
		activities: [
			{
				name: 'with node.js',
				type: ActivityType.Playing,
			},
		],
	});
	global.clientLogger.log(`Successfully logged in as ${client.user?.tag}\n`);
};

module.exports = {
	name: Events.ClientReady,
	once: true,
	function: callbackAction,
};
