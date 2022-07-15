import { CommandInteraction, VoiceBasedChannel } from 'discord.js';
import { Queue } from 'distube';

export const verifyValidQueue = (
  queue: Queue | null | undefined,
  interaction: CommandInteraction
) => {
  !queue &&
    interaction.reply({
      content: 'No current queue detected.',
      ephemeral: true,
    });
};
