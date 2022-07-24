import { ICommand } from 'wokcommands';
import GymDayModel from '../Models/GymDayModel';
import getGymDayEmbed from '../Views/getGymDayEmbed';

export default {
  category: 'Workout',
  description: 'Gets the next work out day in your routine.',
  slash: true,
  testOnly: true,
  guildOnly: true,
  callback: async ({ interaction }) => {
    // Gets the next Gym Day, if all completed, resets all the false
    // and returns next day
    const getNextDay = async () => {
      let nextDay = await GymDayModel.findOne({
        userId: interaction.user.id,
        completed: false,
      });

      if (!nextDay) {
        await GymDayModel.updateMany(
          {
            userId: interaction.user.id,
            completed: true,
          },
          { completed: false }
        );

        return await GymDayModel.findOne({
          userId: interaction.user.id,
          completed: false,
        });
      }

      return nextDay;
    };

    try {
      await interaction.deferReply();
      const nextGymDay = await getNextDay();

      const embed = getGymDayEmbed(nextGymDay!);

      await interaction.editReply({
        content: `Your work out routine for today.`,
      });

      interaction.followUp({
        embeds: [embed],
      });
    } catch (err) {
      console.error(err);
    }
  },
} as ICommand;
