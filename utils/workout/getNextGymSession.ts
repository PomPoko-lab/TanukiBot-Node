import { TextChannel, User } from 'discord.js';
import GymDayModel from '../../models/GymDayModel';
import getGymDayEmbed from '../../views/getGymDayEmbed';

export default async (user: User, channel: TextChannel) => {
  // Gets the next Gym Day, if all completed, resets all the false
  // and returns next day
  const getNextDay = async () => {
    let nextDay = await GymDayModel.findOne({
      userId: user.id,
      completed: false,
    });

    if (!nextDay) {
      await GymDayModel.updateMany(
        {
          userId: user.id,
          completed: true,
        },
        { completed: false }
      );

      return await GymDayModel.findOne({
        userId: user.id,
        completed: false,
      });
    }

    return nextDay;
  };

  try {
    const nextGymDay = await getNextDay();

    const embed = getGymDayEmbed(nextGymDay!);

    await channel.send({
      content: `Your work out routine for today.`,
      embeds: [embed],
    });

    // interaction.followUp({
    //   embeds: [embed],
    // });
  } catch (err) {
    console.error(err);
  }
};
