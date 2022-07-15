import { ICommand } from 'wokcommands';
import { distube } from '../..';

export default {
  description: `Stops and exits the music player.`,
  category: 'Music Player',
  slash: true,
  testOnly: true,
  guildOnly: true,

  callback: ({ interaction, member, guild }) => {
    const songQueue = distube.getQueue(guild?.id!);
    const playingChannel = songQueue?.voiceChannel;
    const memberChannel = member.voice.channel;

    if (!songQueue) return;

    memberChannel === playingChannel &&
      songQueue.stop().then(() =>
        interaction.reply({
          content: 'Successfully stopped the music player.',
          ephemeral: true,
        })
      );

    // Checks if member is in a voice channel
    !memberChannel &&
      interaction.reply({
        content: 'No voice channel detected.',
        ephemeral: true,
      });
  },
} as ICommand;
