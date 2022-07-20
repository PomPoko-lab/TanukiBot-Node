import { ICommand } from 'wokcommands';
import RemindersModel from '../Models/RemindersModel';

import dotenv from 'dotenv';
dotenv.config;

export default {
  category: 'Reminders',
  description: 'Adds a reminder task.',
  slash: true,
  testOnly: true,
  guildOnly: true,
  options: [
    {
      name: 'description',
      description: 'Description of your reminder, what to be reminded of',
      required: true,
      type: 'STRING',
    },
    {
      name: 'time',
      description: 'Time to execute the reminder in XPM/AM. Example: 7PM',
      required: true,
      type: 'STRING',
    },
    {
      name: 'repeatnum',
      description:
        'Number of times to repeat the reminder. Example: 2, forever',
      required: true,
      type: 'INTEGER',
    },
  ],
  callback: async ({ interaction, args }) => {
    const description = interaction.options.getString('description');
    let time = interaction.options.getString('time');
    const repeatNum = +args.slice(-1);

    if (!(time?.includes('PM') || time?.includes('AM')))
      return interaction.reply({
        content: 'Entered time was not valid.',
        ephemeral: true,
      });

    // Converts PM/AM to 24Hour times
    if (time?.includes('PM')) {
      time = `${+time.slice(0, 2) === 12 ? 12 : +time.charAt(0) + 12}`;
    } else {
      time = `${+time.slice(0, 2) === 12 ? 0 : time.charAt(0)}`;
    }

    // Checks if repeat is less than 1
    if (repeatNum < 1) {
      interaction.reply({
        ephemeral: true,
        content: 'Repeat number cannot be less than 1.',
      });
    }

    try {
      await interaction.deferReply({
        ephemeral: true,
      });
      const reminder = new RemindersModel({
        userId: interaction.user.id,
        description,
        time,
        repeatedTimes: repeatNum,
      });
      await reminder.save();
      interaction.editReply({
        content: `Added your reminder.`,
      });
    } catch (err) {
      console.error(err);
    }
  },
} as ICommand;
