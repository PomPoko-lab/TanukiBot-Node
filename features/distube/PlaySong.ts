import { MessageEmbed } from 'discord.js';
import { distube } from '../..';

export default () => {
  distube.on('playSong', (queue, song) => {
    const message = new MessageEmbed()
      .setColor('#dfa290')
      .setTitle(`[${song.formattedDuration}] - ${song.name?.trim()}`)
      .setURL(song.url)
      .setAuthor({
        name: 'Now Playing:',
      })
      .setThumbnail(song.thumbnail!)
      .addField('Requested by:', song.user?.username as string, true)
      .addField('Queue duration:', queue.formattedDuration, true);

    queue.songs.length > 1 &&
      message.addField('Next Song:', queue.songs[1].name?.trim() as string);

    queue.textChannel?.send({
      embeds: [message],
    });
  });
};
