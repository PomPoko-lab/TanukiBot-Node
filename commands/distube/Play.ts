import { ICommand } from 'wokcommands';
import { distube } from '../../index';
import { GuildTextBasedChannel } from 'discord.js';

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

  callback: async ({ interaction, member }) => {
    const voiceChannel = member.voice.channel;
    const url = interaction.options.getString('url');
    interaction.deferReply({
      ephemeral: true,
    });

    if (voiceChannel && url) {
      await distube.play(voiceChannel, url, {
        member: member,
        textChannel: interaction.channel as GuildTextBasedChannel,
      });
      console.log(`Playing: ${url}`);
    }

    await interaction.editReply({
      content: 'Successfully sent request',
    });
  },
} as ICommand;
