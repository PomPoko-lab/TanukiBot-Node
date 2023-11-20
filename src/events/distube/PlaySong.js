const { EmbedBuilder } = require('discord.js');

const clientLogger = require('../../utils/classes/ClientLogger');

/**
 * Action to attach
 * @param {import('distube').Queue} queue
 * @param {import('distube').Song} song
 */
const callbackAction = (queue, song) => {
	const songName = song.name?.trim();
	const message = new EmbedBuilder()
		.setColor('#dfa290')
		.setTitle(`[${song.formattedDuration}] - ${songName}`)
		.setURL(song.url)
		.setAuthor({
			name: 'Now Playing:',
		})
		// @ts-ignore
		.setThumbnail(song.thumbnail)
		.addFields(
			{
				name: 'Requested by:',
				value: `${song.user?.username}`,
				inline: true,
			},
			{
				name: 'Queue duration',
				value: `${queue.formattedDuration}`,
				inline: true,
			}
		);

	queue.songs.length > 1 &&
		message.addFields({
			name: 'Next Song:',
			value: `${queue.songs[1].name?.trim()}`,
		});

	queue.textChannel?.send({
		embeds: [message],
	});

	clientLogger.log(`Now playing: ${songName}`);
};

module.exports = {
	name: 'playSong',
	once: true,
	function: callbackAction,
};
