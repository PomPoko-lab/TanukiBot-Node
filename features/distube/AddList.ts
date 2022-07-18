// When a new playlist is added to the player,
// Display an embed saying '@username has added @playlistname to the queue. - (@playlistsong number songs)'

import { distube } from '../..';
import { MessageEmbed } from 'discord.js';

export default () => {
  distube.on('addList', (queue, playlist) => {
    const message = new MessageEmbed()
      .setColor('#dfa290')
      .setAuthor({
        name: 'New Playlist Added',
      })
      .setDescription(
        `<@${playlist.user?.id}> has added '${playlist.name}' to the queue. - (${playlist.songs.length} songs)`
      );

    queue.textChannel?.send({
      embeds: [message],
      allowedMentions: { users: [] },
    });
  });
};
