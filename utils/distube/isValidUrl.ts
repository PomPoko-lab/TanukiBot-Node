import { CommandInteraction } from 'discord.js';

export const isValidUrl = (
  url: string | null | undefined,
  interaction: CommandInteraction
) => {
  !url &&
    interaction.reply({
      content: 'No valid URL or search detected.',
      ephemeral: true,
    });
  return url;
};
