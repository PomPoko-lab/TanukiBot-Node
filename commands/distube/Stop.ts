import { ICommand } from 'wokcommands';
import { distube } from '../..';
import { verifyValidVoice } from '../../utils/distube/verifyValidVoice';
import { verifyValidQueue } from '../../utils/distube/verifyValidQueue';
import { GuildIdResolvable } from 'distube';

export default {
  description: `Stops and exits the music player.`,
  category: 'Music Player',
  slash: true,
  testOnly: true,
  guildOnly: true,

  callback: async ({ interaction, member, guild }) => {
    const songQueue = distube.getQueue(guild?.id as GuildIdResolvable);
    const playingChannel = songQueue?.voiceChannel;
    const memberChannel = member.voice.channel;

    // Checks if member is in a voice channel
    verifyValidVoice(memberChannel, interaction);

    // Checks if queue is valid
    verifyValidQueue(songQueue, interaction);

    if (memberChannel === playingChannel && songQueue) {
      await interaction.deferReply({ ephemeral: true });
      try {
        await songQueue.stop();

        interaction.editReply({
          content: 'Successfully stopped the music player.',
        });
      } catch (err) {
        console.error(err);
      }
    }
  },
} as ICommand;
