import { Message, MessageEmbed } from 'discord.js';
import { ICommand } from 'wokcommands';
import GymDayModel from '../Models/GymDayModel';

import dotenv from 'dotenv';
dotenv.config;

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
    try {
      // Get Gym Days

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

      const embed = new MessageEmbed({
        color: '#dfa290',
        title: `Day ${selectedDay.dayNumber}`,
        fields: [
          {
            name: 'Category',
            value: `${selectedDay.dayCategory}`,
            inline: true,
          },
          {
            name: 'Exercises',
            value: `${selectedDay.routine.length}`,
            inline: true,
          },
          {
            name: '\u200B',
            value: '\u200B',
          },
        ],
      });

      selectedDay.routine.forEach((w) =>
        embed.addField(
          w.exercise.replace(w.exercise[0], w.exercise[0].toUpperCase()),
          `${w.sets} sets of ${w.reps} reps`
        )
      );

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
