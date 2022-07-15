import { CommandInteraction, VoiceBasedChannel } from 'discord.js';

export const verifyValidQueue = (
  voiceChannel: VoiceBasedChannel | null | undefined,
  interaction: CommandInteraction
) => {
  !voiceChannel &&
    interaction.reply({
      content: 'No current queue detected.',
      ephemeral: true,
    });
};
