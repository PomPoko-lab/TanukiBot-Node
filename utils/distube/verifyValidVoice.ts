import { CommandInteraction, VoiceBasedChannel } from 'discord.js';

export const verifyValidVoice = (
  voiceChannel: VoiceBasedChannel | null | undefined,
  interaction: CommandInteraction
) => {
  !voiceChannel &&
    interaction.reply({
      content: 'No voice channel detected.',
      ephemeral: true,
    });
};
