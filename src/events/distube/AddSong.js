const { EmbedBuilder } = require('discord.js');

/**
 * Action to attach
 * @param {import('distube').Queue} queue
 * @param {import('distube').Song} song
 */
const callbackAction = (queue, song) => {
	const songName = song.name?.trim();
	const message = new EmbedBuilder()
		.setColor('#dfa290')
		.setAuthor({
			name: 'New Song Added',
		})
		.setDescription(`<@${song.user?.id}> has added '${songName}' to the queue.`);

	queue.textChannel?.send({
		embeds: [message],
		allowedMentions: { users: [] },
	});

	global.clientLogger.log(`${song.user?.tag} added song: ${songName}`);
};

module.exports = {
	name: 'addSong',
	once: true,
	function: callbackAction,
};
