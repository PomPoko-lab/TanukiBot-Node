import { ICommand } from 'wokcommands';
import { distube } from '../..';
import { isValidVoice } from '../../utils/distube/isValidVoice';
import { isValidQueue } from '../../utils/distube/isValidQueue';
import { GuildIdResolvable } from 'distube';

export default {
  description: `Skips song.`,
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
        await songQueue?.skip();
        interaction.editReply({
          content: 'Playing next song..',
        });

        setTimeout(() => interaction.deleteReply, 5000);
      } catch (err) {
        await songQueue.stop();
        interaction.editReply({
          content: 'No next song in queue, stopping player now..',
        });
      }
    }
  },
} as ICommand;
