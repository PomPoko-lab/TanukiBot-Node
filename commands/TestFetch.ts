import { Message, MessageEmbed, TextChannel } from 'discord.js';
import { ICommand } from 'wokcommands';
import GymDayModel from '../Models/GymDayModel';

// Holiday API required imports
// import { MessageEmbed, TextChannel } from 'discord.js';
// import axios from 'axios';
// import { format, addDays } from 'date-fns';

import dotenv from 'dotenv';
dotenv.config;

interface GymDay {
  userId: string;
  dayNumber: number;
  dayCategory: string;
  routine: [];
  skippedLast: boolean;
}

export default {
  category: 'Testing',
  description: 'For testing purposes. DO NOT USE',
  permissions: ['ADMINISTRATOR'],
  ownerOnly: true,
  hidden: true,
  slash: true,
  testOnly: true,
  guildOnly: true,
  callback: async ({ interaction, channel }) => {
    // Adding a Gym day

    interaction.reply({
      content: `Starting new workout process..`,
    });

    try {
      const filter = (m: Message) => m.member?.id === interaction.user.id;

      // User input for gym day category
      channel.send('What categories will this gym day be for? (15s)');
      const gymDayCategory = (
        await interaction.channel?.awaitMessages({
          filter,
          time: 15000,
          max: 1,
          errors: ['time'],
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

      channel.send(
        'Successfully saved your gym day. Implement embed of details.'
      );
    } catch (err) {
      console.error(err);
    }
  },
} as ICommand;

/////////// Testing fetching of Holiday API
// export default {
//   category: 'Testing',
//   description: 'Fetches something for testing. DO NOT USE',
//   permissions: ['ADMINISTRATOR'],
//   ownerOnly: true,
//   hidden: true,
//   slash: true,
//   testOnly: true,
//   guildOnly: true,
//   callback: async ({ interaction, client }) => {
//     const API_URL = 'https://holidays.abstractapi.com/v1/?';
//     const API_KEY = `api_key=${process.env.HOLIDAY_API}`;
//     const country = 'US';
//     const currYear = new Date().getFullYear();
//     const currMonth = new Date().getMonth() + 1;
//     const currDay = new Date().getDate();
//     const days3 = +format(addDays(new Date(), 3), 'd');
//     const params = `&country=${country}&year=${currYear}&month=${currMonth}`;

//     const fetchURL = `${API_URL}${API_KEY}${params}`;
//     const channelID = '996561103054192741';

//     const getHoliday = async (day = currDay) => {
//       const response = await axios.get(`${fetchURL}&day=${day}`);
//       if (response.status !== 200) return;
//       return response.data;
//     };

//     const printHolidays = (holidaysArr: [], channel: TextChannel) => {
//       if (holidaysArr.length === 0) return;
//       holidaysArr.forEach(
//         (holiday: {
//           name: string;
//           description: string;
//           date: string;
//           type: string;
//         }) => {
//           // if (holiday.type !== 'public_holiday') return;

//           const embed = new MessageEmbed()
//             .setAuthor({
//               name: 'New Holiday',
//             })
//             .setColor('#0099ff')
//             .setTitle(holiday.name)
//             .setDescription(holiday.description)
//             .addFields({
//               name: 'Date',
//               value: holiday.date,
//             });
//           channel.send({ embeds: [embed] });
//         }
//       );
//     };

//     const holidayAnnouncer = async () => {
//       try {
//         // Text channel to insert holiday updates
//         const channel = (await client.channels.fetch(channelID)) as TextChannel;

//         // Daily Announcement
//         printHolidays(await getHoliday(), channel);

//         // Announcement 3 days from now
//         setTimeout(async () => {
//           printHolidays(await getHoliday(days3), channel);
//           console.log('Completed holidays fetch function');
//         }, 5000);
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     await holidayAnnouncer();
//     await interaction.reply({
//       content: 'Sent info',
//       ephemeral: true,
//     });
//   },
// } as ICommand;
