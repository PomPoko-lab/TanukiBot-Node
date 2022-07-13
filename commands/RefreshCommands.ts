import { ICommand } from 'wokcommands';
export default {
  description: `Refreshes the bot's command cache. REQUIRES A MANUAL RESTART.`,
  category: 'Maintenance',
  permissions: ['ADMINISTRATOR'],
  slash: true,
  testOnly: true,
  guildOnly: true,
  callback: ({ interaction, client, guild }) => {
    client.application?.commands.set([]);
    guild?.commands.set([]);
    interaction.reply({
      content: `Completed refreshing command's cache, please restart the bot.`,
      ephemeral: true,
    });
  },
} as ICommand;
