import { ICommand } from 'wokcommands';
import { distube } from '../..';

export default {
  description: `Skips song.`,
  category: 'Music Player',
  slash: true,
  testOnly: true,
  guildOnly: true,

  callback: ({ interaction, member, guild }) => {
    const songQueue = distube.getQueue(guild?.id!);
    const playingChannel = songQueue?.voiceChannel;
    const memberChannel = member.voice.channel;

    if (!songQueue) return;

    if (memberChannel === playingChannel) {
      songQueue?.skip().catch((err) => {
        songQueue.stop();
      });
    }
  },
} as ICommand;
