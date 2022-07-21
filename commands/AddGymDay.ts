import { Message, MessageEmbed } from 'discord.js';
import { ICommand } from 'wokcommands';
import GymDayModel from '../Models/GymDayModel';

import dotenv from 'dotenv';
dotenv.config;

// interface GymDay {
//   userId: string;
//   dayNumber: number;
//   dayCategory: string;
//   routine: [];
//   skippedLast: boolean;
// }

export default {
  category: 'Workout',
  description: 'Adds a gym day to daily work outs notifier.',
  slash: true,
  testOnly: true,
  guildOnly: true,
  callback: async ({ interaction, channel }) => {
    interaction.reply({
      content: `Starting new workout process..`,
    });

    try {
      const filter = (message: Message) =>
        message.member?.id === interaction.user.id;

      // User input for gym day category
      channel.send('What categories will this gym day be for? (15s)');
      const gymDayCategory = (
        await interaction.channel?.awaitMessages({
          filter,
          idle: 15000,
          max: 1,
          errors: ['idle'],
        })
      )?.first()?.content;

      const routine = [];

      // User input for routine
      channel.send(
        `We're now adding the workouts to your routine for that day.`
      );

      while (true) {
        channel.send(
          `Please enter a workout comma separated by sets and reps. (15s) Example: Bench Press, 3, 12`
        );
        const res2 = await interaction.channel?.awaitMessages({
          filter,
          time: 15000,
          max: 1,
          errors: ['time'],
        });

        if (!res2 || res2.first()?.content.trim().toLowerCase() === 'exit')
          break;

        // If array is at least 3 (2 length), add workout obj to routine Arr
        const r = res2?.first()?.content.trim().toLowerCase().split(',');
        if (!r || r.length === 0) {
          return channel.send('Inputs were invalid.');
        } else if (r.length === 3) {
          channel.send(`Stored input. To quit inputting, enter 'exit'.`);
          const workout = {
            exercise: r[0].trim().toLowerCase(),
            sets: r[1].trim(),
            reps: r[2].trim(),
          };

          routine.push(workout);
        }
      }

      if (routine.length === 0) {
        throw Error(`Couldn't find input routines.`);
      }

      // Get userid gym days to add into dayNumber
      const dayNumber =
        (await GymDayModel.find({ userId: interaction.user.id })).length + 1;

      // Prepping the gymDay model to store into DB
      const gymDay = new GymDayModel({
        userId: interaction.user.id,
        dayNumber,
        dayCategory: gymDayCategory,
        routine,
        skippedLast: false,
      });

      await gymDay.save();

      // Generates an embed and outputs stored values to the user
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

      await channel.send(`Here's the output of your day.`);
      await channel.send({
        embeds: [embed],
      });
      channel.send(`Your day was saved to the database.`);
    } catch (err) {
      console.error(err);
    }
  },
} as ICommand;
// Day 2
// Shoulders and back
// 5 exercises
// Overhead Press 40x12x3
// Dumbbell flyes 20x12x3
// Supermans 3x 12
// Bent over rows 20x12x3
// Lateral raises  15x12x3
