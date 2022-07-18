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
        const queueList = songQueue?.songs;

        const list = queueList.slice(1, 9).map((song, i) => {
          return `${i + 2}. [${song.name}](${song.url}) [${
            song.formattedDuration
          }]\n`;
        });

        const songListEmbed = new MessageEmbed()
          .setColor('#dfa290')
          .setTitle('Playlist')
          .setDescription(
            `${
              list.length !== 0
                ? list.join(' ')
                : 'No additional songs to display'
            }\n`
          )
          .addFields(
            {
              name: '\u200B',
              value: '\u200B',
            },
            {
              name: 'Current Song:',
              value: `1. [${queueList[0].name}](${queueList[0].url}) [${queueList[0].formattedDuration}]`,
            },
            {
              name: 'Songs in queue:',
              value: `${queueList.length}`,
              inline: true,
            },
            {
              name: 'Queue duration:',
              value: `${songQueue.formattedDuration}`,
              inline: true,
            }
          );

        interaction.editReply({ embeds: [songListEmbed] });
      } catch (err) {
        console.error(err);
      }
    }
  },
} as ICommand;
