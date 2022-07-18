import { ICommand } from 'wokcommands';
export default {
  description: `Refreshes the bot's command cache. REQUIRES A MANUAL RESTART.`,
  category: 'Maintenance',
  permissions: ['ADMINISTRATOR'],
  slash: true,
  testOnly: true,
  guildOnly: true,
  callback: async ({ interaction, client, guild }) => {
    try {
      await interaction.deferReply({
        ephemeral: true,
      });
      client.application?.commands.set([]);
      guild?.commands.set([]);
      interaction.editReply({
        content: `Completed refreshing command's cache, please restart the bot.`,
      });
    } catch (err) {
      console.error(err);
    }
  },
} as ICommand;
