import { ICommand } from 'wokcommands';
import GymDayModel from '../../models/GymDayModel';

export default {
  category: 'Workout',
  description: 'Marks your workout routine for the day as completed.',
  slash: true,
  testOnly: true,
  guildOnly: true,
  callback: async ({ interaction }) => {
    try {
      await interaction.deferReply();

      const updateCompletedDay = await GymDayModel.findOneAndUpdate(
        {
          userId: interaction.user.id,
          completed: false,
        },
        { completed: true }
      );

      if (!updateCompletedDay) {
        await interaction.editReply(
          `Couldn't record your gym session, run getGymSession first before running this command.`
        );
        return;
      }

      await interaction.editReply({
        content: `Successfully recorded your gym session for the day.`,
      });
    } catch (err) {
      console.error(err);
    }
  },
} as ICommand;
