import { MessageEmbed } from 'discord.js';
import { GymDay } from '../models/GymDayModel';

export default (gymDay: GymDay) => {
  const embed = new MessageEmbed({
    color: '#dfa290',
    title: `Day ${gymDay.dayNumber}`,
    fields: [
      {
        name: 'Category',
        value: `${gymDay.dayCategory}`,
        inline: true,
      },
      {
        name: 'Exercises',
        value: `${gymDay.routine.length}`,
        inline: true,
      },
      {
        name: '\u200B',
        value: '\u200B',
      },
    ],
  });

  gymDay.routine.forEach((w) =>
    embed.addField(
      w.exercise.replace(w.exercise[0], w.exercise[0].toUpperCase()),
      `${w.sets} sets of ${w.reps} reps`
    )
  );

  return embed;
};
