import { ICommand } from 'wokcommands';
import { distube } from '../../index';
import { GuildTextBasedChannel } from 'discord.js';
import { verifyValidVoice } from '../../utils/distube/verifyValidVoice';
import { verifyValidURL } from '../../utils/distube/verifyValidURL';

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

    if (voiceChannel && url) {
      interaction.deferReply({
        ephemeral: true,
      });
      await distube.play(voiceChannel, url, {
        member: member,
        textChannel: interaction.channel as GuildTextBasedChannel,
      });

      await interaction.editReply({
        content: 'Successfully sent request',
      });

      console.log(`Playing: ${url}`);
    }

    // Checks if member is in a voice channel
    verifyValidVoice(voiceChannel, interaction);

    // Checks if url is valid,
    // but already validated through required front-end input
    verifyValidURL(url, interaction);
  },
} as ICommand;
