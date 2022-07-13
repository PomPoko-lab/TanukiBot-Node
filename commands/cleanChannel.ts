import { ICommand } from 'wokcommands';

export default {
  category: 'Maintenance',
  name: 'CleanTextChannel',
  description: 'Deletes posts in a channel.',
  permissions: ['ADMINISTRATOR'],
  slash: true,
  testOnly: true,
  guildOnly: true,
  minArgs: 1,
  maxArgs: 1,
  expectedArgs: '<amount>',
  expectedArgsTypes: ['INTEGER'],
  syntaxError: {
    english: 'Please specify a number of messages to delete.',
  },

  callback: async ({ channel, interaction, args }) => {
    const numToDel = +args.shift()!;
    const lastMessage = channel.lastMessageId;

    if (!lastMessage) return;
    if (numToDel === 0) {
      return interaction.reply({
        content: 'Input cannot be 0.',
        ephemeral: true,
      });
    }

    if (numToDel > 100) {
      return interaction.reply({
        content: 'Input cannot be greater than 100.',
        ephemeral: true,
      });
    }

    try {
      interaction.deferReply({
        ephemeral: true,
      });

      const messages = await channel.messages.fetch({
        limit: numToDel,
      });

      for (const [_, message] of messages) {
        await message.delete();
      }

      interaction.editReply({
        content: `Successfully deleted ${messages.size} messages.`,
      });
    } catch (err) {
      console.error(err);
      interaction.reply({
        content: 'Something went wrong..',
        ephemeral: true,
      });
    }
  },
} as ICommand;
