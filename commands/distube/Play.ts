import { ICommand } from 'wokcommands';
import { distube } from '../../index';

export default {
  description: `Play a YoutubeURL or search.`,
  category: 'Music Player',
  slash: true,
  testOnly: true,
  guildOnly: true,
  minArgs: 1,
  maxArgs: 1,
  expectedArgs: '<url>',
  expectedArgsTypes: ['STRING'],

  callback: ({ interaction, member }) => {
    const voiceChannel = member.voice.channel;
    const url = interaction.options.getString('url');

    if (voiceChannel && url) {
      distube.play(voiceChannel, url);
    }

    console.log(`Playing: ${url}`);
  },
} as ICommand;
