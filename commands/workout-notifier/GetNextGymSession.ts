import { ICommand } from 'wokcommands';
import getNextGymSession from '../../utils/workout/getNextGymSession';
import { TextChannel } from 'discord.js';

export default {
  category: 'Workout',
  description: 'Gets the next work out day in your routine.',
  slash: true,
  testOnly: true,
  guildOnly: true,
  callback: async ({ interaction }) => {
    const channel = interaction.channel as TextChannel;

    getNextGymSession(interaction.user, channel);
  },
} as ICommand;
