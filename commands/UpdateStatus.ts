import { ICommand } from 'wokcommands';

export default {
  description: `Sets the bot's playing status.`,
  category: 'Maintenance',
  permissions: ['ADMINISTRATOR'],
  slash: true,
  testOnly: true,
  guildOnly: true,
  minArgs: 1,
  maxArgs: 1,
  expectedArgs: '<status>',
  expectedArgsTypes: ['STRING'],
  callback: ({ client, interaction }) => {
    const setStatus = interaction.options.getString('status');

    if (!setStatus) return;
    client.user?.setPresence({
      activities: [
        {
          name: setStatus,
        },
      ],
    });

    const newStatus = client.user?.presence.activities.shift()?.name;

    interaction.reply({
      content: `I'm now playing ${newStatus}.`,
      ephemeral: true,
    });
  },
} as ICommand;
