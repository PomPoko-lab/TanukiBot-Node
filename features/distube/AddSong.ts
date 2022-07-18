// When a new song is added to the player,
// Display an embed saying '@username has added @songname to the queue.'

import { distube } from '../..';
import { MessageEmbed } from 'discord.js';

export default () => {
  distube.on('addSong', (queue, song) => {
    const message = new MessageEmbed()
      .setColor('#dfa290')
      .setAuthor({
        name: 'New Song Added',
      })
      .setDescription(
        `<@${song.user?.id}> has added '${song.name}' to the queue.`
      );

    queue.textChannel?.send({
      embeds: [message],
      allowedMentions: { users: [] },
    });
  });
};
