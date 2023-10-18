const { EmbedBuilder } = require('discord.js');

const clientLogger = require('../../utils/ClientLogger');

/**
 * Action to attach
 * @param {import('distube').Queue} queue
 * @param {import('distube').Playlist} playlist
 */
const callbackAction = (queue, playlist) => {
	const message = new EmbedBuilder()
		.setColor('#dfa290')
		.setAuthor({
			name: 'New Playlist Added',
		})
		.setDescription(
			`<@${playlist.user?.id}> has added '${playlist.name.trim()}' to the queue. - (${
				playlist.songs.length
			} songs)`
		);

	queue.textChannel?.send({
		embeds: [message],
		allowedMentions: { users: [] },
	});

	clientLogger.error(`${playlist.member?.displayName}#${playlist.user?.tag} added ${playlist.songs.length} to the queue
	}`);
};

module.exports = {
	name: 'addList',
	once: true,
	function: callbackAction,
};
