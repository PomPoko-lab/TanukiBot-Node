import { ICommand } from 'wokcommands';
import { distube } from '../..';
import { isValidVoice } from '../../utils/distube/isValidVoice';
import { isValidQueue } from '../../utils/distube/isValidQueue';
import { GuildIdResolvable } from 'distube';

export default {
  category: 'Music Player',
  description: `Pauses the current queue.`,
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
        songQueue?.pause();
        interaction.editReply({
          content: 'Successfully paused the queue',
        });

        setTimeout(() => {
          interaction.deleteReply();
        }, 5000);
      } catch (err) {
        await songQueue.stop();
        interaction.editReply({
          content: 'Something went wrong..',
        });
      }
    }
  },
} as ICommand;
