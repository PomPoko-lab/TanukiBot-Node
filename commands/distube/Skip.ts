import { ICommand } from 'wokcommands';
import { distube } from '../..';

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

    if (!songQueue) return;

    if (memberChannel === playingChannel) {
      songQueue
        ?.skip()
        .then(() =>
          interaction.reply({
            content: 'Playing next song..',
            ephemeral: true,
          })
        )
        .catch((err) => {
          songQueue.stop();
          interaction.reply({
            content: 'No next song in queue, stopping player now..',
            ephemeral: true,
          });
        });
    }
  },
} as ICommand;
