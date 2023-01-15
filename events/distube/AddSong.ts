import { Queue, Song } from 'distube';
import { EmbedBuilder } from 'discord.js';

module.exports = {
	name: 'addSong',
	once: true,
	function: (queue: Queue, song: Song) => {
		const songName = song.name?.trim();
		const message = new EmbedBuilder()
			.setColor('#dfa290')
			.setAuthor({
				name: 'New Song Added',
			})
			.setDescription(
				`<@${song.user?.id}> has added '${songName}' to the queue.`
			);

		queue.textChannel?.send({
			embeds: [message],
			allowedMentions: { users: [] },
		});

		clientLogger.log(`${song.user?.tag} added song: ${songName}`);
	},
};
