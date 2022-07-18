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
      .addFields(
        {
          name: 'Requested by: ',
          value: song.user?.username as string,
        },
        {
          name: 'Next Song:',
          value: `${queue.songs.length > 1 ? queue.songs[1].name : 'None'}`,
        }
      );

    queue.textChannel?.send({
      embeds: [message],
      allowedMentions: {
        users: [],
      },
    });
  });
};
