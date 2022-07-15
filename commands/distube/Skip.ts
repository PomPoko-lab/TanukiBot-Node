import { ICommand } from 'wokcommands';
import { distube } from '../..';
import { verifyValidVoice } from '../../utils/distube/verifyValidVoice';
import { verifyValidQueue } from '../../utils/distube/verifyValidQueue';

export default {
  description: `Skips song.`,
  category: 'Music Player',
  slash: true,
  testOnly: true,
  guildOnly: true,

  callback: async ({ interaction, member, guild }) => {
    const songQueue = distube.getQueue(guild?.id!);
    const playingChannel = songQueue?.voiceChannel;
    const memberChannel = member.voice.channel;

    // Checks if member is in a voice channel
    verifyValidVoice(memberChannel, interaction);

    // Checks if queue is valid
    verifyValidQueue(songQueue, interaction);

    if (memberChannel === playingChannel && songQueue) {
      await interaction.deferReply({ ephemeral: true });
      try {
        await songQueue?.skip();
        interaction.editReply({
          content: 'Playing next song..',
        });
      } catch (err) {
        await songQueue.stop();
        interaction.editReply({
          content: 'No next song in queue, stopping player now..',
        });
      }
    }
  },
} as ICommand;
