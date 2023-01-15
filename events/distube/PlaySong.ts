import { Queue, Song } from 'distube';
import { EmbedBuilder } from 'discord.js';

module.exports = {
	name: 'playSong',
	once: true,
	function: (queue: Queue, song: Song) => {
		const songName = song.name?.trim();
		const message = new EmbedBuilder()
			.setColor('#dfa290')
			.setTitle(`[${song.formattedDuration}] - ${songName}`)
			.setURL(song.url)
			.setAuthor({
				name: 'Now Playing:',
			})
			.setThumbnail(song.thumbnail!)
			.addFields(
				{
					name: 'Requested by:',
					value: `${song.user?.username as string}`,
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
	},
};
