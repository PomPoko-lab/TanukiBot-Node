import { CommandInteraction, VoiceBasedChannel } from 'discord.js';

export const isValidVoice = (
  voiceChannel: VoiceBasedChannel | null | undefined,
  interaction: CommandInteraction
) => {
  !voiceChannel &&
    interaction.reply({
      content: 'No voice channel detected.',
      ephemeral: true,
    });
  return voiceChannel;
};
