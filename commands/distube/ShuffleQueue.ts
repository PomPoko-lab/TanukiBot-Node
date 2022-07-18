import { ICommand } from 'wokcommands';
import { distube } from '../..';
import { isValidVoice } from '../../utils/distube/isValidVoice';
import { isValidQueue } from '../../utils/distube/isValidQueue';
import { GuildIdResolvable } from 'distube';
import { MessageEmbed } from 'discord.js';

export default {
  description: `Shuffles the current queue.`,
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

        if (queueList.length > 1) {
          const shuffledQueue = await songQueue.shuffle();
          const shuffledList = shuffledQueue.songs;

          const list = shuffledList.slice(1, 9).map((song, i) => {
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
            .addField('\u200B', '\u200B')
            .addField(
              'Current Song:',
              `1. [${queueList[0].name}](${queueList[0].url}) [${queueList[0].formattedDuration}]`
            );

          interaction.editReply({ embeds: [songListEmbed] });
        } else {
          interaction.editReply({
            content: 'Playlist shuffle was unsuccessful.',
          });
          setTimeout(() => interaction.deleteReply, 5000);
        }
      } catch (err) {
        console.error(err);
      }
    }
  },
} as ICommand;
