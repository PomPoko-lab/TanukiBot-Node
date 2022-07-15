import { MessageEmbed } from 'discord.js';
import { Queue, Song } from 'distube';
import { distube } from '../..';

export default () => {
  distube.on('playSong', (queue: Queue, song: Song) => {
    const message = new MessageEmbed()
      .setColor('#dfa290')
      .setTitle(`${song.name} : (${song.formattedDuration})`)
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
          value: `${queue.songs.length >= 2 ? queue.songs[1].name : 'None'}`,
        }
      )
      .setTimestamp();

    queue.textChannel?.send({
      embeds: [message],
      allowedMentions: {
        users: [],
      },
    });
  });
};