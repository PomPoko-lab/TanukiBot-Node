import { ICommand } from 'wokcommands';
import { distube } from '../..';
import { isValidVoice } from '../../utils/distube/isValidVoice';
import { isValidQueue } from '../../utils/distube/isValidQueue';
import { GuildIdResolvable } from 'distube';
import { MessageEmbed } from 'discord.js';

export default {
  description: `Gets the current queue.`,
  category: 'Music Player',
  slash: true,
  testOnly: true,
  guildOnly: true,

  callback: async ({ interaction, member, guild }) => {
    const songQueue = distube.getQueue(guild?.id as GuildIdResolvable);
    const playingChannel = songQueue?.voiceChannel;
    const memberChannel = member.voice.channel;

    // Checks if member is in a voice channel
    if (!isValidVoice(memberChannel, interaction)) return;

    // Checks if currently playing
    if (!isValidVoice(playingChannel, interaction)) return;

    // Checks if queue is valid
    if (!isValidQueue(songQueue, interaction)) return;

    if (memberChannel === playingChannel && songQueue) {
      await interaction.deferReply();
      try {
        const queueList = await songQueue?.songs;

        const list = queueList.slice(1, 9).map((song, i) => {
          return `${i + 2}. [${song.name}](${song.url}) [${
            song.formattedDuration
          }]\n`;
        });

        const songListEmbed = new MessageEmbed()
          .setColor('#dfa290')
          .setTitle('Playlist')
          .setDescription(`${list.join(' ')}\n`)
          .addField('\u200B', '\u200B')
          .addField(
            'Current Song:',
            `1. [${queueList[0].name}](${queueList[0].url}) [${queueList[0].formattedDuration}]`
          );

        interaction.editReply({ embeds: [songListEmbed] });
      } catch (err) {
        console.error(err);
      }
    }
  },
} as ICommand;
