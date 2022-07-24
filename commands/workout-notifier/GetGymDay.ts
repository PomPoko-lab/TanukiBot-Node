import { Message } from 'discord.js';
import { ICommand } from 'wokcommands';
import GymDayModel from '../../Models/GymDayModel';
import getGymDayEmbed from '../../Views/getGymDayEmbed';

export default {
  category: 'Workout',
  description: 'Gets information about a gym day.',
  slash: true,
  testOnly: true,
  guildOnly: true,
  callback: async ({ interaction, channel }) => {
    try {
      await interaction.deferReply();

      const gymDays = await GymDayModel.find({ userId: interaction.user.id });

      interaction.editReply(
        `You have ${gymDays.length} days recorded. Input a day number to view. (15s) Example: 2`
      );

      const filter = (message: Message) =>
        message.member?.id === interaction.user.id;

      const reply = +(
        await channel.awaitMessages({
          filter,
          time: 15000,
          max: 1,
          errors: ['time'],
        })
      ).first()?.content!;

      if (!reply) throw Error('No replies detected.');

      const selectedDay = gymDays.find((day) => day.dayNumber === reply);

      if (!selectedDay) throw Error('No selected day was found.');

      const embed = getGymDayEmbed(selectedDay);

      await channel.send(`Here's the output of your selected day.`);
      channel.send({
        embeds: [embed],
      });

      // Fetches and displays all days, bad for performance.
      // gymDays.forEach((day) => {
      //   const embed = new MessageEmbed({
      //     color: '#dfa290',
      //     title: `Day ${day.dayNumber}`,
      //     fields: [
      //       {
      //         name: 'Category',
      //         value: `${day.dayCategory}`,
      //       },
      //     ],
      //   });

      //   day.routine.forEach((w) =>
      //     embed.addField(
      //       w.exercise.replace(w.exercise[0], w.exercise[0].toUpperCase()),
      //       `${w.sets} of ${w.reps} reps.`
      //     )
      //   );
      // });
    } catch (err) {
      console.error(err);
    }
  },
} as ICommand;
