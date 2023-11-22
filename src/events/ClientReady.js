const { Events, ActivityType } = require('discord.js');

const clientLogger = require('../utils/classes/ClientLogger');

/**
 * Action to attach
 * @param {import('../classes/utils/ExtendedClient')} client
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
	clientLogger.log(`Successfully logged in as ${client.user?.tag}\n`);
};

module.exports = {
	name: Events.ClientReady,
	once: true,
	function: callbackAction,
};
