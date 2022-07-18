import { MessageEmbed } from 'discord.js';
import { Queue, Song } from 'distube';
import { distube } from '../..';

export default () => {
  distube.on('playSong', (queue: Queue, song: Song) => {
    const message = new MessageEmbed()
      .setColor('#dfa290')
      .setTitle(`[${song.formattedDuration}] - ${song.name}`)
      .setURL(song.url)
      .setAuthor({
        name: 'Now Playing:',
      })
      .setThumbnail(song.thumbnail!)
      .addField('Requested by:', song.user?.username as string);

    queue.songs.length > 1 &&
      message.addField('Next Song:', queue.songs[1].name as string);

    queue.textChannel?.send({
      embeds: [message],
      allowedMentions: {
        users: [],
      },
    });
  });
};
