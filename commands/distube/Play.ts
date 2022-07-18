import { ICommand } from 'wokcommands';
import { distube } from '../../index';
import { GuildTextBasedChannel } from 'discord.js';
import { isValidVoice } from '../../utils/distube/isValidVoice';
import { isValidUrl } from '../../utils/distube/isValidURL';

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

    // Checks if member is in a voice channel
    if (!isValidVoice(voiceChannel, interaction)) return;

    // Checks if url is valid,
    // but already validated through required front-end input
    if (!isValidUrl(url, interaction)) return;

    if (voiceChannel && url) {
      try {
        await interaction.deferReply();
        await distube.play(voiceChannel, url, {
          member: member,
          textChannel: interaction.channel as GuildTextBasedChannel,
        });

        interaction.deleteReply();

        console.log(`Playing: ${url}`);
      } catch (err) {
        console.error(err);
      }
    }
  },
} as ICommand;
