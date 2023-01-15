import { Playlist, Queue } from 'distube';
import { EmbedBuilder } from 'discord.js';

module.exports = {
	name: 'addList',
	once: true,
	function: (queue: Queue, playlist: Playlist) => {
		const message = new EmbedBuilder()
			.setColor('#dfa290')
			.setAuthor({
				name: 'New Playlist Added',
			})
			.setDescription(
				`<@${
					playlist.user?.id
				}> has added '${playlist.name.trim()}' to the queue. - (${
					playlist.songs.length
				} songs)`
			);

		queue.textChannel?.send({
			embeds: [message],
			allowedMentions: { users: [] },
		});

		clientLogger.error(`${playlist.member?.displayName}#${playlist.user?.tag} added ${playlist.songs.length} to the queue
		}`);
	},
};
