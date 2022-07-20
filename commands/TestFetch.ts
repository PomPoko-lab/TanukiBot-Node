import { ICommand } from 'wokcommands';
import mongoose from 'mongoose';
import RemindersSchema from '../Models/RemindersSchema';

// Holiday API required imports
// import { MessageEmbed, TextChannel } from 'discord.js';
// import axios from 'axios';
// import { format, addDays } from 'date-fns';

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
  callback: async ({ interaction, client, args }) => {
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

    try {
      const reminder = new RemindersSchema({
        description,
        time,
        repeatedTimes: repeatNum,
      });
      interaction.reply({
        content: `${time}`,
        ephemeral: true,
      });
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
