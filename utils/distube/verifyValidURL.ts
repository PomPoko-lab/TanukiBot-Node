import { CommandInteraction } from 'discord.js';

export const verifyValidURL = (
  url: string | null | undefined,
  interaction: CommandInteraction
) => {
  !url &&
    interaction.reply({
      content: 'No valid URL or search detected.',
      ephemeral: true,
    });
};
